export const typeToBitRecord = {
  nil: 1 << 0,
  emptyString: 1 << 1,
  nonEmptyString: 1 << 2,
  zero: 1 << 3,
  positiveInteger: 1 << 4,
  negativeInteger: 1 << 5,
  positiveNonInteger: 1 << 6,
  negativeNonInteger: 1 << 7,
  true: 1 << 8,
  false: 1 << 9,
  emptyArray: 1 << 10,
  nonEmptyArray: 1 << 11,
  emptyObject: 1 << 12,
  nonEmptyObject: 1 << 13,
  regexp: 1 << 14,
  function: 1 << 15,
}

const allBitValues = Object.values(typeToBitRecord)
if (allBitValues.length > 16) {
  throw Error(`Only 16 different types allowed`)
}

// All bits set to 1
const UNKNWON_BITS = allBitValues.reduce((result, bit) => result | bit, 0)

// console.log(stringifyBitMask(UNKNWON_BITS))
const FALSY_BITS = typeToBitRecord.nil | typeToBitRecord.zero | typeToBitRecord.emptyString | typeToBitRecord.false

// All non falsy bits
const TRUTHY_BITS = UNKNWON_BITS & ~FALSY_BITS

function stringifyBitMask(bitMaks: number): string {
  let mask = ``

  for (let index = 15; index >= 0; index -= 1) {
    const bitValue = 1 << index
    const zeroOrOne = (bitMaks & bitValue) === 0 ? `0` : `1`
    const space = index !== 15 && (index + 1) % 4 === 0 ? ` ` : ``
    mask += `${space}${zeroOrOne}`
  }
  return mask
}
const builtinTypesBitMasks = {
  nil: typeToBitRecord.nil,
  emptyString: typeToBitRecord.emptyString,
  nonEmptyString: typeToBitRecord.nonEmptyString,
  string: typeToBitRecord.emptyString | typeToBitRecord.nonEmptyString,
  zero: typeToBitRecord.zero,
  nonZeroNumber:
    typeToBitRecord.negativeNonInteger |
    typeToBitRecord.negativeInteger |
    typeToBitRecord.positiveNonInteger |
    typeToBitRecord.positiveInteger,
  positiveNumber: typeToBitRecord.positiveNonInteger | typeToBitRecord.positiveInteger,
  negativeNumber: typeToBitRecord.negativeNonInteger | typeToBitRecord.negativeInteger,
  integer: typeToBitRecord.zero | typeToBitRecord.positiveInteger | typeToBitRecord.negativeInteger,
  number:
    typeToBitRecord.zero |
    typeToBitRecord.positiveNonInteger |
    typeToBitRecord.positiveInteger |
    typeToBitRecord.negativeNonInteger |
    typeToBitRecord.negativeInteger,
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
}
export class DataType {
  public readonly bitmask: number
  public readonly fnReturnType: DataType | undefined

  private constructor(bitMask: number, fnReturnType?: DataType) {
    this.bitmask = bitMask
    this.fnReturnType = fnReturnType
    Object.freeze(this.fnReturnType)
  }

  public static readonly never = new DataType(0)
  public static readonly nil = new DataType(builtinTypesBitMasks.nil)
  public static readonly emptyString = new DataType(builtinTypesBitMasks.emptyString)
  public static readonly nonEmptyString = new DataType(builtinTypesBitMasks.nonEmptyString)
  public static readonly string = new DataType(builtinTypesBitMasks.string)
  public static readonly zero = new DataType(builtinTypesBitMasks.zero)
  public static readonly positiveNumber = new DataType(builtinTypesBitMasks.positiveNumber)
  public static readonly negativeNumber = new DataType(builtinTypesBitMasks.negativeNumber)
  public static readonly integer = new DataType(builtinTypesBitMasks.integer)
  public static readonly number = new DataType(builtinTypesBitMasks.number)
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
  public static readonly truthy = new DataType(builtinTypesBitMasks.truthy)
  public static readonly falsy = new DataType(builtinTypesBitMasks.falsy)
  public static readonly emptyCollection = new DataType(builtinTypesBitMasks.emptyCollection)
  public static readonly nonEmptyCollection = new DataType(builtinTypesBitMasks.nonEmptyCollection)
  public static readonly collection = new DataType(builtinTypesBitMasks.collection)
  public static readonly unknown = new DataType(builtinTypesBitMasks.unknown)
  public static readonly function = new DataType(builtinTypesBitMasks.function)

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
      if (returnFunction.bitmask === 0) {
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
        if (returnType.bitmask === 0) {
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

  public equals(...types: DataType[]): boolean {
    return DataType.equals(this, ...types)
  }

  public isUnionType(): boolean {
    return DataType.isUnionType(this)
  }

  public withReturnType(dataType: DataType): DataType {
    return new DataType(this.bitmask, dataType)
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
