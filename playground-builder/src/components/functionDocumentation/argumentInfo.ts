import type { Category, Reference } from '../../../../reference'
import { createStyles, css } from '../../styles'
import { formatDescription } from './description'
import { getType } from './getType'

const styles = createStyles({
  Description: css`
    @apply text-color-gray-400;
    @apply font-sans;
    @apply text-xs;
  `,
  Description_argument: css`
    @apply px-0.5; 
    @apply font-mono;
    @apply text-color-Viola;
  `,
})

export function getArgumentInfo(reference: Reference<Category>) {
  const { args } = reference
  return `<table ${styles('text-sm')}>
  ${Object.entries(args).map(([argName, arg]) => {
    return `<tr>
              <td><span ${styles('Description_argument')}>${argName}</span></td>
              <td ${styles('pl-4', 'whitespace-nowrap')}>${getType(arg)}</td>
              ${arg.description ? `<td ${styles('pl-4', 'italic', 'text-base')}>${formatDescription(arg.description, reference)}</td>` : ''}
            </tr>`
  }).join(' ')}
  </table>`
}
