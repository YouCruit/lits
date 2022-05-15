import { AbstractLitsError } from '../errors'
import { Lits } from '../Lits/Lits'
import { SourceCodeInfoImpl } from '../tokenizer/SourceCodeInfoImpl'
import fs from 'fs'
import path from 'path'

type TestChunk = {
  name: string
  program: string
  directive: `SKIP` | null
}

export type RunTestParams = {
  testPath: string
  testNamePattern?: RegExp
}

export type TestResult = {
  /**
   * Test report
   * http://testanything.org/
   */
  tap: string
  success: boolean
}

export function runTest({ testPath, testNamePattern }: RunTestParams, createLits: () => Lits): TestResult {
  const test = readLitsFile(testPath)
  const includes = getIncludes(testPath, test)
  const testResult: TestResult = {
    tap: `TAP version 13\n`,
    success: true,
  }
  try {
    const testChunks = getTestChunks(test)
    testResult.tap += `1..${testChunks.length}\n`
    testChunks.forEach((testChunkProgram, index) => {
      const testNumber = index + 1
      if (testNamePattern && !testNamePattern.test(testChunkProgram.name)) {
        testResult.tap += `ok ${testNumber} ${testChunkProgram.name} # skip - Not matching testNamePattern ${testNamePattern}\n`
      } else if (testChunkProgram.directive === `SKIP`) {
        testResult.tap += `ok ${testNumber} ${testChunkProgram.name} # skip\n`
      } else {
        try {
          const lits = createLits()
          const context = lits.context(includes)
          lits.run(testChunkProgram.program, { contexts: [context], filename: testPath })
          testResult.tap += `ok ${testNumber} ${testChunkProgram.name}\n`
        } catch (error) {
          testResult.success = false
          testResult.tap += `not ok ${testNumber} ${testChunkProgram.name}${getErrorYaml(error)}`
        }
      }
    })
  } catch (error: unknown) {
    testResult.tap += `Bail out! ${getErrorMessage(error)}\n`
    testResult.success = false
  }
  return testResult
}

function readLitsFile(litsPath: string): string {
  if (!litsPath.endsWith(`.lits`)) {
    throw Error(`Expected .lits file, got ${litsPath}`)
  }
  return fs.readFileSync(litsPath, { encoding: `utf-8` })
}

function getIncludes(testPath: string, test: string): string {
  const dirname = path.dirname(testPath)
  let okToInclude = true
  return test.split(`\n`).reduce((includes: string, line) => {
    const includeMatch = line.match(/^\s*;+\s*@include\s*(\S+)\s*$/)
    if (includeMatch) {
      if (!okToInclude) {
        throw Error(`@include must be in the beginning of file`)
      }
      const relativeFilePath = includeMatch[1] as string
      const filePath = path.resolve(dirname, relativeFilePath)
      const fileContent = readLitsFile(filePath)
      includes += `\n${fileContent}`
    }
    if (!line.match(/^\s*(?:;.*)$/)) {
      okToInclude = false
    }
    return includes
  }, ``)
}

// Splitting test file based on @test annotations
function getTestChunks(testProgram: string): TestChunk[] {
  let currentTest: TestChunk | undefined
  let setupCode = ``
  return testProgram.split(`\n`).reduce((result: TestChunk[], line, index) => {
    const currentLineNbr = index + 1
    const testNameAnnotationMatch = line.match(/^\s*;+\s*@(?:(skip)-)?test\s*(.*)$/)
    if (testNameAnnotationMatch) {
      const directive = (testNameAnnotationMatch[1] ?? ``).toUpperCase()
      const testName = testNameAnnotationMatch[2]
      if (!testName) {
        throw Error(`Missing test name on line ${currentLineNbr}`)
      }
      if (result.find(chunk => chunk.name === testName)) {
        throw Error(`Duplicate test name ${testName}`)
      }
      currentTest = {
        directive: (directive || null) as TestChunk[`directive`],
        name: testName,
        // Adding new-lines to make lits debug information report correct rows
        program:
          setupCode + [...Array(currentLineNbr + 2 - setupCode.split(`\n`).length).keys()].map(() => ``).join(`\n`),
      }
      result.push(currentTest)
      return result
    }
    if (!currentTest) {
      setupCode += `${line}\n`
    } else {
      currentTest.program += `${line}\n`
    }
    return result
  }, [])
}

function getErrorYaml(error: unknown): string {
  const message = getErrorMessage(error)
  // This is a fallbak, should not happen (Lits should be throwing AbstractLitsErrors)
  /* istanbul ignore next */
  if (!isAbstractLitsError(error)) {
    return `
  ---
  message: ${JSON.stringify(message)}
  ...
`
  }

  /* istanbul ignore next */
  if (!(error.debugInfo instanceof SourceCodeInfoImpl)) {
    return `
  ---
  message: ${JSON.stringify(message)}
  error: ${JSON.stringify(error.name)}
  ...
`
  }
  const location = `${error.debugInfo.filename}:${error.debugInfo.line}:${error.debugInfo.column}`
  return `
  ---
  error: ${JSON.stringify(error.name)}
  message: ${JSON.stringify(message)}
  location: ${JSON.stringify(location)}
  code:
    - "${error.debugInfo.code}"
    - "${error.debugInfo.codeMarker}"
  ...
`
}

function getErrorMessage(error: unknown): string {
  if (!isAbstractLitsError(error)) {
    // error should always be an Error (other cases is just for kicks)
    /* istanbul ignore next */
    return typeof error === `string` ? error : error instanceof Error ? error.message : `Unknown error`
  }
  return error.shortMessage
}

function isAbstractLitsError(error: unknown): error is AbstractLitsError {
  return error instanceof AbstractLitsError
}
