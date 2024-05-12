import type { Reference } from '../index.ts'

export const bitwiseReference: Record<string, Reference<'Bitwise'>> = { 'bit-shift-left': {
  name: 'bit-shift-left',
  category: 'Bitwise',
  linkName: 'bit-shift-left',
  returns: {
    type: 'integer',
  },
  args: {
    x: {
      type: 'integer',
    },
    n: {
      type: 'integer',
    },
  },
  variants: [
    { argumentNames: ['x', 'n'] },
  ],
  description: 'Shifts $x arithmetically left by $n bit positions.',
  examples: ['(bit-shift-left 1 10)', '(bit-shift-left -4 2)'],
}, 'bit-shift-right': {
  name: 'bit-shift-right',
  category: 'Bitwise',
  linkName: 'bit-shift-right',
  returns: {
    type: 'integer',
  },
  args: {
    x: {
      type: 'integer',
    },
    n: {
      type: 'integer',
    },
  },
  variants: [
    { argumentNames: ['x', 'n'] },
  ],
  description: 'Shifts $x arithmetically right by $n bit positions.',
  examples: ['(bit-shift-right 2048 10)', '(bit-shift-right 4 10)'],
}, 'bit-not': {
  name: 'bit-not',
  category: 'Bitwise',
  linkName: 'bit-not',
  returns: {
    type: 'integer',
  },
  args: {
    x: {
      type: 'integer',
    },
  },
  variants: [
    { argumentNames: ['x'] },
  ],
  description: 'Returns bitwise `not` of $x.',
  examples: ['(bit-not 0)', '(bit-not 255)'],
}, 'bit-and': {
  name: 'bit-and',
  category: 'Bitwise',
  linkName: 'bit-and',
  returns: {
    type: 'integer',
  },
  args: {
    x: {
      type: 'integer',
    },
    y: {
      type: 'integer',
    },
    rest: {
      type: 'integer',
      rest: true,
    },
  },
  variants: [
    { argumentNames: ['x', 'y'] },
    { argumentNames: ['x', 'y', 'rest'] },
  ],
  description: 'Returns bitwise `and` of all arguments.',
  examples: [
    '(bit-and 0b0011 0b0110)',
    '(bit-and 0b0011 0b0110 0b1001)',
  ],
}, 'bit-and-not': {
  name: 'bit-and-not',
  category: 'Bitwise',
  linkName: 'bit-and-not',
  returns: {
    type: 'integer',
  },
  args: {
    x: {
      type: 'integer',
    },
    y: {
      type: 'integer',
    },
    rest: {
      type: 'integer',
      rest: true,
    },
  },
  variants: [
    { argumentNames: ['x', 'y'] },
    { argumentNames: ['x', 'y', 'rest'] },
  ],
  description: 'Returns bitwise `and` with complement.',
  examples: ['(bit-and-not 0b0011 0b0110)', '(bit-and-not 0b0011 0b0110 0b1001)'],
}, 'bit-or': {
  name: 'bit-or',
  category: 'Bitwise',
  linkName: 'bit-or',
  returns: {
    type: 'integer',
  },
  args: {
    x: {
      type: 'integer',
    },
    y: {
      type: 'integer',
    },
    rest: {
      type: 'integer',
      rest: true,
    },
  },
  variants: [
    { argumentNames: ['x', 'y'] },
    { argumentNames: ['x', 'y', 'rest'] },
  ],
  description: 'Returns bitwise `or` of all arguments.',
  examples: ['(bit-or 0b0011 0b0110)', '(bit-or 0b1000 0b0100 0b0010)'],
}, 'bit-xor': {
  name: 'bit-xor',
  category: 'Bitwise',
  linkName: 'bit-xor',
  returns: {
    type: 'integer',
  },
  args: {
    x: {
      type: 'integer',
    },
    y: {
      type: 'integer',
    },
    rest: {
      type: 'integer',
      rest: true,
    },
  },
  variants: [
    { argumentNames: ['x', 'y'] },
    { argumentNames: ['x', 'y', 'rest'] },
  ],
  description: 'Returns bitwise `xor` of all arguments.',
  examples: ['(bit-xor 0b0011 0b0110)', '(bit-xor 0b11110000 0b00111100 0b10101010)'],
}, 'bit-flip': {
  name: 'bit-flip',
  category: 'Bitwise',
  linkName: 'bit-flip',
  returns: {
    type: 'integer',
  },
  args: {
    x: {
      type: 'integer',
    },
    n: {
      type: 'integer',
    },
  },
  variants: [
    { argumentNames: ['x', 'n'] },
  ],
  description: 'Flips bit number $n.',
  examples: ['(bit-flip 0b0011 1)', '(bit-flip 0b1100 1)'],
}, 'bit-clear': {
  name: 'bit-clear',
  category: 'Bitwise',
  linkName: 'bit-clear',
  returns: {
    type: 'integer',
  },
  args: {
    x: {
      type: 'integer',
    },
    n: {
      type: 'integer',
    },
  },
  variants: [
    { argumentNames: ['x', 'n'] },
  ],
  description: 'Clears bit number $n.',
  examples: ['(bit-clear 0b0011 1)', '(bit-clear 0b1100 1)'],
}, 'bit-set': {
  name: 'bit-set',
  category: 'Bitwise',
  linkName: 'bit-set',
  returns: {
    type: 'integer',
  },
  args: {
    x: {
      type: 'integer',
    },
    n: {
      type: 'integer',
    },
  },
  variants: [
    { argumentNames: ['x', 'n'] },
  ],
  description: 'Sets bit number $n.',
  examples: ['(bit-set 0b0011 1)', '(bit-set 0b1100 1)'],
}, 'bit-test': {
  name: 'bit-test',
  category: 'Bitwise',
  linkName: 'bit-test',
  returns: {
    type: 'boolean',
  },
  args: {
    x: {
      type: 'integer',
    },
    n: {
      type: 'integer',
    },
  },
  variants: [
    { argumentNames: ['x', 'n'] },
  ],
  description: 'Checks if bit number $n is set.',
  examples: ['(bit-test 0b0011 1)', '(bit-test 0b1100 1)'],
} }
