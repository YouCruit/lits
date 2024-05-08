import type { Category, Reference } from '../../../reference'
import { styles } from '../../styles'
import { formatDescription } from './description'
import { getType } from './getType'

export function getReturnType(reference: Reference<Category>) {
  const { returns } = reference
  // return `<div ${styles('text-sm')}>${getType(returns)}</div>`
  return `<div ${styles('flex', 'flex-row', 'gap-2', 'text-sm')}>
  <div>${getType(reference.returns)}</div>
  ${returns.description ? formatDescription(returns.description, reference) : ''}
</div>`
}

