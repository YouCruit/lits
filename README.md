A lisp implementation in Typescript. Could be used in browser, node.js or as a CLI.

# REPL
## Documentation
[mojir.github.io/lispish](https://mojir.github.io/lispish)
## Install
```
npm i -g lispish
```
## Repl usage
Start the lispish REPL in a terminal by enter `lispish`
* Tab completion
* History stored on file
```
$ lispish
Type "`help" for more information.
LISPISH> (+ 7 4)
11
LISPISH> (let ((day (* 24 60 60 1000))) (* 7 day)) ; Ever wondered how many milliseconds there are in a week?
604800000
```
```
$ lispish --help
Usage: lispish [options]

Options:
  -g ...                          Global variables as a JSON string
  -G ...                          Global variables file (.json file)
  -f ...                          .lispish file
  -e ...                          Lispish expression
  -h, --help                      Show this help
  -h, --help <builtin function>   Show help for <builtin function>
  -v, --version                   Print lispish version
```
```
$ lispish -e "(/ 81 9)"
9
```

# API
## Install api

```
npm i lispish
```

## How to use?

```ts
import { Lispish } from 'lispish'

const lispish = new Lispish()
lispish.run('(+ 1 2 3 4)'); // returns 10
```

# Builtin Functions
## Special functions
* and
* cond
* def
* defn
* defns
* defs
* do
* fn
* for
* if
* if-let
* if-not
* let
* loop
* or
* recur
* throw
* time!
* try
* when
* when-first
* when-let
* when-not
## Normal functions
### Predicate
* array?
* boolean?
* coll?
* even?
* false?
* finite?
* function?
* integer?
* nan?
* neg?
* negative-infinity?
* nil?
* number?
* object?
* odd?
* pos?
* positive-infinity?
* regexp?
* seq?
* string?
* true?
* zero?
### Sequence
* cons
* distinct
* drop
* drop-last
* drop-while
* filter
* first
* frequencies
* group-by
* index-of
* join
* last
* map
* next
* nth
* nthnext
* nthrest
* partition
* partition-all
* partition-by
* pop
* position
* push
* rand-nth!
* random-sample!
* reduce
* reduce-right
* remove
* rest
* reverse
* second
* shift
* shuffle
* slice
* some
* sort
* sort-by
* split-at
* split-with
* take
* take-last
* take-while
* unshift
### Collection
* any?
* assoc
* assoc-in
* concat
* contains?
* count
* empty?
* every?
* get
* get-in
* has?
* not-any?
* not-every?
* update
* update-in
* Array
* array
* flatten
* mapcat
* range
* repeat
### Object
* dissoc
* entries
* find
* keys
* merge
* merge-with
* object
* select-keys
* vals
* zipmap
### String
* from-char-code
* lower-case
* number
* number-to-string
* pad-left
* pad-right
* split
* str
* string-repeat
* subs
* template
* to-char-code
* trim
* trim-left
* trim-right
* upper-case
### Math
* &ast;
* &plus;
* &minus;
* /
* abs
* acos
* acosh
* asin
* asinh
* atan
* atanh
* cbrt
* ceil
* cos
* cosh
* dec
* e
* epsilon
* exp
* floor
* inc
* log
* log10
* log2
* max
* max-safe-integer
* max-value
* min
* min-safe-integer
* min-value
* mod
* nan
* negative-infinity
* pi
* positive-infinity
* pow
* quot
* rand!
* rand-int!
* rem
* round
* sign
* sin
* sinh
* sqrt
* tan
* tanh
* trunc
### Functional
* apply
* comp
* complement
* constantly
* every-pred
* fnil
* identity
* juxt
* partial
* some-pred
### Regular expression
* match
* regexp
* replace
### Bitwise
* bit-and
* bit-and-not
* bit-clear
* bit-flip
* bit-not
* bit-or
* bit-set
* bit-shift-left
* bit-shift-right
* bit-test
* bit-xor
### Misc
* <
* <=
* =
* &gt;
* &gt;=
* assert
* boolean
* compare
* debug!
* equal?
* get-path
* inst-ms
* lispish-version
* not
* not=
* write!