import { LitsError } from '../../errors'
import { DebugInfo } from '../../tokenizer/interface'
import { any, array, litsFunction, object, regularExpression } from '../../utils/assertion'

export const typeToBitRecord = {
  // Group 1: Falsy types
  // 0000 0000 0000 0000 0000 1111
  nil: 1 << 0,
  emptyString: 1 << 1,
  zero: 1 << 2,
  false: 1 << 3,

  // Group 2: Simple truthy types
  // 0000 0000 0000 0000 0111 0000
  true: 1 << 4,
  nonEmptyString: 1 << 5,
  regexp: 1 << 6,

  // Group 3: Truthy number types
  // 0000 0000 0000 1111 0000 0000
  positiveInteger: 1 << 8,
  negativeInteger: 1 << 9,
  positiveNonInteger: 1 << 10,
  negativeNonInteger: 1 << 11,

  // Group 4: Arrays types
  // 0000 0000 0011 0000 0000 0000
  emptyArray: 1 << 12,
  nonEmptyArray: 1 << 13,

  // Group 5: Object types
  // 0000 0011 0000 0000 0000 0000
  emptyObject: 1 << 16,
  nonEmptyObject: 1 << 17,

  // Group 6: Function type
  // 0001 0000 0000 0000 0000 0000
  function: 1 << 20,
}

const allBitValues = Object.values(typeToBitRecord)

// All bits set to 1
const UNKNWON_BITS = allBitValues.reduce((result, bit) => result | bit, 0)

// console.log(stringifyBitMask(UNKNWON_BITS))
const FALSY_BITS = typeToBitRecord.nil | typeToBitRecord.zero | typeToBitRecord.emptyString | typeToBitRecord.false

// All non falsy bits
const TRUTHY_BITS = UNKNWON_BITS & ~FALSY_BITS

const builtinTypesBitMasks = {
  never: 0,

  nil: typeToBitRecord.nil,

  emptyString: typeToBitRecord.emptyString,
  nonEmptyString: typeToBitRecord.nonEmptyString,
  string: typeToBitRecord.emptyString | typeToBitRecord.nonEmptyString,

  // Numbers
  number:
    typeToBitRecord.zero |
    typeToBitRecord.positiveNonInteger |
    typeToBitRecord.positiveInteger |
    typeToBitRecord.negativeNonInteger |
    typeToBitRecord.negativeInteger,
  zero: typeToBitRecord.zero,
  nonZeroNumber:
    typeToBitRecord.negativeNonInteger |
    typeToBitRecord.negativeInteger |
    typeToBitRecord.positiveNonInteger |
    typeToBitRecord.positiveInteger,

  positiveNumber: typeToBitRecord.positiveNonInteger | typeToBitRecord.positiveInteger,
  nonPositiveNumber: typeToBitRecord.zero | typeToBitRecord.negativeNonInteger | typeToBitRecord.negativeInteger,

  negativeNumber: typeToBitRecord.negativeNonInteger | typeToBitRecord.negativeInteger,
  nonNegativeNumber: typeToBitRecord.zero | typeToBitRecord.positiveNonInteger | typeToBitRecord.positiveInteger,

  integer: typeToBitRecord.zero | typeToBitRecord.positiveInteger | typeToBitRecord.negativeInteger,
  nonInteger: typeToBitRecord.positiveNonInteger | typeToBitRecord.negativeNonInteger,

  nonZeroInteger: typeToBitRecord.negativeInteger | typeToBitRecord.positiveInteger,
  nonZeroNonInteger: typeToBitRecord.negativeNonInteger | typeToBitRecord.positiveNonInteger,
  positiveInteger: typeToBitRecord.positiveInteger,
  positiveNonInteger: typeToBitRecord.positiveNonInteger,

  negativeInteger: typeToBitRecord.negativeInteger,
  negativeNonInteger: typeToBitRecord.negativeNonInteger,

  nonPositiveInteger: typeToBitRecord.zero | typeToBitRecord.negativeInteger,
  nonNegativeInteger: typeToBitRecord.zero | typeToBitRecord.positiveInteger,

  true: typeToBitRecord.true,
  false: typeToBitRecord.false,
  boolean: typeToBitRecord.true | typeToBitRecord.false,

  emptyArray: typeToBitRecord.emptyArray,
  nonEmptyArray: typeToBitRecord.nonEmptyArray,
  array: typeToBitRecord.emptyArray | typeToBitRecord.nonEmptyArray,

  emptyObject: typeToBitRecord.emptyObject,
  nonEmptyObject: typeToBitRecord.nonEmptyObject,
  object: typeToBitRecord.emptyObject | typeToBitRecord.nonEmptyObject,

  regexp: typeToBitRecord.regexp,

  function: typeToBitRecord.function,

  unknown: UNKNWON_BITS,

  truthy: TRUTHY_BITS,

  falsy: FALSY_BITS,

  emptyCollection: typeToBitRecord.emptyString | typeToBitRecord.emptyArray | typeToBitRecord.emptyObject,
  nonEmptyCollection: typeToBitRecord.nonEmptyString | typeToBitRecord.nonEmptyArray | typeToBitRecord.nonEmptyObject,
  collection:
    typeToBitRecord.emptyString |
    typeToBitRecord.nonEmptyString |
    typeToBitRecord.emptyArray |
    typeToBitRecord.nonEmptyArray |
    typeToBitRecord.emptyObject |
    typeToBitRecord.nonEmptyObject,

  emptySequence: typeToBitRecord.emptyString | typeToBitRecord.emptyArray,
  nonEmptySequence: typeToBitRecord.nonEmptyString | typeToBitRecord.nonEmptyArray,
  sequence:
    typeToBitRecord.emptyString |
    typeToBitRecord.nonEmptyString |
    typeToBitRecord.emptyArray |
    typeToBitRecord.nonEmptyArray,
}

function stringifyBitMask(bitMaks: number): string {
  let mask = ``

  for (let index = 23; index >= 0; index -= 1) {
    const bitValue = 1 << index
    const zeroOrOne = (bitMaks & bitValue) === builtinTypesBitMasks.never ? `0` : `1`
    const space = index !== 23 && (index + 1) % 4 === 0 ? ` ` : ``
    mask += `${space}${zeroOrOne}`
  }
  return mask
}

export class DataType {
  public readonly bitmask: number
  public readonly fnReturnType: DataType | undefined

  private constructor(bitmask: number, fnReturnType?: DataType) {
    this.bitmask = bitmask
    this.fnReturnType = fnReturnType
    Object.freeze(this.fnReturnType)
  }

  public static readonly never = new DataType(builtinTypesBitMasks.never)

  public static readonly nil = new DataType(builtinTypesBitMasks.nil)

  public static readonly emptyString = new DataType(builtinTypesBitMasks.emptyString)
  public static readonly nonEmptyString = new DataType(builtinTypesBitMasks.nonEmptyString)
  public static readonly string = new DataType(builtinTypesBitMasks.string)

  public static readonly zero = new DataType(builtinTypesBitMasks.zero)
  public static readonly number = new DataType(builtinTypesBitMasks.number)
  public static readonly integer = new DataType(builtinTypesBitMasks.integer)
  public static readonly nonInteger = new DataType(builtinTypesBitMasks.nonInteger)
  public static readonly nonZeroNumber = new DataType(builtinTypesBitMasks.nonZeroNumber)
  public static readonly positiveNumber = new DataType(builtinTypesBitMasks.positiveNumber)
  public static readonly negativeNumber = new DataType(builtinTypesBitMasks.negativeNumber)
  public static readonly nonPositiveNumber = new DataType(builtinTypesBitMasks.nonPositiveNumber)
  public static readonly nonNegativeNumber = new DataType(builtinTypesBitMasks.nonNegativeNumber)
  public static readonly nonZeroInteger = new DataType(builtinTypesBitMasks.nonZeroInteger)
  public static readonly nonZeroNonInteger = new DataType(builtinTypesBitMasks.nonZeroNonInteger)
  public static readonly positiveInteger = new DataType(builtinTypesBitMasks.positiveInteger)
  public static readonly negativeInteger = new DataType(builtinTypesBitMasks.negativeInteger)
  public static readonly positiveNonInteger = new DataType(builtinTypesBitMasks.positiveNonInteger)
  public static readonly negativeNonInteger = new DataType(builtinTypesBitMasks.negativeNonInteger)
  public static readonly nonPositiveInteger = new DataType(builtinTypesBitMasks.nonPositiveInteger)
  public static readonly nonNegativeInteger = new DataType(builtinTypesBitMasks.nonNegativeInteger)

  public static readonly true = new DataType(builtinTypesBitMasks.true)
  public static readonly false = new DataType(builtinTypesBitMasks.false)
  public static readonly boolean = new DataType(builtinTypesBitMasks.boolean)

  public static readonly emptyArray = new DataType(builtinTypesBitMasks.emptyArray)
  public static readonly nonEmptyArray = new DataType(builtinTypesBitMasks.nonEmptyArray)
  public static readonly array = new DataType(builtinTypesBitMasks.array)

  public static readonly emptyObject = new DataType(builtinTypesBitMasks.emptyObject)
  public static readonly nonEmptyObject = new DataType(builtinTypesBitMasks.nonEmptyObject)
  public static readonly object = new DataType(builtinTypesBitMasks.object)

  public static readonly regexp = new DataType(builtinTypesBitMasks.regexp)

  public static readonly emptyCollection = new DataType(builtinTypesBitMasks.emptyCollection)
  public static readonly nonEmptyCollection = new DataType(builtinTypesBitMasks.nonEmptyCollection)
  public static readonly collection = new DataType(builtinTypesBitMasks.collection)

  public static readonly emptySequence = new DataType(builtinTypesBitMasks.emptySequence)
  public static readonly nonEmptySequence = new DataType(builtinTypesBitMasks.nonEmptySequence)
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
    } else if (typeof input === `string`) {
      return input ? DataType.nonEmptyString : DataType.emptyString
    } else if (typeof input === `number`) {
      if (input === 0) {
        return DataType.zero
      } else if (Number.isInteger(input)) {
        return input > 0 ? DataType.positiveInteger : DataType.negativeInteger
      } else {
        return input > 0 ? DataType.positiveNonInteger : DataType.negativeNonInteger
      }
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
    const functions = types.filter(type => type.isFunction())
    if (functions.some(f => !f.fnReturnType)) {
      return new DataType(newTypeMask)
    }
    const returnTypes = functions.map(type => type.fnReturnType) as DataType[]
    const fnReturnType = returnTypes.length > 0 ? DataType.or(...returnTypes) : undefined
    return new DataType(newTypeMask, fnReturnType)
  }

  public static and(...types: DataType[]): DataType {
    const newTypeMask = types.reduce((result, type) => {
      return result & type.bitmask
    }, UNKNWON_BITS)

    // At least one of the types is a function
    if (newTypeMask & builtinTypesBitMasks.function) {
      const returnFunctions = types.filter(type => type.isFunction())
      const returnFunction = DataType.and(...returnFunctions)
      if (returnFunction.bitmask === builtinTypesBitMasks.never) {
        return new DataType(newTypeMask & ~builtinTypesBitMasks.function)
      } else {
        return new DataType(newTypeMask, returnFunction)
      }
    }

    return new DataType(newTypeMask)
  }

  public static exclude(first: DataType, ...rest: DataType[]): DataType {
    return rest.reduce((result, type) => {
      const newBitmask = result.bitmask & ~type.bitmask
      // Only remove function bit if functions are equal
      if (result.isFunction() && type.isFunction()) {
        const returnType: DataType = !type.fnReturnType
          ? DataType.never
          : !result.fnReturnType
          ? DataType.unknown.exclude(type.fnReturnType)
          : result.fnReturnType.exclude(type.fnReturnType)
        if (returnType.bitmask === builtinTypesBitMasks.never) {
          return new DataType(newBitmask)
        } else {
          return new DataType(newBitmask | builtinTypesBitMasks.function, returnType)
        }
      }
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

  public withReturnType(dataType: DataType): DataType {
    if (!this.isFunction()) {
      throw Error(`Only functions can have return types`)
    }
    return new DataType(this.bitmask, dataType)
  }

  public nilable(): DataType {
    return this.or(DataType.nil)
  }

  public isNever(): boolean {
    return this.bitmask === 0
  }

  public negateNumber() {
    let newBitmask = this.bitmask
    if (this.bitmask & typeToBitRecord.negativeInteger && !(this.bitmask & typeToBitRecord.positiveInteger)) {
      newBitmask = (newBitmask | typeToBitRecord.positiveInteger) & ~typeToBitRecord.negativeInteger
    }
    if (this.bitmask & typeToBitRecord.negativeNonInteger && !(this.bitmask & typeToBitRecord.positiveNonInteger)) {
      newBitmask = (newBitmask | typeToBitRecord.positiveNonInteger) & ~typeToBitRecord.negativeNonInteger
    }
    if (this.bitmask & typeToBitRecord.positiveInteger && !(this.bitmask & typeToBitRecord.negativeInteger)) {
      newBitmask = (newBitmask | typeToBitRecord.negativeInteger) & ~typeToBitRecord.positiveInteger
    }
    if (this.bitmask & typeToBitRecord.positiveNonInteger && !(this.bitmask & typeToBitRecord.negativeNonInteger)) {
      newBitmask = (newBitmask | typeToBitRecord.negativeNonInteger) & ~typeToBitRecord.positiveNonInteger
    }

    return new DataType(newBitmask, this.fnReturnType)
  }

  public isFunction(): boolean {
    return !!(this.bitmask & builtinTypesBitMasks.function)
  }

  public isUnknown(): boolean {
    return this.bitmask === UNKNWON_BITS
  }

  public toString(indent = 0): string {
    const padding = ` `.repeat(indent)
    const suffix = ` [Bitmask = ${stringifyBitMask(this.bitmask)}  (${this.bitmask})]`
    if (this.isUnknown()) {
      return `${padding}unknown${suffix}`
    }
    if (this.bitmask === 0) {
      return `${padding}never${suffix}`
    }
    const types = Object.entries(typeToBitRecord).reduce((result: string[], entry) => {
      const [name, bitValue] = entry
      if (this.bitmask & bitValue) {
        result.push(name)
      }
      return result
    }, [])
    return `${padding}${types.join(` | `)}${suffix}${
      this.fnReturnType ? ` =>\n${this.fnReturnType.toString(indent + 2)}` : ``
    }`
  }
}
