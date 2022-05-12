module.exports = {
  assert: {
    name: `assert`,
    category: `Assert`,
    linkName: `assert`,
    returns: {
      type: `any`,
    },
    arguments: [
      {
        name: `value`,
        type: `any`,
      },
      {
        name: `message`,
        type: `string`,
        description: `optional`,
      },
    ],
    description: `If \`value\` is falsy it throws AssertionError with \`message\`. If no \`message\` is provided, message is set to \`value\`.`,
    examples: [`(try (assert 0 "Expected a positive value") (catch e e))`],
  },
  'assert=': {
    name: `assert=`,
    category: `Assert`,
    linkName: `assert_equal`,
    clojureDocs: null,
    returns: {
      type: `nil`,
    },
    arguments: [
      {
        name: `first`,
        type: `any`,
      },
      {
        name: `second`,
        type: `any`,
      },
      {
        name: `message`,
        type: `string`,
        description: `optional`,
      },
    ],
    description: `If \`first\` is not the same as \`second\` it throws AssertionError.`,
    examples: [
      `(try (assert= 0 1 "Expected same values") (catch e e))`,
      `(try (assert= 0 1) (catch e e))`,
      `(try (assert= 1 1) (catch e e))`,
    ],
  },
  'assertNot=': {
    name: `assertNot=`,
    category: `Assert`,
    linkName: `assertNot_equal`,
    clojureDocs: null,
    returns: {
      type: `nil`,
    },
    arguments: [
      {
        name: `first`,
        type: `any`,
      },
      {
        name: `second`,
        type: `any`,
      },
      {
        name: `message`,
        type: `string`,
        description: `optional`,
      },
    ],
    description: `If \`first\` is the same as \`second\` it throws AssertionError.`,
    examples: [
      `(try (assertNot= 0 0 "Expected different values") (catch e e))`,
      `(try (assertNot= 0 0) (catch e e))`,
      `(try (assertNot= 0 1) (catch e e))`,
    ],
  },
  assertEqual: {
    name: `assertEqual`,
    category: `Assert`,
    linkName: `assertEqual`,
    clojureDocs: null,
    returns: {
      type: `nil`,
    },
    arguments: [
      {
        name: `first`,
        type: `any`,
      },
      {
        name: `second`,
        type: `any`,
      },
      {
        name: `message`,
        type: `string`,
        description: `optional`,
      },
    ],
    description: `If \`first\` is not deep equal to \`second\` it throws AssertionError.`,
    examples: [
      `(try (assertEqual { :a 1 } { :a 2 } "Expected equal values") (catch e e))`,
      `(try (assertEqual { :a 1 } { :a 2 }) (catch e e))`,
      `(try (assertEqual { :a 1 } { :a 1 }) (catch e e))`,
    ],
  },
  assertNotEqual: {
    name: `assertNotEqual`,
    category: `Assert`,
    linkName: `assertNotEqual`,
    clojureDocs: null,
    returns: {
      type: `nil`,
    },
    arguments: [
      {
        name: `first`,
        type: `any`,
      },
      {
        name: `second`,
        type: `any`,
      },
      {
        name: `message`,
        type: `string`,
        description: `optional`,
      },
    ],
    description: `If \`first\` is not deep equal to \`second\` it throws AssertionError.`,
    examples: [
      `(try (assertNotEqual { :a 2 } { :a 2 } "Expected different values") (catch e e))`,
      `(try (assertNotEqual { :a 2 } { :a 2 }) (catch e e))`,
      `(try (assertNotEqual { :a 1 } { :a 2 }) (catch e e))`,
    ],
  },
  'assert>': {
    name: `assert>`,
    category: `Assert`,
    linkName: `assert_gt`,
    clojureDocs: null,
    returns: {
      type: `nil`,
    },
    arguments: [
      {
        name: `first`,
        type: `any`,
      },
      {
        name: `second`,
        type: `any`,
      },
      {
        name: `message`,
        type: `string`,
        description: `optional`,
      },
    ],
    description: `If \`first\` is not greater than \`second\` it throws AssertionError.`,
    examples: [
      `(try (assert> 0 1 "Expected greater value") (catch e e))`,
      `(try (assert> 0 0) (catch e e))`,
      `(try (assert> 1 0) (catch e e))`,
    ],
  },
  'assert<': {
    name: `assert<`,
    category: `Assert`,
    linkName: `assert_lt`,
    clojureDocs: null,
    returns: {
      type: `nil`,
    },
    arguments: [
      {
        name: `first`,
        type: `any`,
      },
      {
        name: `second`,
        type: `any`,
      },
      {
        name: `message`,
        type: `string`,
        description: `optional`,
      },
    ],
    description: `If \`first\` is not less than \`second\` it throws AssertionError.`,
    examples: [
      `(try (assert< 1 0 "Expected smaller value value") (catch e e))`,
      `(try (assert< 1 1) (catch e e))`,
      `(try (assert< 0 1) (catch e e))`,
    ],
  },
  'assert>=': {
    name: `assert>=`,
    category: `Assert`,
    linkName: `assert_gte`,
    clojureDocs: null,
    returns: {
      type: `nil`,
    },
    arguments: [
      {
        name: `first`,
        type: `any`,
      },
      {
        name: `second`,
        type: `any`,
      },
      {
        name: `message`,
        type: `string`,
        description: `optional`,
      },
    ],
    description: `If \`first\` is less than \`second\` it throws AssertionError.`,
    examples: [
      `(try (assert>= 0 1 "Expected greater value") (catch e e))`,
      `(try (assert>= 0 1) (catch e e))`,
      `(try (assert>= 1 1) (catch e e))`,
    ],
  },
  'assert<=': {
    name: `assert<=`,
    category: `Assert`,
    linkName: `assert_lte`,
    clojureDocs: null,
    returns: {
      type: `nil`,
    },
    arguments: [
      {
        name: `first`,
        type: `any`,
      },
      {
        name: `second`,
        type: `any`,
      },
      {
        name: `message`,
        type: `string`,
        description: `optional`,
      },
    ],
    description: `If \`first\` is grater than \`second\` it throws AssertionError.`,
    examples: [
      `(try (assert<= 1 0 "Expected smaller value value") (catch e e))`,
      `(try (assert<= 1 0) (catch e e))`,
      `(try (assert<= 1 1) (catch e e))`,
    ],
  },
  assertTrue: {
    name: `assertTrue`,
    category: `Assert`,
    linkName: `assertTrue`,
    clojureDocs: null,
    returns: {
      type: `nil`,
    },
    arguments: [
      {
        name: `first`,
        type: `any`,
      },
      {
        name: `message`,
        type: `string`,
        description: `optional`,
      },
    ],
    description: `If \`first\` is not \`true\` it throws AssertionError.`,
    examples: [
      `(try (assertTrue false "Expected true") (catch e e))`,
      `(try (assertTrue false) (catch e e))`,
      `(try (assertTrue true) (catch e e))`,
    ],
  },
  assertFalse: {
    name: `assertFalse`,
    category: `Assert`,
    linkName: `assertFalse`,
    clojureDocs: null,
    returns: {
      type: `nil`,
    },
    arguments: [
      {
        name: `first`,
        type: `any`,
      },
      {
        name: `message`,
        type: `string`,
        description: `optional`,
      },
    ],
    description: `If \`first\` is not \`false\` it throws AssertionError.`,
    examples: [
      `(try (assertFalse true "Expected false") (catch e e))`,
      `(try (assertFalse true) (catch e e))`,
      `(try (assertFalse false) (catch e e))`,
    ],
  },
}
