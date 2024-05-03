import type { Reference } from '..'

export const regularExpressionReference: Record<string, Reference<`Regular expression`>> = { regexp: {
  name: `regexp`,
  category: `Regular expression`,
  linkName: `regexp`,
  clojureDocs: null,
  returns: {
    type: `regexp`,
  },
  arguments: [
    {
      type: `string`,
    },
    {
      type: `string`,
    },
  ],
  description: `Creates a RegExp from \`pattern\` and \`flags\`.`,
  examples: [`(regexp "^\\s*(.*)$")`, `#"^\\s*(.*)$"`, `(regexp "albert" :i)`, `#"albert"ig`],
}, match: {
  name: `match`,
  category: `Regular expression`,
  linkName: `match`,
  clojureDocs: null,
  returns: {
    type: `any`,
    array: true,
  },
  arguments: [
    {
      type: `regexp`,
    },
    {
      type: `string`,
    },
  ],
  description: `Matches \`string\` against \`pattern\`. If \`string\` is a string and matches the regular expression, a *match*-array is returned, otherwise \`nil\`.`,
  examples: [
      `(match (regexp "^\\s*(.*)$") "  A string")`,
      `(match #"albert"i "My name is Albert")`,
      `(match #"albert"i "My name is Ben")`,
      `(match #"albert"i nil)`,
      `(match #"albert"i 1)`,
      `(match #"albert"i {})`,
  ],
}, replace: {
  name: `replace`,
  category: `Regular expression`,
  linkName: `replace`,
  clojureDocs: null,
  returns: {
    type: `any`,
    array: true,
  },
  arguments: [
    {
      type: `string`,
    },
    {
      type: `regexp`,
    },
    {
      type: `string`,
    },
  ],
  description: `Returns a new string with some or all matches of \`pattern\` replaced by \`replacement\`.`,
  examples: [
      `(replace "Duck" (regexp :u) :i)`,
      `(replace "abcABC" (regexp :a "gi") "-")`,
      `(replace "abcABC" #"a"gi "-")`,
  ],
} }
