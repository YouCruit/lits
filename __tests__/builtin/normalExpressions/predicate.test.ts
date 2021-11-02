import { Lits } from '../../../src'

let lits: Lits

beforeEach(() => {
  lits = new Lits({ debug: true })
})

describe(`predicates`, () => {
  describe(`function?`, () => {
    test(`samples`, () => {
      expect(lits.run(`(function? '')`)).toBe(false)
      expect(lits.run(`(function? :x)`)).toBe(false)
      expect(lits.run(`(function? 1)`)).toBe(false)
      expect(lits.run(`(function? 0)`)).toBe(false)
      expect(lits.run(`(function? [])`)).toBe(false)
      expect(lits.run(`(function? (object))`)).toBe(false)
      expect(lits.run(`(function? nil)`)).toBe(false)
      expect(lits.run(`(function? true)`)).toBe(false)
      expect(lits.run(`(function? false)`)).toBe(false)
      expect(lits.run(`(function? +)`)).toBe(true)
      expect(lits.run(`(function? +)`)).toBe(true)
      expect(() => lits.run(`(function?)`)).toThrow()
      expect(() => lits.run(`(function? :k :k)`)).toThrow()
    })
  })

  describe(`string?`, () => {
    test(`samples`, () => {
      expect(lits.run(`(string? '')`)).toBe(true)
      expect(lits.run(`(string? :x)`)).toBe(true)
      expect(lits.run(`(string? 1)`)).toBe(false)
      expect(lits.run(`(string? 0)`)).toBe(false)
      expect(lits.run(`(string? [])`)).toBe(false)
      expect(lits.run(`(string? (object))`)).toBe(false)
      expect(lits.run(`(string? nil)`)).toBe(false)
      expect(lits.run(`(string? true)`)).toBe(false)
      expect(lits.run(`(string? false)`)).toBe(false)
      expect(lits.run(`(string? +)`)).toBe(false)
      expect(lits.run(`(string? +)`)).toBe(false)
      expect(() => lits.run(`(string?)`)).toThrow()
      expect(() => lits.run(`(string? :k :k)`)).toThrow()
    })
  })

  describe(`number?`, () => {
    test(`samples`, () => {
      expect(lits.run(`(number? 1)`)).toBe(true)
      expect(lits.run(`(number? 0)`)).toBe(true)
      expect(lits.run(`(number? -1)`)).toBe(true)
      expect(lits.run(`(number? -1.123)`)).toBe(true)
      expect(lits.run(`(number? 0.123)`)).toBe(true)
      expect(lits.run(`(number? '')`)).toBe(false)
      expect(lits.run(`(number? :x)`)).toBe(false)
      expect(lits.run(`(number? [])`)).toBe(false)
      expect(lits.run(`(number? (object))`)).toBe(false)
      expect(lits.run(`(number? nil)`)).toBe(false)
      expect(lits.run(`(number? false)`)).toBe(false)
      expect(lits.run(`(number? true)`)).toBe(false)
      expect(lits.run(`(number? +)`)).toBe(false)
      expect(lits.run(`(number? +)`)).toBe(false)
      expect(() => lits.run(`(number?)`)).toThrow()
      expect(() => lits.run(`(number? 1 2)`)).toThrow()
    })
  })

  describe(`integer?`, () => {
    test(`samples`, () => {
      expect(lits.run(`(integer? 1)`)).toBe(true)
      expect(lits.run(`(integer? 0)`)).toBe(true)
      expect(lits.run(`(integer? -1)`)).toBe(true)
      expect(lits.run(`(integer? -1.123)`)).toBe(false)
      expect(lits.run(`(integer? 0.123)`)).toBe(false)
      expect(lits.run(`(integer? '')`)).toBe(false)
      expect(lits.run(`(integer? :x)`)).toBe(false)
      expect(lits.run(`(integer? [])`)).toBe(false)
      expect(lits.run(`(integer? (object))`)).toBe(false)
      expect(lits.run(`(integer? nil)`)).toBe(false)
      expect(lits.run(`(integer? false)`)).toBe(false)
      expect(lits.run(`(integer? true)`)).toBe(false)
      expect(lits.run(`(integer? +)`)).toBe(false)
      expect(lits.run(`(integer? +)`)).toBe(false)
      expect(() => lits.run(`(integer?)`)).toThrow()
      expect(() => lits.run(`(integer? 1 2)`)).toThrow()
    })
  })

  describe(`boolean?`, () => {
    test(`samples`, () => {
      expect(lits.run(`(boolean? 1)`)).toBe(false)
      expect(lits.run(`(boolean? 0)`)).toBe(false)
      expect(lits.run(`(boolean? -1)`)).toBe(false)
      expect(lits.run(`(boolean? -1.123)`)).toBe(false)
      expect(lits.run(`(boolean? 0.123)`)).toBe(false)
      expect(lits.run(`(boolean? '')`)).toBe(false)
      expect(lits.run(`(boolean? :x)`)).toBe(false)
      expect(lits.run(`(boolean? [])`)).toBe(false)
      expect(lits.run(`(boolean? (object))`)).toBe(false)
      expect(lits.run(`(boolean? nil)`)).toBe(false)
      expect(lits.run(`(boolean? false)`)).toBe(true)
      expect(lits.run(`(boolean? true)`)).toBe(true)
      expect(lits.run(`(boolean? +)`)).toBe(false)
      expect(lits.run(`(boolean? +)`)).toBe(false)
      expect(() => lits.run(`(boolean?)`)).toThrow()
      expect(() => lits.run(`(boolean? true false)`)).toThrow()
    })
  })

  describe(`nil?`, () => {
    test(`samples`, () => {
      expect(lits.run(`(nil? 1)`)).toBe(false)
      expect(lits.run(`(nil? 0)`)).toBe(false)
      expect(lits.run(`(nil? -1)`)).toBe(false)
      expect(lits.run(`(nil? -1.123)`)).toBe(false)
      expect(lits.run(`(nil? 0.123)`)).toBe(false)
      expect(lits.run(`(nil? '')`)).toBe(false)
      expect(lits.run(`(nil? :x)`)).toBe(false)
      expect(lits.run(`(nil? [])`)).toBe(false)
      expect(lits.run(`(nil? (object))`)).toBe(false)
      expect(lits.run(`(nil? nil)`)).toBe(true)
      expect(lits.run(`(nil? false)`)).toBe(false)
      expect(lits.run(`(nil? true)`)).toBe(false)
      expect(lits.run(`(nil? +)`)).toBe(false)
      expect(lits.run(`(nil? +)`)).toBe(false)
      expect(() => lits.run(`(nil?)`)).toThrow()
      expect(() => lits.run(`(nil? true false)`)).toThrow()
    })
  })

  describe(`zero?`, () => {
    test(`samples`, () => {
      expect(lits.run(`(zero? 1)`)).toBe(false)
      expect(lits.run(`(zero? 0)`)).toBe(true)
      expect(lits.run(`(zero? -0)`)).toBe(true)
      expect(lits.run(`(zero? (/ 0 -1))`)).toBe(true)
      expect(lits.run(`(zero? -1)`)).toBe(false)
      expect(() => lits.run(`(zero?)`)).toThrow()
      expect(() => lits.run(`(zero? '')`)).toThrow()
      expect(() => lits.run(`(zero? true)`)).toThrow()
      expect(() => lits.run(`(zero? false)`)).toThrow()
      expect(() => lits.run(`(zero? nil)`)).toThrow()
      expect(() => lits.run(`(zero? (object))`)).toThrow()
      expect(() => lits.run(`(zero? [])`)).toThrow()
    })
  })

  describe(`pos?`, () => {
    test(`samples`, () => {
      expect(lits.run(`(pos? 1)`)).toBe(true)
      expect(lits.run(`(pos? 0)`)).toBe(false)
      expect(lits.run(`(pos? -0)`)).toBe(false)
      expect(lits.run(`(pos? (/ 0 -1))`)).toBe(false)
      expect(lits.run(`(pos? -1)`)).toBe(false)
      expect(() => lits.run(`(pos?)`)).toThrow()
      expect(() => lits.run(`(pos? '')`)).toThrow()
      expect(() => lits.run(`(pos? true)`)).toThrow()
      expect(() => lits.run(`(pos? false)`)).toThrow()
      expect(() => lits.run(`(pos? nil)`)).toThrow()
      expect(() => lits.run(`(pos? (object))`)).toThrow()
      expect(() => lits.run(`(pos? [])`)).toThrow()
    })
  })

  describe(`neg?`, () => {
    test(`samples`, () => {
      expect(lits.run(`(neg? 1)`)).toBe(false)
      expect(lits.run(`(neg? 0)`)).toBe(false)
      expect(lits.run(`(neg? -0)`)).toBe(false)
      expect(lits.run(`(neg? (/ 0 -1))`)).toBe(false)
      expect(lits.run(`(neg? -1)`)).toBe(true)
      expect(() => lits.run(`(neg?)`)).toThrow()
      expect(() => lits.run(`(neg? '')`)).toThrow()
      expect(() => lits.run(`(neg? true)`)).toThrow()
      expect(() => lits.run(`(neg? false)`)).toThrow()
      expect(() => lits.run(`(neg? nil)`)).toThrow()
      expect(() => lits.run(`(neg? (object))`)).toThrow()
      expect(() => lits.run(`(neg? [])`)).toThrow()
    })
  })

  describe(`even?`, () => {
    test(`samples`, () => {
      expect(lits.run(`(even? 1)`)).toBe(false)
      expect(lits.run(`(even? 0)`)).toBe(true)
      expect(lits.run(`(even? -0)`)).toBe(true)
      expect(lits.run(`(even? (/ 0 -1))`)).toBe(true)
      expect(lits.run(`(even? -1)`)).toBe(false)
      expect(lits.run(`(even? -10)`)).toBe(true)
      expect(lits.run(`(even? -2.001)`)).toBe(false)
      expect(lits.run(`(even? 4)`)).toBe(true)
      expect(() => lits.run(`(even?)`)).toThrow()
      expect(() => lits.run(`(even? '')`)).toThrow()
      expect(() => lits.run(`(even? true)`)).toThrow()
      expect(() => lits.run(`(even? false)`)).toThrow()
      expect(() => lits.run(`(even? nil)`)).toThrow()
      expect(() => lits.run(`(even? (object))`)).toThrow()
      expect(() => lits.run(`(even? [])`)).toThrow()
    })
  })

  describe(`odd?`, () => {
    test(`samples`, () => {
      expect(lits.run(`(odd? 1)`)).toBe(true)
      expect(lits.run(`(odd? 0)`)).toBe(false)
      expect(lits.run(`(odd? -0)`)).toBe(false)
      expect(lits.run(`(odd? (/ 0 -1))`)).toBe(false)
      expect(lits.run(`(odd? -1)`)).toBe(true)
      expect(lits.run(`(odd? -10)`)).toBe(false)
      expect(lits.run(`(odd? -2.001)`)).toBe(false)
      expect(lits.run(`(odd? 4)`)).toBe(false)
      expect(lits.run(`(odd? 5)`)).toBe(true)
      expect(() => lits.run(`(odd?)`)).toThrow()
      expect(() => lits.run(`(odd? '')`)).toThrow()
      expect(() => lits.run(`(odd? true)`)).toThrow()
      expect(() => lits.run(`(odd? false)`)).toThrow()
      expect(() => lits.run(`(odd? nil)`)).toThrow()
      expect(() => lits.run(`(odd? (object))`)).toThrow()
      expect(() => lits.run(`(odd? [])`)).toThrow()
    })
  })

  describe(`array?`, () => {
    test(`samples`, () => {
      expect(lits.run(`(array? 1)`)).toBe(false)
      expect(lits.run(`(array? 0)`)).toBe(false)
      expect(lits.run(`(array? -1)`)).toBe(false)
      expect(lits.run(`(array? -1.123)`)).toBe(false)
      expect(lits.run(`(array? 0.123)`)).toBe(false)
      expect(lits.run(`(array? '')`)).toBe(false)
      expect(lits.run(`(array? :x)`)).toBe(false)
      expect(lits.run(`(array? [])`)).toBe(true)
      expect(lits.run(`(array? [1 2 3])`)).toBe(true)
      expect(lits.run(`(array? (object))`)).toBe(false)
      expect(lits.run(`(array? nil)`)).toBe(false)
      expect(lits.run(`(array? false)`)).toBe(false)
      expect(lits.run(`(array? true)`)).toBe(false)
      expect(lits.run(`(array? +)`)).toBe(false)
      expect(lits.run(`(array? +)`)).toBe(false)
      expect(() => lits.run(`(array?)`)).toThrow()
      expect(() => lits.run(`(array? true false)`)).toThrow()
    })
  })

  describe(`coll?`, () => {
    test(`samples`, () => {
      expect(lits.run(`(coll? 1)`)).toBe(false)
      expect(lits.run(`(coll? 0)`)).toBe(false)
      expect(lits.run(`(coll? -1)`)).toBe(false)
      expect(lits.run(`(coll? -1.123)`)).toBe(false)
      expect(lits.run(`(coll? 0.123)`)).toBe(false)
      expect(lits.run(`(coll? '')`)).toBe(true)
      expect(lits.run(`(coll? :x)`)).toBe(true)
      expect(lits.run(`(coll? [])`)).toBe(true)
      expect(lits.run(`(coll? [1 2 3])`)).toBe(true)
      expect(lits.run(`(coll? (object))`)).toBe(true)
      expect(lits.run(`(coll? {:a 1})`)).toBe(true)
      expect(lits.run(`(coll? nil)`)).toBe(false)
      expect(lits.run(`(coll? false)`)).toBe(false)
      expect(lits.run(`(coll? true)`)).toBe(false)
      expect(lits.run(`(coll? +)`)).toBe(false)
      expect(lits.run(`(coll? +)`)).toBe(false)
      expect(() => lits.run(`(coll?)`)).toThrow()
      expect(() => lits.run(`(coll? true false)`)).toThrow()
    })
  })

  describe(`seq?`, () => {
    test(`samples`, () => {
      expect(lits.run(`(seq? 1)`)).toBe(false)
      expect(lits.run(`(seq? 0)`)).toBe(false)
      expect(lits.run(`(seq? -1)`)).toBe(false)
      expect(lits.run(`(seq? -1.123)`)).toBe(false)
      expect(lits.run(`(seq? 0.123)`)).toBe(false)
      expect(lits.run(`(seq? '')`)).toBe(true)
      expect(lits.run(`(seq? :x)`)).toBe(true)
      expect(lits.run(`(seq? [])`)).toBe(true)
      expect(lits.run(`(seq? [1 2 3])`)).toBe(true)
      expect(lits.run(`(seq? (object))`)).toBe(false)
      expect(lits.run(`(seq? {:a 1})`)).toBe(false)
      expect(lits.run(`(seq? nil)`)).toBe(false)
      expect(lits.run(`(seq? false)`)).toBe(false)
      expect(lits.run(`(seq? true)`)).toBe(false)
      expect(lits.run(`(seq? +)`)).toBe(false)
      expect(lits.run(`(seq? +)`)).toBe(false)
      expect(() => lits.run(`(seq?)`)).toThrow()
      expect(() => lits.run(`(seq? true false)`)).toThrow()
    })
  })

  describe(`object?`, () => {
    test(`samples`, () => {
      expect(lits.run(`(object? 1)`)).toBe(false)
      expect(lits.run(`(object? 0)`)).toBe(false)
      expect(lits.run(`(object? -1)`)).toBe(false)
      expect(lits.run(`(object? -1.123)`)).toBe(false)
      expect(lits.run(`(object? 0.123)`)).toBe(false)
      expect(lits.run(`(object? '')`)).toBe(false)
      expect(lits.run(`(object? :x)`)).toBe(false)
      expect(lits.run(`(object? [])`)).toBe(false)
      expect(lits.run(`(object? (object :x 10))`)).toBe(true)
      expect(lits.run(`(object? nil)`)).toBe(false)
      expect(lits.run(`(object? (regexp 'abc'))`)).toBe(false)
      expect(lits.run(`(object? false)`)).toBe(false)
      expect(lits.run(`(object? true)`)).toBe(false)
      expect(lits.run(`(object? +)`)).toBe(false)
      expect(lits.run(`(object? +)`)).toBe(false)
      expect(() => lits.run(`(object?)`)).toThrow()
      expect(() => lits.run(`(object? true false)`)).toThrow()
    })
  })

  describe(`regexp?`, () => {
    test(`samples`, () => {
      expect(lits.run(`(regexp? 1)`)).toBe(false)
      expect(lits.run(`(regexp? 0)`)).toBe(false)
      expect(lits.run(`(regexp? -1)`)).toBe(false)
      expect(lits.run(`(regexp? -1.123)`)).toBe(false)
      expect(lits.run(`(regexp? 0.123)`)).toBe(false)
      expect(lits.run(`(regexp? '')`)).toBe(false)
      expect(lits.run(`(regexp? :x)`)).toBe(false)
      expect(lits.run(`(regexp? [])`)).toBe(false)
      expect(lits.run(`(regexp? (object :x 10))`)).toBe(false)
      expect(lits.run(`(regexp? nil)`)).toBe(false)
      expect(lits.run(`(regexp? (regexp 'abc'))`)).toBe(true)
      expect(lits.run(`(regexp? false)`)).toBe(false)
      expect(lits.run(`(regexp? true)`)).toBe(false)
      expect(lits.run(`(regexp? +)`)).toBe(false)
      expect(lits.run(`(regexp? +)`)).toBe(false)
      expect(() => lits.run(`(regexp?)`)).toThrow()
      expect(() => lits.run(`(regexp? true false)`)).toThrow()
    })
  })

  describe(`finite?`, () => {
    test(`samples`, () => {
      expect(lits.run(`(finite? 1)`)).toBe(true)
      expect(lits.run(`(finite? 0)`)).toBe(true)
      expect(lits.run(`(finite? (/ 1 0))`)).toBe(false)
      expect(lits.run(`(finite? (/ -1 0))`)).toBe(false)
      expect(lits.run(`(finite? (sqrt -1))`)).toBe(false)
    })
  })

  describe(`nan?`, () => {
    test(`samples`, () => {
      expect(lits.run(`(nan? 1)`)).toBe(false)
      expect(lits.run(`(nan? 0)`)).toBe(false)
      expect(lits.run(`(nan? (/ 1 0))`)).toBe(false)
      expect(lits.run(`(nan? (/ -1 0))`)).toBe(false)
      expect(lits.run(`(nan? (sqrt -1))`)).toBe(true)
    })
  })

  describe(`positive-infinity?`, () => {
    test(`samples`, () => {
      expect(lits.run(`(positive-infinity? 1)`)).toBe(false)
      expect(lits.run(`(positive-infinity? 0)`)).toBe(false)
      expect(lits.run(`(positive-infinity? (/ 1 0))`)).toBe(true)
      expect(lits.run(`(positive-infinity? (/ -1 0))`)).toBe(false)
      expect(lits.run(`(positive-infinity? (sqrt -1))`)).toBe(false)
    })
  })

  describe(`negative-infinity?`, () => {
    test(`samples`, () => {
      expect(lits.run(`(negative-infinity? 1)`)).toBe(false)
      expect(lits.run(`(negative-infinity? 0)`)).toBe(false)
      expect(lits.run(`(negative-infinity? (/ 1 0))`)).toBe(false)
      expect(lits.run(`(negative-infinity? (/ -1 0))`)).toBe(true)
      expect(lits.run(`(negative-infinity? (sqrt -1))`)).toBe(false)
    })
  })

  describe(`true?`, () => {
    test(`samples`, () => {
      expect(lits.run(`(true? false)`)).toBe(false)
      expect(lits.run(`(true? true)`)).toBe(true)
      expect(lits.run(`(true? 1)`)).toBe(false)
      expect(lits.run(`(true? 0)`)).toBe(false)
      expect(lits.run(`(true? 'Mojir')`)).toBe(false)
    })
  })

  describe(`false?`, () => {
    test(`samples`, () => {
      expect(lits.run(`(false? false)`)).toBe(true)
      expect(lits.run(`(false? true)`)).toBe(false)
      expect(lits.run(`(false? 1)`)).toBe(false)
      expect(lits.run(`(false? 0)`)).toBe(false)
      expect(lits.run(`(false? 'Mojir')`)).toBe(false)
    })
  })
})
