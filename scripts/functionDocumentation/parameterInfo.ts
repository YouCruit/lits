import type { Category, Reference } from '../../reference'
import { styles } from '../styles'
import { formatDescription } from './description'
import { getType } from './getType'

export function getParameterInfo(reference: Reference<Category>) {
  const { parameters } = reference
  return `<table ${styles('text-sm')}>
  ${Object.entries(parameters).map(([parameterName, parameter]) => {
    return `<tr>
              <td><span ${styles('Description_argument')}>${parameterName}</span></td>
              <td ${styles('pl-4')}>${getType(parameter)}</td>
              ${parameter.description ? `<td ${styles('pl-4')}>${formatDescription(parameter.description, reference)}</td>` : ''}
            </tr>`
  }).join(' ')}
  </table>`
}
