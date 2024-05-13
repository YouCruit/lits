import type { Reference } from '../index.ts'

export const specialExpressionsReference: Record<string, Reference<'Special expression'>> = {
  'and': {
    name: 'and',
    category: 'Special expression',
    linkName: 'and',
    returns: {
      type: 'boolean',
    },
    args: {
      expressions: {
        type: '*expression',
        rest: true,
      },
    },
    variants: [
      { argumentNames: ['expressions'] },
    ],
    description: `
Computes logical \`and\` function. Evaluation of $expressions starts from left.
As soon as a \`expression\` evaluates to a falsy value, the result is returned.

If all expressions evaluate to truthy values, the value of the last expression is returned.`,
    examples: [
      '(and 1 1)',
      '(and (> 3 2) "string")',
      '(and (< 3 2) "string")',
      '(and true true true true)',
      '(and true true 0 true)',
    ],
  },

  'or': {
    name: 'or',
    category: 'Special expression',
    linkName: 'or',
    returns: {
      type: 'boolean',
    },
    args: {
      expressions: {
        type: '*expression',
        rest: true,
      },
    },
    variants: [
      { argumentNames: ['expressions'] },
    ],
    description: `
Computes logical \`or\` function. Evaluation of $expressions evaluation starts from left.
As soon as a \`expression\` evaluates to a truthy value, the result is returned.

If all expressions evaluate to falsy values, the value of the last expression is returned.`,
    examples: [
      '(or 1 1)',
      '(or (> 3 2) "string")',
      '(or (< 3 2) "string")',
      '(or true true true true)',
      '(or 1 2 3 4)',
    ],
  },
  'def': {
    name: 'def',
    category: 'Special expression',
    linkName: 'def',
    returns: {
      type: 'any',
    },
    args: {
      n: {
        type: '*name',
      },
      value: {
        type: '*expression',
      },
    },
    variants: [
      { argumentNames: ['n', 'value'] },
    ],
    description: `Bind $value to variable $n.

If $n is already defined, an error is thrown.`,
    examples: [
      '(def a (object))',
      '(def a (object :x 10 :y true :z "A string"))',
    ],
  },
  'defs': {
    name: 'defs',
    category: 'Special expression',
    linkName: 'defs',
    clojureDocs: null,
    returns: {
      type: 'any',
    },
    args: {
      name: {
        type: '*expression',
      },
      value: {
        type: '*expression',
      },
    },
    variants: [
      { argumentNames: ['name', 'value'] },
    ],
    description: `
Creates a variable with name set to $name evaluated and value set to $value.

If a variable with name $name is already defined, an error is thrown.`,
    examples: [
      '(defs :a :b)',
      `
(defs (str :a :1) (object :x 10 :y true :z "A string"))
a1`,
      `
(defs :a :b)
(defs a :c)
b`,
    ],
  },
  'let': {
    name: 'let',
    category: 'Special expression',
    linkName: 'let',
    returns: {
      type: 'any',
    },
    args: {
      bindings: {
        type: '*binding',
        rest: true,
      },
      expressions: {
        type: '*expression',
        rest: true,
      },
    },
    variants: [
      { argumentNames: ['bindings', 'expressions'] },
    ],
    description: `
Binds local variables. The variables lives only within $expressions.
It returns evaluation of the last expression in $expressions.`,
    examples: [`
  (let [a (+ 1 2 3 4) 
        b (* 1 2 3 4)]
    (write! a b))`],
  },
  'if-let': {
    name: 'if-let',
    category: 'Special expression',
    linkName: 'if-let',
    returns: {
      type: 'any',
    },
    args: {
      'binding': {
        type: '*binding',
      },
      'if-expr': {
        type: '*expression',
      },
      'else-expr': {
        type: '*expression',
      },
    },
    variants: [
      { argumentNames: ['binding', 'if-expr'] },
      { argumentNames: ['binding', 'if-expr', 'else-expr'] },
    ],
    description: `
Binds one local variable. If it evaluates to a truthy value
$if-expr is executed with the variable accessable.
If the bound variable evaluates to false, the $else-expr is evaluated
(without variable accessable).`,
    examples: [
      `
(if-let [a (> (count "Albert") 4)]
  (write! (str a "is big enough"))
  (write! "Sorry, not big enough."))`,
      `
(if-let [a (> (count "Albert") 10)]
  (write! (str a "is big enough"))
  (write! "Sorry, not big enough."))`,
    ],
  },
  'when-let': {
    name: 'when-let',
    category: 'Special expression',
    linkName: 'when-let',
    returns: {
      type: 'any',
    },
    args: {
      binding: {
        type: '*binding',
      },
      expressions: {
        type: '*expression',
        rest: true,
      },
    },
    variants: [
      { argumentNames: ['binding', 'expressions'] },
    ],
    description: `
Binds one local variable. If it evaluates to a truthy value
$expressions is executed with the variable accessable.
If the bound variable evaluates to a falsy value, \`nil\` is returned.`,
    examples: [
      `
(when-let [a (> (count "Albert") 4)]
  (write! a))`,
    ],
  },
  'when-first': {
    name: 'when-first',
    category: 'Special expression',
    linkName: 'when-first',
    returns: {
      type: 'any',
    },
    args: {
      binding: {
        type: '*binding',
        rest: true,
      },
      expressions: {
        type: '*expression',
        rest: true,
      },
    },
    variants: [
      { argumentNames: ['binding', 'expressions'] },
    ],
    description: 'When the binding value in $binding is truthy, first element of that sequence (instead of the sequence itself) is bound to the variable.',
    examples: [
      '(when-first [x [1 2 3]] (write! 10) (write! 20) x)',
      '(when-first [x "Albert"] x)',
      '(when-first [x ""] x)',
      '(when-first [x []] x)',
    ],
  },
}
//   'fn': {
//     name: 'fn',
//     category: 'Special expression',
//     linkName: 'fn',
//     returns: {
//       type: 'function',
//     },
//     args: {
//       {
//         type: '*arguments',
//       },
//       {
//         type: '*expressions',
//       },
//     },
//     description: 'Creates a function. When called, evaluation of the last expression in the body is returned.',
//     examples: ['(fn [a b] (sqrt (+ (* a a) (* b b))))', '((fn [a b] (sqrt (+ (* a a) (* b b)))) 3 4)'],
//   },
//   'defn': {
//     name: 'defn',
//     category: 'Special expression',
//     linkName: 'defn',
//     returns: {
//       type: 'function',
//     },
//     args: {
//       {
//         type: '*name',
//       },
//       {
//         type: '*arguments',
//       },
//       {
//         type: '*expressions',
//       },
//     },
//     description: 'Creates a named global function. When called, evaluation of the last expression in the body is returned.',
//     examples: [
//       '(defn hyp [a b] (sqrt (+ (* a a) (* b b)))) hyp',
//       '(defn hyp [a b] (sqrt (+ (* a a) (* b b)))) (hyp 3 4)',
//       '(defn sumOfSquares [& s] (apply + (map (fn [x] (* x x)) s))) (sumOfSquares 1 2 3 4 5)',
//     ],
//   },
// }
// }, 'defns': {
//   name: 'defns',
//   category: 'Special expression',
//   linkName: 'defns',
//   clojureDocs: null,
//   returns: {
//     type: 'function',
//   },
//   args: {
//     {
//       type: '*expression',
//     },
//     {
//       type: '*arguments',
//     },
//     {
//       type: '*expressions',
//     },
//   ],
//   description: 'Creates a named global function with its name set to `name` evaluated. When called, evaluation of the last expression in the body is returned.',
//   examples: [
//     '(defns "hyp" [a b] (sqrt (+ (* a a) (* b b)))) hyp',
//     '(defns (str :h :y :p) [a b] (sqrt (+ (* a a) (* b b)))) (hyp 3 4)',
//     '(defns "sumOfSquares" [& s] (apply + (map (fn [x] (* x x)) s))) (sumOfSquares 1 2 3 4 5)',
//   ],
// }, 'try': {
//   name: 'try',
//   category: 'Special expression',
//   linkName: 'try',
//   clojureDocs: null,
//   returns: {
//     type: 'any',
//   },
//   args: {
//     {
//       type: '*expression',
//     },
//     {
//       type: '*catch',
//     },
//   ],
//   description: 'Executes tryExpression. If that throws, the catchBlock gets executed. See examples for details.',
//   examples: [
//     '(try (/ 2 4) (catch error (/ 2 1)))',
//     '(try (/ 2 0) (catch error (/ 2 1)))',
//     '(try (/ 2 0) (catch error error))',
//   ],
// }, 'throw': {
//   name: 'throw',
//   category: 'Special expression',
//   linkName: 'throw',
//   clojureDocs: null,
//   returns: {
//     type: '*never',
//   },
//   args: {
//     {
//       type: '*expression',
//     },
//   ],
//   description: 'Throws `UserDefinedError` with message set to `message` evaluated. `message` must evaluate to a `string`.',
//   examples: [
//     '(throw "You shall not pass!")',
//     '(throw (subs "You shall not pass!" 0 3))',
//     '(throw "You shall not pass!")',
//   ],
// }, 'if': {
//   name: 'if',
//   category: 'Special expression',
//   linkName: 'if',
//   returns: {
//     type: 'any',
//   },
//   args: {
//     {
//       type: 'any',
//     },
//     {
//       type: 'any',
//     },
//     {
//       type: 'any',
//     },
//   ],
//   description: 'Either `then` or `else` branch is taken. Then branch is selected when `test` result is truthy. I test is falsy and no `else` branch exists, `nil` is returned.',
//   examples: [
//     '(if true (write! "TRUE") (write! "FALSE"))',
//     '(if false (write! "TRUE") (write! "FALSE"))',
//     '(if true (write! "TRUE"))',
//     '(if false (write! "TRUE"))',
//   ],
// }, 'if-not': {
//   name: 'if-not',
//   category: 'Special expression',
//   linkName: 'if-not',
//   returns: {
//     type: 'any',
//   },
//   args: {
//     {
//       type: 'any',
//     },
//     {
//       type: 'any',
//     },
//     {
//       type: 'any',
//     },
//   ],
//   description: 'Either `then` or `else` branch is taken. Then branch is selected when `test` result is falsy. I test is falsy and no `else` branch exists, `nil` is returned.',
//   examples: [
//     '(if-not true (write! "TRUE") (write! "FALSE"))',
//     '(if-not false (write! "TRUE") (write! "FALSE"))',
//     '(if-not true (write! "TRUE"))',
//     '(if-not false (write! "TRUE"))',
//   ],
// }, 'cond': {
//   name: 'cond',
//   category: 'Special expression',
//   linkName: 'cond',
//   returns: {
//     type: 'any',
//   },
//   args: {
//     {
//       type: '*cond-cases',
//     },
//   ],
//   description: 'Used for branching. Variants are tested sequentially from the top. If no branch is tested truthy, `nil` is returned.',
//   examples: [
//     '(cond false (write! "FALSE") nil (write! "nil") true (write! "TRUE"))',
//     '(cond false (write! "FALSE") nil (write! "nil"))',
//   ],
// }, 'when': {
//   name: 'when',
//   category: 'Special expression',
//   linkName: 'when',
//   returns: {
//     type: 'any',
//   },
//   args: {
//     {
//       type: '*expression',
//     },
//     {
//       type: '*expression',
//     },
//   ],
//   description: 'If `test` yields a thruthy value, the expressions are evaluated in order from left to right and the value returned by the last `expression` is returned. Otherwise, if `test` yields a falsy value, the expressions are not evaluated, and `nil` is returned. If no `expression` is provided, `nil` is returned.',
//   examples: [
//     '(when true (write! "Hi") (write! "There"))',
//     '(when false (write! "Hi") (write! "There"))',
//     '(when true)',
//     '(when false)',
//   ],
// }, 'when-not': {
//   name: 'when-not',
//   category: 'Special expression',
//   linkName: 'when-not',
//   returns: {
//     type: 'any',
//   },
//   args: {
//     {
//       type: '*expression',
//     },
//     {
//       type: '*expression',
//     },
//   ],
//   description: 'If `test` yields a falsy value, the expressions are evaluated in order from left to right and the value returned by the last `expression` is returned. Otherwise, if `test` yields a truthy value, the expressions are not evaluated, and `nil` is returned. If no `expression` is provided, `nil` is returned.',
//   examples: [
//     '(when-not true (write! "Hi") (write! "There"))',
//     '(when-not false (write! "Hi") (write! "There"))',
//     '(when-not true)',
//     '(when-not false)',
//   ],
// }, 'comment': {
//   name: 'comment',
//   category: 'Special expression',
//   linkName: 'comment',
//   returns: {
//     type: 'nil',
//   },
//   args: {
//     {
//       type: '*expressions',
//     },
//   ],
//   description: 'All `expressions` within `comment` are read and must be valid `lits` but they are not eveluated. `nil` is returned.',
//   examples: ['(comment (write! "Hi") (write! "Albert"))', '(comment)'],
// }, 'do': {
//   name: 'do',
//   category: 'Special expression',
//   linkName: 'do',
//   returns: {
//     type: 'any',
//   },
//   args: {
//     {
//       type: '*expressions',
//     },
//   ],
//   description: 'Calls `expressions` in the order they have been written. Resulting value is the value of the last expression.',
//   examples: ['(do (write! "Hi") (write! "Albert"))', '(do)'],
// }, 'recur': {
//   name: 'recur',
//   category: 'Special expression',
//   linkName: 'recur',
//   returns: {
//     type: 'nil',
//   },
//   args: {
//     {
//       type: '*expressions',
//     },
//   ],
//   description: 'Recursevly calls enclosing function or loop with its evaluated `expressions`.',
//   examples: [
//     '(defn foo [n] (write! n) (when (not (zero? n)) (recur (dec n)))) (foo 3)',
//     '((fn [n] (write! n) (when (not (zero? n)) (recur (dec n)))) 3)',
//     '(loop [n 3] (write! n) (when (not (zero? n)) (recur (dec n))))',
//   ],
// }, 'loop': {
//   name: 'loop',
//   category: 'Special expression',
//   linkName: 'loop',
//   returns: {
//     type: 'any',
//   },
//   args: {
//     {
//       type: '*bindings',
//     },
//     {
//       type: '*expressions',
//     },
//   ],
//   description: 'Executes body with initial `bindings`. The `bindings` will be replaced with the recur parameters for subsequent recursions.',
//   examples: [
//     '(loop [n 3] (write! n) (when (not (zero? n)) (recur (dec n))))',
//     '(loop [n 3] (write! n) (if (not (zero? n)) (recur (dec n)) n))',
//   ],
// }, 'time!': {
//   name: 'time!',
//   category: 'Special expression',
//   linkName: 'time_exclamation',
//   clojureDocs: 'time',
//   returns: {
//     type: 'any',
//   },
//   args: {
//     {
//       type: 'any',
//     },
//   ],
//   description: 'Prints the time it took to evaluate `expression`. Returns `expression` evaluated.',
//   examples: ['(defn fib [x] (if (<= x 2) 1 (+ (fib (dec x)) (fib (- x 2))))) (time! (fib 10))'],
// }, 'doseq': {
//   name: 'doseq',
//   category: 'Special expression',
//   linkName: 'doseq',
//   returns: {
//     type: 'nil',
//   },
//   args: {
//     {
//       type: '*bindings',
//     },
//     {
//       type: '*expression',
//     },
//   ],
//   description: 'Same syntax as `for`, but returns `nil`. Use for side effects. Consumes less memory than `for`.',
//   examples: ['(doseq [x [1 2 4]] (write! x))'],
// }, 'for': {
//   name: 'for',
//   category: 'Special expression',
//   linkName: 'for',
//   returns: {
//     type: 'any',
//     array: true,
//   },
//   args: {
//     {
//       type: '*bindings',
//     },
//     {
//       type: '*expression',
//     },
//   ],
//   description: 'List comprehension. Takes an array of one or more `bindings`, each followed by zero or more modifiers, and returns an array of evaluations of `expression`. Collections are iterated in a nested fashion, rightmost fastest. Supported modifiers are: &let &while and &when.',
//   examples: [
//     '(for [x "Al" y [1 2]] (repeat y x))',
//     '(for [x {:a 10 :b 20} y [1 2]] (repeat y x))',
//     '(for [x [1 2] y [1 10]] (* x y))',
//     '(for [x [1 2] &let [z (* x x x)]] z)',
//     '(for [x [0 1 2 3 4 5] &let [y (* x 3)] &when (even? y)] y)',
//     '(for [x [0 1 2 3 4 5] &let [y (* x 3)] &while (even? y)] y)',
//     '(for [x [0 1 2 3 4 5] &let [y (* x 3)] &while (odd? y)] y)',
//     '(for [x [1 2 3] y [1 2 3] &while (<= x y) z [1 2 3]] [x y z])',
//     '(for [x [1 2 3] y [1 2 3] z [1 2 3] &while (<= x y)] [x y z])',
//   ],
// }, 'declared?': {
//   name: 'declared?',
//   category: 'Special expression',
//   linkName: 'declared_question',
//   returns: {
//     type: 'boolean',
//   },
//   args: {
//     {
//       type: 'string',
//     },
//   ],
//   description: 'Returns `true` if name is a declared variable or a builtin function.',
//   examples: [
//     '(declared? foo)',
//     '(def foo :foo) (declared? foo)',
//     '(declared? +)',
//     '(def foo nil) (declared? foo)',
//     '(declared? if)',
//   ],
// }, '??': {
//   name: '??',
//   category: 'Special expression',
//   linkName: '_question_question',
//   returns: {
//     type: 'any',
//   },
//   args: {
//     {
//       type: 'any',
//     },
//     {
//       type: 'any',
//     },
//   ],
//   description: 'Sort of like `or` with a couple of differences.\n\n1. `test` does not need to be declared (defaults to `nil`)\n2. Accept exactly one or two parameters.',
//   examples: [
//     '(?? foo)',
//     '(def foo :foo) (?? foo)',
//     '(?? +)',
//     '(def foo nil) (?? foo)',
//     '(?? foo 1)',
//     '(?? "")',
//     '(?? 0)',
//     '(?? 0 1)',
//     '(?? 2 1)',
//   ],
// } }
