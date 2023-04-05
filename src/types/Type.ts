import { LitsError } from '../errors'
import { Any } from '../interface'
import { DebugInfo } from '../tokenizer/interface'
import { MAX_NUMBER, MIN_NUMBER } from '../utils'
import { any, array, litsFunction, object, regularExpression } from '../utils/assertion'
import { TypeName } from './litsTypeNames'

export function isType(value: unknown): value is Type {
  return value instanceof Type
}

export function assertType(value: unknown, debugInfo: DebugInfo | undefined): asserts value is Type {
  if (!(value instanceof Type)) {
    throw new LitsError(`Expected instance of Type, got ${value}`, debugInfo)
  }
}

export function asType(value: unknown, debugInfo: DebugInfo | undefined): Type {
  if (!(value instanceof Type)) {
    throw new LitsError(`Expected instance of Type, got ${value}`, debugInfo)
  }
  return value
}

export function isNotType(value: unknown): boolean {
  return !(value instanceof Type)
}

export type PrimitiveTypeName =
  | `nil`
  | `nan`
  | `true`
  | `false`
  | `positive-zero`
  | `negative-zero`
  | `positive-integer`
  | `negative-integer`
  | `positive-non-integer`
  | `negative-non-integer`
  | `positive-infinity`
  | `negative-infinity`
  | `empty-string`
  | `non-empty-string`
  | `empty-array`
  | `non-empty-array`
  | `empty-object`
  | `non-empty-object`
  | `regexp`
  | `function`

export const typeToBitRecord: Record<PrimitiveTypeName, number> = {
  nil: 1 << 0,
  nan: 1 << 1,
  true: 1 << 2,
  false: 1 << 3,

  'positive-zero': 1 << 4,
  'negative-zero': 1 << 5,
  'positive-integer': 1 << 6,
  'negative-integer': 1 << 7,

  'positive-non-integer': 1 << 8,
  'negative-non-integer': 1 << 9,
  'positive-infinity': 1 << 10,
  'negative-infinity': 1 << 11,

  'empty-string': 1 << 12,
  'non-empty-string': 1 << 13,
  'empty-array': 1 << 14,
  'non-empty-array': 1 << 15,

  'empty-object': 1 << 16,
  'non-empty-object': 1 << 17,
  regexp: 1 << 18,
  function: 1 << 19,
}

const allBitValues = Object.values(typeToBitRecord)

// All bits set to 1
const UNKNWON_BITS = allBitValues.reduce((result, bit) => result | bit, 0)

const FALSY_BITS =
  typeToBitRecord.nil |
  typeToBitRecord[`positive-zero`] |
  typeToBitRecord[`negative-zero`] |
  typeToBitRecord[`empty-string`] |
  typeToBitRecord.false |
  typeToBitRecord.nan

// All non falsy bits
const TRUTHY_BITS = UNKNWON_BITS & ~FALSY_BITS

// Used for stringify Type only
export const orderedTypeNames: TypeName[] = [
  `unknown`,
  `number`,
  `non-zero-number`,
  `float`,
  `non-zero-number`,
  `non-zero-float`,
  `non-positive-number`,
  `non-positive-float`,
  `non-negative-number`,
  `non-negative-float`,
  `positive-number`,
  `positive-float`,
  `negative-number`,
  `negative-float`,
  `integer`,
  `non-zero-integer`,
  `non-positive-integer`,
  `non-negative-integer`,
  `positive-integer`,
  `negative-integer`,
  `zero`,
  `positive-zero`,
  `negative-zero`,
  `infinity`,
  `positive-infinity`,
  `negative-infinity`,
  `nan`,
  `boolean`,
  `true`,
  `false`,
  `collection`,
  `empty-collection`,
  `non-empty-collection`,
  `sequence`,
  `empty-sequence`,
  `non-empty-sequence`,
  `array`,
  `empty-array`,
  `non-empty-array`,
  `object`,
  `empty-object`,
  `non-empty-object`,
  `string`,
  `non-empty-string`,
  `empty-string`,
  `regexp`,
  `function`,
  `nil`,
  `truthy`,
  `falsy`,
]

export const builtinTypesBitMasks: Record<TypeName, number> = {
  never: 0,

  nil: typeToBitRecord.nil,

  'empty-string': typeToBitRecord[`empty-string`],
  'non-empty-string': typeToBitRecord[`non-empty-string`],
  string: typeToBitRecord[`empty-string`] | typeToBitRecord[`non-empty-string`],

  // Numbers
  number:
    typeToBitRecord[`positive-zero`] |
    typeToBitRecord[`negative-zero`] |
    typeToBitRecord[`positive-non-integer`] |
    typeToBitRecord[`positive-integer`] |
    typeToBitRecord[`negative-non-integer`] |
    typeToBitRecord[`negative-integer`] |
    typeToBitRecord[`positive-infinity`] |
    typeToBitRecord[`negative-infinity`],

  float:
    typeToBitRecord[`positive-zero`] |
    typeToBitRecord[`negative-zero`] |
    typeToBitRecord[`positive-non-integer`] |
    typeToBitRecord[`positive-integer`] |
    typeToBitRecord[`negative-non-integer`] |
    typeToBitRecord[`negative-integer`],

  nan: typeToBitRecord.nan,
  'positive-infinity': typeToBitRecord[`positive-infinity`],
  'negative-infinity': typeToBitRecord[`negative-infinity`],

  infinity: typeToBitRecord[`negative-infinity`] | typeToBitRecord[`positive-infinity`],

  'positive-zero': typeToBitRecord[`positive-zero`],
  'negative-zero': typeToBitRecord[`negative-zero`],
  zero: typeToBitRecord[`positive-zero`] | typeToBitRecord[`negative-zero`],

  'non-zero-number':
    typeToBitRecord[`negative-non-integer`] |
    typeToBitRecord[`negative-integer`] |
    typeToBitRecord[`positive-non-integer`] |
    typeToBitRecord[`positive-integer`] |
    typeToBitRecord[`positive-infinity`] |
    typeToBitRecord[`negative-infinity`],

  'non-zero-float':
    typeToBitRecord[`negative-non-integer`] |
    typeToBitRecord[`negative-integer`] |
    typeToBitRecord[`positive-non-integer`] |
    typeToBitRecord[`positive-integer`],

  'positive-number':
    typeToBitRecord[`positive-non-integer`] |
    typeToBitRecord[`positive-integer`] |
    typeToBitRecord[`positive-infinity`],

  'negative-number':
    typeToBitRecord[`negative-non-integer`] |
    typeToBitRecord[`negative-integer`] |
    typeToBitRecord[`negative-infinity`],

  'non-positive-number':
    typeToBitRecord[`positive-zero`] |
    typeToBitRecord[`negative-zero`] |
    typeToBitRecord[`negative-non-integer`] |
    typeToBitRecord[`negative-integer`] |
    typeToBitRecord[`negative-infinity`],

  'non-negative-number':
    typeToBitRecord[`positive-zero`] |
    typeToBitRecord[`negative-zero`] |
    typeToBitRecord[`positive-non-integer`] |
    typeToBitRecord[`positive-integer`] |
    typeToBitRecord[`positive-infinity`],

  'positive-float': typeToBitRecord[`positive-non-integer`] | typeToBitRecord[`positive-integer`],
  'non-positive-float':
    typeToBitRecord[`positive-zero`] |
    typeToBitRecord[`negative-zero`] |
    typeToBitRecord[`negative-non-integer`] |
    typeToBitRecord[`negative-integer`],

  'negative-float': typeToBitRecord[`negative-non-integer`] | typeToBitRecord[`negative-integer`],
  'non-negative-float':
    typeToBitRecord[`positive-zero`] |
    typeToBitRecord[`negative-zero`] |
    typeToBitRecord[`positive-non-integer`] |
    typeToBitRecord[`positive-integer`],

  integer:
    typeToBitRecord[`positive-zero`] |
    typeToBitRecord[`negative-zero`] |
    typeToBitRecord[`positive-integer`] |
    typeToBitRecord[`negative-integer`],

  'non-zero-integer': typeToBitRecord[`negative-integer`] | typeToBitRecord[`positive-integer`],
  'positive-integer': typeToBitRecord[`positive-integer`],
  'negative-integer': typeToBitRecord[`negative-integer`],

  'non-positive-integer':
    typeToBitRecord[`positive-zero`] | typeToBitRecord[`negative-zero`] | typeToBitRecord[`negative-integer`],
  'non-negative-integer':
    typeToBitRecord[`positive-zero`] | typeToBitRecord[`negative-zero`] | typeToBitRecord[`positive-integer`],

  true: typeToBitRecord.true,
  false: typeToBitRecord.false,
  boolean: typeToBitRecord.true | typeToBitRecord.false,

  'empty-array': typeToBitRecord[`empty-array`],
  'non-empty-array': typeToBitRecord[`non-empty-array`],
  array: typeToBitRecord[`empty-array`] | typeToBitRecord[`non-empty-array`],

  'empty-object': typeToBitRecord[`empty-object`],
  'non-empty-object': typeToBitRecord[`non-empty-object`],
  object: typeToBitRecord[`empty-object`] | typeToBitRecord[`non-empty-object`],

  regexp: typeToBitRecord.regexp,

  function: typeToBitRecord.function,

  unknown: UNKNWON_BITS,

  truthy: TRUTHY_BITS,

  falsy: FALSY_BITS,

  'empty-collection':
    typeToBitRecord[`empty-string`] | typeToBitRecord[`empty-array`] | typeToBitRecord[`empty-object`],
  'non-empty-collection':
    typeToBitRecord[`non-empty-string`] | typeToBitRecord[`non-empty-array`] | typeToBitRecord[`non-empty-object`],
  collection:
    typeToBitRecord[`empty-string`] |
    typeToBitRecord[`non-empty-string`] |
    typeToBitRecord[`empty-array`] |
    typeToBitRecord[`non-empty-array`] |
    typeToBitRecord[`empty-object`] |
    typeToBitRecord[`non-empty-object`],

  'empty-sequence': typeToBitRecord[`empty-string`] | typeToBitRecord[`empty-array`],
  'non-empty-sequence': typeToBitRecord[`non-empty-string`] | typeToBitRecord[`non-empty-array`],
  sequence:
    typeToBitRecord[`empty-string`] |
    typeToBitRecord[`non-empty-string`] |
    typeToBitRecord[`empty-array`] |
    typeToBitRecord[`non-empty-array`],
}

function stringifyBitMask(bitMaks: number): string {
  let mask = ``

  for (let index = 19; index >= 0; index -= 1) {
    const bitValue = 1 << index
    const zeroOrOne = bitMaks & bitValue ? `1` : `0`
    const space = index !== 19 && (index + 1) % 4 === 0 ? ` ` : ``
    mask += `${space}${zeroOrOne}`
  }
  return mask
}

export class Type {
  public readonly bitmask: number

  private constructor(bitmask: number) {
    if (bitmask & typeToBitRecord[`positive-non-integer`]) {
      bitmask |= typeToBitRecord[`positive-integer`]
    }
    if (bitmask & typeToBitRecord[`negative-non-integer`]) {
      bitmask |= typeToBitRecord[`negative-integer`]
    }
    this.bitmask = bitmask
  }

  public static readonly never = new Type(builtinTypesBitMasks.never)

  public static readonly nil = new Type(builtinTypesBitMasks.nil)

  public static readonly nan = new Type(builtinTypesBitMasks.nan)
  public static readonly positiveInfinity = new Type(builtinTypesBitMasks[`positive-infinity`])
  public static readonly negativeInfinity = new Type(builtinTypesBitMasks[`negative-infinity`])
  public static readonly infinity = new Type(builtinTypesBitMasks[`infinity`])

  public static readonly emptyString = new Type(builtinTypesBitMasks[`empty-string`])
  public static readonly nonEmptyString = new Type(builtinTypesBitMasks[`non-empty-string`])
  public static readonly string = new Type(builtinTypesBitMasks.string)

  public static readonly number = new Type(builtinTypesBitMasks.number)
  public static readonly positiveZero = new Type(builtinTypesBitMasks[`positive-zero`])
  public static readonly negativeZero = new Type(builtinTypesBitMasks[`negative-zero`])
  public static readonly zero = new Type(builtinTypesBitMasks.zero)
  public static readonly nonZeroNumber = new Type(builtinTypesBitMasks[`non-zero-number`])
  public static readonly positiveNumber = new Type(builtinTypesBitMasks[`positive-number`])
  public static readonly negativeNumber = new Type(builtinTypesBitMasks[`negative-number`])
  public static readonly nonPositiveNumber = new Type(builtinTypesBitMasks[`non-positive-number`])
  public static readonly nonNegativeNumber = new Type(builtinTypesBitMasks[`non-negative-number`])
  public static readonly float = new Type(builtinTypesBitMasks.float)
  public static readonly integer = new Type(builtinTypesBitMasks.integer)
  public static readonly nonZeroFloat = new Type(builtinTypesBitMasks[`non-zero-float`])
  public static readonly positiveFloat = new Type(builtinTypesBitMasks[`positive-float`])
  public static readonly negativeFloat = new Type(builtinTypesBitMasks[`negative-float`])
  public static readonly nonPositiveFloat = new Type(builtinTypesBitMasks[`non-positive-float`])
  public static readonly nonNegativeFloat = new Type(builtinTypesBitMasks[`non-negative-float`])
  public static readonly nonZeroInteger = new Type(builtinTypesBitMasks[`non-zero-integer`])
  public static readonly positiveInteger = new Type(builtinTypesBitMasks[`positive-integer`])
  public static readonly negativeInteger = new Type(builtinTypesBitMasks[`negative-integer`])
  public static readonly nonPositiveInteger = new Type(builtinTypesBitMasks[`non-positive-integer`])
  public static readonly nonNegativeInteger = new Type(builtinTypesBitMasks[`non-negative-integer`])

  public static readonly true = new Type(builtinTypesBitMasks.true)
  public static readonly false = new Type(builtinTypesBitMasks.false)
  public static readonly boolean = new Type(builtinTypesBitMasks.boolean)

  public static readonly emptyArray = new Type(builtinTypesBitMasks[`empty-array`])
  public static readonly nonEmptyArray = new Type(builtinTypesBitMasks[`non-empty-array`])
  public static readonly array = new Type(builtinTypesBitMasks.array)

  public static readonly emptyObject = new Type(builtinTypesBitMasks[`empty-object`])
  public static readonly nonEmptyObject = new Type(builtinTypesBitMasks[`non-empty-object`])
  public static readonly object = new Type(builtinTypesBitMasks.object)

  public static readonly regexp = new Type(builtinTypesBitMasks.regexp)

  public static readonly emptyCollection = new Type(builtinTypesBitMasks[`empty-collection`])
  public static readonly nonEmptyCollection = new Type(builtinTypesBitMasks[`non-empty-collection`])
  public static readonly collection = new Type(builtinTypesBitMasks[`collection`])

  public static readonly emptySequence = new Type(builtinTypesBitMasks[`empty-sequence`])
  public static readonly nonEmptySequence = new Type(builtinTypesBitMasks[`non-empty-sequence`])
  public static readonly sequence = new Type(builtinTypesBitMasks.sequence)

  public static readonly truthy = new Type(builtinTypesBitMasks.truthy)
  public static readonly falsy = new Type(builtinTypesBitMasks.falsy)

  public static readonly unknown = new Type(builtinTypesBitMasks.unknown)

  public static readonly function = new Type(builtinTypesBitMasks.function)

  public static of(input: unknown): Type {
    any.assert(input)
    if (input instanceof Type) {
      return input
    }
    if (input === null) {
      return Type.nil
    } else if (input === true) {
      return Type.true
    } else if (input === false) {
      return Type.false
    } else if (Number.isNaN(input)) {
      return Type.nan
    } else if (input === Infinity) {
      return Type.positiveInfinity
    } else if (input === -Infinity) {
      return Type.negativeInfinity
    } else if (typeof input === `string`) {
      return input ? Type.nonEmptyString : Type[`emptyString`]
    } else if (typeof input === `number`) {
      return input === 0
        ? Object.is(input, -0)
          ? Type.negativeZero
          : Type.positiveZero
        : input > MAX_NUMBER
        ? Type.positiveInfinity
        : input < MIN_NUMBER
        ? Type.negativeInfinity
        : Number.isInteger(input)
        ? input > 0
          ? Type.positiveInteger
          : Type.negativeInteger
        : input > 0
        ? Type.positiveFloat
        : Type.negativeFloat
    } else if (array.is(input)) {
      return input.length === 0 ? Type.emptyArray : Type.nonEmptyArray
    } else if (object.is(input)) {
      return Object.keys(input).length === 0 ? Type.emptyObject : Type.nonEmptyObject
    } else if (regularExpression.is(input)) {
      return Type.regexp
    } else if (litsFunction.is(input)) {
      return Type.function
    }
    throw Error(`Unexpected error, could not figure out type of ${input}`)
  }

  public static or(...types: Type[]): Type {
    const newTypeMask = types.reduce((result, type) => {
      return result | type.bitmask
    }, 0)
    return new Type(newTypeMask)
  }

  public static and(...types: Type[]): Type {
    const newTypeMask = types.reduce((result, type) => {
      return result & type.bitmask
    }, UNKNWON_BITS)

    return new Type(newTypeMask)
  }

  public static exclude(first: Type, ...rest: Type[]): Type {
    return rest.reduce((result, type) => {
      const newBitmask = result.bitmask & ~type.bitmask
      return new Type(newBitmask)
    }, first)
  }

  public static is(a: Type, b: Type): boolean {
    const { bitmask: bitmaskA } = a
    const { bitmask: bitmaskB } = b

    // some bits must be the same AND no bits in a can appear in b
    return !!(bitmaskA & bitmaskB && !(bitmaskA & ~bitmaskB))
  }

  public static equals(type1: Type, type2: Type, ...rest: Type[]): boolean {
    return [type2, ...rest].every(t => {
      return type1.bitmask === t.bitmask
    })
  }

  public static intersects(a: Type, b: Type): boolean {
    return a.and(b).bitmask !== 0
  }

  public static isUnionType(dataType: Type): boolean {
    return !allBitValues.includes(dataType.bitmask)
  }

  public static toValue(dataType: Any): Any {
    if (isType(dataType)) {
      if (dataType.equals(Type.positiveZero)) {
        return 0
      }
      if (dataType.equals(Type.negativeZero)) {
        return -0
      }
      if (dataType.equals(Type.nan)) {
        return NaN
      }
      if (dataType.equals(Type.positiveInfinity)) {
        return Infinity
      }
      if (dataType.equals(Type.negativeInfinity)) {
        return -Infinity
      }
      if (dataType.equals(Type.emptyString)) {
        return ``
      }
      if (dataType.equals(Type.true)) {
        return true
      }
      if (dataType.equals(Type.false)) {
        return false
      }
      if (dataType.equals(Type.nil)) {
        return null
      }
      if (dataType.equals(Type.emptyArray)) {
        return []
      }
      if (dataType.equals(Type.emptyObject)) {
        return {}
      }
    }
    return dataType
  }

  public static toNumberValue(dataType: Type): Type | number {
    if (dataType.equals(Type.positiveZero)) {
      return 0
    }
    if (dataType.equals(Type.negativeZero)) {
      return -0
    }
    if (dataType.equals(Type.nan)) {
      return NaN
    }
    if (dataType.equals(Type.positiveInfinity)) {
      return Infinity
    }
    if (dataType.equals(Type.negativeInfinity)) {
      return -Infinity
    }
    return dataType
  }

  public static toSingelBits(dataType: Type): number[] {
    const result: number[] = []
    Object.values(typeToBitRecord).forEach(bitValue => {
      if (dataType.bitmask & bitValue) {
        result.push(bitValue)
      }
    })
    return result
  }

  public static split(dataType: Type): Type[] {
    return Type.toSingelBits(dataType).map(bits => new Type(bits))
  }

  public or(...dataTypes: Type[]): Type {
    return Type.or(this, ...dataTypes)
  }

  public and(...dataTypes: Type[]): Type {
    return Type.and(this, ...dataTypes)
  }

  public exclude(...dataTypes: Type[]): Type {
    return Type.exclude(this, ...dataTypes)
  }

  public is(dataType: Type): boolean {
    if (dataType.isNever()) {
      return this.isNever()
    }
    return Type.is(this, dataType)
  }

  public intersects(dataType: Type): boolean {
    return Type.intersects(this, dataType)
  }

  public intersectsNonNumber(): boolean {
    return !!(this.bitmask & ~builtinTypesBitMasks.number)
  }

  public assertIs(dataType: Type, debugInfo: DebugInfo | undefined): void {
    if (!this.is(dataType)) {
      throw new LitsError(`Expected to be of type ${dataType.toString()}, but was ${this.toString()}`, debugInfo)
    }
  }

  public assertEquals(dataType: Type, debugInfo: DebugInfo | undefined): void {
    if (!this.equals(dataType)) {
      throw new LitsError(`Expected to be ${dataType.toString()}, but was ${this.toString()}`, debugInfo)
    }
  }

  public assertIntersects(dataType: Type, debugInfo: DebugInfo | undefined): void {
    if (!this.intersects(dataType)) {
      throw new LitsError(`Expected to intersect ${dataType.toString()}, but was ${this.toString()}`, debugInfo)
    }
  }

  public equals(type: Type, ...rest: Type[]): boolean {
    return Type.equals(this, type, ...rest)
  }

  public isUnionType(): boolean {
    return Type.isUnionType(this)
  }

  public nilable(): Type {
    return this.or(Type.nil)
  }

  public isNever(): boolean {
    return this.bitmask === 0
  }

  public negateNumber() {
    let newBitmask = this.bitmask
    if (this.bitmask & typeToBitRecord[`positive-infinity`] && !(this.bitmask & typeToBitRecord[`negative-infinity`])) {
      newBitmask = (newBitmask | typeToBitRecord[`negative-infinity`]) & ~typeToBitRecord[`positive-infinity`]
    }
    if (this.bitmask & typeToBitRecord[`negative-infinity`] && !(this.bitmask & typeToBitRecord[`positive-infinity`])) {
      newBitmask = (newBitmask | typeToBitRecord[`positive-infinity`]) & ~typeToBitRecord[`negative-infinity`]
    }

    if (this.bitmask & typeToBitRecord[`negative-integer`] && !(this.bitmask & typeToBitRecord[`positive-integer`])) {
      newBitmask = (newBitmask | typeToBitRecord[`positive-integer`]) & ~typeToBitRecord[`negative-integer`]
    }
    if (
      this.bitmask & typeToBitRecord[`negative-non-integer`] &&
      !(this.bitmask & typeToBitRecord[`positive-non-integer`])
    ) {
      newBitmask = (newBitmask | typeToBitRecord[`positive-non-integer`]) & ~typeToBitRecord[`negative-non-integer`]
    }
    if (this.bitmask & typeToBitRecord[`positive-integer`] && !(this.bitmask & typeToBitRecord[`negative-integer`])) {
      newBitmask = (newBitmask | typeToBitRecord[`negative-integer`]) & ~typeToBitRecord[`positive-integer`]
    }
    if (
      this.bitmask & typeToBitRecord[`positive-non-integer`] &&
      !(this.bitmask & typeToBitRecord[`negative-non-integer`])
    ) {
      newBitmask = (newBitmask | typeToBitRecord[`negative-non-integer`]) & ~typeToBitRecord[`positive-non-integer`]
    }

    if (this.bitmask & typeToBitRecord[`positive-zero`] && !(this.bitmask & typeToBitRecord[`negative-zero`])) {
      newBitmask = (newBitmask | typeToBitRecord[`negative-zero`]) & ~typeToBitRecord[`positive-zero`]
    }
    if (this.bitmask & typeToBitRecord[`negative-zero`] && !(this.bitmask & typeToBitRecord[`positive-zero`])) {
      newBitmask = (newBitmask | typeToBitRecord[`positive-zero`]) & ~typeToBitRecord[`negative-zero`]
    }

    return new Type(newBitmask)
  }

  public isFunction(): boolean {
    return !!(this.bitmask & builtinTypesBitMasks.function)
  }

  public isUnknown(): boolean {
    return this.bitmask === UNKNWON_BITS
  }

  public isInteger(): boolean {
    return (
      this.intersects(Type.float) &&
      !(this.bitmask & (typeToBitRecord[`positive-non-integer`] | typeToBitRecord[`negative-non-integer`]))
    )
  }

  public toSingelBits(): number[] {
    return Type.toSingelBits(this)
  }

  public split(): Type[] {
    return Type.split(this)
  }

  public toValue(): Any {
    return Type.toValue(this)
  }

  public toNumberValue(): Type | number {
    return Type.toNumberValue(this)
  }

  public toString({ showDetails } = { showDetails: true }): string {
    const suffix = ` [Bitmask = ${stringifyBitMask(this.bitmask)}  (${this.bitmask})]`
    const typeString = this.getTypeString()
    return `${typeString}${showDetails ? suffix : ``}`
  }

  private getTypeString(): string {
    if (this.isNever()) {
      return `::never`
    }

    for (const typeName of orderedTypeNames) {
      const bitmask = builtinTypesBitMasks[typeName]
      if (this.bitmask === bitmask) {
        return `::${typeName}`
      }
    }

    const typeStrings: string[] = []
    let bits = this.bitmask

    for (const typeName of orderedTypeNames) {
      const bitmask = builtinTypesBitMasks[typeName]
      if ((bits & bitmask) === bitmask) {
        typeStrings.push(`::${typeName}`)
        bits &= ~bitmask
      }
    }

    return typeStrings.join(` | `)
  }
}
