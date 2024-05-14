/* eslint-disable no-console */
import { afterEach, beforeEach, describe, expect, it, vitest } from 'vitest'
import { Lits } from '../../../src'

describe('misc functions', () => {
  let oldLog: () => void
  let oldWarn: () => void
  // eslint-disable-next-line unused-imports/no-unused-vars
  let lastLog: unknown
  let logSpy: (...args: unknown[]) => void
  beforeEach(() => {
    oldLog = console.log
    oldWarn = console.warn
    logSpy = vitest.fn()
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
  for (const lits of [new Lits(), new Lits({ debug: true })]) {
    describe('inst-ms!', () => {
      it('samples', () => {
        expect(() => lits.run('(inst-ms! 1)')).toThrow()
        expect(() => lits.run('(inst-ms! :x)')).toThrow()
        expect(lits.run('(inst-ms!)')).toBeLessThanOrEqual(Date.now())
      })
    })

    describe('inst-ms->iso-date-time', () => {
      it('samples', () => {
        expect(() => lits.run('(inst-ms->iso-date-time 1649756230899 1649756230899)')).toThrow()
        expect(() => lits.run('(inst-ms->iso-date-time)')).toThrow()
        expect(() => lits.run('(inst-ms->iso-date-time "1649756230899")')).toThrow()
        expect(() => lits.run('(inst-ms->iso-date-time nil)')).toThrow()
        expect(() => lits.run('(inst-ms->iso-date-time true)')).toThrow()
        expect(lits.run('(inst-ms->iso-date-time 1649756230899)')).toBe('2022-04-12T09:37:10.899Z')
        expect(lits.run('(inst-ms->iso-date-time -1649756230899)')).toBe('1917-09-21T14:22:49.101Z')
        expect(lits.run('(inst-ms->iso-date-time 0)')).toBe('1970-01-01T00:00:00.000Z')
        expect(lits.run('(inst-ms->iso-date-time 0.999)')).toBe('1970-01-01T00:00:00.000Z')
        expect(lits.run('(inst-ms->iso-date-time 0.999)')).toBe('1970-01-01T00:00:00.000Z')
      })
    })

    describe('iso-date-time->inst-ms', () => {
      it('samples', () => {
        expect(() =>
          lits.run('(iso-date-time->inst-ms "2022-04-12T09:37:10.899Z" "2022-04-12T09:37:10.899Z")'),
        ).toThrow()
        expect(() => lits.run('(iso-date-time->inst-ms)')).toThrow()
        expect(() => lits.run('(iso-date-time->inst-ms 1649756230899)')).toThrow()
        expect(() => lits.run('(iso-date-time->inst-ms nil)')).toThrow()
        expect(() => lits.run('(iso-date-time->inst-ms true)')).toThrow()
        expect(() => lits.run('(iso-date-time->inst-ms "2022-04-1X")')).toThrow()
        expect(() => lits.run('(iso-date-time->inst-ms "")')).toThrow()
        expect(lits.run('(iso-date-time->inst-ms "2022-04-12T09:37:10.899Z")')).toBe(1649756230899)
        expect(lits.run('(iso-date-time->inst-ms "2022-04-12")')).toBeGreaterThan(1649548800000)
      })
    })

    describe('not=', () => {
      it('samples', () => {
        expect(() => lits.run('(not=)')).toThrow()
        expect(lits.run('(not= 1)')).toBe(true)
        expect(lits.run('(not= 1 1)')).toBe(false)
        expect(lits.run('(not= 1 2)')).toBe(true)
        expect(lits.run('(not= 1 2 1)')).toBe(false)
        expect(lits.run('(not= 1 2 3)')).toBe(true)
        expect(lits.run('(not= :1)')).toBe(true)
        expect(lits.run('(not= :1 :1)')).toBe(false)
        expect(lits.run('(not= :1 :2)')).toBe(true)
        expect(lits.run('(not= :1 :2 :1)')).toBe(false)
        expect(lits.run('(not= :1 :2 3)')).toBe(true)
        expect(lits.run('(not= nil 0)')).toBe(true)
        expect(lits.run('(not= 1 true 3)')).toBe(true)
        expect(lits.run('(not= 1 false 3)')).toBe(true)
      })
    })

    describe('equal?', () => {
      it('samples', () => {
        expect(() => lits.run('(not=)')).toThrow()
        expect(lits.run('(equal? 1 1)')).toBe(true)
        expect(lits.run('(equal? 1 2)')).toBe(false)
        expect(lits.run('(equal? :1 :1)')).toBe(true)
        expect(lits.run('(equal? :1 :2)')).toBe(false)
        expect(lits.run('(equal? nil 0)')).toBe(false)
        expect(lits.run('(equal? [1 2 {:a 10 :b [nil]}] [1 2 {:b [nil] :a 10}])')).toBe(true)
        expect(lits.run('(equal? [1 2 {:a 10 :b [nil]}] [1 2 {:b [0] :a 10}])')).toBe(false)
        expect(lits.run('(equal? {:a 10 :b 20} {:b 20 :a 10})')).toBe(true)
        expect(lits.run('(equal? [1 true nil] [1 true nil])')).toBe(true)
        expect(lits.run('(equal? {:a 10 :b [1 2 {:b 20}]} {:b [1 2 {:b 20}] :a 10})')).toBe(true)
        expect(lits.run('(equal? {:a 10 :b [1 2 {:b 20}]} {:b [1 2 {:b 21}] :a 10})')).toBe(false)
        expect(lits.run('(equal? [1, 2, 3] [1, 2, 3, 4])')).toBe(false)
        expect(lits.run('(equal? {:a 10} {:a 10, :b 20})')).toBe(false)
      })
    })

    describe('=', () => {
      it('samples', () => {
        expect(() => lits.run('(=)')).toThrow()
        expect(lits.run('(= 1)')).toBe(true)
        expect(lits.run('(= 1 1)')).toBe(true)
        expect(lits.run('(= 1 2)')).toBe(false)
        expect(lits.run('(= 1 2 1)')).toBe(false)
        expect(lits.run('(= 1 2 3)')).toBe(false)
        expect(lits.run('(= :1)')).toBe(true)
        expect(lits.run('(= :1 :1)')).toBe(true)
        expect(lits.run('(= :1 :2)')).toBe(false)
        expect(lits.run('(= :1 :2 :1)')).toBe(false)
        expect(lits.run('(= :1 :2 :3)')).toBe(false)
        expect(lits.run('(= :2 :2 :2)')).toBe(true)
        expect(lits.run('(= 1 :2 3)')).toBe(false)
        expect(lits.run('(= 1 nil 3)')).toBe(false)
        expect(lits.run('(= 1 true 3)')).toBe(false)
        expect(lits.run('(= 1 false 3)')).toBe(false)
        expect(lits.run('(= nil nil)')).toBe(true)
        expect(lits.run('(= true true)')).toBe(true)
        expect(lits.run('(= false false)')).toBe(true)
      })

      it('object equality', () => {
        const program = `
        (def obj1 (object :x 10))
        (def obj2 (object :x 10))
        [(= obj1 obj1) (= obj1 obj2)]
      `
        expect(lits.run(program)).toEqual([true, false])
      })

      it('array equality', () => {
        const program = `
        (def array1 [1 2 3])
        (def array2 [1 2 3])
        [(= array1 array1) (= array1 array2)]
      `
        expect(lits.run(program)).toEqual([true, false])
      })
    })

    describe('>', () => {
      it('samples', () => {
        expect(() => lits.run('(>)')).toThrow()
        expect(lits.run('(> 1)')).toBe(true)
        expect(lits.run('(> 1 2)')).toBe(false)
        expect(lits.run('(> 1 1)')).toBe(false)
        expect(lits.run('(> 2 1)')).toBe(true)
        expect(lits.run('(> 2 1 2)')).toBe(false)
        expect(lits.run('(> 2 1 0)')).toBe(true)
        expect(lits.run('(> "albert" "ALBERT")')).toBe(true)
        expect(lits.run('(> "ALBERT" "albert")')).toBe(false)
        expect(lits.run('(> "albert" "alber")')).toBe(true)
        expect(lits.run('(> "albert" "albert")')).toBe(false)
        expect(lits.run('(> "alber" "albert")')).toBe(false)

        expect(lits.run('(> :1)')).toBe(true)
        expect(lits.run('(> :1 :2)')).toBe(false)
        expect(lits.run('(> :1 :1)')).toBe(false)
        expect(lits.run('(> :2 :1)')).toBe(true)
        expect(lits.run('(> :2 :1 :2)')).toBe(false)
        expect(lits.run('(> :2 :1 0)')).toBe(true)
      })
    })

    describe('<', () => {
      it('samples', () => {
        expect(() => lits.run('(<)')).toThrow()
        expect(lits.run('(< 1)')).toBe(true)
        expect(lits.run('(< 1 2)')).toBe(true)
        expect(lits.run('(< 1 1)')).toBe(false)
        expect(lits.run('(< 2 1)')).toBe(false)
        expect(lits.run('(< 1 2 1)')).toBe(false)
        expect(lits.run('(< 0 1 2)')).toBe(true)
        expect(lits.run('(< "albert" "ALBERT")')).toBe(false)
        expect(lits.run('(< "ALBERT" "albert")')).toBe(true)
        expect(lits.run('(< "albert" "alber")')).toBe(false)
        expect(lits.run('(< "albert" "albert")')).toBe(false)
        expect(lits.run('(< "alber" "albert")')).toBe(true)

        expect(lits.run('(< :1)')).toBe(true)
        expect(lits.run('(< :1 :2)')).toBe(true)
        expect(lits.run('(< :1 :1)')).toBe(false)
        expect(lits.run('(< :2 :1)')).toBe(false)
        expect(lits.run('(< :1 :2 :1)')).toBe(false)
        expect(lits.run('(< 0 :1 :2)')).toBe(true)
      })
    })

    describe('>=', () => {
      it('samples', () => {
        expect(() => lits.run('(>=)')).toThrow()
        expect(lits.run('(>= 1)')).toBe(true)
        expect(lits.run('(>= 1 2)')).toBe(false)
        expect(lits.run('(>= 1 1)')).toBe(true)
        expect(lits.run('(>= 2 1)')).toBe(true)
        expect(lits.run('(>= 2 1 2)')).toBe(false)
        expect(lits.run('(>= 2 1 1)')).toBe(true)
        expect(lits.run('(>= "albert" "ALBERT")')).toBe(true)
        expect(lits.run('(>= "ALBERT" "albert")')).toBe(false)
        expect(lits.run('(>= "albert" "alber")')).toBe(true)
        expect(lits.run('(>= "albert" "albert")')).toBe(true)
        expect(lits.run('(>= "alber" "albert")')).toBe(false)

        expect(lits.run('(>= :1)')).toBe(true)
        expect(lits.run('(>= :1 :2)')).toBe(false)
        expect(lits.run('(>= :1 :1)')).toBe(true)
        expect(lits.run('(>= :2 :1)')).toBe(true)
        expect(lits.run('(>= :2 :1 :2)')).toBe(false)
        expect(lits.run('(>= :2 :1 :1)')).toBe(true)
      })
    })

    describe('<=', () => {
      it('samples', () => {
        expect(() => lits.run('(<=)')).toThrow()
        expect(lits.run('(<= 1)')).toBe(true)
        expect(lits.run('(<= 1 2)')).toBe(true)
        expect(lits.run('(<= 1 1)')).toBe(true)
        expect(lits.run('(<= 2 1)')).toBe(false)
        expect(lits.run('(<= 1 2 1)')).toBe(false)
        expect(lits.run('(<= 1 2 2)')).toBe(true)
        expect(lits.run('(<= "albert" "ALBERT")')).toBe(false)
        expect(lits.run('(<= "ALBERT" "albert")')).toBe(true)
        expect(lits.run('(<= "albert" "alber")')).toBe(false)
        expect(lits.run('(<= "albert" "albert")')).toBe(true)
        expect(lits.run('(<= "alber" "albert")')).toBe(true)

        expect(lits.run('(<= :1)')).toBe(true)
        expect(lits.run('(<= :1 :2)')).toBe(true)
        expect(lits.run('(<= :1 :1)')).toBe(true)
        expect(lits.run('(<= :2 :1)')).toBe(false)
        expect(lits.run('(<= :1 :2 :1)')).toBe(false)
        expect(lits.run('(<= :1 :2 :2)')).toBe(true)
      })
    })

    describe('not', () => {
      it('samples', () => {
        expect(() => lits.run('(not)')).toThrow()
        expect(lits.run('(not 0)')).toBe(true)
        expect(lits.run('(not "")')).toBe(true)
        expect(lits.run('(not :0)')).toBe(false)
        expect(lits.run('(not 1)')).toBe(false)
        expect(lits.run('(not -1)')).toBe(false)
        expect(lits.run('(not [])')).toBe(false)
        expect(lits.run('(not false)')).toBe(true)
        expect(lits.run('(not true)')).toBe(false)
        expect(lits.run('(not nil)')).toBe(true)
        expect(() => lits.run('(not 0 1)')).toThrow()
      })
    })

    describe('write!', () => {
      it('samples', () => {
        expect(lits.run('(write!)')).toBe(null)
        expect(lits.run('(write! 1)')).toBe(1)
        expect(lits.run('(write! :1)')).toBe('1')
        expect(lits.run('(write! 100 [] :1)')).toBe('1')
        expect(lits.run('(write! [])')).toEqual([])
        expect(lits.run('(write! (object))')).toEqual({})
        expect(lits.run('(write! nil)')).toBe(null)
        expect(lits.run('(write! true)')).toBe(true)
        expect(lits.run('(write! false)')).toBe(false)
      })
      it('that it does console.log', () => {
        lits.run('(write! 1)')
        expect(logSpy).toHaveBeenCalledWith(1)
      })
    })

    describe('boolean', () => {
      it('samples', () => {
        expect(lits.run('(boolean 0)')).toBe(false)
        expect(lits.run('(boolean 1)')).toBe(true)
        expect(lits.run('(boolean "Albert")')).toBe(true)
        expect(lits.run('(boolean "")')).toBe(false)
        expect(lits.run('(boolean true)')).toBe(true)
        expect(lits.run('(boolean false)')).toBe(false)
        expect(lits.run('(boolean nil)')).toBe(false)
        expect(lits.run('(boolean [])')).toBe(true)
        expect(lits.run('(boolean {})')).toBe(true)
        expect(() => lits.run('(boolean)')).toThrow()
        expect(() => lits.run('(boolean 2 3)')).toThrow()
      })
    })

    describe('compare', () => {
      it('samples', () => {
        expect(lits.run('(compare 0 1)')).toBe(-1)
        expect(lits.run('(compare 3 1)')).toBe(1)
        expect(lits.run('(compare nil nil)')).toBe(0)
        expect(lits.run('(compare true true)')).toBe(0)
        expect(lits.run('(compare true false)')).toBe(1)
        expect(lits.run('(compare false true)')).toBe(-1)
        expect(lits.run('(compare [] [])')).toBe(0)
        expect(lits.run('(compare [1 2 3] [2 3])')).toBe(1)
        expect(lits.run('(compare [1 2] [1 2 3])')).toBe(-1)
        expect(lits.run('(compare [1 2 3] [1 2 4])')).toBe(-1)
        expect(lits.run('(compare :A :a)')).toBe(-1)
        expect(lits.run('(compare :A :A)')).toBe(0)
        expect(lits.run('(compare (regexp :A) (regexp :a))')).toBe(-1)
        expect(lits.run('(compare (regexp :A) (regexp :A))')).toBe(0)
        expect(lits.run('(compare (regexp :a) (regexp :A))')).toBe(1)
        expect(lits.run('(compare (regexp :a) :A)')).toBe(1)
        expect(lits.run('(compare {:a 1} {:a 2})')).toBe(0)
        expect(lits.run('(compare {:a 1 :b 2} {:a 2})')).toBe(1)
        expect(lits.run('(compare {:a 1 :b 2} {:a 2})')).toBe(1)
        expect(lits.run('(compare + {:a 2})')).toBe(1)
        expect(lits.run('(compare + -)')).toBe(0)
      })
    })

    describe('lits-version!', () => {
      it('samples', () => {
        expect(lits.run('(lits-version!)')).toMatch(/^\d+\.\d+\.\d+/)
        expect(() => lits.run('(lits-version! 1)')).toThrow()
      })
    })

    describe('uuid!', () => {
      it('samples', () => {
        expect(lits.run('(uuid!)')).toMatch(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)
      })
    })

    describe('json-stringify', () => {
      it('samples', () => {
        expect(lits.run('(json-stringify {:a 10 :b 20})')).toBe('{"a":10,"b":20}')
        expect(lits.run('(json-stringify {:a 10 :b 20} 2)')).toBe('{\n  "a": 10,\n  "b": 20\n}')
      })
    })
    describe('json-parse', () => {
      it('samples', () => {
        expect(lits.run('(json-parse "[1,2,3]")')).toEqual([1, 2, 3])
      })
    })
  }
})
