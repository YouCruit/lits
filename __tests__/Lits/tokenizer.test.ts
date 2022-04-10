import { tokenize } from '../../src/tokenizer'

describe(`Tokenizer`, () => {
  test(`simple expressions`, () => {
    const tokens = tokenize(
      `
      (let ((day (* 24 60 60 1000)))
        (* days day)
      )`,
      false,
    )
    expect(tokens.length).toBeGreaterThan(0)
  })
  test(`another simple expressions`, () => {
    const tokens = tokenize(`(do-me)`, false)
    expect(tokens.length).toBeGreaterThan(0)
  })

  test(`forbidden reserved names`, () => {
    expect(() => tokenize(`nil`, false)).not.toThrow()
    expect(() => tokenize(`false`, false)).not.toThrow()
    expect(() => tokenize(`true`, false)).not.toThrow()
    expect(() => tokenize(`null`, false)).toThrow()
    expect(() => tokenize(`undefined`, false)).toThrow()
    expect(() => tokenize(`===`, false)).toThrow()
    expect(() => tokenize(`!==`, false)).toThrow()
    expect(() => tokenize(`&&`, false)).toThrow()
    expect(() => tokenize(`||`, false)).toThrow()
  })

  test(`comments`, () => {
    expect(tokenize(`'Hi' ;This is a string`, false)).toEqual([{ type: `string`, value: `Hi`, debugInfo: null }])
    expect(tokenize(`'Hi' ;This is a string\n'there'`, false)).toEqual([
      { type: `string`, value: `Hi`, debugInfo: null },
      { type: `string`, value: `there`, debugInfo: null },
    ])
  })

  describe(`strings`, () => {
    test(`Unclosed string`, () => {
      expect(() => tokenize(`'Hej`, false)).toThrow()
    })
    test(`Escaped string`, () => {
      expect(tokenize(`'He\\'j'`, false)[0]).toEqual({
        type: `string`,
        value: `He'j`,
        debugInfo: null,
      })
      expect(tokenize(`'He\\\\j'`, false)[0]).toEqual({
        type: `string`,
        value: `He\\j`,
        debugInfo: null,
      })
      expect(tokenize(`'H\\ej'`, false)[0]).toEqual({
        type: `string`,
        value: `H\\ej`,
        debugInfo: null,
      })
    })
  })

  describe(`regexpShorthand`, () => {
    test(`samples`, () => {
      expect(tokenize(`#'Hej'`, true)).toEqual([
        {
          type: `regexpShorthand`,
          value: `Hej`,
          options: {},
          debugInfo: { line: 1, column: 1, code: `#'Hej'` },
        },
      ])
      expect(tokenize(`#'Hej'g`, true)).toEqual([
        {
          type: `regexpShorthand`,
          value: `Hej`,
          options: { g: true },
          debugInfo: { line: 1, column: 1, code: `#'Hej'g` },
        },
      ])
      expect(tokenize(`#'Hej'i`, true)).toEqual([
        {
          type: `regexpShorthand`,
          value: `Hej`,
          options: { i: true },
          debugInfo: { line: 1, column: 1, code: `#'Hej'i` },
        },
      ])
      expect(tokenize(`#'Hej'gi`, true)).toEqual([
        {
          type: `regexpShorthand`,
          value: `Hej`,
          options: { i: true, g: true },
          debugInfo: { line: 1, column: 1, code: `#'Hej'gi` },
        },
      ])
      expect(tokenize(`#'Hej'ig`, true)).toEqual([
        {
          type: `regexpShorthand`,
          value: `Hej`,
          options: { i: true, g: true },
          debugInfo: { line: 1, column: 1, code: `#'Hej'ig` },
        },
      ])
      expect(() => tokenize(`#'Hej'gg`, true)).toThrow()
      expect(() => tokenize(`#'Hej'ii`, true)).toThrow()
      expect(() => tokenize(`#1`, true)).toThrow()
    })
  })

  describe(`fnShorthand`, () => {
    test(`samples`, () => {
      expect(tokenize(`#(`, true)).toEqual([
        { type: `fnShorthand`, value: `#`, debugInfo: { line: 1, column: 1, code: `#(` } },
        { type: `paren`, value: `(`, debugInfo: { line: 1, column: 2, code: `#(` } },
      ])
      expect(() => tokenize(`#`, true)).toThrow()
    })
  })
})
