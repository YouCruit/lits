import { isUnknownRecord } from '../src/typeGuards'
import { collectionReference } from './categories/collection'
import { functionalReference } from './categories/functional'
import { arrayReference } from './categories/array'
// import { sequenceReference } from './categories/sequence'
import { mathReference } from './categories/math'
// import { miscReference } from './categories/misc'
import { assertReference } from './categories/assert'
// import { objectReference } from './categories/object'
// import { predicateReference } from './categories/predicate'
// import { regularExpressionReference } from './categories/regularExpression'
import { specialExpressionsReference } from './categories/specialExpressions'
// import { stringReference } from './categories/string'
import { bitwiseReference } from './categories/bitwise'

export { } from './examples'
export type Category = 'Collection' | 'Array' | 'Sequence' | 'Math' | 'Functional' | 'Misc' | 'Object' | 'Predicate' | 'Regular expression' | 'Special expression' | 'String' | 'Bitwise' | 'Assert'

type DataType = 'number' | 'string' | 'object' | 'array' | 'boolean' | 'function' | 'integer' | 'any' | 'nil' | 'collection' | 'sequence' | 'regexp' | 'never'

export interface TypedValue {
  type: DataType[] | DataType
  rest?: true
  array?: true
}

type NormalExpressionArgument = TypedValue & {
  description?: string
}
interface SpecialExpressionArgument {
  type: '*expression' | '*name' | '*binding' | '*arguments' | '*catch-expression' | '*conditions' | '*for-binding'
  rest?: true
  array?: true
  description?: string
}

export type Argument = NormalExpressionArgument | SpecialExpressionArgument

export function isSpecialExpressionArgument(arg?: Argument): arg is SpecialExpressionArgument {
  return isUnknownRecord(arg) && typeof arg.type === 'string' && arg.type.startsWith('*')
}

export function isNormalExpressionArgument(arg?: Argument): arg is NormalExpressionArgument {
  return isUnknownRecord(arg) && !isSpecialExpressionArgument(arg)
}

export function isTypedValue(arg?: Argument): arg is TypedValue {
  return isUnknownRecord(arg) && !isSpecialExpressionArgument(arg)
}

interface Variant {
  argumentNames: string[]
}

export interface Reference<T extends Category> {
  name: string
  category: T
  linkName: string
  clojureDocs?: string | null
  returns: TypedValue
  args: Record<string, Argument>
  variants: Variant[]
  description: string
  examples: string[]
}

export const functionReference: Record<string, Reference<Category>> = {
  ...collectionReference,
  ...arrayReference,
  // ...sequenceReference,
  ...mathReference,
  ...functionalReference,
  // ...miscReference,
  // ...objectReference,
  // ...predicateReference,
  // ...regularExpressionReference,
  ...specialExpressionsReference,
  // ...stringReference,
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
