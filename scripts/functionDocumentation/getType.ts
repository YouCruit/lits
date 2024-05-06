import { type Parameter, isNormalExpressionParameter } from '../../reference'
import { styles } from '../styles'

export function getType(parameter: Parameter) {
  if (isNormalExpressionParameter(parameter)) {
    const types = Array.isArray(parameter.type) ? parameter.type : [parameter.type]
    const typeString = types.map(type => `<span ${styles()}>${type}</span>`).join(' | ')
    const result = (parameter.rest || parameter.array)
      ? `Array<${typeString}>`
      : typeString
    return `<span ${styles('font-mono', 'color-gray-300')}>${result}</span>`
  }
  else {
    return `<span ${styles('font-mono', 'color-gray-300')}>${parameter.type}</span>`
  }
}
