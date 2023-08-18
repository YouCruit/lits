import { tokenize } from '../../src/tokenizer'
import { TokenizerType } from '../../src/tokenizer/interface'

describe(`Tokenizer`, () => {
  test(`simple expressions`, () => {
    const tokens = tokenize(
      `
      (let ((day (* 24 60 60 1000)))
        (* days day)
      )`,
      { debug: false },
    )
    expect(tokens.length).toBeGreaterThan(0)
  })
  test(`another simple expressions`, () => {
    const tokens = tokenize(`(do-me)`, { debug: false })
    expect(tokens.length).toBeGreaterThan(0)
  })

  test(`forbidden reserved names`, () => {
    expect(() => tokenize(`nil`, { debug: false })).not.toThrow()
    expect(() => tokenize(`false`, { debug: false })).not.toThrow()
    expect(() => tokenize(`true`, { debug: false })).not.toThrow()
    expect(() => tokenize(`null`, { debug: false })).toThrow()
    expect(() => tokenize(`undefined`, { debug: false })).toThrow()
    expect(() => tokenize(`===`, { debug: false })).toThrow()
    expect(() => tokenize(`!==`, { debug: false })).toThrow()
    expect(() => tokenize(`&&`, { debug: false })).toThrow()
    expect(() => tokenize(`||`, { debug: false })).toThrow()
  })

  test(`comments`, () => {
    expect(tokenize(`"Hi" ;This is a string`, { debug: false })).toEqual([{ t: TokenizerType.String, v: `Hi` }])
    expect(tokenize(`"Hi" ;This is a string\n"there"`, { debug: false })).toEqual([
      { t: TokenizerType.String, v: `Hi` },
      { t: TokenizerType.String, v: `there` },
    ])
  })

  describe(`strings`, () => {
    test(`Unclosed string`, () => {
      expect(() => tokenize(`"Hej`, { debug: false })).toThrow()
    })
    test(`Escaped string`, () => {
      expect(tokenize(`"He\\"j"`, { debug: false })[0]).toEqual({
        t: TokenizerType.String,
        v: `He"j`,
      })
      expect(tokenize(`"He\\\\j"`, { debug: false })[0]).toEqual({
        t: TokenizerType.String,
        v: `He\\j`,
      })
      expect(tokenize(`"H\\ej"`, { debug: false })[0]).toEqual({
        t: TokenizerType.String,
        v: `H\\ej`,
      })
    })
  })

  describe(`regexpShorthand`, () => {
    test(`samples`, () => {
      expect(tokenize(`#"Hej"`, { debug: true })).toEqual([
        {
          t: TokenizerType.RegexpShorthand,
          v: `Hej`,
          o: {},
          d: { line: 1, column: 1, code: `#"Hej"`, getLocation: undefined },
        },
      ])
      expect(tokenize(`#"Hej"g`, { debug: true })).toEqual([
        {
          t: TokenizerType.RegexpShorthand,
          v: `Hej`,
          o: { g: true },
          d: { line: 1, column: 1, code: `#"Hej"g`, getLocation: undefined },
        },
      ])
      expect(tokenize(`#"Hej"i`, { debug: true })).toEqual([
        {
          t: TokenizerType.RegexpShorthand,
          v: `Hej`,
          o: { i: true },
          d: { line: 1, column: 1, code: `#"Hej"i`, getLocation: undefined },
        },
      ])
      expect(tokenize(`#"Hej"gi`, { debug: true })).toEqual([
        {
          t: TokenizerType.RegexpShorthand,
          v: `Hej`,
          o: { i: true, g: true },
          d: { line: 1, column: 1, code: `#"Hej"gi`, getLocation: undefined },
        },
      ])
      expect(tokenize(`#"Hej"ig`, { debug: true })).toEqual([
        {
          t: TokenizerType.RegexpShorthand,
          v: `Hej`,
          o: { i: true, g: true },
          d: { line: 1, column: 1, code: `#"Hej"ig`, getLocation: undefined },
        },
      ])
      expect(() => tokenize(`#"Hej"gg`, { debug: true })).toThrow()
      expect(() => tokenize(`#"Hej"ii`, { debug: true })).toThrow()
      expect(() => tokenize(`#1`, { debug: true })).toThrow()
    })
  })

  describe(`fnShorthand`, () => {
    test(`samples`, () => {
      expect(tokenize(`#(`, { debug: true })).toEqual([
        {
          t: TokenizerType.FnShorthand,
          v: `#`,
          d: { line: 1, column: 1, code: `#(`, getLocation: undefined },
        },
        {
          t: TokenizerType.Bracket,
          v: `(`,
          d: { line: 1, column: 2, code: `#(`, getLocation: undefined },
        },
      ])
      expect(() => tokenize(`#`, { debug: true })).toThrow()
    })
  })

  describe(`dotExpression`, () => {
    test(`samples`, () => {
      const samples = [
        `(#(indentity %1) [1 2 3])#1`,
        `x#1.bar`,
        `x.y.z#1#2`,
        `foo.bar`,
        `foo#10`,
        `foo # 10`,
        `foo #10 #20 . bar`,
        `[1 2 3]#1`,
        `{:a 1}.a`,
      ]
      for (const sample of samples) {
        tokenize(sample, { debug: false })
      }
    })
    test(`illegal samples`, () => {
      const illegalSamples = [`#(indentity %1)#1`, `(.bar`, `foo##1`, `foo..bar`, `.bar`, `).1`]
      for (const sample of illegalSamples) {
        try {
          tokenize(sample, { debug: false })
          throw Error()
        } catch {
          // Expected
        }
      }
    })
  })
})
