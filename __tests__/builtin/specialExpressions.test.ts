/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { lispish } from '../../src'

describe('evaluator', () => {
  let oldLog: () => void
  let logSpy: jest.Mock<any, any>
  beforeEach(() => {
    oldLog = console.log
    logSpy = jest.fn()
    console.log = logSpy
  })
  afterEach(() => {
    console.log = oldLog
  })

  describe('setq', () => {
    test('samples', () => {
      expect(lispish(`(setq a 10) a`)).toBe(10)
      expect(lispish(`(setq a 10) (setq a 20) a`)).toBe(20)
      expect(() => lispish(`(setq a)`)).toThrow()
      expect(() => lispish(`(setq a 10 10)`)).toThrow()
      expect(() => lispish(`(setq 1 10)`)).toThrow()
      expect(() => lispish(`(setq null 10)`)).toThrow()
      expect(() => lispish(`(setq undefined 10)`)).toThrow()
      expect(() => lispish(`(setq false 10)`)).toThrow()
      expect(() => lispish(`(setq true 10)`)).toThrow()
      expect(() => lispish(`(setq (array) 10)`)).toThrow()
      expect(() => lispish(`(setq (object) 10)`)).toThrow()
      expect(() => lispish(`(setq "a" 10)`)).toThrow()
    })

    test('local variable', () => {
      const program = `
        (setq x "A")     ;Global variable x
        (write x)        ;"A"
        (let ((x "B"))   ;Local variable x
          (write x)      ;"B"
          (setq x "C")   ;Set local variable x
          (write x)      ;"C"
        )
        (write x)        ;"A" - global variable x
      `
      lispish(program)
      expect(logSpy).toHaveBeenNthCalledWith(1, 'A')
      expect(logSpy).toHaveBeenNthCalledWith(2, 'B')
      expect(logSpy).toHaveBeenNthCalledWith(3, 'C')
      expect(logSpy).toHaveBeenNthCalledWith(4, 'A')
    })
  })
  describe('if', () => {
    test('samples', () => {
      expect(lispish(`(if true "A" "B")`)).toBe('A')
      expect(lispish(`(if false "A" "B")`)).toBe('B')
      expect(lispish(`(if null "A" "B")`)).toBe('B')
      expect(lispish(`(if undefined "A" "B")`)).toBe('B')
      expect(lispish(`(if "" "A" "B")`)).toBe('B')
      expect(lispish(`(if "x" "A" "B")`)).toBe('A')
      expect(lispish(`(if 0 "A" "B")`)).toBe('B')
      expect(lispish(`(if 1 "A" "B")`)).toBe('A')
      expect(lispish(`(if -1 "A" "B")`)).toBe('A')
      expect(lispish(`(if (array) "A" "B")`)).toBe('A')
      expect(lispish(`(if (object) "A" "B")`)).toBe('A')
      expect(() => lispish(`(if)`)).toThrow()
      expect(() => lispish(`(if true)`)).toThrow()
      expect(() => lispish(`(if true "A")`)).toThrow()
      expect(() => lispish(`(if true "A" "B" "Q")`)).toThrow()
    })
    test('That special form "if" only evaluate the correct path (true)', () => {
      lispish(`(if true (write "A") (write "B"))`)
      expect(logSpy).toHaveBeenCalledWith('A')
      expect(logSpy).not.toHaveBeenCalledWith('B')
    })
    test('That special form "if" only evaluate the correct path (false)', () => {
      lispish(`(if false (write "A") (write "B"))`)
      expect(logSpy).not.toHaveBeenCalledWith('A')
      expect(logSpy).toHaveBeenCalledWith('B')
    })
  })

  describe('let', () => {
    test('samples', () => {
      expect(lispish(`(let ((a "A")) a)`)).toBe('A')
      expect(lispish(`(let ((a "A") (b "B")) a b)`)).toBe('B')
      expect(lispish(`(let ((a "A") (b "B")) a b)`)).toBe('B')
    })
    test('local and global variables', () => {
      expect(() =>
        lispish(`
          (let (
            (a "A")
            (b a)     ;Cannot access local variable a here. This is what let* whould be for
          )
            b
          )
        `),
      ).toThrow()
      expect(
        lispish(`
          (setq a "X")
          (let (
            (a "A")
            (b a)     ;a is the global variable
          )
            b
          )
        `),
      ).toBe('X')
    })
  })

  describe('and', () => {
    test('samples', () => {
      expect(lispish('(and)')).toBe(true)
      expect(lispish('(and 0)')).toBe(0)
      expect(lispish('(and 0 1)')).toBe(0)
      expect(lispish('(and 2 0)')).toBe(0)
      expect(lispish('(and 2 0 1)')).toBe(0)
      expect(lispish('(and 2 3 0)')).toBe(0)
      expect(lispish('(and 2 3 "")')).toBe('')
      expect(lispish('(and 2 3 "x")')).toBe('x')
      expect(lispish('(and false 1)')).toBe(false)
      expect(lispish('(and 1 false)')).toBe(false)
      expect(lispish('(and 1 undefined)')).toBe(undefined)
      expect(lispish('(and 1 null)')).toBe(null)
      expect(lispish('(and 2 2 false)')).toBe(false)
      expect(lispish('(and 3 true 3)')).toBe(3)
    })
    describe('short circuit', () => {
      test('true, false', () => {
        expect(lispish('(and (write true) (write false))')).toBe(false)
        expect(logSpy).toHaveBeenNthCalledWith(1, true)
        expect(logSpy).toHaveBeenNthCalledWith(2, false)
      })
      test('true, 1', () => {
        expect(lispish('(and (write true) (write 1))')).toBe(1)
        expect(logSpy).toHaveBeenNthCalledWith(1, true)
        expect(logSpy).toHaveBeenNthCalledWith(2, 1)
      })
      test('false, true', () => {
        expect(lispish('(and (write false) (write true))')).toBe(false)
        expect(logSpy).toHaveBeenCalledWith(false)
        expect(logSpy).not.toHaveBeenCalledWith(true)
      })
      test('false, true', () => {
        expect(lispish('(and (write false) (write 0))')).toBe(false)
        expect(logSpy).toHaveBeenCalledWith(false)
        expect(logSpy).not.toHaveBeenCalledWith(0)
      })
    })
  })

  describe('or', () => {
    test('samples', () => {
      expect(lispish('(or)')).toBe(false)
      expect(lispish('(or 0)')).toBe(0)
      expect(lispish('(or 0 1)')).toBe(1)
      expect(lispish('(or 2 0)')).toBe(2)
      expect(lispish('(or null 0 false undefined)')).toBe(undefined)
      expect(lispish('(or null 0 1 undefined)')).toBe(1)
    })
    describe('short circuit', () => {
      test('true, false', () => {
        expect(lispish('(or (write true) (write false))')).toBe(true)
        expect(logSpy).toHaveBeenCalledWith(true)
        expect(logSpy).not.toHaveBeenCalledWith(false)
      })
      test('true, 1', () => {
        expect(lispish('(or (write true) (write 1))')).toBe(true)
        expect(logSpy).toHaveBeenCalledWith(true)
        expect(logSpy).not.toHaveBeenCalledWith(1)
      })
      test('false, true', () => {
        expect(lispish('(or (write false) (write true))')).toBe(true)
        expect(logSpy).toHaveBeenNthCalledWith(1, false)
        expect(logSpy).toHaveBeenNthCalledWith(2, true)
      })
      test('false, true', () => {
        expect(lispish('(or (write false) (write 0))')).toBe(0)
        expect(logSpy).toHaveBeenNthCalledWith(1, false)
        expect(logSpy).toHaveBeenNthCalledWith(2, 0)
      })
    })
  })

  describe('cond', () => {
    test('samples', () => {
      expect(lispish('(cond)')).toBeUndefined()
      expect(lispish('(cond (true 10) (true 20))')).toBe(10)
      expect(lispish('(cond (true 10))')).toBe(10)
      expect(lispish('(cond (false 20) (true (+ 5 5)) )')).toBe(10)
      expect(
        lispish('(cond ((> 5 10) 20) ((> 10 10) (write "Hej") (+ 5 5)) ((>= 10 10) "This will work" (+ 5 5 5)))'),
      ).toBe(15)
    })
    test('middle condition true', () => {
      expect(
        lispish('(cond ((> 5 10) (write 20)) ((>= 10 10) (+ 5 5)) ((write (>= 10 10)) "This will work" (+ 5 5 5)))'),
      ).toBe(10)
      expect(logSpy).not.toHaveBeenCalled()
    })
  })
})
