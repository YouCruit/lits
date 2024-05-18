import type { TextFormatter } from '../../../common/textFormatter'
import type { Reference } from '../../../reference'

export function getTitle(fmt: TextFormatter, reference: Reference) {
  return `${fmt.bright.blue(reference.title)} - ${fmt.gray(reference.category)}`
}
