import { describe, expect, it } from 'vitest'
import type { Category, Reference } from '../../reference'
import { styles } from '../styles'
import { formatDescription } from './description'

const reference: Reference<Category> = {
  name: 'name',
  linkName: 'linkName',
  examples: [],
  returns: {
    type: 'number',
  },
  arguments: {
    n: {
      type: 'boolean',
    },
    ns: {
      type: 'boolean',
      rest: true,
    },
  },
  variants: [
    { argumentNames: ['n', 'ns'] },
  ],
  clojureDocs: '',
  category: 'Special expression',
  description: 'calculating **sum** of $n and $ns. $n is a number.',
}

describe('styles', () => {
  it('should work', () => {
    expect(formatDescription(reference.description, reference)).toBe(
      `<span ${
        styles('Description')
      }>calculating <span ${
        styles('font-bold')
      }>sum</span> of <span ${
        styles('Description_argument')
      }>n</span> and <span ${
        styles('Description_argument')
      }>ns</span>. <span ${
        styles('Description_argument')
      }>n</span> is a number.</span>`,
    )
  })
})
