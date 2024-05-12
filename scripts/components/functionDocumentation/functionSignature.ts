import type { Category, Reference } from '../../../reference/index.ts'
import { styles } from '../../styles'
import { getType } from './getType'

export function getFunctionSignature({ name, variants, args, returns }: Reference<Category>) {
  return `<table>
  ${variants.map((variant) => {
    const form = (variant.argumentNames.length === 0)
      ? `<span ${styles('text-color-Operator')}>(</span><span ${styles('text-color-FunctionName')}>${name}</span><span ${styles('text-color-Operator')}>)</span>`
      : `<span ${styles('text-color-Operator')}>(</span><span ${styles('text-color-FunctionName')}>${name}</span> ${variant.argumentNames.map((argName) => {
            let result = ''
            const arg = args[argName]
            if (arg) {
              if (arg.rest)
                result += '& '
              result += `<span ${styles('text-color-Argument')}>${argName}</span>`
              if (arg.type === '*binding')
                result = `<span ${styles('text-color-Operator')}>[</span>${result}<span ${styles('text-color-Operator')}>]</span>`
            }
            return result
          }).join(' ')}<span ${styles('text-color-Operator')}>)</span>`

    return `
      <tr>
        <td>${form}</td>
        <td><span ${styles('text-color-Comment', 'mx-4')}>&rarr;</span></td>
        <td><span>${getType(returns)}</span></td>
      </tr>`
  }).join('')}
  </table>`
}
