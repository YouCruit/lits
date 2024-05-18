#!/usr/bin/env node
/* eslint-disable node/prefer-global/process */

/* eslint-disable no-console */
import type { ReadLine, ReadLineOptions } from 'node:readline'
import readline from 'node:readline'
import path from 'node:path'
import fs from 'node:fs'
import os from 'node:os'
import { version } from '../../package.json'
import type { Context } from '../../src'
import {
  Lits,
  normalExpressionKeys,
  reservedNames,
  specialExpressionKeys,
} from '../../src'
import { runTest } from '../../src/testFramework'
import type { Reference } from '../../reference'
import { apiReference, isFunctionReference } from '../../reference'
import { asAny } from '../../src/typeGuards/lits'
import type { UnknownRecord } from '../../src/interface'
import { isApiName } from '../../reference/api'
import { nameCharacters } from '../../src/tokenizer/tokenizers'
import { stringifyValue } from '../../common/utils'
import { createTextFormatter } from './textFormatter'
import { getFunctionSignature } from './functionDocumentation/functionSignature'

const fmt = createTextFormatter(true)

type Maybe<T> = T | null

interface Config {
  testNamePattern: Maybe<string>
  testFilename: Maybe<string>
  test: Maybe<string>
  filename: Maybe<string>
  globalContext: Context
  expression: Maybe<string>
  help: Maybe<string>
}

const historyResults: unknown[] = []
const lits = new Lits({ debug: true })

const commands = ['`help', '`quit', '`builtins', '`globalContext', '`GlobalContext', '`resetGlobalContext']
const expressionRegExp = new RegExp(`^(.*\\(\\s*)(${nameCharacters}*)$`)
const nameRegExp = new RegExp(`^(.*?)(${nameCharacters}*)$`)
const helpRegExp = new RegExp(`^\`help\\s+(${nameCharacters}+)\\s*$`)
const expressions = [...normalExpressionKeys, ...specialExpressionKeys]

const historyDir = path.join(os.homedir(), '.config')
const historyFile = path.join(historyDir, 'lits_history.txt')
console.log(historyFile)

const config = processArguments(process.argv.slice(2))

if (config.help) {
  console.log(getFullDocumentation(config.help))
  process.exit(0)
}

if (config.expression) {
  execute(config.expression)
  process.exit(0)
}
else if (config.filename) {
  const content = fs.readFileSync(config.filename, { encoding: 'utf-8' })
  execute(content)
  process.exit(0)
}
else if (config.testFilename) {
  runLitsTest(config.testFilename, config.testNamePattern)
  process.exit(0)
}
else {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'LITS> ',
    completer,
    historySize: 100,
  })
  runREPL(rl)
}

function runLitsTest(testPath: string, testNamePattern: Maybe<string>) {
  if (!testPath.match(/\.test\.lits/)) {
    console.error('Test file must end with .test.lits')
    process.exit(1)
  }
  const { success, tap } = runTest({
    testPath,
    testNamePattern: testNamePattern !== null ? new RegExp(testNamePattern) : undefined,
  })

  console.log(`\n${tap}`)

  if (!success)
    process.exit(1)
}

function execute(expression: string) {
  try {
    const result = lits.run(expression, {
      contexts: config.globalContext !== null
        ? [config.globalContext]
        : undefined,
    })
    historyResults.unshift(result)
    if (historyResults.length > 9)
      historyResults.length = 9

    setReplHistoryVariables()
    console.log(stringifyValue(result))
  }
  catch (error) {
    console.log(`${error}`)
    config.globalContext['*e*'] = { value: getErrorMessage(error) }
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error)
    return error.message

  return 'Unknown error'
}

function setReplHistoryVariables() {
  delete config.globalContext['*1*']
  delete config.globalContext['*2*']
  delete config.globalContext['*3*']
  delete config.globalContext['*4*']
  delete config.globalContext['*5*']
  delete config.globalContext['*6*']
  delete config.globalContext['*7*']
  delete config.globalContext['*8*']
  delete config.globalContext['*9*']
  historyResults.forEach((value, i) => {
    config.globalContext[`*${i + 1}*`] = { value: asAny(value) }
  })
}

// function executeExample(expression: string) {
//   const outputs: string[][] = []
//   const oldLog = console.log
//   const oldError = console.error
//   console.log = (...values) => outputs.push(values.map(value => formatValue(value)))
//   console.error = (...values) => outputs.push(values.map(value => formatValue(value)))
//   try {
//     const result = lits.run(expression)
//     const outputString = `Console: ${outputs.map(output => output.join(', ')).join('  ')}`
//     return `${formatValue(result)}    ${outputs.length > 0 ? outputString : ''}`
//   }
//   catch (error) {
//     return 'ERROR!'
//   }
//   finally {
//     console.log = oldLog
//     console.error = oldError
//   }
// }

function jsonStringify(value: unknown, indent: boolean) {
  return JSON.stringify(value, null, indent ? 2 : undefined)
}

function processArguments(args: string[]): Config {
  const defaultConfig: Config = {
    testNamePattern: null,
    testFilename: null,
    test: null,
    filename: null,
    globalContext: {},
    expression: null,
    help: null,
  }
  for (let i = 0; i < args.length; i += 2) {
    const option = args[i]
    const argument = args[i + 1]
    switch (option) {
      case 'test':
        if (!argument) {
          console.error('Missing filename after test')
          process.exit(1)
        }
        defaultConfig.testFilename = argument
        break
      case '-t':
      case '--testNamePattern':
        if (!argument) {
          console.error('Missing test name pattern after -t')
          process.exit(1)
        }
        defaultConfig.testNamePattern = argument
        break
      case '-f':
        if (!argument) {
          console.error('Missing filename after -f')
          process.exit(1)
        }
        defaultConfig.filename = argument
        break
      case '-g':
        if (!argument) {
          console.error('Missing global variables after -g')
          process.exit(1)
        }
        try {
          Object.entries(JSON.parse(argument) as UnknownRecord).forEach(([key, value]) => {
            defaultConfig.globalContext[key] = { value: asAny(value) }
          })
        }
        catch (e) {
          console.error(`Couldn\`t parse global variables: ${getErrorMessage(e)}`)
          process.exit(1)
        }
        break
      case '-G':
        if (!argument) {
          console.error('Missing global variables filename after -G')
          process.exit(1)
        }
        try {
          const contextString = fs.readFileSync(argument, { encoding: 'utf-8' })
          Object.entries(JSON.parse(contextString) as UnknownRecord).forEach(([key, value]) => {
            defaultConfig.globalContext[key] = { value: asAny(value) }
          })
        }
        catch (e) {
          console.error(`Couldn\`t parse global variables: ${getErrorMessage(e)}`)
          process.exit(1)
        }
        break
      case '-e':
        if (!argument) {
          console.error('Missing lits expression after -e')
          process.exit(1)
        }
        defaultConfig.expression = argument
        break
      case '-h':
      case '--help':
        if (argument) {
          defaultConfig.help = argument
        }
        else {
          printUsage()
          process.exit(0)
        }
        break
      case '-v':
      case '--version':
        console.log(version)
        process.exit(0)
        break
      default:
        console.error(`Unknown argument "${argument}"`)
    }
  }
  if (defaultConfig.filename && defaultConfig.expression) {
    console.error('Cannot both specify -f and -e')
    process.exit(1)
  }
  if (defaultConfig.test) {
    if (defaultConfig.filename) {
      console.error('Illegal option -f')
      process.exit(1)
    }
    if (defaultConfig.expression) {
      console.error('Illegal option -e')
      process.exit(1)
    }
  }
  return defaultConfig
}

function runREPL(rl: ReadLine) {
  console.log(`Type "\`help" for more ${fmt.bgCyan.red.bright('information')}.`)
  rl.prompt()

  rl.on('line', (line) => {
    line = line.trim()

    const helpMatch = helpRegExp.exec(line)
    if (helpMatch) {
      const name = helpMatch[1]!
      console.log(getFullDocumentation(name))
    }
    else if (line.startsWith('`')) {
      switch (line) {
        case '`builtins':
          printBuiltins()
          break
        case '`help':
          printHelp()
          break
        case '`globalContext':
          printGlobalContext(false)
          break
        case '`GlobalContext':
          printGlobalContext(true)
          break
        case '`resetGlobalContext':
          config.globalContext = {}
          console.log('Global context is now empty\n')
          break
        case '`quit':
          rl.close()
          break
        default:
          console.error(`Unrecognized command "${line}", try "\`help"\n`)
      }
    }
    else if (line) {
      execute(line)
    }
    rl.prompt()
  }).on('close', () => {
    console.log('Over and out!')
    process.exit(0)
  })
}

function printBuiltins() {
  const maxTitleLength = Object
    .values(apiReference)
    .reduce((max, reference) => Math.max(max, reference.title.length), 0)

  Object
    .values(apiReference)
    .sort((a, b) => a.title.localeCompare(b.title))
    .forEach((reference) => {
      console.log(`
${fmt.bright.blue.rightPad(maxTitleLength + 2, '*').yellow.underscore.reverse(reference.title)} ${fmt.gray(reference.category)}
${getDocString(reference)}
`)
    })
}

function getDocString(reference: Reference) {
  if (isFunctionReference(reference))
    return `${getFunctionSignature(fmt, reference)}`
  return 'TODO'
}

function getFullDocumentation(name: string) {
  console.log(name, '   xxx')
  if (!isApiName(name))
    return `No documentation available for ${name}`

  const doc = apiReference[name]

  const header = `${fmt.bright.blue(name)} - ${doc.category}`

  return header

  //   return `${header}

  // ${doc.description}

  // Syntax
  //   ${getSyntax(doc)}

  // ${'Arguments'}
  // ${doc.arguments.length === 0 ? '  None' : doc.arguments.map(arg => `  ${arg.name}: ${arg.type}`).join('\n')}

// ${'Examples'}
// ${
//   doc.examples.length === 0
//     ? '[no examples]'
//     : doc.examples.map(example => `  ${example} => ${executeExample(example)}`).join('\n')
// }
// `
}

function printHelp() {
  console.log(`\`builtins                 Print all builtin functions
\`globalContext            Print all global variables
\`GlobalContext            Print all global variables (JSON.stringify)
\`resetGlobalContext       Reset all global variables
\`help                     Print this help message
\`help [builtin function]  Print help for [builtin function]
\`quit                     Quit
`)
}

function printUsage() {
  console.log(`Usage: lits [options]

Options:
  -g ...                          Global variables as a JSON string
  -G ...                          Global variables file (.json file)
  -f ...                          .lits file
  -e ...                          Lits expression
  -h, --help                      Show this help
  -h, --help <builtin function>   Show help for <builtin function>
  -v, --version                   Print lits version
`)
}

function printGlobalContext(stringify: boolean) {
  const context = config.globalContext
  const keys = Object.keys(context)
  if (keys.length === 0) {
    console.log('[empty]\n')
  }
  else {
    keys.sort().forEach((x) => {
      if (stringify)
        console.log(`${x} = ${jsonStringify(context[x], true)}`)
      else
        console.log(`${x} = ${stringifyValue(context[x]!.value)}`)
    })
    console.log()
  }
}

function completer(line: string) {
  const helpMatch = line.match(/`help\s+(.*)/)
  if (helpMatch)
    return [expressions.filter(c => c.startsWith(helpMatch[1]!)).map(c => `\`help ${c} `), line]

  if (line.startsWith('`'))
    return [commands.filter(c => c.startsWith(line)).map(c => `${c} `), line]

  const expressionMatch = expressionRegExp.exec(line)

  if (expressionMatch)
    return [expressions.filter(c => c.startsWith(expressionMatch[2]!)).map(c => `${expressionMatch[1]}${c} `), line]

  const names = Array.from(new Set([...reservedNames, ...Object.keys(config.globalContext)]))
  const nameMatch = nameRegExp.exec(line)

  if (nameMatch)
    return [names.filter(c => c.startsWith(nameMatch[2]!)).map(c => `${nameMatch[1]}${c} `), line]

  return [[], line]
}

// function isHistoryEnabled() {
//   if (fs.existsSync(historyFile))
//     return true

//   try {
//     fs.openSync(historyFile, 'w')
//   }
//   catch (e) {
//     console.error(`No history for you!
// If you would like to enable history persistence, make sure the directory "${path.resolve(
//       historyDir,
//     )}" exists and is writable.
// `)
//     return false
//   }
// }

function createInterface(options: ReadLineOptions) {
  // const historyEnabled = isHistoryEnabled()
  // const history = historyEnabled
  //   ? fs.readFileSync(historyFile, 'utf8')
  //     .toString()
  //     .split('\n')
  //     .slice(0, -1)
  //     .reverse()
  //     .slice(0, 100)
  //   : []

  // readline.kHistorySize = Math.max(readline.kHistorySize, 100)

  const rl = readline.createInterface(options)

  // if (historyEnabled) {
  //   const oldAddHistory = rl._addHistory

  //   rl._addHistory = function () {
  //     const last = rl.history[0]
  //     const line = oldAddHistory.call(rl)

  //     if (line.length > 0 && line !== last)
  //       fs.appendFileSync(historyFile, `${line}\n`)

  //     return line
  //   }

  //   if (Array.isArray(rl.history))
  //     rl.history.push(...history)
  // }

  return rl
}
