import type { Category, Reference } from '../../../../reference'
import { nameCharacters } from '../../../../src/tokenizer/tokenizers'
import { createFormatter } from '../../formatter/createFormatter'
import { createVariableRule, mdRules, numberRule } from '../../formatter/rules'
import { styles } from '../../styles'
import { findAllOccurrences } from '../../utils/utils'

const variableRegExp = new RegExp(`\\$${nameCharacters}+`, 'g')

export function formatDescription(description: string, reference: Reference<Category>) {
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
  return `<div ${styles('text-color-gray-400')}>
    ${formattedDescription}
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
