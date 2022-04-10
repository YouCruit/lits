import { AbstractLitsError } from '../errors'
import { Lits, LitsParams } from '../Lits/Lits'
import { SourceCodeInfoImpl } from '../tokenizer/SourceCodeInfoImpl'

type TestChunk = {
  name: string
  program: string
  directive: `SKIP` | null
}

export type TestResult = {
  /**
   * Test report
   * http://testanything.org/
   */
  tap: string
  success: boolean
}

export function runTest(
  testProgram: string,
  program: string,
  testParams: LitsParams,
  programParams: LitsParams,
  createLits: () => Lits,
): TestResult {
  const testResult: TestResult = {
    tap: `TAP version 13\n`,
    success: true,
  }
  try {
    const testChunks = getTestChunks(testProgram)
    testResult.tap += `1..${testChunks.length}\n`
    testChunks.forEach((testChunkProgram, index) => {
      const testNumber = index + 1
      if (testChunkProgram.directive === `SKIP`) {
        testResult.tap += `ok ${testNumber} ${testChunkProgram.name} # skip\n`
      } else {
        try {
          const lits = createLits()
          const context = lits.context(program, programParams)
          lits.run(testChunkProgram.program, { ...testParams, contexts: [...(testParams.contexts || []), context] })
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

// Splitting test file based on @test annotations
function getTestChunks(testProgram: string): TestChunk[] {
  let currentTest: TestChunk | undefined
  let setupCode = ``
  return testProgram.split(`\n`).reduce((result: TestChunk[], line, index) => {
    const testNameAnnotationMatch = line.match(/^\s*;\s*@(?:(skip)-)?test\s*(.*)$/i)
    if (testNameAnnotationMatch) {
      const directive = (testNameAnnotationMatch[1] ?? ``).toUpperCase()
      const testName = testNameAnnotationMatch[2]
      if (!testName) {
        throw Error(`Missing test name on line ${index}`)
      }
      if (result.find(chunk => chunk.name === testName)) {
        throw Error(`Duplicate test name ${testName}`)
      }
      currentTest = {
        directive: (directive || null) as TestChunk[`directive`],
        name: testName,
        // Adding new-lines to make lits debug information report correct rows
        program: setupCode + [...Array(index + 3 - setupCode.split(`\n`).length).keys()].map(() => ``).join(`\n`),
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
  return `
  ---
  error: ${JSON.stringify(error.name)}
  message: ${JSON.stringify(message)}
  line: ${error.debugInfo.line}
  column: ${error.debugInfo.column}
  code:
    - ${JSON.stringify(error.debugInfo.code)}
    - ${JSON.stringify(error.debugInfo.codeMarker)}
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
