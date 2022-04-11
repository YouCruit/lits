import { Lits, LitsParams } from '../../src/Lits/Lits'

const lits = new Lits()

const context = lits.context(`
  (defn plus [a b] (+ a b))
`)

const successProgram = `
(defn add [a b] (+ a b))
(defn sub [a b] (- a b))
`

const successProgramWithContext = `
(defn add [a b] (plus a b))
(defn sub [a b] (- a b))
(assert plus)
`

const oneSuccessProgram = `
(defn add [a b] (+ a b))
(defn sub [a b] (+ a b))
`

const failureProgram = `
(defn add [a b] (- a b))
(defn sub [a b] (+ a b))
`

const testScript = `
; Setup code
(def one 1)

; @test add
(assert= (add one 2) 3)

; @test sub
(assert= (sub one 2) -1)
`

const skipTestScript = `
; Setup code
(def one 1)

; @test add
(assert= (add one 2) 3)

; @skip-test sub
(assert= (sub one 2) -1)
`

const missingTestNameTestScript = `
; @test
(assert= (sub 1 2) -1)
`

const duplicateTestNameTestScript = `
; @test add
(assert= (add 1 2) 3)

; @test add
(assert= (sub 1 2) -1)
`

describe(`testFramework`, () => {
  test(`empty test`, () => {
    const testResult = lits.runTest({ test: ``, program: `` })
    expect(testResult.success).toBe(true)
    expect(testResult.tap).toBe(`TAP version 13\n1..0\n`)
  })
  test(`duplicate test names`, () => {
    const testResult = lits.runTest({ test: duplicateTestNameTestScript, program: successProgram })
    expect(testResult.success).toBe(false)
    expect(testResult.tap).toBe(`TAP version 13
Bail out! Duplicate test name add
`)
  })
  test(`missing test name`, () => {
    const testResult = lits.runTest({ test: missingTestNameTestScript, program: successProgram })
    expect(testResult.success).toBe(false)
    expect(testResult.tap).toBe(`TAP version 13
Bail out! Missing test name on line 1
`)
  })
  test(`success`, () => {
    const testResult = lits.runTest({ test: testScript, program: successProgram })
    expect(testResult.success).toBe(true)
    expect(testResult.tap).toBe(`TAP version 13
1..2
ok 1 add
ok 2 sub
`)
  })

  test(`success with context`, () => {
    const params: LitsParams = { contexts: [context] }
    const testResult = lits.runTest({
      test: testScript,
      program: successProgramWithContext,
      testParams: params,
      programParams: params,
    })
    expect(testResult.success).toBe(true)
    expect(testResult.tap).toBe(`TAP version 13
1..2
ok 1 add
ok 2 sub
`)
  })

  test(`skip-test`, () => {
    const testResult = lits.runTest({ test: skipTestScript, program: oneSuccessProgram })
    expect(testResult.success).toBe(true)
    expect(testResult.tap).toBe(`TAP version 13
1..2
ok 1 add
ok 2 sub # skip
`)
  })

  test(`1 fail.`, () => {
    const testResult = lits.runTest({ test: testScript, program: oneSuccessProgram })
    expect(testResult.success).toBe(false)
    expect(testResult.tap).toBe(`TAP version 13
1..2
ok 1 add
not ok 2 sub
  ---
  error: "AssertionError"
  message: "Expected 3 to be -1."
  location: "(9:2)"
  code:
    - "(assert= (sub one 2) -1)"
    - " ^                      "
  ...
`)
  })

  test(`1 fail with filename`, () => {
    const testResult = lits.runTest({
      test: testScript,
      program: oneSuccessProgram,
      testParams: { filename: `test.lits` },
    })
    expect(testResult.success).toBe(false)
    expect(testResult.tap).toBe(`TAP version 13
1..2
ok 1 add
not ok 2 sub
  ---
  error: "AssertionError"
  message: "Expected 3 to be -1."
  location: "test.lits(9:2)"
  code:
    - "(assert= (sub one 2) -1)"
    - " ^                      "
  ...
`)
  })

  test(`1 fail, 1 not matching pattern`, () => {
    const testResult = lits.runTest({ test: testScript, program: failureProgram, testNamePattern: /ad/ })
    expect(testResult.success).toBe(false)
    expect(testResult.tap).toBe(`TAP version 13
1..2
not ok 1 add
  ---
  error: "AssertionError"
  message: "Expected -1 to be 3."
  location: "(6:2)"
  code:
    - "(assert= (add one 2) 3)"
    - " ^                     "
  ...
ok 2 sub # skip - Not matching testNamePattern /ad/
`)
  })

  test(`2 fail`, () => {
    const testResult = lits.runTest({ test: testScript, program: failureProgram })
    expect(testResult.success).toBe(false)
    expect(testResult.tap).toBe(`TAP version 13
1..2
not ok 1 add
  ---
  error: "AssertionError"
  message: "Expected -1 to be 3."
  location: "(6:2)"
  code:
    - "(assert= (add one 2) 3)"
    - " ^                     "
  ...
not ok 2 sub
  ---
  error: "AssertionError"
  message: "Expected 3 to be -1."
  location: "(9:2)"
  code:
    - "(assert= (sub one 2) -1)"
    - " ^                      "
  ...
`)
  })
})
