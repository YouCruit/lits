import { Lits } from '../../../src'
import { DataType } from '../../../src/analyze/dataTypes/DataType'

// const lits = new Lits()
describe(`collection functions`, () => {
  for (const lits of [new Lits(), new Lits({ debug: true })]) {
    describe(`count`, () => {
      test(`samples`, () => {
        expect(lits.run(`(count [])`)).toBe(0)
        expect(lits.run(`(count [1])`)).toBe(1)
        expect(lits.run(`(count [1 2 3])`)).toBe(3)
        expect(lits.run(`(count (object))`)).toBe(0)
        expect(lits.run(`(count (object :a 1 :b 2))`)).toBe(2)
        expect(lits.run(`(count "")`)).toBe(0)
        expect(lits.run(`(count "Albert")`)).toBe(6)
        expect(() => lits.run(`(count)`)).toThrow()
        expect(() => lits.run(`(count [] [])`)).toThrow()
        expect(() => lits.run(`(count 12)`)).toThrow()
        expect(() => lits.run(`(count false)`)).toThrow()
        expect(() => lits.run(`(count true)`)).toThrow()
        expect(() => lits.run(`(count nil)`)).toThrow()
        expect(() => lits.run(`(count undefined)`)).toThrow()
      })

      test(`dataType`, () => {
        expect(lits.getDataType(`(count [])`)).toEqual(DataType.zero)
        expect(lits.getDataType(`(count {})`)).toEqual(DataType.zero)
        expect(lits.getDataType(`(count "Albert")`)).toEqual(DataType.integer.and(DataType.positiveNumber))
      })
    })

    describe(`get`, () => {
      test(`samples`, () => {
        expect(lits.run(`(get [] 1)`)).toBeNull()
        expect(lits.run(`(get [1] 1)`)).toBeNull()
        expect(lits.run(`(get [1 2 3] 1)`)).toBe(2)
        expect(lits.run(`(get [] 1 :x)`)).toBe(`x`)
        expect(lits.run(`(get [1] 1 :x)`)).toBe(`x`)
        expect(lits.run(`(get [1 2 3] 1 :x)`)).toBe(2)
        expect(lits.run(`(get [1 2 3] -1)`)).toBeNull()
        expect(lits.run(`(get [1 2 3] -1 :x)`)).toBe(`x`)

        expect(lits.run(`(get "Albert" 1)`)).toBe(`l`)
        expect(lits.run(`(get "Albert" 7)`)).toBeNull()
        expect(lits.run(`(get "Albert" -1)`)).toBeNull()
        expect(lits.run(`(get "Albert" -1 :x)`)).toBe(`x`)
        expect(lits.run(`(get "" 0)`)).toBeNull()

        expect(lits.run(`(get (object) :a)`)).toBeNull()
        expect(lits.run(`(get (object :a 1 :b 2) :a)`)).toBe(1)
        expect(lits.run(`(get (object) :a :x)`)).toBe(`x`)
        expect(lits.run(`(get (object :a 1 :b 2) :a)`)).toBe(1)

        expect(lits.run(`(get nil 1)`)).toBeNull()
        expect(lits.run(`(get nil 1 99)`)).toBe(99)

        expect(() => lits.run(`(get)`)).toThrow()
        expect(() => lits.run(`(get [])`)).toThrow()
        expect(() => lits.run(`(get 12)`)).toThrow()
        expect(() => lits.run(`(get 12 1)`)).toThrow()
        expect(() => lits.run(`(get false)`)).toThrow()
        expect(() => lits.run(`(get false 2)`)).toThrow()
        expect(() => lits.run(`(get true)`)).toThrow()
        expect(() => lits.run(`(get nil)`)).toThrow()
        expect(() => lits.run(`(get undefined)`)).toThrow()
      })
      test(`dataType`, () => {
        expect(lits.getDataType(`(get "Albert" 1)`)).toEqual(DataType.string.nilable())
        expect(lits.getDataType(`(get [1 2 3] 1)`)).toEqual(DataType.unknown)
        expect(lits.getDataType(`(get {:a 1 :b 2} 1)`)).toEqual(DataType.unknown)
      })
    })

    describe(`get-in`, () => {
      test(`samples`, () => {
        expect(lits.run(`(get-in [] [1])`)).toBeNull()
        expect(lits.run(`(get-in [1] [1])`)).toBeNull()
        expect(lits.run(`(get-in [1 2 3] [1])`)).toBe(2)
        expect(lits.run(`(get-in [[1 2 3] [4 {:a 2} 6]] [1 1 :a])`)).toBe(2)
        expect(lits.run(`(get-in {:a ["Albert" "Mojir"]} [:a 0])`)).toBe(`Albert`)
        expect(lits.run(`(get-in {:a ["Albert" "Mojir"]} [:a 0 5])`)).toBe(`t`)
        expect(lits.run(`(get-in {:a ["Albert" "Mojir"]} [:a 0 5 0 0 0 0 0 0])`)).toBe(`t`)
        expect(lits.run(`(get-in {:a ["Albert" "Mojir"]} [:a 2] "DEFAULT")`)).toBe(`DEFAULT`)
        expect(lits.run(`(get-in {:a ["Albert" "Mojir"]} [:a 2 :x] "DEFAULT")`)).toBe(`DEFAULT`)

        expect(lits.run(`(get-in nil [] "DEFAULT")`)).toBe(null)
        expect(lits.run(`(get-in nil [1] "DEFAULT")`)).toBe(`DEFAULT`)
        expect(lits.run(`(get-in [] [] "DEFAULT")`)).toEqual([])
        expect(lits.run(`(get-in [1 2] [1] "DEFAULT")`)).toBe(2)
        expect(lits.run(`(get-in [1 2] [1 2] "DEFAULT")`)).toBe(`DEFAULT`)
        expect(lits.run(`(get-in [] [1] "DEFAULT")`)).toBe(`DEFAULT`)
        expect(lits.run(`(get-in 2 [1] "DEFAULT")`)).toBe(`DEFAULT`)
        expect(lits.run(`(get-in 2 [] "DEFAULT")`)).toBe(2)

        expect(lits.run(`(get-in nil [])`)).toBe(null)
        expect(lits.run(`(get-in nil [1])`)).toBe(null)
        expect(lits.run(`(get-in [] [])`)).toEqual([])
        expect(lits.run(`(get-in [1 2] [1])`)).toBe(2)
        expect(lits.run(`(get-in [1 2] nil)`)).toEqual([1, 2])
        expect(lits.run(`(get-in [] nil)`)).toEqual([])
        expect(lits.run(`(get-in [1 2] [1 2])`)).toBe(null)
        expect(lits.run(`(get-in [] [1])`)).toBe(null)
        expect(lits.run(`(get-in 2 [1])`)).toBe(null)
        expect(lits.run(`(get-in 2 [])`)).toBe(2)

        expect(lits.run(`(get-in "" [])`)).toBe(``)
        expect(lits.run(`(get-in "Albert" [])`)).toBe(`Albert`)
        expect(lits.run(`(get-in "Albert" [0])`)).toBe(`A`)
        expect(lits.run(`(get-in "Albert" [:0])`)).toBe(null)
        expect(lits.run(`(get-in "Albert" nil)`)).toBe(`Albert`)

        expect(lits.run(`(get-in "Albert" nil "DEFAULT")`)).toBe(`Albert`)

        expect(() => lits.run(`(get-in)`)).toThrow()
        expect(() => lits.run(`(get-in [])`)).toThrow()
        expect(() => lits.run(`(get-in 12)`)).toThrow()
        expect(() => lits.run(`(get-in false)`)).toThrow()
        expect(() => lits.run(`(get-in true)`)).toThrow()
        expect(() => lits.run(`(get-in nil)`)).toThrow()
        expect(() => lits.run(`(get-in undefined)`)).toThrow()
      })
      test(`dataType`, () => {
        expect(lits.getDataType(`(get-in "Albert" nil)`)).toEqual(DataType.nonEmptyString)
        expect(lits.getDataType(`(get-in [] nil)`)).toEqual(DataType.emptyArray)
        expect(lits.getDataType(`(get-in [1 2] nil)`)).toEqual(DataType.nonEmptyArray)
        expect(lits.getDataType(`(get-in {} nil)`)).toEqual(DataType.emptyObject)
        expect(lits.getDataType(`(get-in { :a 12 } nil)`)).toEqual(DataType.nonEmptyObject)
        expect(lits.getDataType(`(get-in #"^test" nil)`)).toEqual(DataType.regexp)
        expect(lits.getDataType(`(get-in 123 nil)`)).toEqual(DataType.integer.and(DataType.positiveNumber))
        expect(lits.getDataType(`(get-in false nil)`)).toEqual(DataType.false)

        expect(lits.getDataType(`(get-in "Albert" [])`)).toEqual(DataType.unknown)
        expect(lits.getDataType(`(get-in [] [])`)).toEqual(DataType.unknown)
        expect(lits.getDataType(`(get-in [1 2] [])`)).toEqual(DataType.unknown)
        expect(lits.getDataType(`(get-in {} [])`)).toEqual(DataType.unknown)
        expect(lits.getDataType(`(get-in #"^test" [])`)).toEqual(DataType.unknown)
        expect(lits.getDataType(`(get-in 123 [])`)).toEqual(DataType.unknown)
        expect(lits.getDataType(`(get-in false [])`)).toEqual(DataType.unknown)

        expect(lits.getDataType(`(get-in "Albert" [1] nil)`)).toEqual(DataType.unknown)
        expect(lits.getDataType(`(get-in [] [1] :abc)`)).toEqual(DataType.unknown)
        expect(lits.getDataType(`(get-in [1 2] [1] 1)`)).toEqual(DataType.unknown)
        expect(lits.getDataType(`(get-in {} [1] [])`)).toEqual(DataType.unknown)
        expect(lits.getDataType(`(get-in #"^test" [1] {})`)).toEqual(DataType.unknown)
        expect(lits.getDataType(`(get-in 123 [1] true)`)).toEqual(DataType.unknown)
        expect(lits.getDataType(`(get-in false [1] #"hey")`)).toEqual(DataType.unknown)
      })
    })

    describe(`contains?`, () => {
      test(`samples`, () => {
        expect(lits.run(`(contains? [] 1)`)).toBe(false)
        expect(lits.run(`(contains? [1] 1)`)).toBe(false)
        expect(lits.run(`(contains? [1 2 3] 1)`)).toBe(true)
        expect(lits.run(`(contains? (object) :a)`)).toBe(false)
        expect(lits.run(`(contains? (object :a 1 :b 2) :a)`)).toBe(true)
        expect(lits.run(`(contains? [] :1)`)).toBe(false)
        expect(lits.run(`(contains? [1] :1)`)).toBe(false)
        expect(lits.run(`(contains? [1 2 3] :1)`)).toBe(false)
        expect(lits.run(`(contains? (object) 1)`)).toBe(false)
        expect(lits.run(`(contains? (object :a 1 :b 2) 2)`)).toBe(false)
        expect(lits.run(`(contains? "Albert" 0)`)).toBe(true)
        expect(lits.run(`(contains? "Albert" 5)`)).toBe(true)
        expect(lits.run(`(contains? "Albert" 6)`)).toBe(false)
        expect(lits.run(`(contains? "Albert" -1)`)).toBe(false)

        expect(() => lits.run(`(contains? "")`)).toThrow()
        expect(() => lits.run(`(contains? [])`)).toThrow()
        expect(() => lits.run(`(contains? "123")`)).toThrow()
        expect(() => lits.run(`(contains?)`)).toThrow()
        expect(() => lits.run(`(contains? [] [])`)).toThrow()
        expect(() => lits.run(`(contains? 12)`)).toThrow()
        expect(() => lits.run(`(contains? false)`)).toThrow()
        expect(() => lits.run(`(contains? true)`)).toThrow()
        expect(() => lits.run(`(contains? nil)`)).toThrow()
        expect(() => lits.run(`(contains? undefined)`)).toThrow()
      })

      test(`dataType`, () => {
        expect(lits.getDataType(`(contains? [] 1)`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(contains? [1] 1)`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(contains? [1 2 3] 1)`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(contains? (object) :a)`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(contains? (object :a 1 :b 2) :a)`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(contains? [] :1)`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(contains? [1] :1)`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(contains? [1 2 3] :1)`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(contains? (object) 1)`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(contains? (object :a 1 :b 2) 2)`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(contains? "Albert" 0)`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(contains? "Albert" 5)`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(contains? "Albert" 6)`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(contains? "Albert" -1)`)).toEqual(DataType.boolean)
      })
    })

    describe(`has?`, () => {
      test(`samples`, () => {
        expect(lits.run(`(has? [] 1)`)).toBe(false)
        expect(lits.run(`(has? [1] 1)`)).toBe(true)
        expect(lits.run(`(has? [1 2 3] 0)`)).toBe(false)
        expect(lits.run(`(has? (object) :a)`)).toBe(false)
        expect(lits.run(`(has? (object :a 1 :b 2) 1)`)).toBe(true)
        expect(lits.run(`(has? (object :a 1 :b 2) :a)`)).toBe(false)
        expect(lits.run(`(has? [] :1)`)).toBe(false)
        expect(lits.run(`(has? [1] :1)`)).toBe(false)
        expect(lits.run(`(has? [1 2 3] :1)`)).toBe(false)
        expect(lits.run(`(has? (object) 1)`)).toBe(false)
        expect(lits.run(`(has? "Albert" :A)`)).toBe(true)
        expect(lits.run(`(has? "Albert" :a)`)).toBe(false)
        expect(lits.run(`(has? "Albert" 1)`)).toBe(false)

        expect(() => lits.run(`(has? "")`)).toThrow()
        expect(() => lits.run(`(has? [])`)).toThrow()
        expect(() => lits.run(`(has? "123")`)).toThrow()
        expect(() => lits.run(`(has?)`)).toThrow()
        expect(() => lits.run(`(has? 12 [])`)).toThrow()
        expect(() => lits.run(`(has? 12)`)).toThrow()
        expect(() => lits.run(`(has? false)`)).toThrow()
        expect(() => lits.run(`(has? true)`)).toThrow()
        expect(() => lits.run(`(has? nil)`)).toThrow()
      })

      test(`dataTypes`, () => {
        expect(lits.getDataType(`(has? [] 1)`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(has? [1] 1)`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(has? [1 2 3] 0)`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(has? (object) :a)`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(has? (object :a 1 :b 2) 1)`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(has? (object :a 1 :b 2) :a)`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(has? [] :1)`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(has? [1] :1)`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(has? [1 2 3] :1)`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(has? (object) 1)`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(has? "Albert" :A)`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(has? "Albert" :a)`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(has? "Albert" 1)`)).toEqual(DataType.boolean)
      })
    })

    describe(`has-some?`, () => {
      test(`samples`, () => {
        expect(lits.run(`(has-some? [] [1])`)).toBe(false)
        expect(lits.run(`(has-some? [1] [])`)).toBe(false)
        expect(lits.run(`(has-some? [1] [1])`)).toBe(true)
        expect(lits.run(`(has-some? [1 2 3] [0])`)).toBe(false)
        expect(lits.run(`(has-some? [1 2 3] [0 1])`)).toBe(true)
        expect(lits.run(`(has-some? (object) [:a])`)).toBe(false)
        expect(lits.run(`(has-some? (object :a 1 :b 2) [0])`)).toBe(false)
        expect(lits.run(`(has-some? (object :a 1 :b 2) [0 1])`)).toBe(true)
        expect(lits.run(`(has-some? "Albert" "xyz")`)).toBe(false)
        expect(lits.run(`(has-some? "Albert" ["Alb" "ert"])`)).toBe(false)
        expect(lits.run(`(has-some? "Albert" ["A"])`)).toBe(true)
        expect(lits.run(`(has-some? "Albert" "xyzl")`)).toBe(true)
        expect(lits.run(`(has-some? [:a :b :c :d] "xyz")`)).toBe(false)
        expect(lits.run(`(has-some? [:a :b :c :d] "xyzc")`)).toBe(true)

        expect(() => lits.run(`(has-some? [] [1] 1)`)).toThrow()
        expect(() => lits.run(`(has-some? [] 4)`)).toThrow()
        expect(() => lits.run(`(has-some? [] true)`)).toThrow()
        expect(() => lits.run(`(has-some? [] false)`)).toThrow()
        expect(() => lits.run(`(has-some? [] nil)`)).toThrow()
        expect(() => lits.run(`(has-some? [] odd?)`)).toThrow()
        expect(() => lits.run(`(has-some? [] {})`)).toThrow()
        expect(() => lits.run(`(has-some? true [1])`)).toThrow()
        expect(() => lits.run(`(has-some? false [1])`)).toThrow()
        expect(() => lits.run(`(has-some? nil [1])`)).toThrow()
        expect(() => lits.run(`(has-some? odd? [1])`)).toThrow()
        expect(() => lits.run(`(has-some? 3 [1])`)).toThrow()
      })

      test(`dataType`, () => {
        expect(lits.getDataType(`(has-some? [] [1])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(has-some? [1] [])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(has-some? [1] [1])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(has-some? [1 2 3] [0])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(has-some? [1 2 3] [0 1])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(has-some? (object) [:a])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(has-some? (object :a 1 :b 2) [0])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(has-some? (object :a 1 :b 2) [0 1])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(has-some? "Albert" "xyz")`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(has-some? "Albert" ["Alb" "ert"])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(has-some? "Albert" ["A"])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(has-some? "Albert" "xyzl")`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(has-some? [:a :b :c :d] "xyz")`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(has-some? [:a :b :c :d] "xyzc")`)).toEqual(DataType.boolean)
      })
    })

    describe(`has-every?`, () => {
      test(`samples`, () => {
        expect(lits.run(`(has-every? [] [1])`)).toBe(false)
        expect(lits.run(`(has-every? [1] [])`)).toBe(true)
        expect(lits.run(`(has-every? [1] [1])`)).toBe(true)
        expect(lits.run(`(has-every? [1 2 3] [0 1])`)).toBe(false)
        expect(lits.run(`(has-every? [1 2 3] [1 2])`)).toBe(true)
        expect(lits.run(`(has-every? (object) [:a])`)).toBe(false)
        expect(lits.run(`(has-every? (object :a 1 :b 2) [0 1])`)).toBe(false)
        expect(lits.run(`(has-every? (object :a 1 :b 2) [1 2])`)).toBe(true)
        expect(lits.run(`(has-every? "Albert" "xyz")`)).toBe(false)
        expect(lits.run(`(has-every? "Albert" ["Alb" "ert"])`)).toBe(false)
        expect(lits.run(`(has-every? "Albert" ["A"])`)).toBe(true)
        expect(lits.run(`(has-every? "Albert" "treblA")`)).toBe(true)
        expect(lits.run(`(has-every? [:a :b :c :d] "xyz")`)).toBe(false)
        expect(lits.run(`(has-every? [:a :b :c :d] "dcba")`)).toBe(true)

        expect(() => lits.run(`(has-every? [] [1] 1)`)).toThrow()
        expect(() => lits.run(`(has-every? [] 4)`)).toThrow()
        expect(() => lits.run(`(has-every? [] true)`)).toThrow()
        expect(() => lits.run(`(has-every? [] false)`)).toThrow()
        expect(() => lits.run(`(has-every? [] nil)`)).toThrow()
        expect(() => lits.run(`(has-every? [] odd?)`)).toThrow()
        expect(() => lits.run(`(has-every? [] {})`)).toThrow()
        expect(() => lits.run(`(has-every? true [1])`)).toThrow()
        expect(() => lits.run(`(has-every? false [1])`)).toThrow()
        expect(() => lits.run(`(has-every? nil [1])`)).toThrow()
        expect(() => lits.run(`(has-every? odd? [1])`)).toThrow()
        expect(() => lits.run(`(has-every? 3 [1])`)).toThrow()
      })
      test(`dataType`, () => {
        expect(lits.getDataType(`(has-every? [] [1])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(has-every? [1] [])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(has-every? [1] [1])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(has-every? [1 2 3] [0 1])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(has-every? [1 2 3] [1 2])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(has-every? (object) [:a])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(has-every? (object :a 1 :b 2) [0 1])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(has-every? (object :a 1 :b 2) [1 2])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(has-every? "Albert" "xyz")`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(has-every? "Albert" ["Alb" "ert"])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(has-every? "Albert" ["A"])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(has-every? "Albert" "treblA")`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(has-every? [:a :b :c :d] "xyz")`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(has-every? [:a :b :c :d] "dcba")`)).toEqual(DataType.boolean)
      })
    })

    describe(`assoc`, () => {
      test(`samples`, () => {
        expect(lits.run(`(assoc [1 2 3] 0 :1)`)).toEqual([`1`, 2, 3])
        expect(lits.run(`(assoc [1 2 3] 1 :2)`)).toEqual([1, `2`, 3])
        expect(lits.run(`(def a [1 2 3]) (assoc a 1 :2)`)).toEqual([1, `2`, 3])
        expect(lits.run(`(def a [1 2 3]) (assoc a 1 :2) a`)).toEqual([1, 2, 3])
        expect(lits.run(`(assoc [1 2 3] 3 :4)`)).toEqual([1, 2, 3, `4`])

        expect(lits.run(`(assoc {} :a :1)`)).toEqual({ a: `1` })

        expect(lits.run(`(assoc {:a 1 :b 2} :a :1)`)).toEqual({ a: `1`, b: 2 })
        expect(lits.run(`(assoc {:a 1 :b 2} :b :2)`)).toEqual({ a: 1, b: `2` })
        expect(lits.run(`(def o {:a 1 :b 2}) (assoc o :a :1)`)).toEqual({ a: `1`, b: 2 })
        expect(lits.run(`(def o {:a 1 :b 2}) (assoc o :a :1) o`)).toEqual({ a: 1, b: 2 })

        expect(lits.run(`(assoc :1 0 :2)`)).toBe(`2`)
        expect(lits.run(`(assoc "Albert" 6 "!")`)).toBe(`Albert!`)

        expect(() => lits.run(`(assoc "Albert" 7 "!")`)).toThrow()
        expect(() => lits.run(`(assoc [1 2 3] 4 :4)`)).toThrow()
        expect(() => lits.run(`(assoc (object) 0 :2)`)).toThrow()
        expect(() => lits.run(`(assoc nil 0 :2)`)).toThrow()
        expect(() => lits.run(`(assoc undefined 0 :2)`)).toThrow()
        expect(() => lits.run(`(assoc true 0 :2)`)).toThrow()
        expect(() => lits.run(`(assoc false 0 :2)`)).toThrow()
        expect(() => lits.run(`(assoc 1 0 :2)`)).toThrow()
        expect(() => lits.run(`(assoc :1 0 "22")`)).toThrow()
        expect(() => lits.run(`(assoc [1] :0 :2)`)).toThrow()
        expect(() => lits.run(`(assoc [1] true :2)`)).toThrow()
        expect(() => lits.run(`(assoc [1] false :2)`)).toThrow()
        expect(() => lits.run(`(assoc [1] [] :2)`)).toThrow()
        expect(() => lits.run(`(assoc [1] nil :2)`)).toThrow()
        expect(() => lits.run(`(assoc [1] undefined :2)`)).toThrow()
        expect(() => lits.run(`(assoc 0 :2)`)).toThrow()
        expect(() => lits.run(`(assoc [1 2 3] -1 :x)`)).toThrow()
        expect(() => lits.run(`(assoc [1 2 3] 4 :x)`)).toThrow()
        expect(() => lits.run(`(assoc)`)).toThrow()
        expect(() => lits.run(`(assoc [])`)).toThrow()
        expect(() => lits.run(`(assoc [] 0)`)).toThrow()
        expect(() => lits.run(`(assoc [] 0 :x :y)`)).toThrow()
        expect(() => lits.run(`(assoc [] :a :1)`)).toThrow()
      })
    })

    describe(`assoc-in`, () => {
      test(`samples`, () => {
        expect(lits.run(`(assoc-in "Albert" [0] :a)`)).toEqual(`albert`)
        expect(lits.run(`(assoc-in "Albert" [6] "!")`)).toEqual(`Albert!`)
        expect(() => lits.run(`(assoc-in "Albert" [7] "!")`)).toThrow()
        expect(lits.run(`(assoc-in {} [:a :b :c] "Albert")`)).toEqual({ a: { b: { c: `Albert` } } })
        expect(lits.run(`(assoc-in [1 2 3] [0] :1)`)).toEqual([`1`, 2, 3])
        expect(lits.run(`(assoc-in [1 2 [1 2 3]] [2 1] :2)`)).toEqual([1, 2, [1, `2`, 3]])
        expect(lits.run(`(assoc-in [1 2 "albert"] [2 0] :A)`)).toEqual([1, 2, `Albert`])
        expect(lits.run(`(assoc-in [1 2 {"name" "albert"}] [2 "name"] :A)`)).toEqual([1, 2, { name: `A` }])
        expect(lits.run(`(assoc-in [1 2 {"name" "albert"}] [2 "name" 0] :A)`)).toEqual([1, 2, { name: `Albert` }])
        expect(() => lits.run(`(assoc-in [1 2 {"name" "albert"}] [:2 "name" 0] :A)`)).toThrow()
        expect(() => lits.run(`(assoc-in [1 2 {"name" "albert"}] [2 1 0] :A)`)).toThrow()
        expect(() => lits.run(`(assoc-in [1 2 {"name" "albert"}] [2 "name" :a] :A)`)).toThrow()
      })
    })

    describe(`concat`, () => {
      test(`samples`, () => {
        expect(lits.run(`(concat [])`)).toEqual([])
        expect(lits.run(`(concat [1])`)).toEqual([1])
        expect(lits.run(`(concat [1] [2] [3 4])`)).toEqual([1, 2, 3, 4])
        expect(lits.run(`(concat [1 2 3] [])`)).toEqual([1, 2, 3])

        expect(lits.run(`(concat {:a 1 :b 2} {:b 1 :c 2})`)).toEqual({ a: 1, b: 1, c: 2 })
        expect(lits.run(`(concat {} {:a 1 :b 2})`)).toEqual({ a: 1, b: 2 })

        expect(lits.run(`(concat :1 "23")`)).toBe(`123`)
        expect(lits.run(`(concat :1 "")`)).toBe(`1`)
        expect(lits.run(`(concat :1)`)).toBe(`1`)

        expect(() => lits.run(`(concat)`)).toThrow()
        expect(() => lits.run(`(concat [1] :2)`)).toThrow()
        expect(() => lits.run(`(concat :1 [:2])`)).toThrow()
        expect(() => lits.run(`(concat 0)`)).toThrow()
        expect(() => lits.run(`(concat true)`)).toThrow()
        expect(() => lits.run(`(concat :1 false)`)).toThrow()
        expect(() => lits.run(`(concat nil :m)`)).toThrow()
        expect(() => lits.run(`(concat undefined)`)).toThrow()
      })
    })

    describe(`not-empty`, () => {
      test(`samples`, () => {
        expect(lits.run(`(not-empty [])`)).toBe(null)
        expect(lits.run(`(not-empty [0])`)).toEqual([0])
        expect(lits.run(`(not-empty {})`)).toBe(null)
        expect(lits.run(`(not-empty {:a 2})`)).toEqual({ a: 2 })
        expect(lits.run(`(not-empty "")`)).toBe(null)
        expect(lits.run(`(not-empty "Albert")`)).toEqual(`Albert`)
        expect(() => lits.run(`(not-empty)`)).toThrow()
        expect(() => lits.run(`(not-empty)`)).toThrow()
        expect(() => lits.run(`(not-empty true)`)).toThrow()
        expect(() => lits.run(`(not-empty false)`)).toThrow()
        expect(() => lits.run(`(not-empty nil)`)).toThrow()
        expect(() => lits.run(`(not-empty undefined)`)).toThrow()
        expect(() => lits.run(`(not-empty 10)`)).toThrow()
        expect(() => lits.run(`(not-empty (regexp "^start"))`)).toThrow()
      })
    })

    describe(`every?`, () => {
      test(`samples`, () => {
        expect(lits.run(`(every? number? [1 2 3])`)).toBe(true)
        expect(lits.run(`(every? number? [:1 :2 :3])`)).toBe(false)
        expect(lits.run(`(every? number? [])`)).toBe(true)
        expect(lits.run(`(every? number? "")`)).toBe(true)
        expect(lits.run(`(every? number? {})`)).toBe(true)
        expect(lits.run(`(every? (fn [x] (zero? (mod x 2))) [2 4 6])`)).toBe(true)
        expect(lits.run(`(every? (fn [x] (>= x :a)) "abc")`)).toBe(true)
        expect(lits.run(`(every? (fn [x] (>= x :a)) "abC")`)).toBe(false)
        expect(lits.run(`(every? #(even? (second %1)) {:a 2 :b 4})`)).toBe(true)
        expect(lits.run(`(every? #(even? (second %1)) {:a 2 :b 3})`)).toBe(false)
        expect(lits.run(`(every? #(even? (second %1)) {:a 2 :b 3})`)).toBe(false)

        expect(() => lits.run(`(every? +)`)).toThrow()
        expect(() => lits.run(`(every?)`)).toThrow()
        expect(() => lits.run(`(every? number? [1] 2)`)).toThrow()
      })
      test(`dataType`, () => {
        expect(lits.getDataType(`(every? number? [1 2 3])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(every? number? [:1 :2 :3])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(every? number? [])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(every? number? "")`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(every? number? {})`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(every? (fn [x] (zero? (mod x 2))) [2 4 6])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(every? (fn [x] (>= x :a)) "abc")`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(every? (fn [x] (>= x :a)) "abC")`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(every? #(even? (second %1)) {:a 2 :b 4})`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(every? #(even? (second %1)) {:a 2 :b 3})`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(every? #(even? (second %1)) {:a 2 :b 3})`)).toEqual(DataType.boolean)
      })
    })

    describe(`not-every?`, () => {
      test(`samples`, () => {
        expect(lits.run(`(not-every? number? [1 2 3])`)).toBe(false)
        expect(lits.run(`(not-every? number? [:1 :2 :3])`)).toBe(true)
        expect(lits.run(`(not-every? number? [])`)).toBe(false)
        expect(lits.run(`(not-every? number? "")`)).toBe(false)
        expect(lits.run(`(not-every? number? {})`)).toBe(false)
        expect(lits.run(`(not-every? (fn [x] (zero? (mod x 2))) [2 4 6])`)).toBe(false)
        expect(lits.run(`(not-every? (fn [x] (>= x :a)) "abc")`)).toBe(false)
        expect(lits.run(`(not-every? (fn [x] (>= x :a)) "abC")`)).toBe(true)
        expect(lits.run(`(not-every? #(even? (second %1)) {:a 2 :b 4})`)).toBe(false)
        expect(lits.run(`(not-every? #(even? (second %1)) {:a 2 :b 3})`)).toBe(true)
        expect(lits.run(`(not-every? #(even? (second %1)) {:a 2 :b 3})`)).toBe(true)

        expect(() => lits.run(`(not-every? +)`)).toThrow()
        expect(() => lits.run(`(not-every?)`)).toThrow()
        expect(() => lits.run(`(not-every? number? [1] 2)`)).toThrow()
      })
      test(`dataType`, () => {
        expect(lits.getDataType(`(not-every? number? [1 2 3])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(not-every? number? [:1 :2 :3])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(not-every? number? [])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(not-every? number? "")`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(not-every? number? {})`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(not-every? (fn [x] (zero? (mod x 2))) [2 4 6])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(not-every? (fn [x] (>= x :a)) "abc")`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(not-every? (fn [x] (>= x :a)) "abC")`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(not-every? #(even? (second %1)) {:a 2 :b 4})`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(not-every? #(even? (second %1)) {:a 2 :b 3})`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(not-every? #(even? (second %1)) {:a 2 :b 3})`)).toEqual(DataType.boolean)
      })
    })

    describe(`any?`, () => {
      test(`samples`, () => {
        expect(lits.run(`(any? number? [1 2 3])`)).toBe(true)
        expect(lits.run(`(any? number? [1 :2 3])`)).toBe(true)
        expect(lits.run(`(any? number? [:1 :2 :3])`)).toBe(false)
        expect(lits.run(`(any? number? [])`)).toBe(false)
        expect(lits.run(`(any? number? "")`)).toBe(false)
        expect(lits.run(`(any? number? {})`)).toBe(false)
        expect(lits.run(`(any? (fn [x] (zero? (mod x 2))) [1 3 6])`)).toBe(true)
        expect(lits.run(`(any? (fn [x] (zero? (mod x 2))) [1 3 5])`)).toBe(false)
        expect(lits.run(`(any? (fn [x] (>= x :a)) "abc")`)).toBe(true)
        expect(lits.run(`(any? (fn [x] (>= x :a)) "abC")`)).toBe(true)
        expect(lits.run(`(any? (fn [x] (>= x :a)) "ABC")`)).toBe(false)
        expect(lits.run(`(any? #(even? (second %1)) {:a 2 :b 4})`)).toBe(true)
        expect(lits.run(`(any? #(even? (second %1)) {:a 2 :b 3})`)).toBe(true)
        expect(lits.run(`(any? #(even? (second %1)) {:a 1 :b 3})`)).toBe(false)

        expect(() => lits.run(`(any? +)`)).toThrow()
        expect(() => lits.run(`(any?)`)).toThrow()
        expect(() => lits.run(`(any? number? [1] 2)`)).toThrow()
      })
      test(`dataType`, () => {
        expect(lits.getDataType(`(any? number? [1 2 3])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(any? number? [1 :2 3])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(any? number? [:1 :2 :3])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(any? number? [])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(any? number? "")`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(any? number? {})`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(any? (fn [x] (zero? (mod x 2))) [1 3 6])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(any? (fn [x] (zero? (mod x 2))) [1 3 5])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(any? (fn [x] (>= x :a)) "abc")`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(any? (fn [x] (>= x :a)) "abC")`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(any? (fn [x] (>= x :a)) "ABC")`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(any? #(even? (second %1)) {:a 2 :b 4})`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(any? #(even? (second %1)) {:a 2 :b 3})`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(any? #(even? (second %1)) {:a 1 :b 3})`)).toEqual(DataType.boolean)
      })
    })

    describe(`not-any?`, () => {
      test(`samples`, () => {
        expect(lits.run(`(not-any? number? [1 2 3])`)).toBe(false)
        expect(lits.run(`(not-any? number? [1 :2 3])`)).toBe(false)
        expect(lits.run(`(not-any? number? [:1 :2 :3])`)).toBe(true)
        expect(lits.run(`(not-any? number? [])`)).toBe(true)
        expect(lits.run(`(not-any? number? "")`)).toBe(true)
        expect(lits.run(`(not-any? number? {})`)).toBe(true)
        expect(lits.run(`(not-any? (fn [x] (zero? (mod x 2))) [1 3 6])`)).toBe(false)
        expect(lits.run(`(not-any? (fn [x] (zero? (mod x 2))) [1 3 5])`)).toBe(true)
        expect(lits.run(`(not-any? (fn [x] (>= x :a)) "abc")`)).toBe(false)
        expect(lits.run(`(not-any? (fn [x] (>= x :a)) "abC")`)).toBe(false)
        expect(lits.run(`(not-any? (fn [x] (>= x :a)) "ABC")`)).toBe(true)
        expect(lits.run(`(not-any? #(even? (second %1)) {:a 2 :b 4})`)).toBe(false)
        expect(lits.run(`(not-any? #(even? (second %1)) {:a 2 :b 3})`)).toBe(false)
        expect(lits.run(`(not-any? #(even? (second %1)) {:a 1 :b 3})`)).toBe(true)

        expect(() => lits.run(`(not-any? +)`)).toThrow()
        expect(() => lits.run(`(not-any?)`)).toThrow()
        expect(() => lits.run(`(not-any? number? [1] 2)`)).toThrow()
      })
      test(`dataType`, () => {
        expect(lits.getDataType(`(not-any? number? [1 2 3])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(not-any? number? [1 :2 3])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(not-any? number? [:1 :2 :3])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(not-any? number? [])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(not-any? number? "")`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(not-any? number? {})`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(not-any? (fn [x] (zero? (mod x 2))) [1 3 6])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(not-any? (fn [x] (zero? (mod x 2))) [1 3 5])`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(not-any? (fn [x] (>= x :a)) "abc")`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(not-any? (fn [x] (>= x :a)) "abC")`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(not-any? (fn [x] (>= x :a)) "ABC")`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(not-any? #(even? (second %1)) {:a 2 :b 4})`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(not-any? #(even? (second %1)) {:a 2 :b 3})`)).toEqual(DataType.boolean)
        expect(lits.getDataType(`(not-any? #(even? (second %1)) {:a 1 :b 3})`)).toEqual(DataType.boolean)
      })
    })

    describe(`update`, () => {
      test(`samples`, () => {
        expect(
          lits.run(
            `(def x "Albert") (update x 3 (fn [val] (if (nil? val) "!" (from-char-code (inc (to-char-code val))))))`,
          ),
        ).toEqual(`Albfrt`)
        expect(
          lits.run(
            `(def x "Albert") (update x 6 (fn [val] (if (nil? val) "!" (from-char-code (inc (to-char-code val))))))`,
          ),
        ).toEqual(`Albert!`)

        expect(lits.run(`(def x [0, 1, 2, 3]) (update x 3 inc)`)).toEqual([0, 1, 2, 4])
        expect(lits.run(`(def x [0, 1, 2, 3]) (update x 4 identity)`)).toEqual([0, 1, 2, 3, null])

        expect(lits.run(`(def x {:a 1 :b 2}) (update x :a inc)`)).toEqual({ a: 2, b: 2 })
        expect(lits.run(`(def x {:a 1 :b 2}) (update x :a + 10)`)).toEqual({ a: 11, b: 2 })
        expect(lits.run(`(def x {:a 1 :b 2}) (update x :a (fn [val] (if (even? val) 0 (inc val))))`)).toEqual({
          a: 2,
          b: 2,
        })
        expect(lits.run(`(def x {:a 1 :b 2}) (:c x)`)).toEqual(null)
        expect(lits.run(`(update {} :a (fn [val] (when (nil? val) 0)))`)).toEqual({ a: 0 })
        expect(lits.run(`(def x {:a 1 :b 2}) (update x :c (fn [val] (if (nil? val) 0 (inc val))))`)).toEqual({
          a: 1,
          b: 2,
          c: 0,
        })
        expect(() => lits.run(`(update number? [1] 2)`)).toThrow()
      })
    })

    describe(`update-in`, () => {
      test(`samples`, () => {
        expect(
          lits.run(
            `(def x "Albert") (update-in x [3] (fn [val] (if (nil? val) "!" (from-char-code (inc (to-char-code val))))))`,
          ),
        ).toEqual(`Albfrt`)
        expect(
          lits.run(
            `(def x "Albert") (update-in x [6] (fn [val] (if (nil? val) "!" (from-char-code (inc (to-char-code val))))))`,
          ),
        ).toEqual(`Albert!`)

        expect(lits.run(`(def x [0, 1, 2, 3]) (update-in x [3] inc)`)).toEqual([0, 1, 2, 4])
        expect(lits.run(`(def x [0, 1, 2, 3]) (update-in x [4] identity)`)).toEqual([0, 1, 2, 3, null])

        expect(lits.run(`(def x {:a 1 :b 2}) (update-in x [:a] inc)`)).toEqual({ a: 2, b: 2 })
        expect(lits.run(`(def x {:a 1 :b 2}) (update-in x [:a] + 10)`)).toEqual({ a: 11, b: 2 })
        expect(lits.run(`(def x {:a 1 :b 2}) (update-in x [:a] (fn [val] (if (even? val) 0 (inc val))))`)).toEqual({
          a: 2,
          b: 2,
        })
        expect(lits.run(`(update-in {} [:a] (fn [val] (when (nil? val) 0)))`)).toEqual({ a: 0 })
        expect(lits.run(`(def x {:a 1 :b 2}) (update-in x [:c] (fn [val] (if (nil? val) 0 (inc val))))`)).toEqual({
          a: 1,
          b: 2,
          c: 0,
        })
        expect(lits.run(`(update-in {:a [1 2 3]} [:a 1] (fn [val] (when (nil? val) 0)))`)).toEqual({
          a: [1, null, 3],
        })
        expect(lits.run(`(update-in {:a [1 nil 3]} [:a 1] (fn [val] (when (nil? val) 0)))`)).toEqual({
          a: [1, 0, 3],
        })
        expect(lits.run(`(update-in {:a [1 "Albert" 3]} [:a 1 0] (fn [val] (if (nil? val) "?" "!")))`)).toEqual({
          a: [1, `!lbert`, 3],
        })
        expect(lits.run(`(update-in {:a [1 "" 3]} [:a 1 0] (fn [val] (if (nil? val) "?" "!")))`)).toEqual({
          a: [1, `?`, 3],
        })
      })
    })
  }
})
