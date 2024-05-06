import { nameCharacters } from '../../src/tokenizer/tokenizers'
import { styles } from '../styles'
import { type TextFormatter, createFormatter } from './createFormatter'

export type FormatterRule = (text: string, index: number, formatter: TextFormatter) => {
  count: number
  formattedText: string
}

export const variableRegExp = new RegExp(`^\\$${nameCharacters}+`)

const noMatch = { count: 0, formattedText: '' }

export function createRule({
  name,
  startPattern,
  endPattern,
  startTag,
  endTag,
  keepPatterns,
  formatPatterns,
  stopRecursion,
}: {
  name: string
  startPattern: RegExp
  endPattern?: RegExp
  startTag: string
  endTag: string
  keepPatterns?: boolean
  formatPatterns?: boolean
  stopRecursion?: boolean
}): FormatterRule {
  return (text, index, formatter) => {
    const startMatch = startPattern.exec(text.slice(index))
    if (startMatch) {
      let count = startMatch[0].length
      let body = keepPatterns && formatPatterns ? startMatch[0] : ''
      let endMatch: RegExpExecArray | null = null

      if (endPattern) {
        while (index + count < text.length && !endPattern.test(text.slice(index + count))) {
          body += text[index + count]
          count += 1
        }
        endMatch = endPattern.exec(text.slice(index + count))
        if (!endMatch)
          throw new Error(`No end pattern found for rule ${name},  ${endPattern}`)

        count += endMatch[0].length
        body += keepPatterns && formatPatterns ? endMatch[0] : ''
      }
      const formattedText = `${
        keepPatterns && !formatPatterns ? startMatch[0] : ''
      }${
        startTag
      }${
        body ? (stopRecursion ? body : formatter(body)) : ''
      }${
        endTag
      }${
        endMatch && keepPatterns && !formatPatterns ? endMatch[0] : ''
      }`
      return { count, formattedText }
    }
    return { count: 0, formattedText: '' }
  }
}

export function createVariableRule(
  formatVariableName: TextFormatter,
  variableNamePredicate: (variableName: string) => boolean,
): FormatterRule {
  return (text, index) => {
    const startMatch = variableRegExp.exec(text.slice(index))
    if (startMatch) {
      const count = startMatch[0].length
      const variableName = startMatch[0].slice(1)
      if (!variableNamePredicate(variableName))
        return noMatch

      const formattedText = formatVariableName(variableName)
      return { count, formattedText }
    }
    return { count: 0, formattedText: '' }
  }
}

const numberRegExp = /^[0-9]+(\.[0-9]+)?/
export const numberRule: FormatterRule = (text, index) => {
  const startMatch = numberRegExp.exec(text.slice(index))
  if (startMatch) {
    const count = startMatch[0].length
    const characterBefor = text[index - 1]
    const characterAfter = text[index + count]
    if (characterBefor && new RegExp(nameCharacters).test(characterBefor))
      return noMatch
    if (characterBefor && numberRegExp.test(characterBefor))
      return noMatch
    if (characterAfter && new RegExp(nameCharacters).test(characterAfter))
      return noMatch
    if (characterAfter && numberRegExp.test(characterAfter))
      return noMatch

    const number = startMatch[0]
    const formattedText = `<span ${styles('color-Number')}>${number}</span>`
    return { count, formattedText }
  }
  return { count: 0, formattedText: '' }
}

export const stringRule = createRule({
  name: 'string',
  startPattern: /^"/,
  endPattern: /^"/,
  startTag: `<span ${styles('color-String')}>`,
  endTag: '</span>',
  keepPatterns: true,
  formatPatterns: true,
  stopRecursion: true,
})

export const shortcutStringRule = createRule({
  name: 'string',
  startPattern: new RegExp(`^:${nameCharacters}+`),
  startTag: `<span ${styles('color-String')}>`,
  endTag: '</span>',
  keepPatterns: true,
  formatPatterns: true,
  stopRecursion: true,
})

export const functionNameRule = createRule({
  name: 'functionName',
  startPattern: new RegExp(`^\\((?=${nameCharacters}+)`),
  endPattern: /^[) \n]/,
  startTag: `<span ${styles('color-FunctionName')}>`,
  endTag: '</span>',
  keepPatterns: true,
  formatPatterns: false,
  stopRecursion: true,
})

export const nameRule = createRule({
  name: 'functionName',
  startPattern: new RegExp(`^${nameCharacters}+`),
  startTag: `<span ${styles('color-Name')}>`,
  endTag: '</span>',
  keepPatterns: true,
  formatPatterns: true,
  stopRecursion: true,
})

export const commentRule = createRule({
  name: 'comment',
  startPattern: /^;.*/,
  startTag: `<span ${styles('color-Comment', 'italic')}>`,
  endTag: '</span>',
  keepPatterns: true,
  formatPatterns: true,
  stopRecursion: true,
})

export const litsKeywordRule = createRule({
  name: 'functionName',
  startPattern: /^\b(nil|true|false)\b/,
  startTag: `<span ${styles('color-Keyword')}>`,
  endTag: '</span>',
  keepPatterns: true,
  formatPatterns: true,
  stopRecursion: true,
})

export const inlinceCodeKeywordRule = createRule({
  name: 'inlinceCodeKeywordRule',
  startPattern: /^\b(null|true|false|nil|falsy|truthy)\b/,
  startTag: `<span ${styles('color-Keyword')}>`,
  endTag: '</span>',
  keepPatterns: true,
  formatPatterns: true,
  stopRecursion: true,
})

const formatInlineCode = createFormatter([
  stringRule,
  shortcutStringRule,
  numberRule,
  inlinceCodeKeywordRule,
  nameRule,
], {
  prefix: `<span ${styles('color-gray-200')}>`,
  suffix: '</span>',
})

const inlineCodeRule: FormatterRule = (text, index) => {
  if (text[index] === '`') {
    let count = 1
    let body = ''

    while (index + count < text.length && text[index + count] !== '`') {
      body += text[index + count]
      count += 1
    }
    if (text[index + count] !== '`')
      throw new Error(`No end \` found for rule inlineCodeRule: ${text}`)

    count += 1
    const formattedText = formatInlineCode(body)
    return { count, formattedText }
  }
  return { count: 0, formattedText: '' }
}

const italicRule = createRule({
  name: 'italic',
  startPattern: /^\*\*\*/,
  endPattern: /^\*\*\*/,
  startTag: `<span ${styles('italic')}>`,
  endTag: '</span>',
})

const boldRule = createRule({
  name: 'bold',
  startPattern: /^\*\*/,
  endPattern: /^\*\*/,
  startTag: `<span ${styles('font-bold')}>`,
  endTag: '</span>',
})

const newLineRule = createRule({
  name: 'new-line',
  startPattern: /^ {2}\n/,
  startTag: '',
  endTag: '<br>',
})

const paragraphRule = createRule({
  name: 'paragraph',
  startPattern: /^\n{2}/,
  startTag: `<div ${styles('mb-2')}>`,
  endTag: '</div>',
})

export const mdRules: FormatterRule[] = [inlineCodeRule, italicRule, boldRule, newLineRule, paragraphRule]
