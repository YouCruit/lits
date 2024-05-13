import { describe, expect, it } from 'vitest'
import { styles } from '../styles'
import { mdRules } from './rules'
import { createFormatter } from './createFormatter'

describe('textFormatter', () => {
  it('should work with mdRules', () => {
    const formatter = createFormatter(mdRules)
    const input = '***Hello***, **world**!'
    const output = formatter(input)
    expect(output).toBe(
      `<span ${styles('italic')}>Hello</span>, <span ${styles('font-bold')}>world</span>!`,
    )
  })
})
