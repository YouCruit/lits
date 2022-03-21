/* eslint-disable no-console */
import { Lits } from '../../../src'

let lits: Lits

beforeEach(() => {
  lits = new Lits()
})

describe(`misc functions`, () => {
  let oldLog: () => void
  let oldWarn: () => void
  let lastLog: unknown
  let logSpy: (...args: unknown[]) => void
  beforeEach(() => {
    oldLog = console.log
    oldWarn = console.warn
    logSpy = jest.fn()
    console.log = (...args) => {
      logSpy(...args)
      lastLog = args[0]
    }
    console.warn = (...args) => {
      lastLog = args[0]
    }
  })
  afterEach(() => {
    console.log = oldLog
    console.warn = oldWarn
  })
  describe(`inst-ms!`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(inst-ms! 1)`)).toThrow()
      expect(() => lits.run(`(inst-ms! :x)`)).toThrow()
      expect(lits.run(`(inst-ms!)`)).toBeLessThanOrEqual(Date.now())
    })
  })

  describe(`not=`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(not=)`)).toThrow()
      expect(lits.run(`(not= 1)`)).toBe(true)
      expect(lits.run(`(not= 1 1)`)).toBe(false)
      expect(lits.run(`(not= 1 2)`)).toBe(true)
      expect(lits.run(`(not= 1 2 1)`)).toBe(false)
      expect(lits.run(`(not= 1 2 3)`)).toBe(true)
      expect(lits.run(`(not= :1)`)).toBe(true)
      expect(lits.run(`(not= :1 :1)`)).toBe(false)
      expect(lits.run(`(not= :1 :2)`)).toBe(true)
      expect(lits.run(`(not= :1 :2 :1)`)).toBe(false)
      expect(lits.run(`(not= :1 :2 3)`)).toBe(true)
      expect(lits.run(`(not= nil 0)`)).toBe(true)
      expect(lits.run(`(not= 1 true 3)`)).toBe(true)
      expect(lits.run(`(not= 1 false 3)`)).toBe(true)
    })
  })

  describe(`equal?`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(not=)`)).toThrow()
      expect(lits.run(`(equal? 1 1)`)).toBe(true)
      expect(lits.run(`(equal? 1 2)`)).toBe(false)
      expect(lits.run(`(equal? :1 :1)`)).toBe(true)
      expect(lits.run(`(equal? :1 :2)`)).toBe(false)
      expect(lits.run(`(equal? nil 0)`)).toBe(false)
      expect(lits.run(`(equal? [1 2 {:a 10 :b [nil]}] [1 2 {:b [nil] :a 10}])`)).toBe(true)
      expect(lits.run(`(equal? [1 2 {:a 10 :b [nil]}] [1 2 {:b [0] :a 10}])`)).toBe(false)
    })
  })

  describe(`=`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(=)`)).toThrow()
      expect(lits.run(`(= 1)`)).toBe(true)
      expect(lits.run(`(= 1 1)`)).toBe(true)
      expect(lits.run(`(= 1 2)`)).toBe(false)
      expect(lits.run(`(= 1 2 1)`)).toBe(false)
      expect(lits.run(`(= 1 2 3)`)).toBe(false)
      expect(lits.run(`(= :1)`)).toBe(true)
      expect(lits.run(`(= :1 :1)`)).toBe(true)
      expect(lits.run(`(= :1 :2)`)).toBe(false)
      expect(lits.run(`(= :1 :2 :1)`)).toBe(false)
      expect(lits.run(`(= :1 :2 :3)`)).toBe(false)
      expect(lits.run(`(= :2 :2 :2)`)).toBe(true)
      expect(lits.run(`(= 1 :2 3)`)).toBe(false)
      expect(lits.run(`(= 1 nil 3)`)).toBe(false)
      expect(lits.run(`(= 1 true 3)`)).toBe(false)
      expect(lits.run(`(= 1 false 3)`)).toBe(false)
      expect(lits.run(`(= nil nil)`)).toBe(true)
      expect(lits.run(`(= true true)`)).toBe(true)
      expect(lits.run(`(= false false)`)).toBe(true)
    })

    test(`Object equality`, () => {
      const program = `
        (def obj1 (object :x 10))
        (def obj2 (object :x 10))
        [(= obj1 obj1) (= obj1 obj2)]
      `
      expect(lits.run(program)).toEqual([true, false])
    })

    test(`Array equality`, () => {
      const program = `
        (def array1 [1 2 3])
        (def array2 [1 2 3])
        [(= array1 array1) (= array1 array2)]
      `
      expect(lits.run(program)).toEqual([true, false])
    })
  })

  describe(`>`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(>)`)).toThrow()
      expect(lits.run(`(> 1)`)).toBe(true)
      expect(lits.run(`(> 1 2)`)).toBe(false)
      expect(lits.run(`(> 1 1)`)).toBe(false)
      expect(lits.run(`(> 2 1)`)).toBe(true)
      expect(lits.run(`(> 2 1 2)`)).toBe(false)
      expect(lits.run(`(> 2 1 0)`)).toBe(true)
      expect(lits.run(`(> 'albert' 'ALBERT')`)).toBe(true)
      expect(lits.run(`(> 'ALBERT' 'albert')`)).toBe(false)
      expect(lits.run(`(> 'albert' 'alber')`)).toBe(true)
      expect(lits.run(`(> 'albert' 'albert')`)).toBe(false)
      expect(lits.run(`(> 'alber' 'albert')`)).toBe(false)

      expect(lits.run(`(> :1)`)).toBe(true)
      expect(lits.run(`(> :1 :2)`)).toBe(false)
      expect(lits.run(`(> :1 :1)`)).toBe(false)
      expect(lits.run(`(> :2 :1)`)).toBe(true)
      expect(lits.run(`(> :2 :1 :2)`)).toBe(false)
      expect(lits.run(`(> :2 :1 0)`)).toBe(true)
    })
  })

  describe(`<`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(<)`)).toThrow()
      expect(lits.run(`(< 1)`)).toBe(true)
      expect(lits.run(`(< 1 2)`)).toBe(true)
      expect(lits.run(`(< 1 1)`)).toBe(false)
      expect(lits.run(`(< 2 1)`)).toBe(false)
      expect(lits.run(`(< 1 2 1)`)).toBe(false)
      expect(lits.run(`(< 0 1 2)`)).toBe(true)
      expect(lits.run(`(< 'albert' 'ALBERT')`)).toBe(false)
      expect(lits.run(`(< 'ALBERT' 'albert')`)).toBe(true)
      expect(lits.run(`(< 'albert' 'alber')`)).toBe(false)
      expect(lits.run(`(< 'albert' 'albert')`)).toBe(false)
      expect(lits.run(`(< 'alber' 'albert')`)).toBe(true)

      expect(lits.run(`(< :1)`)).toBe(true)
      expect(lits.run(`(< :1 :2)`)).toBe(true)
      expect(lits.run(`(< :1 :1)`)).toBe(false)
      expect(lits.run(`(< :2 :1)`)).toBe(false)
      expect(lits.run(`(< :1 :2 :1)`)).toBe(false)
      expect(lits.run(`(< 0 :1 :2)`)).toBe(true)
    })
  })

  describe(`>=`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(>=)`)).toThrow()
      expect(lits.run(`(>= 1)`)).toBe(true)
      expect(lits.run(`(>= 1 2)`)).toBe(false)
      expect(lits.run(`(>= 1 1)`)).toBe(true)
      expect(lits.run(`(>= 2 1)`)).toBe(true)
      expect(lits.run(`(>= 2 1 2)`)).toBe(false)
      expect(lits.run(`(>= 2 1 1)`)).toBe(true)
      expect(lits.run(`(>= 'albert' 'ALBERT')`)).toBe(true)
      expect(lits.run(`(>= 'ALBERT' 'albert')`)).toBe(false)
      expect(lits.run(`(>= 'albert' 'alber')`)).toBe(true)
      expect(lits.run(`(>= 'albert' 'albert')`)).toBe(true)
      expect(lits.run(`(>= 'alber' 'albert')`)).toBe(false)

      expect(lits.run(`(>= :1)`)).toBe(true)
      expect(lits.run(`(>= :1 :2)`)).toBe(false)
      expect(lits.run(`(>= :1 :1)`)).toBe(true)
      expect(lits.run(`(>= :2 :1)`)).toBe(true)
      expect(lits.run(`(>= :2 :1 :2)`)).toBe(false)
      expect(lits.run(`(>= :2 :1 :1)`)).toBe(true)
    })
  })

  describe(`<=`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(<=)`)).toThrow()
      expect(lits.run(`(<= 1)`)).toBe(true)
      expect(lits.run(`(<= 1 2)`)).toBe(true)
      expect(lits.run(`(<= 1 1)`)).toBe(true)
      expect(lits.run(`(<= 2 1)`)).toBe(false)
      expect(lits.run(`(<= 1 2 1)`)).toBe(false)
      expect(lits.run(`(<= 1 2 2)`)).toBe(true)
      expect(lits.run(`(<= 'albert' 'ALBERT')`)).toBe(false)
      expect(lits.run(`(<= 'ALBERT' 'albert')`)).toBe(true)
      expect(lits.run(`(<= 'albert' 'alber')`)).toBe(false)
      expect(lits.run(`(<= 'albert' 'albert')`)).toBe(true)
      expect(lits.run(`(<= 'alber' 'albert')`)).toBe(true)

      expect(lits.run(`(<= :1)`)).toBe(true)
      expect(lits.run(`(<= :1 :2)`)).toBe(true)
      expect(lits.run(`(<= :1 :1)`)).toBe(true)
      expect(lits.run(`(<= :2 :1)`)).toBe(false)
      expect(lits.run(`(<= :1 :2 :1)`)).toBe(false)
      expect(lits.run(`(<= :1 :2 :2)`)).toBe(true)
    })
  })

  describe(`not`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(not)`)).toThrow()
      expect(lits.run(`(not 0)`)).toBe(true)
      expect(lits.run(`(not '')`)).toBe(true)
      expect(lits.run(`(not :0)`)).toBe(false)
      expect(lits.run(`(not 1)`)).toBe(false)
      expect(lits.run(`(not -1)`)).toBe(false)
      expect(lits.run(`(not [])`)).toBe(false)
      expect(lits.run(`(not false)`)).toBe(true)
      expect(lits.run(`(not true)`)).toBe(false)
      expect(lits.run(`(not nil)`)).toBe(true)
      expect(() => lits.run(`(not 0 1)`)).toThrow()
    })
  })

  describe(`write!`, () => {
    test(`samples`, () => {
      expect(lits.run(`(write!)`)).toBe(null)
      expect(lits.run(`(write! 1)`)).toBe(1)
      expect(lits.run(`(write! :1)`)).toBe(`1`)
      expect(lits.run(`(write! 100 [] :1)`)).toBe(`1`)
      expect(lits.run(`(write! [])`)).toEqual([])
      expect(lits.run(`(write! (object))`)).toEqual({})
      expect(lits.run(`(write! nil)`)).toBe(null)
      expect(lits.run(`(write! true)`)).toBe(true)
      expect(lits.run(`(write! false)`)).toBe(false)
    })
    test(`that it does console.log`, () => {
      lits.run(`(write! 1)`)
      expect(logSpy).toHaveBeenCalledWith(1)
    })
  })

  describe(`debug!`, () => {
    test(`samples`, () => {
      expect(lits.run(`(debug!)`)).toBe(null)
      expect(lits.run(`(debug! +)`)).toBeTruthy()
      expect(() => lits.run(`(debug! '' 0)`)).toThrow()
    })
    test(`multiple contexts`, () => {
      const context = lits.context(`(def x 10) (defn foo [] 'foo') (def bar (fn [] 'bar')) (def plus +)`)
      lits.run(`((fn [z] (debug!) (+ z 1)) 10)`, { globals: { y: 20 }, contexts: [context] })
      expect(lastLog).toMatchSnapshot()
    })
    test(`debug value.`, () => {
      lits.run(`(debug! #(> %1 2))`)
      expect(lastLog).toMatchSnapshot()
    })
  })

  describe(`boolean`, () => {
    test(`samples`, () => {
      expect(lits.run(`(boolean 0)`)).toBe(false)
      expect(lits.run(`(boolean 1)`)).toBe(true)
      expect(lits.run(`(boolean 'Albert')`)).toBe(true)
      expect(lits.run(`(boolean '')`)).toBe(false)
      expect(lits.run(`(boolean true)`)).toBe(true)
      expect(lits.run(`(boolean false)`)).toBe(false)
      expect(lits.run(`(boolean nil)`)).toBe(false)
      expect(lits.run(`(boolean [])`)).toBe(true)
      expect(lits.run(`(boolean {})`)).toBe(true)
      expect(() => lits.run(`(boolean)`)).toThrow()
      expect(() => lits.run(`(boolean 2 3)`)).toThrow()
    })
  })

  describe(`compare`, () => {
    test(`samples`, () => {
      expect(lits.run(`(compare 0 1)`)).toBe(-1)
      expect(lits.run(`(compare 3 1)`)).toBe(1)
      expect(lits.run(`(compare nil nil)`)).toBe(0)
      expect(lits.run(`(compare true true)`)).toBe(0)
      expect(lits.run(`(compare true false)`)).toBe(1)
      expect(lits.run(`(compare false true)`)).toBe(-1)
      expect(lits.run(`(compare [] [])`)).toBe(0)
      expect(lits.run(`(compare [1 2 3] [2 3])`)).toBe(1)
      expect(lits.run(`(compare [1 2] [1 2 3])`)).toBe(-1)
      expect(lits.run(`(compare [1 2 3] [1 2 4])`)).toBe(-1)
      expect(lits.run(`(compare :A :a)`)).toBe(-1)
      expect(lits.run(`(compare :A :A)`)).toBe(0)
      expect(lits.run(`(compare (regexp :A) (regexp :a))`)).toBe(-1)
      expect(lits.run(`(compare (regexp :A) (regexp :A))`)).toBe(0)
      expect(lits.run(`(compare (regexp :a) (regexp :A))`)).toBe(1)
      expect(lits.run(`(compare (regexp :a) :A)`)).toBe(1)
      expect(lits.run(`(compare {:a 1} {:a 2})`)).toBe(0)
      expect(lits.run(`(compare {:a 1 :b 2} {:a 2})`)).toBe(1)
      expect(lits.run(`(compare {:a 1 :b 2} {:a 2})`)).toBe(1)
      expect(lits.run(`(compare + {:a 2})`)).toBe(1)
      expect(lits.run(`(compare + -)`)).toBe(0)
    })
  })

  describe(`lits-version!`, () => {
    test(`samples`, () => {
      expect(lits.run(`(lits-version!)`)).toMatch(/^\d+\.\d+\.\d+/)
      expect(() => lits.run(`(lits-version! 1)`)).toThrow()
    })
  })

  describe(`equal?`, () => {
    test(`samples`, () => {
      expect(lits.run(`(equal? {:a 10 :b 20} {:b 20 :a 10})`)).toBe(true)
      expect(lits.run(`(equal? [1 true nil] [1 true nil])`)).toBe(true)
      expect(lits.run(`(equal? {:a 10 :b [1 2 {:b 20}]} {:b [1 2 {:b 20}] :a 10})`)).toBe(true)
      expect(lits.run(`(equal? {:a 10 :b [1 2 {:b 20}]} {:b [1 2 {:b 21}] :a 10})`)).toBe(false)
      expect(lits.run(`(equal? [1, 2, 3] [1, 2, 3, 4])`)).toBe(false)
      expect(lits.run(`(equal? {:a 10} {:a 10, :b 20})`)).toBe(false)
    })
  })
})
