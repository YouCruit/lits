import { type Argument, type TypedValue, isSpecialExpressionArgument, isTypedValue } from '../../../reference'
import { styles } from '../../styles'

export function getType(arg: Argument | TypedValue) {
  if (isTypedValue(arg)) {
    const types = Array.isArray(arg.type) ? arg.type : [arg.type]
    const typeString = types.map((type) => {
      return `<span ${styles('text-color-Type')}>${type}</span>`
    }).join(' | ')
    const result = (arg.rest || arg.array)
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
  else if (isSpecialExpressionArgument(arg)) {
    return `<span ${styles('font-mono', 'text-color-gray-300')}>${arg.type}</span>`
  }

  throw new Error(`Invalid argument type: ${JSON.stringify(arg, null, 2)}`)
}
