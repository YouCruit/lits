import type { Token } from '../../src'
import { parse } from '../../src/parser'
import { AstNodeType, TokenType } from '../../src/constants/constants'
import type { Ast } from '../../src/parser/interface'
import { parseToken } from '../../src/parser/parsers'
import { tokenize } from '../../src/tokenizer'

const program = `
(let [day (* 24 60 60 1000)]
  (* days day)
)`

const optimizableProgram = `
(let [day (* 24 60 60 1000)]
  (* 11 day)
)`

describe(`Parser`, () => {
  test(`simple program`, () => {
    const tokens = tokenize(program, { debug: true })
    const ast = parse(tokens)
    expect(ast.b.length).toBe(1)
  })
  test(`empty program`, () => {
    const tokens = tokenize(``, { debug: true })
    const ast = parse(tokens)
    expect(ast.b.length).toBe(0)
  })

  test(`optimization`, () => {
    const tokens = tokenize(optimizableProgram, { debug: true })
    const ast = parse(tokens)
    expect(ast.b.length).toBe(1)
  })

  test(`Unparsable expression`, () => {
    const tokens = tokenize(`(`, { debug: true })
    expect(() => parse(tokens)).toThrow()
  })

  test(`parse for`, () => {
    expect(() => parse(tokenize(`(for [x [1 2 3]] x)`, { debug: true }))).not.toThrow()
    expect(() => parse(tokenize(`(for [x [1 2 3] &let [y (* x x)]] y)`, { debug: true }))).not.toThrow()
    expect(() => parse(tokenize(`(for [x [1 2 3] &let [z x] &let [y (* x x)]] y)`, { debug: true }))).toThrow()
    expect(() => parse(tokenize(`(for [x [1 2 3] &when (odd? x)] x)`, { debug: true }))).not.toThrow()
    expect(() => parse(tokenize(`(for [x [1 2 3] &when (odd? x) &when (odd? x)] x)`, { debug: true }))).toThrow()
    expect(() => parse(tokenize(`(for [x [1 2 3] &while (odd? x)] x)`, { debug: true }))).not.toThrow()
    expect(() => parse(tokenize(`(for [x [1 2 3] &while (odd? x) &while (odd? x)] x)`, { debug: true }))).toThrow()
    expect(() => parse(tokenize(`(for [x [1 2 3] &while (odd? x) &whil (odd? x)] x)`, { debug: true }))).toThrow()
    expect(() =>
      parse(
        tokenize(
          `(for [x [1 2 3] &when (odd? x) &while (not= x 3) &let [y (* x x)] y [5 10 15] z [100 200 300]] (+ x y z))`,
          { debug: true },
        ),
      ),
    ).not.toThrow()
  })

  test(`parse dotNotation, check ast 1`, () => {
    const tokens = tokenize(`foo#1.a`, { debug: false })
    const ast = parse(tokens)
    expect(ast).toEqual<Ast>({
      b: [
        {
          t: AstNodeType.NormalExpression,
          e: {
            t: AstNodeType.NormalExpression,
            n: `foo`,
            p: [
              {
                t: AstNodeType.Number,
                v: 1,
              },
            ],
          },
          p: [
            {
              t: AstNodeType.String,
              v: `a`,
            },
          ],
        },
      ],
    })
  })

  test(`parse dotNotation, check ast 2`, () => {
    const tokens = tokenize(`(#(identity %1) [1 2 3])#1`, { debug: false })
    const ast = parse(tokens)
    expect(ast).toEqual<Ast>({
      b: [
        {
          t: 203,
          e: {
            t: 203,
            e: {
              t: 204,
              n: `fn`,
              p: [],
              o: [
                {
                  as: {
                    b: [],
                    m: [`%1`],
                  },
                  b: [
                    {
                      t: 203,
                      n: `identity`,
                      p: [
                        {
                          t: 205,
                          v: `%1`,
                        },
                      ],
                    },
                  ],
                  a: 1,
                },
              ],
            },
            p: [
              {
                t: 203,
                n: `array`,
                p: [
                  {
                    t: 201,
                    v: 1,
                  },
                  {
                    t: 201,
                    v: 2,
                  },
                  {
                    t: 201,
                    v: 3,
                  },
                ],
              },
            ],
          },
          p: [
            {
              t: 201,
              v: 1,
            },
          ],
        },
      ],
    })
  })

  test(`parseToken unknown token`, () => {
    const tokens: Token[] = [
      {
        t: TokenType.CollectionAccessor,
        v: ``,
      },
      {
        t: TokenType.Modifier,
        v: ``,
      },
    ]
    expect(() => parseToken(tokens, 0)).toThrow()
    expect(() => parseToken(tokens, 1)).toThrow()
  })
})
