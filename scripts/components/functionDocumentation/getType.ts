import { type Argument, type TypedValue, isSpecialExpressionArgument } from '../../../reference'
import { styles } from '../../styles'

export function getType(arg: Argument | TypedValue) {
  const argType = isSpecialExpressionArgument(arg) ? arg.type.slice(1) : arg.type
  const types = Array.isArray(argType) ? argType : [argType]
  const typeString = types.map((type) => {
    return `<span ${styles('text-color-Type')}>${type}</span>`
  }).join(' | ')
  const result = arg.array || arg.rest
    ? `<span ${
      styles('text-color-Name')
    }>Array</span><span ${
      styles('text-color-Operator')
    }>&lt;</span>${
      typeString
    }<span ${
      styles('text-color-Operator')
    }>&gt;`
    : typeString

  return `<span ${styles('font-mono', 'text-color-gray-300')}>${result}</span>`
}
