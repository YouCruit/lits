import type { Category, Reference } from '../../../../reference'
import { styles } from '../../styles'
import { getType } from './getType'

export function getFunctionSignature({ name, variants, args, returns }: Reference<Category>) {
  return `<table>
  ${variants.map((variant) => {
    const form = (variant.argumentNames.length === 0)
      ? `<span ${styles('text-color-gray-500')}>(</span><span ${styles('text-color-Blue')}>${name}</span><span ${styles('text-color-gray-500')}>)</span>`
      : `<span ${styles('text-color-gray-500')}>(</span><span ${styles('text-color-Blue')}>${name}</span> ${variant.argumentNames.map((argName) => {
            let result = ''
            const arg = args[argName]
            if (arg) {
              if (arg.rest)
                result += '& '
              result += `<span ${styles('text-color-Viola')}>${argName}</span>`
              if (arg.type === '*binding')
                result = `<span ${styles('text-color-gray-500')}>[</span>${result}<span ${styles('text-color-gray-500')}>]</span>`
            }
            return result
          }).join(' ')}<span ${styles('text-color-gray-500')}>)</span>`

    return `
      <tr>
        <td>${form}</td>
        <td><span ${styles('text-color-gray-400', 'mx-4', 'text-2xl', 'line-height: 1rem;')}>&rarr;</span></td>
        <td><span>${getType(returns)}</span></td>
      </tr>`
  }).join('')}
  </table>`
}
