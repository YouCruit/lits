/* eslint-disable no-console */
import { Lits } from '../../../src'
import { AssertionError } from '../../../src/errors'

let lits: Lits

beforeEach(() => {
  lits = new Lits()
})

describe(`assert functions`, () => {
  describe(`assert`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(assert false)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assert false "Expected true")`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assert nil)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assert 0)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assert "")`)).toThrowError(AssertionError)
      expect(lits.run(`(assert [])`)).toEqual([])
      expect(lits.run(`(assert true)`)).toBe(true)
      expect(lits.run(`(assert 1)`)).toBe(1)
      expect(lits.run(`(assert :0)`)).toBe(`0`)
    })
  })
  describe(`assert=`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(assert= 0 1)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assert= 0 1 "Expected same")`)).toThrowError(AssertionError)
      expect(lits.run(`(assert= 1 1)`)).toBeNull()
      expect(lits.run(`(assert= :Albert :Albert)`)).toBeNull()
      expect(lits.run(`(assert= :Albert "Albert")`)).toBeNull()
    })
  })
  describe(`assertNot=`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(assertNot= 0 0)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assertNot= 0 0 "Expected different")`)).toThrowError(AssertionError)
      expect(lits.run(`(assertNot= 0 1)`)).toBeNull()
      expect(lits.run(`(assertNot= :Albert :Mojir)`)).toBeNull()
    })
  })
  describe(`assertEqual`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(assertEqual 1 0)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assertEqual {:a 1} {:a 2})`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assertEqual {:a 1} {:a 2} "Expected deep equal")`)).toThrowError(AssertionError)
      expect(lits.run(`(assertEqual {:a 1} {:a 1})`)).toBeNull()
    })
  })
  describe(`assertNotEqual`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(assertNotEqual 0 0)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assertNotEqual {:a 2} {:a 2})`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assertNotEqual {:a 2} {:a 2} "Expected not deep equal")`)).toThrowError(AssertionError)
      expect(lits.run(`(assertNotEqual {:a 2} {:a 1})`)).toBeNull()
    })
  })
  describe(`assert>`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(assert> 0 0)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assert> 0 1)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assert> :Albert :albert)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assert> :Albert :albert "Expected greater than")`)).toThrowError(AssertionError)
      expect(lits.run(`(assert> 1 0)`)).toBeNull()
      expect(lits.run(`(assert> :albert :Albert)`)).toBeNull()
    })
  })
  describe(`assert<`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(assert< 0 0)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assert< 1 0)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assert< :albert :Albert)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assert< :albert :Albert "Expected less than")`)).toThrowError(AssertionError)
      expect(lits.run(`(assert< 0 1)`)).toBeNull()
      expect(lits.run(`(assert< :Albert :albert)`)).toBeNull()
    })
  })
  describe(`assert>=`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(assert>= 0 1)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assert>= :Albert :albert)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assert>= :Albert :albert "Expected greater than or equal")`)).toThrowError(AssertionError)
      expect(lits.run(`(assert>= 1 0)`)).toBeNull()
      expect(lits.run(`(assert>= 1 1)`)).toBeNull()
      expect(lits.run(`(assert>= :albert :albert)`)).toBeNull()
      expect(lits.run(`(assert>= :albert :Albert)`)).toBeNull()
    })
  })
  describe(`assert<=`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(assert<= 1 0)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assert<= :albert :Albert)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assert<= :albert :Albert "Expected less than or equal")`)).toThrowError(AssertionError)
      expect(lits.run(`(assert<= 0 1)`)).toBeNull()
      expect(lits.run(`(assert<= 1 1)`)).toBeNull()
      expect(lits.run(`(assert<= :albert :albert)`)).toBeNull()
      expect(lits.run(`(assert<= :Albert :albert)`)).toBeNull()
    })
  })
  describe(`assertTrue`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(assertTrue false)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assertTrue false "Expected false")`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assertTrue 1)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assertTrue nil)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assertTrue :x)`)).toThrowError(AssertionError)
      expect(lits.run(`(assertTrue true)`)).toBeNull()
    })
  })
  describe(`assertFalse`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(assertFalse true)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assertFalse true "Expected false")`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assertFalse nil)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assertFalse 0)`)).toThrowError(AssertionError)
      expect(lits.run(`(assertFalse false)`)).toBeNull()
    })
  })

  describe(`assertTruthy`, () => {
    test(`samples`, () => {
      expect(lits.run(`(assertTruthy true)`)).toBeNull()
      expect(lits.run(`(assertTruthy [])`)).toBeNull()
      expect(lits.run(`(assertTruthy {})`)).toBeNull()
      expect(lits.run(`(assertTruthy 1)`)).toBeNull()
      expect(lits.run(`(assertTruthy :hej)`)).toBeNull()
      expect(lits.run(`(assertTruthy #(+ %1 %1))`)).toBeNull()
      expect(() => lits.run(`(assertTruthy false)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assertTruthy nil "Expected true")`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assertTruthy 0)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assertTruthy "")`)).toThrowError(AssertionError)
    })
  })

  describe(`assertFalsy`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(assertFalsy true)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assertFalsy [])`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assertFalsy {})`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assertFalsy 1)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assertFalsy :hej)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assertFalsy #(+ %1 %1))`)).toThrowError(AssertionError)
      expect(lits.run(`(assertFalsy false)`)).toBeNull()
      expect(lits.run(`(assertFalsy nil "Expected true")`)).toBeNull()
      expect(lits.run(`(assertFalsy 0)`)).toBeNull()
      expect(lits.run(`(assertFalsy "")`)).toBeNull()
    })
  })

  describe(`assertNil`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(assertNil false)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assertNil 0)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assertNil "")`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assertNil :hej)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assertNil [])`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assertNil {})`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assertNil #(+ %1 %1))`)).toThrowError(AssertionError)
      expect(lits.run(`(assertNil nil "Should be nil")`)).toBeNull()
    })
  })

  describe(`assertThrows`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(assertThrows (fn [] (identity :X)) "Should throw")`)).toThrow()
      expect(() => lits.run(`(assertThrows (fn [] (throw :X)))`)).not.toThrow()
    })
  })

  describe(`assertNotThrows`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(assertNotThrows (fn [] (identity :X)) "Should not throw")`)).not.toThrow()
      expect(() => lits.run(`(assertNotThrows (fn [] (throw :X)))`)).toThrow()
    })
  })

  describe(`assertThrowsError`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(assertThrowsError (fn [] (identity :X)) :X "Should throw X")`)).toThrow()
      expect(() => lits.run(`(assertThrowsError (fn [] (throw :Y)) :X)`)).toThrow()
      expect(() => lits.run(`(assertThrowsError (fn [] (throw :X)) :X)`)).not.toThrow()
    })
  })
})
