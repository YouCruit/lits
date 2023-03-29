import { LitsError } from '../../errors'
import { DebugInfo } from '../../tokenizer/interface'
import { MAX_NUMBER, MIN_NUMBER } from '../../utils'
import { any, array, litsFunction, object, regularExpression } from '../../utils/assertion'
import { TypeName } from './litsTypeNames'

export function isDataType(value: unknown): value is DataType {
  return value instanceof DataType
}

export function assertDataType(value: unknown, debugInfo: DebugInfo | undefined): asserts value is DataType {
  if (!(value instanceof DataType)) {
    throw new LitsError(`Expected instance of DataType, got ${value}`, debugInfo)
  }
}

export function asDataType(value: unknown, debugInfo: DebugInfo | undefined): DataType {
  if (!(value instanceof DataType)) {
    throw new LitsError(`Expected instance of DataType, got ${value}`, debugInfo)
  }
  return value
}

export function isNotDataType(value: unknown): boolean {
  return !(value instanceof DataType)
}

export type PrimitiveTypeName =
  | `nil`
  | `empty-string`
  | `zero`
  | `false`
  | `nan`
  | `positive-infinity`
  | `negative-infinity`
  | `true`
  | `non-empty-string`
  | `regexp`
  | `positive-integer`
  | `negative-integer`
  | `positive-non-integer`
  | `negative-non-integer`
  | `empty-array`
  | `non-empty-array`
  | `empty-object`
  | `non-empty-object`
  | `function`

export const typeToBitRecord: Record<PrimitiveTypeName, number> = {
  // Group 1: Falsy types
  // 0000 0000 0000 0000 0000 1111
  nil: 1 << 0,
  'empty-string': 1 << 1,
  zero: 1 << 2,
  false: 1 << 3,

  // Group 2: Illegal number
  // 0000 0000 0000 0000 0000 1111
  nan: 1 << 4,
  'positive-infinity': 1 << 5,
  'negative-infinity': 1 << 6,

  // Group 3: Simple truthy types
  // 0000 0000 0000 0000 0111 0000
  true: 1 << 8,
  'non-empty-string': 1 << 9,
  regexp: 1 << 10,

  // Group 4: Truthy number types
  // 0000 0000 0000 1111 0000 0000
  'positive-integer': 1 << 12,
  'negative-integer': 1 << 13,
  'positive-non-integer': 1 << 14,
  'negative-non-integer': 1 << 15,

  // Group 5: Container types
  // 0000 0000 1111 0000 0000 0000
  'empty-array': 1 << 16,
  'non-empty-array': 1 << 17,
  'empty-object': 1 << 18,
  'non-empty-object': 1 << 19,

  // Group 6: Function
  // 0000 0001 0000 0000 0000 0000
  function: 1 << 20,
}

const allBitValues = Object.values(typeToBitRecord)

// All bits set to 1
const UNKNWON_BITS = allBitValues.reduce((result, bit) => result | bit, 0)

// console.log(stringifyBitMask(UNKNWON_BITS))
const FALSY_BITS =
  typeToBitRecord.nil |
  typeToBitRecord.zero |
  typeToBitRecord[`empty-string`] |
  typeToBitRecord.false |
  typeToBitRecord.nan

// All non falsy bits
const TRUTHY_BITS = UNKNWON_BITS & ~FALSY_BITS

const builtinTypesBitMasks: Record<TypeName, number> = {
  never: 0,

  nil: typeToBitRecord.nil,

  'empty-string': typeToBitRecord[`empty-string`],
  'non-empty-string': typeToBitRecord[`non-empty-string`],
  string: typeToBitRecord[`empty-string`] | typeToBitRecord[`non-empty-string`],

  // Numbers
  number:
    typeToBitRecord.zero |
    typeToBitRecord[`positive-non-integer`] |
    typeToBitRecord[`positive-integer`] |
    typeToBitRecord[`negative-non-integer`] |
    typeToBitRecord[`negative-integer`] |
    typeToBitRecord[`positive-infinity`] |
    typeToBitRecord[`negative-infinity`] |
    typeToBitRecord[`nan`],
  float:
    typeToBitRecord.zero |
    typeToBitRecord[`positive-non-integer`] |
    typeToBitRecord[`positive-integer`] |
    typeToBitRecord[`negative-non-integer`] |
    typeToBitRecord[`negative-integer`],
  'illegal-number': typeToBitRecord.nan | typeToBitRecord[`positive-infinity`] | typeToBitRecord[`negative-infinity`],
  nan: typeToBitRecord.nan,
  'positive-infinity': typeToBitRecord[`positive-infinity`],
  'negative-infinity': typeToBitRecord[`negative-infinity`],
  infinity: typeToBitRecord[`negative-infinity`] | typeToBitRecord[`positive-infinity`],
  zero: typeToBitRecord.zero,
  'non-zero-float':
    typeToBitRecord[`negative-non-integer`] |
    typeToBitRecord[`negative-integer`] |
    typeToBitRecord[`positive-non-integer`] |
    typeToBitRecord[`positive-integer`],

  'positive-float': typeToBitRecord[`positive-non-integer`] | typeToBitRecord[`positive-integer`],
  'non-positive-float':
    typeToBitRecord.zero | typeToBitRecord[`negative-non-integer`] | typeToBitRecord[`negative-integer`],

  'negative-float': typeToBitRecord[`negative-non-integer`] | typeToBitRecord[`negative-integer`],
  'non-negative-float':
    typeToBitRecord.zero | typeToBitRecord[`positive-non-integer`] | typeToBitRecord[`positive-integer`],

  integer: typeToBitRecord.zero | typeToBitRecord[`positive-integer`] | typeToBitRecord[`negative-integer`],
  // 'non-integer': typeToBitRecord[`positive-non-integer`] | typeToBitRecord[`negative-non-integer`],

  'non-zero-integer': typeToBitRecord[`negative-integer`] | typeToBitRecord[`positive-integer`],
  'positive-integer': typeToBitRecord[`positive-integer`],
  // 'positive-non-integer': typeToBitRecord[`positive-non-integer`],

  'negative-integer': typeToBitRecord[`negative-integer`],
  // 'negative-non-integer': typeToBitRecord[`negative-non-integer`],

  'non-positive-integer': typeToBitRecord.zero | typeToBitRecord[`negative-integer`],
  'non-negative-integer': typeToBitRecord.zero | typeToBitRecord[`positive-integer`],

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

  for (let index = 23; index >= 0; index -= 1) {
    const bitValue = 1 << index
    const zeroOrOne = bitMaks & bitValue ? `1` : `0`
    const space = index !== 23 && (index + 1) % 4 === 0 ? ` ` : ``
    mask += `${space}${zeroOrOne}`
  }
  return mask
}

type ConstructorOptions = {
  arrayVariants?: DataType[] | DataType
}
export class DataType {
  public readonly bitmask: number
  public readonly fnReturnType?: DataType
  // private readonly objectVariants?: Record<string, DataType> | DataType
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private readonly arrayVariants?: DataType[] | DataType

  private constructor(bitmask: number, { arrayVariants }: ConstructorOptions = {}) {
    if (bitmask & typeToBitRecord[`positive-non-integer`]) {
      bitmask |= typeToBitRecord[`positive-integer`]
    }
    if (bitmask & typeToBitRecord[`negative-non-integer`]) {
      bitmask |= typeToBitRecord[`negative-integer`]
    }
    this.bitmask = bitmask
    this.fnReturnType = undefined
    this.arrayVariants = arrayVariants
  }

  public static readonly never = new DataType(builtinTypesBitMasks.never)

  public static readonly nil = new DataType(builtinTypesBitMasks.nil)

  public static readonly illegalNumber = new DataType(builtinTypesBitMasks[`illegal-number`])
  public static readonly nan = new DataType(builtinTypesBitMasks.nan)
  public static readonly positiveInfinity = new DataType(builtinTypesBitMasks[`positive-infinity`])
  public static readonly negativeInfinity = new DataType(builtinTypesBitMasks[`negative-infinity`])
  public static readonly infinity = new DataType(builtinTypesBitMasks[`infinity`])

  public static readonly emptyString = new DataType(builtinTypesBitMasks[`empty-string`])
  public static readonly nonEmptyString = new DataType(builtinTypesBitMasks[`non-empty-string`])
  public static readonly string = new DataType(builtinTypesBitMasks.string)

  public static readonly zero = new DataType(builtinTypesBitMasks.zero)
  public static readonly number = new DataType(builtinTypesBitMasks[`number`])
  public static readonly float = new DataType(builtinTypesBitMasks.float)
  public static readonly integer = new DataType(builtinTypesBitMasks.integer)
  public static readonly nonZeroFloat = new DataType(builtinTypesBitMasks[`non-zero-float`])
  public static readonly positiveFloat = new DataType(builtinTypesBitMasks[`positive-float`])
  public static readonly negativeFloat = new DataType(builtinTypesBitMasks[`negative-float`])
  public static readonly nonPositiveFloat = new DataType(builtinTypesBitMasks[`non-positive-float`])
  public static readonly nonNegativeFloat = new DataType(builtinTypesBitMasks[`non-negative-float`])
  public static readonly nonZeroInteger = new DataType(builtinTypesBitMasks[`non-zero-integer`])
  public static readonly positiveInteger = new DataType(builtinTypesBitMasks[`positive-integer`])
  public static readonly negativeInteger = new DataType(builtinTypesBitMasks[`negative-integer`])
  public static readonly nonPositiveInteger = new DataType(builtinTypesBitMasks[`non-positive-integer`])
  public static readonly nonNegativeInteger = new DataType(builtinTypesBitMasks[`non-negative-integer`])

  public static readonly true = new DataType(builtinTypesBitMasks.true)
  public static readonly false = new DataType(builtinTypesBitMasks.false)
  public static readonly boolean = new DataType(builtinTypesBitMasks.boolean)

  public static readonly emptyArray = new DataType(builtinTypesBitMasks[`empty-array`])
  public static readonly nonEmptyArray = new DataType(builtinTypesBitMasks[`non-empty-array`])
  public static readonly array = new DataType(builtinTypesBitMasks.array)

  public static readonly emptyObject = new DataType(builtinTypesBitMasks[`empty-object`])
  public static readonly nonEmptyObject = new DataType(builtinTypesBitMasks[`non-empty-object`])
  public static readonly object = new DataType(builtinTypesBitMasks.object)

  public static readonly regexp = new DataType(builtinTypesBitMasks.regexp)

  public static readonly emptyCollection = new DataType(builtinTypesBitMasks[`empty-collection`])
  public static readonly nonEmptyCollection = new DataType(builtinTypesBitMasks[`non-empty-collection`])
  public static readonly collection = new DataType(builtinTypesBitMasks[`collection`])

  public static readonly emptySequence = new DataType(builtinTypesBitMasks[`empty-sequence`])
  public static readonly nonEmptySequence = new DataType(builtinTypesBitMasks[`non-empty-sequence`])
  public static readonly sequence = new DataType(builtinTypesBitMasks.sequence)

  public static readonly truthy = new DataType(builtinTypesBitMasks.truthy)
  public static readonly falsy = new DataType(builtinTypesBitMasks.falsy)

  public static readonly unknown = new DataType(builtinTypesBitMasks.unknown)

  public static readonly function = new DataType(builtinTypesBitMasks.function)

  public static of(input: unknown): DataType {
    any.assert(input)
    if (input instanceof DataType) {
      return input
    }
    if (input === null) {
      return DataType.nil
    } else if (input === true) {
      return DataType.true
    } else if (input === false) {
      return DataType.false
    } else if (Number.isNaN(input)) {
      return DataType.nan
    } else if (input === Number.POSITIVE_INFINITY) {
      return DataType.positiveInfinity
    } else if (input === Number.NEGATIVE_INFINITY) {
      return DataType.negativeInfinity
    } else if (typeof input === `string`) {
      return input ? DataType.nonEmptyString : DataType[`emptyString`]
    } else if (typeof input === `number`) {
      return input === 0
        ? DataType.zero
        : input > MAX_NUMBER
        ? DataType.positiveInfinity
        : input < MIN_NUMBER
        ? DataType.negativeInfinity
        : Number.isInteger(input)
        ? input > 0
          ? DataType.positiveInteger
          : DataType.negativeInteger
        : input > 0
        ? DataType.positiveFloat
        : DataType.negativeFloat
    } else if (array.is(input)) {
      return input.length === 0 ? DataType.emptyArray : DataType.nonEmptyArray
    } else if (object.is(input)) {
      return Object.keys(input).length === 0 ? DataType.emptyObject : DataType.nonEmptyObject
    } else if (regularExpression.is(input)) {
      return DataType.regexp
    } else if (litsFunction.is(input)) {
      return DataType.function
    }
    throw Error(`Unexpected error, could not figure out type of ${input}`)
  }

  public static or(...types: DataType[]): DataType {
    const newTypeMask = types.reduce((result, type) => {
      return result | type.bitmask
    }, 0)
    // const functions = types.filter(type => type.isFunction())
    // if (functions.some(f => !f.fnReturnType)) {
    //   return new DataType(newTypeMask)
    // }
    // const returnTypes = functions.map(type => type.fnReturnType) as DataType[]
    // const fnReturnType = returnTypes.length > 0 ? DataType.or(...returnTypes) : undefined
    return new DataType(newTypeMask)
  }

  public static and(...types: DataType[]): DataType {
    const newTypeMask = types.reduce((result, type) => {
      return result & type.bitmask
    }, UNKNWON_BITS)

    // At least one of the types is a function
    // if (newTypeMask & builtinTypesBitMasks.function) {
    //   const returnFunctions = types.filter(type => type.isFunction())
    //   const returnFunction = DataType.and(...returnFunctions)
    //   if (returnFunction.bitmask === builtinTypesBitMasks.never) {
    //     return new DataType(newTypeMask & ~builtinTypesBitMasks.function)
    //   } else {
    //     return new DataType(newTypeMask, returnFunction)
    //   }
    // }

    return new DataType(newTypeMask)
  }

  public static exclude(first: DataType, ...rest: DataType[]): DataType {
    return rest.reduce((result, type) => {
      const newBitmask = result.bitmask & ~type.bitmask
      // Only remove function bit if functions are equal
      // if (result.isFunction() && type.isFunction()) {
      //   const returnType: DataType = !type.fnReturnType
      //     ? DataType.never
      //     : !result.fnReturnType
      //     ? DataType.unknown.exclude(type.fnReturnType)
      //     : result.fnReturnType.exclude(type.fnReturnType)
      //   if (returnType.bitmask === builtinTypesBitMasks.never) {
      //     return new DataType(newBitmask)
      //   } else {
      //     return new DataType(newBitmask | builtinTypesBitMasks.function, returnType)
      //   }
      // }
      return new DataType(newBitmask)
    }, first)
  }

  public static is(a: DataType, b: DataType): boolean {
    const { bitmask: bitmaskA, fnReturnType: fnReturnTypeA } = a
    const { bitmask: bitmaskB, fnReturnType: fnReturnTypeB } = b

    // some bits must be the same AND no bits in a can appear in b
    const success = bitmaskA & bitmaskB && !(bitmaskA & ~bitmaskB)

    if (!success) {
      return false
    }
    if (a.isFunction()) {
      if (!fnReturnTypeB) {
        return true
      }
      if (!fnReturnTypeA) {
        return false
      }
      return fnReturnTypeA.is(fnReturnTypeB)
    }
    return true
  }

  public static equals(type: DataType, ...types: DataType[]): boolean {
    return types.every(t => {
      if (type.bitmask !== t.bitmask) {
        return false
      }
      if (!type.fnReturnType && !t.fnReturnType) {
        return true
      }
      if (type.fnReturnType && t.fnReturnType) {
        return type.fnReturnType.equals(t.fnReturnType)
      }
      return false
    })
  }

  public static intersects(a: DataType, b: DataType): boolean {
    return a.and(b).bitmask !== 0
  }

  public static isUnionType(dataType: DataType): boolean {
    return !allBitValues.includes(dataType.bitmask)
  }

  public or(...dataTypes: DataType[]): DataType {
    return DataType.or(this, ...dataTypes)
  }

  public and(...dataTypes: DataType[]): DataType {
    return DataType.and(this, ...dataTypes)
  }

  public exclude(...dataTypes: DataType[]): DataType {
    return DataType.exclude(this, ...dataTypes)
  }

  public is(dataType: DataType): boolean {
    if (dataType.isNever()) {
      return this.isNever()
    }
    return DataType.is(this, dataType)
  }

  public intersects(dataType: DataType): boolean {
    return DataType.intersects(this, dataType)
  }

  public assertIs(dataType: DataType, debugInfo: DebugInfo | undefined): void {
    if (!this.is(dataType)) {
      throw new LitsError(`Expected to be of type ${dataType.toString()}, but was ${this.toString()}`, debugInfo)
    }
  }

  public assertEquals(dataType: DataType, debugInfo: DebugInfo | undefined): void {
    if (!this.equals(dataType)) {
      throw new LitsError(`Expected to be ${dataType.toString()}, but was ${this.toString()}`, debugInfo)
    }
  }

  public assertIntersects(dataType: DataType, debugInfo: DebugInfo | undefined): void {
    if (!this.intersects(dataType)) {
      throw new LitsError(`Expected to intersect ${dataType.toString()}, but was ${this.toString()}`, debugInfo)
    }
  }

  public equals(...types: DataType[]): boolean {
    return DataType.equals(this, ...types)
  }

  public isUnionType(): boolean {
    return DataType.isUnionType(this)
  }

  // public withReturnType(dataType: DataType): DataType {
  //   if (!this.isFunction()) {
  //     throw Error(`Only functions can have return types`)
  //   }
  //   return new DataType(this.bitmask, dataType)
  // }

  public nilable(): DataType {
    return this.or(DataType.nil)
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

    return new DataType(newBitmask)
  }

  public isFunction(): boolean {
    return !!(this.bitmask & builtinTypesBitMasks.function)
  }

  public isUnknown(): boolean {
    return this.bitmask === UNKNWON_BITS
  }

  public isInteger(): boolean {
    return (
      this.intersects(DataType.float) &&
      !(this.bitmask & (typeToBitRecord[`positive-non-integer`] | typeToBitRecord[`negative-non-integer`]))
    )
  }

  public toSingelBits(): number[] {
    const result: number[] = []
    Object.values(typeToBitRecord).forEach(bitValue => {
      if (this.bitmask & bitValue) {
        result.push(bitValue)
      }
    })
    return result
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
    if (this.isUnknown()) {
      return `::unknown`
    }

    const nan = !!(this.bitmask & typeToBitRecord.nan)
    const positiveInfinity = !!(this.bitmask & typeToBitRecord[`positive-infinity`])
    const negativeInfinity = !!(this.bitmask & typeToBitRecord[`negative-infinity`])
    const nilable = !!(this.bitmask & typeToBitRecord.nil)
    const bitmask =
      this.bitmask &
      ~(
        typeToBitRecord.nil |
        typeToBitRecord.nan |
        typeToBitRecord[`positive-infinity`] |
        typeToBitRecord[`negative-infinity`]
      )

    const typeStrings: string[] = []

    for (const [name, bits] of Object.entries(builtinTypesBitMasks).filter(
      ([_, value]) => value !== builtinTypesBitMasks.never,
    )) {
      if (bitmask === bits) {
        typeStrings.push(`::${name}`)
        break
      }
    }

    if (typeStrings.length === 0) {
      Object.entries(typeToBitRecord).forEach(([name, bitValue]) => {
        if (bitmask & bitValue) {
          typeStrings.push(`::${name}`)
        }
      })
    }

    if (nilable) {
      typeStrings.push(`::nil`)
    }

    if (nan && positiveInfinity && negativeInfinity) {
      typeStrings.push(`::illegal-number`)
    } else {
      if (nan) {
        typeStrings.push(`::nan`)
      }

      if (positiveInfinity) {
        typeStrings.push(`::positive-infinity`)
      }

      if (negativeInfinity) {
        typeStrings.push(`::negative-infinity`)
      }
    }

    return typeStrings.join(` | `)
  }
}
