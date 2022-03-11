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
      expect(() => lits.run(`(assert false 'Expected true')`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assert nil)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assert 0)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assert '')`)).toThrowError(AssertionError)
      expect(lits.run(`(assert [])`)).toEqual([])
      expect(lits.run(`(assert true)`)).toBe(true)
      expect(lits.run(`(assert 1)`)).toBe(1)
      expect(lits.run(`(assert :0)`)).toBe(`0`)
    })
  })
  describe(`assert=`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(assert= 0 1)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assert= 0 1 'Expected same')`)).toThrowError(AssertionError)
      expect(lits.run(`(assert= 1 1)`)).toBeNull()
      expect(lits.run(`(assert= :Albert :Albert)`)).toBeNull()
      expect(lits.run(`(assert= :Albert 'Albert')`)).toBeNull()
    })
  })
  describe(`assertNot=`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(assertNot= 0 0)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assertNot= 0 0 'Expected different')`)).toThrowError(AssertionError)
      expect(lits.run(`(assertNot= 0 1)`)).toBeNull()
      expect(lits.run(`(assertNot= :Albert :Mojir)`)).toBeNull()
    })
  })
  describe(`assertEqual`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(assertEqual 1 0)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assertEqual {:a 1} {:a 2})`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assertEqual {:a 1} {:a 2} 'Expected deep equal')`)).toThrowError(AssertionError)
      expect(lits.run(`(assertEqual {:a 1} {:a 1})`)).toBeNull()
    })
  })
  describe(`assertNotEqual`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(assertNotEqual 0 0)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assertNotEqual {:a 2} {:a 2})`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assertNotEqual {:a 2} {:a 2} 'Expected not deep equal')`)).toThrowError(AssertionError)
      expect(lits.run(`(assertNotEqual {:a 2} {:a 1})`)).toBeNull()
    })
  })
  describe(`assert>`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(assert> 0 0)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assert> 0 1)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assert> :Albert :albert)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assert> :Albert :albert 'Expected greater than')`)).toThrowError(AssertionError)
      expect(lits.run(`(assert> 1 0)`)).toBeNull()
      expect(lits.run(`(assert> :albert :Albert)`)).toBeNull()
    })
  })
  describe(`assert<`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(assert< 0 0)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assert< 1 0)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assert< :albert :Albert)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assert< :albert :Albert 'Expected less than')`)).toThrowError(AssertionError)
      expect(lits.run(`(assert< 0 1)`)).toBeNull()
      expect(lits.run(`(assert< :Albert :albert)`)).toBeNull()
    })
  })
  describe(`assert>=`, () => {
    test(`samples`, () => {
      expect(() => lits.run(`(assert>= 0 1)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assert>= :Albert :albert)`)).toThrowError(AssertionError)
      expect(() => lits.run(`(assert>= :Albert :albert 'Expected greater than or equal')`)).toThrowError(AssertionError)
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
      expect(() => lits.run(`(assert<= :albert :Albert 'Expected less than or equal')`)).toThrowError(AssertionError)
      expect(lits.run(`(assert<= 0 1)`)).toBeNull()
      expect(lits.run(`(assert<= 1 1)`)).toBeNull()
      expect(lits.run(`(assert<= :albert :albert)`)).toBeNull()
      expect(lits.run(`(assert<= :Albert :albert)`)).toBeNull()
    })
  })
})
