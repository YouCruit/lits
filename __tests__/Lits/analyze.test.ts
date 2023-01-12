import { Lits } from '../../src'

describe(`analyze`, () => {
  for (const lits of [new Lits(), new Lits({ debug: true })]) {
    test(`undefinedSymbols`, () => {
      expect(lits.analyze(`(+ a 10)`).undefinedSymbols).toEqual(new Set([`a`]))
      expect(lits.analyze(`(def a 10) (+ a 10)`).undefinedSymbols).toEqual(new Set())
      expect(lits.analyze(`(let [a 10] (+ a b))`).undefinedSymbols).toEqual(new Set([`b`]))
      expect(lits.analyze(`(let [a 10] (+ a b)) a`).undefinedSymbols).toEqual(new Set([`a`, `b`]))
      expect(lits.analyze(`(let [a 10] (str :a :b))`).undefinedSymbols).toEqual(new Set())
      expect(lits.analyze(`(foo bar)`).undefinedSymbols).toEqual(new Set([`foo`, `bar`]))
      expect(lits.analyze(`({:bar (+ a b)})`).undefinedSymbols).toEqual(new Set([`a`, `b`]))
      expect(lits.analyze(`({:bar (+ a b)} :bar)`).undefinedSymbols).toEqual(new Set([`a`, `b`]))
      expect(lits.analyze(`(:bar {:bar (+ a b)})`).undefinedSymbols).toEqual(new Set([`a`, `b`]))
      expect(lits.analyze(`(foo d e)`).undefinedSymbols).toEqual(new Set([`foo`, `d`])) // e is not reported due to that e is a builtin function: (e) -> 2.718281828459045
      expect(lits.analyze(`(foo d f)`).undefinedSymbols).toEqual(new Set([`foo`, `d`, `f`]))
      expect(
        lits.analyze(`(defn foo [] (let [data1 1, data2 (+ data1 1) data3 (+ data2 1)] data3))`).undefinedSymbols,
      ).toEqual(new Set([]))
    })
  }
})
