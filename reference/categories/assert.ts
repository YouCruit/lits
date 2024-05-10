import type { Reference } from '..'

export const assertReference: Record<string, Reference<'Assert'>> = { 'assert': {
  name: 'assert',
  category: 'Assert',
  linkName: 'assert',
  returns: {
    type: 'any',
  },
  args: {
    value: {
      type: 'any',
    },
    message: {
      type: 'string',
    },
  },
  variants: [
    { argumentNames: ['value'] },
    { argumentNames: ['value', 'message'] },
  ],
  description: 'If $value is falsy it throws `AssertionError` with $message. If no $message is provided, message is set to $value.',
  examples: ['(try (assert 0 "Expected a positive value") (catch e e))'],
}, 'assert=': {
  name: 'assert=',
  category: 'Assert',
  linkName: 'assert_equal',
  clojureDocs: null,
  returns: {
    type: 'nil',
  },
  args: {
    a: {
      type: 'any',
    },
    b: {
      type: 'any',
    },
    message: {
      type: 'string',
    },
  },
  variants: [
    { argumentNames: ['a', 'b'] },
    { argumentNames: ['a', 'b', 'message'] },
  ],
  description: 'If $a is not the same as $b it throws `AssertionError`.',
  examples: [
    '(try (assert= 0 1 "Expected same values") (catch e e))',
    '(try (assert= 0 1) (catch e e))',
    '(try (assert= 1 1) (catch e e))',
  ],
}, 'assert-not=': {
  name: 'assert-not=',
  category: 'Assert',
  linkName: 'assert-not_equal',
  clojureDocs: null,
  returns: {
    type: 'nil',
  },
  args: {
    a: {
      type: 'any',
    },
    b: {
      type: 'any',
    },
    message: {
      type: 'string',
    },
  },
  variants: [
    { argumentNames: ['a', 'b'] },
    { argumentNames: ['a', 'b', 'message'] },
  ],
  description: 'If $a is the same as $b it throws `AssertionError`.',
  examples: [
    '(try (assert-not= 0 0 "Expected different values") (catch e e))',
    '(try (assert-not= 0 0) (catch e e))',
    '(try (assert-not= 0 1) (catch e e))',
  ],
}, 'assert-equal': {
  name: 'assert-equal',
  category: 'Assert',
  linkName: 'assert-equal',
  clojureDocs: null,
  returns: {
    type: 'nil',
  },
  args: {
    a: {
      type: 'any',
    },
    b: {
      type: 'any',
    },
    message: {
      type: 'string',
    },
  },
  variants: [
    { argumentNames: ['a', 'b'] },
    { argumentNames: ['a', 'b', 'message'] },
  ],
  description: 'If $a is not deep equal to $b it throws `AssertionError`.',
  examples: [
    '(try (assert-equal { :a 1 } { :a 2 } "Expected equal values") (catch e e))',
    '(try (assert-equal { :a 1 } { :a 2 }) (catch e e))',
    '(try (assert-equal { :a 1 } { :a 1 }) (catch e e))',
  ],
}, 'assert-not-equal': {
  name: 'assert-not-equal',
  category: 'Assert',
  linkName: 'assert-not-equal',
  clojureDocs: null,
  returns: {
    type: 'nil',
  },
  args: {
    a: {
      type: 'any',
    },
    b: {
      type: 'any',
    },
    message: {
      type: 'string',
    },
  },
  variants: [
    { argumentNames: ['a', 'b'] },
    { argumentNames: ['a', 'b', 'message'] },
  ],
  description: 'If $a is not deep equal to $b it throws `AssertionError`.',
  examples: [
    '(try (assert-not-equal { :a 2 } { :a 2 } "Expected different values") (catch e e))',
    '(try (assert-not-equal { :a 2 } { :a 2 }) (catch e e))',
    '(try (assert-not-equal { :a 1 } { :a 2 }) (catch e e))',
  ],
}, 'assert>': {
  name: 'assert>',
  category: 'Assert',
  linkName: 'assert_gt',
  clojureDocs: null,
  returns: {
    type: 'nil',
  },
  args: {
    a: {
      type: 'any',
    },
    b: {
      type: 'any',
    },
    message: {
      type: 'string',
    },
  },
  variants: [
    { argumentNames: ['a', 'b'] },
    { argumentNames: ['a', 'b', 'message'] },
  ],
  description: 'If $a is not greater than $b it throws `AssertionError`.',
  examples: [
    '(try (assert> 0 1 "Expected greater value") (catch e e))',
    '(try (assert> 0 0) (catch e e))',
    '(try (assert> 1 0) (catch e e))',
  ],
}, 'assert<': {
  name: 'assert<',
  category: 'Assert',
  linkName: 'assert_lt',
  clojureDocs: null,
  returns: {
    type: 'nil',
  },
  args: {
    a: {
      type: 'any',
    },
    b: {
      type: 'any',
    },
    message: {
      type: 'string',
    },
  },
  variants: [
    { argumentNames: ['a', 'b'] },
    { argumentNames: ['a', 'b', 'message'] },
  ],
  description: 'If $a is not less than $b it throws `AssertionError`.',
  examples: [
    '(try (assert< 1 0 "Expected smaller value value") (catch e e))',
    '(try (assert< 1 1) (catch e e))',
    '(try (assert< 0 1) (catch e e))',
  ],
}, 'assert>=': {
  name: 'assert>=',
  category: 'Assert',
  linkName: 'assert_gte',
  clojureDocs: null,
  returns: {
    type: 'nil',
  },
  args: {
    a: {
      type: 'any',
    },
    b: {
      type: 'any',
    },
    message: {
      type: 'string',
    },
  },
  variants: [
    { argumentNames: ['a', 'b'] },
    { argumentNames: ['a', 'b', 'message'] },
  ],
  description: 'If $a is less than $b it throws `AssertionError`.',
  examples: [
    '(try (assert>= 0 1 "Expected greater value") (catch e e))',
    '(try (assert>= 0 1) (catch e e))',
    '(try (assert>= 1 1) (catch e e))',
  ],
}, 'assert<=': {
  name: 'assert<=',
  category: 'Assert',
  linkName: 'assert_lte',
  clojureDocs: null,
  returns: {
    type: 'nil',
  },
  args: {
    a: {
      type: 'any',
    },
    b: {
      type: 'any',
    },
    message: {
      type: 'string',
    },
  },
  variants: [
    { argumentNames: ['a', 'b'] },
    { argumentNames: ['a', 'b', 'message'] },
  ],
  description: 'If $a is grater than $b it throws `AssertionError`.',
  examples: [
    '(try (assert<= 1 0 "Expected smaller value value") (catch e e))',
    '(try (assert<= 1 0) (catch e e))',
    '(try (assert<= 1 1) (catch e e))',
  ],
}, 'assert-true': {
  name: 'assert-true',
  category: 'Assert',
  linkName: 'assert-true',
  clojureDocs: null,
  returns: {
    type: 'nil',
  },
  args: {
    value: {
      type: 'any',
    },
    message: {
      type: 'string',
    },
  },
  variants: [
    { argumentNames: ['value'] },
    { argumentNames: ['value', 'message'] },
  ],
  description: 'If $value is not `true` it throws `AssertionError`.',
  examples: [
    '(try (assert-true false "Expected true") (catch e e))',
    '(try (assert-true false) (catch e e))',
    '(try (assert-true true) (catch e e))',
  ],
}, 'assert-false': {
  name: 'assert-false',
  category: 'Assert',
  linkName: 'assert-false',
  clojureDocs: null,
  returns: {
    type: 'nil',
  },
  args: {
    value: {
      type: 'any',
    },
    message: {
      type: 'string',
    },
  },
  variants: [
    { argumentNames: ['value'] },
    { argumentNames: ['value', 'message'] },
  ],
  description: 'If $value is not `false` it throws `AssertionError`.',
  examples: [
    '(try (assert-false true "Expected false") (catch e e))',
    '(try (assert-false true) (catch e e))',
    '(try (assert-false false) (catch e e))',
  ],
}, 'assert-truthy': {
  name: 'assert-truthy',
  category: 'Assert',
  linkName: 'assert-truthy',
  clojureDocs: null,
  returns: {
    type: 'nil',
  },
  args: {
    value: {
      type: 'any',
    },
    message: {
      type: 'string',
    },
  },
  variants: [
    { argumentNames: ['value'] },
    { argumentNames: ['value', 'message'] },
  ],
  description: 'If $value is not `truthy` it throws `AssertionError`.',
  examples: [
    '(try (assert-truthy false "Expected truthy") (catch e e))',
    '(try (assert-truthy false) (catch e e))',
    '(try (assert-truthy 0) (catch e e))',
    '(try (assert-truthy nil) (catch e e))',
    '(try (assert-truthy "") (catch e e))',
    '(assert-truthy true)',
    '(assert-truthy 1)',
    '(assert-truthy :x)',
    '(assert-truthy [])',
    '(assert-truthy {})',
  ],
}, 'assert-falsy': {
  name: 'assert-falsy',
  category: 'Assert',
  linkName: 'assert-falsy',
  clojureDocs: null,
  returns: {
    type: 'nil',
  },
  args: {
    value: {
      type: 'any',
    },
    message: {
      type: 'string',
    },
  },
  variants: [
    { argumentNames: ['value'] },
    { argumentNames: ['value', 'message'] },
  ],
  description: 'If $value is not `falsy` it throws `AssertionError`.',
  examples: [
    '(try (assert-falsy true "Expected falsy") (catch e e))',
    '(try (assert-falsy :x) (catch e e))',
    '(try (assert-falsy []) (catch e e))',
    '(try (assert-falsy {}) (catch e e))',
    '(try (assert-falsy 1) (catch e e))',
    '(assert-falsy false)',
    '(assert-falsy 0)',
    '(assert-falsy nil)',
    '(assert-falsy "")',
  ],
}, 'assert-nil': {
  name: 'assert-nil',
  category: 'Assert',
  linkName: 'assert-nil',
  clojureDocs: null,
  returns: {
    type: 'nil',
  },
  args: {
    value: {
      type: 'any',
    },
    message: {
      type: 'string',
    },
  },
  variants: [
    { argumentNames: ['value'] },
    { argumentNames: ['value', 'message'] },
  ],
  description: 'If $value is not `nil` it throws `AssertionError`.',
  examples: [
    '(assert-nil nil)',
    '(try (assert-nil true "Expected nil") (catch e e))',
    '(try (assert-nil :x) (catch e e))',
    '(try (assert-nil []) (catch e e))',
    '(try (assert-nil {}) (catch e e))',
    '(try (assert-nil 1) (catch e e))',
    '(try (assert-nil false) (catch e e))',
    '(try (assert-nil 0) (catch e e))',
    '(try (assert-nil "") (catch e e))',
  ],
}, 'assert-throws': {
  name: 'assert-throws',
  category: 'Assert',
  linkName: 'assert-throws',
  clojureDocs: null,
  returns: {
    type: 'nil',
  },
  args: {
    fn: {
      type: 'function',
    },
    message: {
      type: 'string',
    },
  },
  variants: [
    { argumentNames: ['fn'] },
    { argumentNames: ['fn', 'message'] },
  ],
  description: 'If $fn does not throw, it throws `AssertionError`.',
  examples: ['(assert-throws #(throw "Error"))', '(try (assert-throws #(identity "Error")) (catch e e))'],
}, 'assert-throws-error': {
  name: 'assert-throws-error',
  category: 'Assert',
  linkName: 'assert-throws-error',
  clojureDocs: null,
  returns: {
    type: 'nil',
  },
  args: {
    'fn': {
      type: 'function',
    },
    'error-message': {
      type: 'string',
    },
    'message': {
      type: 'string',
    },
  },
  variants: [
    { argumentNames: ['value', 'error-message'] },
    { argumentNames: ['value', 'error-message', 'message'] },
  ],
  description: 'If $fn does not throw $error-message, it throws `AssertionError`.',
  examples: [
    '(assert-throws-error #(throw :Error) :Error)',
    '(try (assert-throws-error #(throw "Something else") :Error "Hej alla barn") (catch e e))',
    '(try (assert-throws-error #(identity :Error) :Error) (catch e e))',
  ],
}, 'assert-not-throws': {
  name: 'assert-not-throws',
  category: 'Assert',
  linkName: 'assert-not-throws',
  clojureDocs: null,
  returns: {
    type: 'nil',
  },
  args: {
    fn: {
      type: 'function',
    },
    message: {
      type: 'string',
    },
  },
  variants: [
    { argumentNames: ['fn'] },
    { argumentNames: ['fn', 'message'] },
  ],
  description: 'If $fn throws, it throws `AssertionError`.',
  examples: ['(assert-not-throws #(identity "Error"))', '(try (assert-not-throws #(throw "Error")) (catch e e))'],
} }
