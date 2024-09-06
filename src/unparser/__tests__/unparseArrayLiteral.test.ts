import { describe, it } from 'vitest'
import { Lits } from '../../Lits/Lits'
import { testFormatter } from './testFormatter'

const lits = new Lits({ debug: true })
const sampleProgram = '(flatten [1 2 [3 4] 5])'
const sampleProgramWithComments = `
(flatten [(inc 1)
          ;; Second element
          2
          [{:a 1, :b 2} 4] ;; Third element

          ;; Comment

          {:foo [{}] ;; Inline
           :bar 5}]) ;; Last element
`

describe('unparseArrayLitteral', () => {
  it('shoudl unparse unply array', () => {
    const program = '[]'
    testFormatter(
      p => lits.format(p),
      program,
      '[]\n',
    )
  })

  it('should work 1', () => {
    const program = '[{}]\n'
    testFormatter(
      p => lits.format(p),
      program,
      program,
    )
  })

  it('should work 2', () => {
    const program = `
(flatten
 (identity
  [1 ;; A
   (+ 2
      3)
   ;; B
   [3 4]
   5]))
`
    testFormatter(
      p => lits.format(p),
      program,
      program,
    )
  })

  it('should work 3', () => {
    const program = `
(slice [1 2 3 4 5]
       1
       3)
`
    testFormatter(
      p => lits.format(p),
      program,
      program,
    )
  })

  it('should work 4', () => {
    const program = `
[ ;; Inline comment
 1
 2
 3
 4
 5]
`
    testFormatter(
      p => lits.format(p),
      program,
      program,
    )
  })

  describe('unparse sampleProgram', () => {
    for (let lineLength = 0; lineLength <= sampleProgram.length + 1; lineLength += 1) {
      it(`should unparse with line length ${lineLength}`, () => {
        testFormatter(
          p => lits.format(p, { lineLength }),
          sampleProgram,
          formatSampleProgram(lineLength),
        )
      })
    }
  })

  describe('unparse sampleProgramWithComments', () => {
    for (let lineLength = 0; lineLength <= 43; lineLength += 1) {
      it(`should unparse with line length ${lineLength}`, () => {
        testFormatter(
          p => lits.format(p, { lineLength }),
          sampleProgramWithComments,
          formatSampleProgramWithComments(lineLength),
        )
      })
    }
  })
})

function formatSampleProgramWithComments(lineLength: number): string {
  if (lineLength >= 43 || lineLength === 0)
    return sampleProgramWithComments

  if (lineLength >= 35) {
    return `
(flatten
 [(inc 1)
  ;; Second element
  2
  [{:a 1, :b 2} 4] ;; Third element

  ;; Comment

  {:foo [{}] ;; Inline
   :bar 5}]) ;; Last element
`
  }

  if (lineLength >= 22) {
    return `
(flatten
 [(inc 1)
  ;; Second element
  2
  [{:a 1, :b 2}
   4] ;; Third element

  ;; Comment

  {:foo [{}] ;; Inline
   :bar 5}]) ;; Last element
`
  }

  if (lineLength >= 15) {
    return `
(flatten
 [(inc 1)
  ;; Second element
  2
  [{:a 1, :b 2}
   4] ;; Third element

  ;; Comment

  {:foo
   [{}] ;; Inline
   :bar
   5}]) ;; Last element
`
  }

  if (lineLength >= 9) {
    return `
(flatten
 [(inc 1)
  ;; Second element
  2
  [{:a 1
    :b 2}
   4] ;; Third element

  ;; Comment

  {:foo
   [{}] ;; Inline
   :bar
   5}]) ;; Last element
`
  }

  return `
(flatten
 [(inc
   1)
  ;; Second element
  2
  [{:a
    1
    :b
    2}
   4] ;; Third element

  ;; Comment

  {:foo
   [{}] ;; Inline
   :bar
   5}]) ;; Last element
`
}

function formatSampleProgram(lineLength: number): string {
  if (lineLength >= sampleProgram.length || lineLength === 0)
    return `${sampleProgram}\n`

  if (lineLength >= 14) {
    return `
(flatten
 [1 2 [3 4] 5])
`.trimStart()
  }

  if (lineLength >= 7) {
    return `
(flatten
 [1
  2
  [3 4]
  5])
`.trimStart()
  }

  return `
(flatten
 [1
  2
  [3
   4]
  5])
`.trimStart()
}
