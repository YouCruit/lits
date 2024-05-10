import type { Category, Reference } from '../../../reference'
import { nameCharacters } from '../../../src/tokenizer/tokenizers'
import { styles } from '../../styles'
import { createFormatter } from '../../formatter/createFormatter'
import { createVariableRule, mdRules, numberRule } from '../../formatter/rules'
import { findAllOccurrences } from '../../utils/utils'
import { externalLinkIcon } from '../../icons'
import { getClojureDocsLink } from './clojureDocs'

const variableRegExp = new RegExp(`\\$${nameCharacters}+`, 'g')

export function formatDescription(description: string, reference: Reference<Category>) {
  const clojureDocsLink = getClojureDocsLink(reference.name, reference.clojureDocs)

  const descriptionVariables = findAllOccurrences(description, variableRegExp)

  const currentFunctionNameRule = createVariableRule(
    variableName => `<span ${styles('text-color-FunctionName')}>${variableName}</span>`,
    variableName => variableName === reference.name,
  )

  const argumentRule = createVariableRule(
    variableName => `<span ${styles('text-color-Argument')}>${variableName}</span>`,
    variableName => isArgumentName(variableName, reference),
  )

  checkVariables(reference, descriptionVariables)
  const formattedDescription = createFormatter([...mdRules, currentFunctionNameRule, argumentRule, numberRule])(description)
  return `<div ${styles('Description')}>
    ${formattedDescription}
    ${
      clojureDocsLink
        ? `<a target="_blank" ${styles('flex', 'gap-1', 'items-center', 'text-sm', 'underline', 'mt-3')} href="${clojureDocsLink}">
        <span ${styles('pt-1')}>${externalLinkIcon}</span>
        <span>Clojure docs</span>
          </a>`
        : ''
    }
  </div>`
}

function checkVariables(reference: Reference<Category>, variables: Set<string>) {
  variables.forEach((variable) => {
    const variableName = variable.slice(1)
    if (variableName === reference.name)
      return

    if (!isArgumentName(variableName, reference)) {
      console.error(`Unknown argument ${variable}`, reference)
      throw new Error(`Unknown argument ${variable}`)
    }
  })
}

function isArgumentName(variableName: string, reference: Reference<Category>) {
  return Object.keys(reference.args).includes(variableName)
}
