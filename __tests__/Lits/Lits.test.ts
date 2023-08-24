import type { Ast } from '../../src'
import { Lits } from '../../src'
import { UndefinedSymbolError } from '../../src/errors'
import { Cache } from '../../src/Lits/Cache'
import type { LazyValue } from '../../src/Lits/Lits'
import { AstNodeType } from '../../src/constants/constants'
import { TokenType } from '../../src/constants/constants'
import { assertLitsFunction } from '../../src/utils/functionAsserter'

describe(`TEST`, () => {
  let lits: Lits
  beforeEach(() => {
    lits = new Lits({ debug: true, astCacheSize: 0 })
  })
  test(`without params`, () => {
    const fn = lits.run(`#(+ %1 %2)`)
    assertLitsFunction(fn)
    expect(lits.apply(fn, [2, 3])).toBe(5)
  })
  test(`with empty params`, () => {
    const fn = lits.run(`#(+ %1 %2)`)
    assertLitsFunction(fn)
    expect(lits.apply(fn, [2, 3], {})).toBe(5)
  })

  test(`with params`, () => {
    const fn = lits.run(`#(+ %1 %2 x)`)
    assertLitsFunction(fn)
    expect(lits.apply(fn, [2, 3], { contexts: [{ x: { value: 1 } }] })).toBe(6)
  })
})

describe(`Lazy host values as function`, () => {
  test(`that it works`, () => {
    const lits = new Lits()
    const lazyHostValues: Record<string, LazyValue> = {
      x: {
        read: () => 42,
      },
      foo: {
        read: () => ({
          λ: true,
          t: 301,
          o: [
            {
              as: {
                mandatoryArguments: [],
              },
              a: 0,
              b: [
                {
                  t: 201,
                  v: 42,
                },
              ],
              f: {},
            },
          ],
        }),
      },
    }

    // expect(lits.run(`x`, { lazyValues: lazyHostValues })).toBe(42)
    expect(lits.run(`(foo)`, { lazyValues: lazyHostValues })).toBe(42)
    expect(lits.run(`z`, { lazyValues: { z: { read: () => 12 } } })).toBe(12)
  })
})

describe(`runtime info`, () => {
  test(`getRuntimeInfo().`, () => {
    const lits = new Lits()
    expect(lits.getRuntimeInfo()).toMatchSnapshot()
  })
  test(`getRuntimeInfo() with ast cache > 0`, () => {
    const lits = new Lits({ astCacheSize: 10 })
    expect(lits.getRuntimeInfo()).toMatchSnapshot()
  })
  test(`getRuntimeInfo() with ast cache = 0`, () => {
    const lits = new Lits({ astCacheSize: 0 })
    expect(lits.getRuntimeInfo()).toMatchSnapshot()
  })
})

describe(`context`, () => {
  let lits: Lits
  beforeEach(() => {
    lits = new Lits({ debug: true })
  })
  test(`a function.`, () => {
    lits = new Lits({ astCacheSize: 10 })
    const contexts = [lits.context(`(defn tripple [x] (* x 3))`)]
    expect(lits.run(`(tripple 10)`, { contexts })).toBe(30)
    expect(lits.run(`(tripple 10)`, { contexts })).toBe(30)
  })

  test(`a function - no cache`, () => {
    lits = new Lits({ debug: true })
    const contexts = [lits.context(`(defn tripple [x] (* x 3))`, {})]
    expect(lits.run(`(tripple 10)`, { contexts })).toBe(30)
    expect(lits.run(`(tripple 10)`, { contexts })).toBe(30)
  })

  test(`a function - initial cache`, () => {
    const initialCache: Record<string, Ast> = {
      '(pow 2 4)': {
        b: [
          {
            t: AstNodeType.NormalExpression,
            n: `pow`,
            p: [
              {
                t: AstNodeType.Number,
                v: 2,
                tkn: {
                  t: TokenType.Number,
                  v: `2`,
                },
              },
              {
                t: AstNodeType.Number,
                v: 4,
                tkn: {
                  t: TokenType.Number,
                  v: `4`,
                },
              },
            ],
            tkn: {
              t: TokenType.Name,
              v: `pow`,
            },
          },
        ],
      },
    }
    lits = new Lits({ astCacheSize: 10, initialCache })
    expect(lits.run(`(pow 2 2)`)).toBe(4)
    expect(lits.run(`(pow 2 4)`)).toBe(16)
  })

  test(`a variable.`, () => {
    const contexts = [lits.context(`(def magicNumber 42)`)]
    expect(lits.run(`magicNumber`, { contexts })).toBe(42)
  })

  test(`a variable - again.`, () => {
    const contexts = [
      lits.context(`
    (defn zip? [string] (boolean (match (regexp "^\\d{5}$") string)))
    (defn isoDateString? [string] (boolean (match (regexp "^\\d{4}-\\d{2}-\\d{2}$") string)))
    (def NAME_LENGTH 100)
    `),
    ]
    expect(lits.run(`NAME_LENGTH`, { contexts })).toBe(100)
  })

  test(`change imported variable`, () => {
    const contexts = [lits.context(`(def magicNumber 42)`)]
    expect(lits.run(`magicNumber`, { contexts })).toBe(42)
  })

  test(`a function with a built in normal expression name`, () => {
    expect(() => lits.context(`(defn inc (x) (+ x 1))`)).toThrow()
    expect(() => lits.context(`(defn inc (x) (+ x 1))`, { contexts: [{}] })).toThrow()
    expect(() => lits.context(`(defn inc (x) (+ x 1))`, { values: {} })).toThrow()
  })

  test(`a function with a built in special expression name`, () => {
    expect(() => lits.context(`(defn and (x y) (* x y))`)).toThrow()
  })

  test(`a variable twice`, () => {
    const contexts = [lits.context(`(def magicNumber 42) (defn getMagic [] 42)`)]
    lits.context(`(def magicNumber 42) (defn getMagic [] 42)`, { contexts })
  })

  test(`more than one`, () => {
    const contexts = [lits.context(`(defn tripple [x] (* x 3))`), lits.context(`(def magicNumber 42)`)]
    expect(lits.run(`(tripple magicNumber)`, { contexts })).toBe(126)
  })
})

function ast(n: number): Ast {
  return {
    b: [
      {
        t: AstNodeType.Number,
        v: n,
      },
    ],
  }
}

describe(`Cache`, () => {
  test(`cannot set same key twice`, () => {
    const cache = new Cache(10)
    cache.set(`a`, ast(1))
    expect(() => cache.set(`a`, ast(2))).toThrow()
  })

  test(`getContent`, () => {
    const cache = new Cache(10)
    cache.set(`a`, ast(1))
    cache.set(`b`, ast(2))
    expect(cache.getContent()).toEqual({
      a: ast(1),
      b: ast(2),
    })
  })
  test(`getContent`, () => {
    const cache = new Cache(null)
    cache.set(`a`, ast(1))
    cache.set(`b`, ast(2))
    expect(cache.getContent()).toEqual({
      a: ast(1),
      b: ast(2),
    })
  })

  test(`max cache size must be at least 1`, () => {
    expect(() => new Cache(-1)).toThrow()
    expect(() => new Cache(0)).toThrow()
    expect(() => new Cache(0.1)).not.toThrow()
    expect(() => new Cache(1)).not.toThrow()
  })

  test(`Add an entry.`, () => {
    const cache = new Cache(10)
    expect(cache.size).toBe(0)
    cache.set(`a`, ast(1))
    expect(cache.size).toBe(1)
    expect(cache.get(`a`)).toEqual(ast(1))
    expect(cache.has(`a`)).toBe(true)
  })

  test(`Clear cache.`, () => {
    const cache = new Cache(10)
    cache.set(`a`, ast(1))
    cache.set(`b`, ast(2))
    cache.set(`c`, ast(3))
    expect(cache.size).toBe(3)
    cache.clear()
    expect(cache.size).toBe(0)
  })

  test(`Add an entry - cacheSize = 1`, () => {
    const cache = new Cache(1)
    expect(cache.size).toBe(0)
    cache.set(`a`, ast(1))
    expect(cache.size).toBe(1)
    expect(cache.get(`a`)).toEqual(ast(1))
  })
  test(`maxSize.`, () => {
    const cache = new Cache(1)
    cache.set(`a`, ast(1))
    expect(cache.get(`a`)).toEqual(ast(1))
    cache.set(`b`, ast(2))
    expect(cache.size).toBe(1)
    expect(cache.get(`a`)).toBeUndefined()
    expect(cache.has(`a`)).toBe(false)
    expect(cache.get(`b`)).toEqual(ast(2))
    expect(cache.has(`b`)).toBe(true)
  })
  test(`maxSize.`, () => {
    const cache = new Cache(1)
    cache.set(`a`, ast(1))
    expect(cache.get(`a`)).toEqual(ast(1))
    cache.set(`b`, ast(2))
    expect(cache.size).toBe(1)
    expect(cache.get(`a`)).toBeUndefined()
    expect(cache.has(`a`)).toBe(false)
    expect(cache.get(`b`)).toEqual(ast(2))
    expect(cache.has(`b`)).toBe(true)
  })
})

describe(`regressions`, () => {
  let lits: Lits
  beforeEach(() => {
    lits = new Lits({ debug: true })
  })
  test(`debugInfo`, () => {
    try {
      lits.run(`(loop [n 3]
  (write! n)
  (when (not zero? n))
    (recur (dec n))
  )
)`)
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((error as any).debugInfo.line).toBe(3)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((error as any).debugInfo.column).toBe(10)
    }
  })
  test(`name not recognized`, () => {
    expect(() => lits.run(`(asd)`)).toThrowError(UndefinedSymbolError)
    expect(() => lits.run(`asd`)).toThrowError(UndefinedSymbolError)
  })

  test(`debug info when executing function with error in`, () => {
    const program = `(defn formatPhoneNumber [$data]
  (if (string? $data)
    (let [phoneNumber (if (= "+" (nth $data 0)) (subs $data 2) $data)]
      (cond
        (> (count phoneNumber) 6)
          (astr
            "("
            (subs phoneNumber 0 3)

            ") "
            (subs phoneNumber 3 6)
            "-"
            (subs phoneNumber 6))

        (> (count phoneNumber) 3)
          (str "(" (subs phoneNumber 0 3) ") " (subs phoneNumber 3))

        (> (count phoneNumber) 0)
          (str "(" (subs phoneNumber 0))

        true
          phoneNumber
      )
    )
    ""
  )
)

(formatPhoneNumber "+1234232123")`
    try {
      lits.run(program)
      fail()
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((error as any).debugInfo.line).toBe(6)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((error as any).debugInfo.column).toBe(12)
    }
  })
  test(`unexpected argument`, () => {
    try {
      lits.run(`(+ 1 + 2)`)
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyError = error as any
      expect(anyError.debugInfo.line).toBe(1)
      expect(anyError.debugInfo.column).toBe(6)
    }
  })
})
