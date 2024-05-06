import type { Category, Reference } from '../../reference'
import { styles } from '../styles'
import { formatDescription } from './description'
import { getType } from './getType'

export function getArgumentInfo(reference: Reference<Category>) {
  const { args } = reference
  return `<table ${styles('text-sm')}>
  ${Object.entries(args).map(([argName, arg]) => {
    return `<tr>
              <td><span ${styles('Description_argument')}>${argName}</span></td>
              <td ${styles('pl-4')}>${getType(arg)}</td>
              ${arg.description ? `<td ${styles('pl-4')}>${formatDescription(arg.description, reference)}</td>` : ''}
            </tr>`
  }).join(' ')}
  </table>`
}
