import { TokenType } from '../constants/constants'
import type { Token } from '../tokenizer/interface'
import { assertToken, isToken } from './token'

describe(`token type guard`, () => {
  test(`token`, () => {
    const tkn: Token = {
      d: `EOF`,
      t: TokenType.Name,
      v: `Albert`,
    }
    const nonTkn1 = {
      ...tkn,
      t: 999,
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nonTkn2: any = {
      ...tkn,
    }
    delete nonTkn2.v
    expect(isToken(tkn)).toBe(true)
    expect(isToken(nonTkn1)).toBe(false)
    expect(isToken(10)).toBe(false)
    expect(() => assertToken(tkn, `EOF`)).not.toThrow()
    expect(() => assertToken(nonTkn2, `EOF`)).toThrow()
    expect(() => assertToken(nonTkn2, `EOF`)).toThrow()
    expect(() => assertToken(tkn, `EOF`, { type: TokenType.Name })).not.toThrow()
    expect(() => assertToken(tkn, `EOF`, { type: TokenType.Number })).toThrow()
    expect(() => assertToken(tkn, `EOF`, { type: TokenType.Name, value: `Albert` })).not.toThrow()
    expect(() => assertToken(tkn, `EOF`, { type: TokenType.Name, value: `Mojir` })).toThrow()
  })
})
