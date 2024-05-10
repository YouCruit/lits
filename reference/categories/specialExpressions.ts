// import type { Reference } from '..'

// export const specialExpressionsReference: Record<string, Reference<'Special expression'>> = { 'and': {
//   name: 'and',
//   category: 'Special expression',
//   linkName: 'and',
//   returns: {
//     type: 'boolean',
//   },
//   arguments: [
//     {
//       type: '*expressions',
//     },
//   ],
//   description: 'Computes logical \'and\' function. `expressions` evaluation starts from left. Value from the first form that decides result is returned so `expressions` at end of argument array may not evaluated.',
//   examples: [
//     '(and 1 1)',
//     '(and (> 3 2) "string")',
//     '(and (< 3 2) "string")',
//     '(and true true true true)',
//     '(and true true 0 true)',
//   ],
// }, 'or': {
//   name: 'or',
//   category: 'Special expression',
//   linkName: 'or',
//   returns: {
//     type: 'boolean',
//   },
//   arguments: [
//     {
//       type: '*expressions',
//     },
//   ],
//   description: 'Computes logical \'or\' function. `expressions` evaluation starts from left. Value from the first form that decides result is returned so forms at end of argument array may not evaluated.',
//   examples: [
//     '(or 1 1)',
//     '(or (> 3 2) "string")',
//     '(or (< 3 2) "string")',
//     '(or true true true true)',
//     '(or 1 2 3 4)',
//   ],
// }, 'def': {
//   name: 'def',
//   category: 'Special expression',
//   linkName: 'def',
//   returns: {
//     type: 'any',
//   },
//   arguments: [
//     {
//       type: '*name',
//     },
//     {
//       type: 'any',
//     },
//   ],
//   description: 'Bind `value` to `variable`. If `variable` isn\'t defined, a new global variable is created.',
//   examples: ['(def a (object))', '(def a (object :x 10 :y true :z "A string"))'],
// }, 'defs': {
//   name: 'defs',
//   category: 'Special expression',
//   linkName: 'defs',
//   clojureDocs: null,
//   returns: {
//     type: 'any',
//   },
//   arguments: [
//     {
//       type: '*expression',
//     },
//     {
//       type: 'any',
//     },
//   ],
//   description: 'Creates a variable with name set to `variable` evaluated and value set to `value`. If a variable with name `variable` isn\'t found a new global variable is created.',
//   examples: [
//     '(defs :a :b)',
//     '(defs (str :a :1) (object :x 10 :y true :z "A string")) a1',
//     '(defs :a :b) (defs a :c) b',
//   ],
// }, 'let': {
//   name: 'let',
//   category: 'Special expression',
//   linkName: 'let',
//   returns: {
//     type: 'any',
//   },
//   arguments: [
//     {
//       type: '*bindings',
//     },
//     {
//       type: '*expressions',
//     },
//   ],
//   description: 'Binds local variables. The variables lives only within the body. It returns evaluation of the last expression in the body.',
//   examples: ['(let [a (+ 1 2 3 4) b (* 1 2 3 4)] (write! a b))'],
// }, 'if-let': {
//   name: 'if-let',
//   category: 'Special expression',
//   linkName: 'if-let',
//   returns: {
//     type: 'any',
//   },
//   arguments: [
//     {
//       type: '*bindings',
//     },
//     {
//       type: 'any',
//     },
//     {
//       type: 'any',
//     },
//   ],
//   description: 'Binds one local variable. If it evaluates to a truthy value the then-form is executed with the variable accessable. If the bound variable evaluates to false, the then-form is evaluated (without variable accessable).',
//   examples: [
//     '(if-let [a (> (count "Albert") 4)] (write! (str a "is big enough")) (write! "Sorry, not big enough."))',
//     '(if-let [a (> (count "Albert") 10)] (write! (str a "is big enough")) (write! "Sorry, not big enough."))',
//   ],
// }, 'when-let': {
//   name: 'when-let',
//   category: 'Special expression',
//   linkName: 'when-let',
//   returns: {
//     type: 'any',
//   },
//   arguments: [
//     {
//       type: '*bindings',
//     },
//     {
//       type: 'any',
//     },
//   ],
//   description: 'Binds one local variable. If it evaluates to a truthy value the then-form is executed with the variable accessable. If the bound variable evaluates to false, `nil` is returned.',
//   examples: [
//     '(when-let [a (> (count "Albert") 4)] (write! (str a "is big enough")) (write! "Sorry, not big enough."))',
//     '(when-let [a (> (count "Albert") 10)] (write! (str a "is big enough")) (write! "Sorry, not big enough."))',
//   ],
// }, 'when-first': {
//   name: 'when-first',
//   category: 'Special expression',
//   linkName: 'when-first',
//   returns: {
//     type: 'any',
//   },
//   arguments: [
//     {
//       type: '*bindings',
//     },
//     {
//       type: 'any',
//     },
//   ],
//   description: 'Roughly the same as `(when (seq xs) (let [x (first xs)] body))`.',
//   examples: [
//     '(when-first [x [1 2 3]] (write! 10) (write! 20) x)',
//     '(when-first [x "Albert"] x)',
//     '(when-first [x ""] x)',
//     '(when-first [x []] x)',
//   ],
// }, 'fn': {
//   name: 'fn',
//   category: 'Special expression',
//   linkName: 'fn',
//   returns: {
//     type: 'function',
//   },
//   arguments: [
//     {
//       type: '*arguments',
//     },
//     {
//       type: '*expressions',
//     },
//   ],
//   description: 'Creates a function. When called, evaluation of the last expression in the body is returned.',
//   examples: ['(fn [a b] (sqrt (+ (* a a) (* b b))))', '((fn [a b] (sqrt (+ (* a a) (* b b)))) 3 4)'],
// }, 'defn': {
//   name: 'defn',
//   category: 'Special expression',
//   linkName: 'defn',
//   returns: {
//     type: 'function',
//   },
//   arguments: [
//     {
//       type: '*name',
//     },
//     {
//       type: '*arguments',
//     },
//     {
//       type: '*expressions',
//     },
//   ],
//   description: 'Creates a named global function. When called, evaluation of the last expression in the body is returned.',
//   examples: [
//     '(defn hyp [a b] (sqrt (+ (* a a) (* b b)))) hyp',
//     '(defn hyp [a b] (sqrt (+ (* a a) (* b b)))) (hyp 3 4)',
//     '(defn sumOfSquares [& s] (apply + (map (fn [x] (* x x)) s))) (sumOfSquares 1 2 3 4 5)',
//   ],
// }, 'defns': {
//   name: 'defns',
//   category: 'Special expression',
//   linkName: 'defns',
//   clojureDocs: null,
//   returns: {
//     type: 'function',
//   },
//   arguments: [
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
//   arguments: [
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
//   arguments: [
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
//   arguments: [
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
//   arguments: [
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
//   arguments: [
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
//   arguments: [
//     {
//       type: '*expression',
//     },
//     {
//       type: '*expression',
//     },
//   ],
//   description: 'If `test` yields a thruthy value, the forms are evaluated in order from left to right and the value returned by the last `form` is returned. Otherwise, if `test` yields a falsy value, the forms are not evaluated, and `nil` is returned. If no `form` is provided, `nil` is returned.',
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
//   arguments: [
//     {
//       type: '*expression',
//     },
//     {
//       type: '*expression',
//     },
//   ],
//   description: 'If `test` yields a falsy value, the forms are evaluated in order from left to right and the value returned by the last `form` is returned. Otherwise, if `test` yields a truthy value, the forms are not evaluated, and `nil` is returned. If no `form` is provided, `nil` is returned.',
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
//   arguments: [
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
//   arguments: [
//     {
//       type: '*expressions',
//     },
//   ],
//   description: 'Calls `expressions` in the order they have been written. Resulting value is the value of the last form.',
//   examples: ['(do (write! "Hi") (write! "Albert"))', '(do)'],
// }, 'recur': {
//   name: 'recur',
//   category: 'Special expression',
//   linkName: 'recur',
//   returns: {
//     type: 'nil',
//   },
//   arguments: [
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
//   arguments: [
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
//   arguments: [
//     {
//       type: 'any',
//     },
//   ],
//   description: 'Prints the time it took to evaluate `form`. Returns `form` evaluated.',
//   examples: ['(defn fib [x] (if (<= x 2) 1 (+ (fib (dec x)) (fib (- x 2))))) (time! (fib 10))'],
// }, 'doseq': {
//   name: 'doseq',
//   category: 'Special expression',
//   linkName: 'doseq',
//   returns: {
//     type: 'nil',
//   },
//   arguments: [
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
//   arguments: [
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
//   arguments: [
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
//   arguments: [
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
