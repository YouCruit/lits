import type { Category, Reference } from '../../reference'
import { nameCharacters } from '../../src/tokenizer/tokenizers'
import { styles } from '../styles'
import { createFormatter } from '../formatter/createFormatter'
import { createVariableRule, mdRules, numberRule } from '../formatter/rules'
import { findAllOccurrences } from '../utils'

const variableRegExp = new RegExp(`\\$${nameCharacters}+`, 'g')

export function formatDescription(description: string, reference: Reference<Category>) {
  const descriptionVariables = findAllOccurrences(description, variableRegExp)

  const functionNameRule = createVariableRule(
    variableName => `<span ${styles('color-FunctionName')}>${variableName}</span>`,
    variableName => variableName === reference.name,
  )

  const parameterRule = createVariableRule(
    variableName => `<span ${styles('color-Parameter')}>${variableName}</span>`,
    variableName => isParameterName(variableName, reference),
  )

  checkVariables(reference, descriptionVariables)
  const formattedDescription = createFormatter([...mdRules, functionNameRule, parameterRule, numberRule])(description)
  return `<span ${styles('Description')}>${formattedDescription}</span>`
}

function checkVariables(reference: Reference<Category>, variables: Set<string>) {
  variables.forEach((variable) => {
    const variableName = variable.slice(1)
    if (variableName === reference.name)
      return

    if (!isParameterName(variableName, reference)) {
      console.error(`Unknown parameter ${variable}`, reference)
      throw new Error(`Unknown parameter ${variable}`)
    }
  })
}

function isParameterName(variableName: string, reference: Reference<Category>) {
  return Object.keys(reference.parameters).includes(variableName)
}
