module.exports = {
  and: {
    name: `and`,
    category: `Special expression`,
    linkName: `and`,
    returns: {
      type: `boolean`,
    },
    arguments: [
      {
        name: `forms`,
        type: `form[]`,
      },
    ],
    description: `Computes logical "and" function. \`forms\` evaluation starts from left. Value from the first form that decides result is returned so \`forms\` at end of argument array may not evaluated.`,
    examples: [
      `(and 1 1)`,
      `(and (> 3 2) "string")`,
      `(and (< 3 2) "string")`,
      `(and true true true true)`,
      `(and true true 0 true)`,
    ],
    specialExpression: true,
  },
  or: {
    name: `or`,
    category: `Special expression`,
    linkName: `or`,
    returns: {
      type: `boolean`,
    },
    arguments: [
      {
        name: `forms`,
        type: `form[]`,
      },
    ],
    description: `Computes logical "or" function. \`forms\` evaluation starts from left. Value from the first form that decides result is returned so forms at end of argument array may not evaluated.`,
    examples: [
      `(or 1 1)`,
      `(or (> 3 2) "string")`,
      `(or (< 3 2) "string")`,
      `(or true true true true)`,
      `(or 1 2 3 4)`,
    ],
    specialExpression: true,
  },
  def: {
    name: `def`,
    category: `Special expression`,
    linkName: `def`,
    returns: {
      type: `any`,
    },
    arguments: [
      {
        name: `variable`,
        type: `name`,
      },
      {
        name: `value`,
        type: `any`,
      },
    ],
    description: `Bind \`value\` to \`variable\`. If \`variable\` isn't defined, a new global variable is created.`,
    examples: [`(def a (object))`, `(def a (object "x" 10 "y" true "z" "A string"))`],
    specialExpression: true,
  },
  defs: {
    name: `defs`,
    category: `Special expression`,
    linkName: `defs`,
    returns: {
      type: `any`,
    },
    arguments: [
      {
        name: `variable`,
        type: `form`,
      },
      {
        name: `value`,
        type: `any`,
      },
    ],
    description: `Creates a variable with name set to \`variable\` evaluated and value set to \`value\`. If a variable with name \`variable\` isn't found a new global variable is created.`,
    examples: [
      `(defs "a" "b")`,
      `(defs (str "a" "1") (object "x" 10 "y" true "z" "A string")) a1`,
      `(defs "a" "b") (defs a "c") b`,
    ],
    specialExpression: true,
  },
  let: {
    name: `let`,
    category: `Special expression`,
    linkName: `let`,
    returns: {
      type: `any`,
    },
    arguments: [
      {
        name: `bindings`,
        type: `bindings`,
      },
      {
        name: `body`,
        type: `lisp expressions`,
      },
    ],
    description: `Binds local variables. The variables lives only within the body. It returns evaluation of the last expression in the body.`,
    examples: [`(let [a (+ 1 2 3 4) b (* 1 2 3 4)] (write! a b))`],
    specialExpression: true,
  },
  fn: {
    name: `fn`,
    category: `Special expression`,
    linkName: `fn`,
    returns: {
      type: `function`,
    },
    arguments: [
      {
        name: `arguments`,
        type: `arguments`,
      },
      {
        name: `body`,
        type: `lisp expressions`,
      },
    ],
    description: `Creates a function. When called, evaluation of the last expression in the body is returned.`,
    examples: [`(fn [a b] (sqrt (+ (* a a) (* b b))))`, `((fn [a b] (sqrt (+ (* a a) (* b b)))) 3 4)`],
    specialExpression: true,
  },
  defn: {
    name: `defn`,
    category: `Special expression`,
    linkName: `defn`,
    returns: {
      type: `function`,
    },
    arguments: [
      {
        name: `name`,
        type: `name`,
      },
      {
        name: `arguments`,
        type: `arguments`,
      },
      {
        name: `body`,
        type: `lisp expressions`,
      },
    ],
    description: `Creates a named global function. When called, evaluation of the last expression in the body is returned.`,
    examples: [
      `(defn hyp [a b] (sqrt (+ (* a a) (* b b)))) hyp`,
      `(defn hyp [a b] (sqrt (+ (* a a) (* b b)))) (hyp 3 4)`,
      `(defn sumOfSquares [&rest s] (apply + (map (fn [x] (* x x)) s))) (sumOfSquares 1 2 3 4 5)`,
    ],
    specialExpression: true,
  },
  defns: {
    name: `defns`,
    category: `Special expression`,
    linkName: `defns`,
    returns: {
      type: `function`,
    },
    arguments: [
      {
        name: `name`,
        type: `form`,
      },
      {
        name: `arguments`,
        type: `arguments`,
      },
      {
        name: `body`,
        type: `lisp expressions`,
      },
    ],
    description: `Creates a named global function with its name set to \`name\` evaluated. When called, evaluation of the last expression in the body is returned.`,
    examples: [
      `(defns "hyp" [a b] (sqrt (+ (* a a) (* b b)))) hyp`,
      `(defns (str "h" "y" "p") [a b] (sqrt (+ (* a a) (* b b)))) (hyp 3 4)`,
      `(defns "sumOfSquares" [&rest s] (apply + (map (fn [x] (* x x)) s))) (sumOfSquares 1 2 3 4 5)`,
    ],
    specialExpression: true,
  },
  try: {
    name: `try`,
    category: `Special expression`,
    linkName: `try`,
    returns: {
      type: `any`,
    },
    arguments: [
      {
        name: `tryExpression`,
        type: `form`,
      },
      {
        name: `catchBlock`,
        type: `catchBlock`,
      },
    ],
    description: `Executes tryExpression. If that throws, the catchBlock gets executed. See examples for details.`,
    examples: [`(try (/ 2 4) ((error) (/ 2 1)))`, `(try (/ 2 0) ((error) (/ 2 1)))`, `(try (/ 2 0) ((error) error))`],
    specialExpression: true,
  },
  throw: {
    name: `throw`,
    category: `Special expression`,
    linkName: `throw`,
    returns: {
      type: `nothing`,
    },
    arguments: [
      {
        name: `message`,
        type: `form`,
      },
    ],
    description: `Throws \`UserDefinedError\` with message set to \`message\` evaluated. \`message\` must evaluate to a \`string\`.`,
    examples: [
      `(throw "You shall not pass!")`,
      `(throw (subs "You shall not pass!" 0 3))`,
      `(try (throw "You shall not pass!") ((error) error))`,
    ],
    specialExpression: true,
  },
  if: {
    name: `if`,
    category: `Special expression`,
    linkName: `if`,
    returns: {
      type: `any`,
    },
    arguments: [
      {
        name: `test`,
        type: `any`,
      },
      {
        name: `then`,
        type: `any`,
      },
      {
        name: `else`,
        type: `any`,
        description: `optional`,
      },
    ],
    description: `Either \`then\` or \`else\` branch is taken. Then branch is selected when \`test\` result is truthy. I test is falsy and no \`else\` branch exists, undefined is returned.`,
    examples: [
      `(if true (write! "TRUE") (write! "FALSE"))`,
      `(if false (write! "TRUE") (write! "FALSE"))`,
      `(if true (write! "TRUE"))`,
      `(if false (write! "TRUE"))`,
    ],
    specialExpression: true,
  },
  'if-not': {
    name: `if-not`,
    category: `Special expression`,
    linkName: `if-not`,
    returns: {
      type: `any`,
    },
    arguments: [
      {
        name: `test`,
        type: `any`,
      },
      {
        name: `then`,
        type: `any`,
      },
      {
        name: `else`,
        type: `any`,
        description: `optional`,
      },
    ],
    description: `Either \`then\` or \`else\` branch is taken. Then branch is selected when \`test\` result is falsy. I test is falsy and no \`else\` branch exists, undefined is returned.`,
    examples: [
      `(if-not true (write! "TRUE") (write! "FALSE"))`,
      `(if-not false (write! "TRUE") (write! "FALSE"))`,
      `(if-not true (write! "TRUE"))`,
      `(if-not false (write! "TRUE"))`,
    ],
    specialExpression: true,
  },
  cond: {
    name: `cond`,
    category: `Special expression`,
    linkName: `cond`,
    returns: {
      type: `any`,
    },
    arguments: [
      {
        name: `variants`,
        type: `variants`,
      },
    ],
    description: `Used for branching. Variants are tested sequentially from the top. I no branch is tested truthy, \`undefined\` is returned.`,
    examples: [
      `(cond false (write! "FALSE") null (write! "NULL") true (write! "TRUE"))`,
      `(cond false (write! "FALSE") null (write! "NULL"))`,
    ],
    specialExpression: true,
  },
  when: {
    name: `when`,
    category: `Special expression`,
    linkName: `when`,
    returns: {
      type: `any`,
    },
    arguments: [
      {
        name: `test`,
        type: `form`,
      },
      {
        name: `form`,
        type: `form`,
        description: `zero or more`,
      },
    ],
    description: `If \`test\` yields a thruthy value, the forms are evaluated in order from left to right and the value returned by the last \`form\` is returned. Otherwise, if \`test\` yields a falsy value, the forms are not evaluated, and \`undefined\` is returned. If no \`form\` is provided, undefined is returned.`,
    examples: [
      `(when true (write! "Hi") (write! "There"))`,
      `(when false (write! "Hi") (write! "There"))`,
      `(when true)`,
      `(when false)`,
    ],
    specialExpression: true,
  },
  do: {
    name: `do`,
    category: `Special expression`,
    linkName: `do`,
    returns: {
      type: `any`,
    },
    arguments: [
      {
        name: `forms`,
        type: `form[]`,
      },
    ],
    description: `Calls \`forms\` in the order they have been written. Resulting value is the value of the last form.`,
    examples: [`(do (write! "Hi") (write! "Albert"))`, `(do)`],
    specialExpression: true,
  },
  recur: {
    name: `recur`,
    category: `Special expression`,
    linkName: `recur`,
    returns: {
      type: `undefined`,
    },
    arguments: [
      {
        name: `forms`,
        type: `form[]`,
      },
    ],
    description: `Recursevly calls enclosing function or loop with its evaluated \`forms\`.`,
    examples: [
      `(defn foo [n] (write! n) (when (not (zero? n)) (recur (dec n)))) (foo 3)`,
      `((fn [n] (write! n) (when (not (zero? n)) (recur (dec n)))) 3)`,
      `(loop [n 3] (write! n) (when (not (zero? n)) (recur (dec n))))`,
    ],
    specialExpression: true,
  },
  loop: {
    name: `loop`,
    category: `Special expression`,
    linkName: `loop`,
    returns: {
      type: `any`,
    },
    arguments: [
      {
        name: `bindings`,
        type: `bindings`,
      },
      {
        name: `body`,
        type: `lisp expressions`,
      },
    ],
    description: `Executes body with initial \`bindings\`. The \`bindings\` will be replaced with the recur parameters for subsequent recursions.`,
    examples: [
      `(loop [n 3] (write! n) (when (not (zero? n)) (recur (dec n))))`,
      `(loop [n 3] (write! n) (if (not (zero? n)) (recur (dec n)) n))`,
    ],
    specialExpression: true,
  },
}
