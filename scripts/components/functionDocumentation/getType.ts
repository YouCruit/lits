import { type Argument, isNormalExpressionArgument } from '../../../reference'
import { styles } from '../../styles'

export function getType(argument: Argument) {
  if (isNormalExpressionArgument(argument)) {
    const types = Array.isArray(argument.type) ? argument.type : [argument.type]
    const typeString = types.map(type => `<span ${styles()}>${type}</span>`).join(' | ')
    const result = (argument.rest || argument.array)
      ? `Array<${typeString}>`
      : typeString
    return `<span ${styles('font-mono', 'text-color-gray-300')}>${result}</span>`
  }
  else {
    return `<span ${styles('font-mono', 'text-color-gray-300')}>${argument.type}</span>`
  }
}
