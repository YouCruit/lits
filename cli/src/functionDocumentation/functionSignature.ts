import type { FunctionReference } from '../../../reference'
import type { TextFormatter } from '../textFormatter'

export function getFunctionSignature(fmt: TextFormatter, { title: name, variants, args }: FunctionReference) {
  return variants.map((variant) => {
    const form = (variant.argumentNames.length === 0)
      ? `${fmt.white('(')}${fmt.blue(name)}${fmt.white(')')}`
      : `${fmt.white('(')}${fmt.blue(name)} ${variant.argumentNames.map((argName) => {
            let result = ''
            const arg = args[argName]
            if (arg) {
              if (arg.rest)
                result += fmt.white('& ')
              result += `${fmt.green(argName)}`
              if (arg.type === '*binding' || arg.type === '*for-binding')
                result = `${fmt.white('[')}${result}${fmt.white(']')}`
              else if (arg.type === '*arguments')
                result = `${fmt.white('[')}${result}${fmt.white(']')}`
              else if (arg.type === '*catch-expression')
                result = `${fmt.white('(')}${result} ${fmt.bright.blue('body')}${fmt.white(')')}`
            }
            return result
          }).join(' ')}${fmt.white(')')}`

    return `${form}  ${fmt.gray('=>')}`
    // ${getType(returns)}`
    //   <td><span>${getType(returns)}</span></td>
    // </tr>`
  }).join('\n')
}
