import { collectionReference } from './categories/collection'
import { functionalReference } from './categories/functional'
import { arrayReference } from './categories/array'
import { sequenceReference } from './categories/sequence'
import { mathReference } from './categories/math'
import { miscReference } from './categories/misc'
import { assertReference } from './categories/assert'
import { objectReference } from './categories/object'
import { predicateReference } from './categories/predicate'
import { regularExpressionReference } from './categories/regularExpression'
import { specialExpressionsReference } from './categories/specialExpressions'
import { stringReference } from './categories/string'
import { bitwiseReference } from './categories/bitwise'

export type Category = 'Collection' | 'Array' | 'Sequence' | 'Math' | 'Functional' | 'Misc' | 'Object' | 'Predicate' | 'Regular expression' | 'Special expression' | 'String' | 'Bitwise' | 'Assert'

type DataType = 'number' | 'string' | 'object' | 'array' | 'boolean' | 'function' | 'integer' | 'any' | 'nil' | 'collection' | 'sequence' | 'regexp'
type Quantifier = 'optional' | 'oneOrMore' | 'zeroOrMore' | 'evenNumber'

type TypedValue = {
  type: DataType[] | DataType
  quantifier?: Quantifier
  array?: true
  description?: string
} | {
  type: '*expression' | '*expressions' | '*name' | '*bindings' | '*arguments' | '*catch' | '*never' | '*cond-cases'
  description?: string
}
export interface Reference<T extends Category> {
  name: string
  category: T
  linkName: string
  clojureDocs?: string | null
  returns: TypedValue
  arguments: TypedValue[]
  description: string
  examples: string[]
}

export const functionReference: Record<string, Reference<Category>> = {
  ...collectionReference,
  ...arrayReference,
  ...sequenceReference,
  ...mathReference,
  ...functionalReference,
  ...miscReference,
  ...objectReference,
  ...predicateReference,
  ...regularExpressionReference,
  ...specialExpressionsReference,
  ...stringReference,
  ...bitwiseReference,
  ...assertReference,
}

export const categories = [
  'Special expression',
  'Predicate',
  'Sequence',
  'Collection',
  'Array',
  'Object',
  'String',
  'Math',
  'Functional',
  'Regular expression',
  'Bitwise',
  'Misc',
  'Assert',
]

export const categorizedFunctions = Object.values(functionReference)
  .reduce((result: Category[], item) => {
    if (!result.includes(item.category))
      result.push(item.category)

    return result
  }, [])
  .sort((a, b) => categories.indexOf(a) - categories.indexOf(b))

module.exports = {
  functionReference,
  categorizedFunctions,
  categories,
}
