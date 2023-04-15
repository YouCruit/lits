import { LitsError } from '../errors'
import { Any } from '../interface'
import { DebugInfo } from '../tokenizer/interface'
import { MAX_NUMBER, MIN_NUMBER } from '../utils'
import {
  any,
  array,
  asNotNull,
  assertNotNull,
  assertNull,
  litsFunction,
  object,
  regularExpression,
} from '../utils/assertion'
import { ArrayInfo, Size, arrayInfoExclude, arrayInfoIs, arrayInfoOr } from './ArrayInfo'
import {
  TypeName,
  UNKNWON_BITS,
  arrayTypeNames,
  builtinTypesBitMasks,
  orderedTypeNames,
  typeToBitRecord,
} from './constants'

export class Type {
  public readonly __TYPE__ = true
  public readonly bitmask: number
  arrayInfo: ArrayInfo | null

  private constructor(bitmask: number, arrayInfo: ArrayInfo | null = null) {
    if (bitmask & builtinTypesBitMasks.array) {
      assertNotNull(arrayInfo)
    }
    if (!(bitmask & builtinTypesBitMasks.array)) {
      assertNull(arrayInfo)
    }

    this.arrayInfo = arrayInfo
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

  public static readonly emptyArray = new Type(builtinTypesBitMasks.array, [{ type: null, size: Size.Empty }])
  public static readonly nonEmptyArray = new Type(builtinTypesBitMasks.array, [{ type: null, size: Size.NonEmpty }])
  public static readonly array = new Type(builtinTypesBitMasks.array, [{ type: null, size: Size.Unknown }])
  public static readonly createTypedArray = (type: Type) =>
    new Type(builtinTypesBitMasks.array, [{ type, size: Size.Unknown }])
  public static readonly createNonEmpyTypedArray = (type: Type) =>
    new Type(builtinTypesBitMasks.array, [{ type, size: Size.NonEmpty }])

  public static readonly emptyObject = new Type(builtinTypesBitMasks[`empty-object`])
  public static readonly nonEmptyObject = new Type(builtinTypesBitMasks[`non-empty-object`])
  public static readonly object = new Type(builtinTypesBitMasks.object)

  public static readonly regexp = new Type(builtinTypesBitMasks.regexp)

  public static readonly truthy = new Type(builtinTypesBitMasks.truthy, [{ type: null, size: Size.Unknown }])
  public static readonly falsy = new Type(builtinTypesBitMasks.falsy)

  public static readonly unknown = new Type(builtinTypesBitMasks.unknown, [{ type: null, size: Size.Unknown }])

  public static readonly function = new Type(builtinTypesBitMasks.function)

  public static isType(value: unknown): value is Type {
    return value instanceof Type
  }

  public static assertType(value: unknown, debugInfo: DebugInfo | undefined): asserts value is Type {
    if (!(value instanceof Type)) {
      throw new LitsError(`Expected instance of Type, got ${value}`, debugInfo)
    }
  }

  public static asType(value: unknown, debugInfo: DebugInfo | undefined): Type {
    if (!(value instanceof Type)) {
      throw new LitsError(`Expected instance of Type, got ${value}`, debugInfo)
    }
    return value
  }

  public static isNotType(value: unknown): boolean {
    return !(value instanceof Type)
  }

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
      if (input.length === 0) {
        return Type.emptyArray
      }
      const type = Type.or(...input.map(i => Type.of(i)))
      return Type.createNonEmpyTypedArray(type)
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

    if (newTypeMask & builtinTypesBitMasks.array) {
      const arrayInfo = types.reduce(
        (result: ArrayInfo | null, type) => arrayInfoOr(result, type.arrayInfo, Type.unknown),
        [],
      )
      return new Type(newTypeMask, arrayInfo)
    } else {
      return new Type(newTypeMask)
    }
  }

  public static and(...types: Type[]): Type {
    const newTypeMask = types.reduce((result, type) => {
      return result & type.bitmask
    }, UNKNWON_BITS)

    return new Type(newTypeMask)
  }

  public static exclude(first: Type, ...rest: Type[]): Type {
    return rest.reduce((result, type) => {
      if (result.bitmask & typeToBitRecord.array && type.bitmask & typeToBitRecord.array) {
        const newArrayInfo = arrayInfoExclude(result.arrayInfo, type.arrayInfo, Type.unknown)
        const newBitmask = newArrayInfo
          ? (result.bitmask & ~type.bitmask) | typeToBitRecord.array
          : result.bitmask & ~(type.bitmask | typeToBitRecord.array)
        return new Type(newBitmask, newArrayInfo)
      } else {
        return new Type(result.bitmask & ~type.bitmask, result.arrayInfo)
      }
    }, first)
  }

  public static is(a: Type, b: Type): boolean {
    const { bitmask: bitmaskA } = a
    const { bitmask: bitmaskB } = b

    // some bits must be the same AND no bits in a can appear in b
    const bitmaskOK = !!(bitmaskA & bitmaskB && !(bitmaskA & ~bitmaskB))
    if (!bitmaskOK) {
      return false
    }
    return bitmaskA & typeToBitRecord.array ? arrayInfoIs(a.arrayInfo, b.arrayInfo, Type.unknown) : true
  }

  public static equals(type1: Type, type2: Type, ...rest: Type[]): boolean {
    return [type2, ...rest].every(t => {
      return type1.bitmask === t.bitmask
    })
  }

  public static intersects(a: Type, b: Type): boolean {
    return a.and(b).bitmask !== 0
  }

  public static toValue(dataType: Any): Any {
    if (Type.isType(dataType)) {
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

  public static toNumberOrNan(dataType: Type): Type | number {
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
    return Type.toSingelBits(dataType).flatMap(bits => {
      if (bits === builtinTypesBitMasks.array && dataType.arrayInfo) {
        return dataType.arrayInfo.map(i => new Type(bits, [i]))
      }
      return new Type(bits)
    })
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

    return new Type(newBitmask, this.arrayInfo)
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
    return Type.toNumberOrNan(this)
  }

  public toString({ showDetails } = { showDetails: true }): string {
    const suffix = ` [Bitmask = ${stringifyBitMask(this.bitmask)}  (${this.bitmask})]`
    const typeString = this.getTypeString(showDetails)
    return `${typeString}${showDetails ? suffix : ``}`
  }

  private getTypeString(showDetails: boolean): string {
    const typeStrings: string[] = []
    let bits = this.bitmask

    for (const typeName of orderedTypeNames) {
      if (bits === 0) {
        break
      }
      const bitmask = builtinTypesBitMasks[typeName]
      if ((bits & bitmask) === bitmask) {
        if (arrayTypeNames.includes(typeName)) {
          asNotNull(this.arrayInfo).forEach(elem => {
            const arrayTypeName: TypeName =
              elem.size === Size.Empty ? `empty-array` : elem.size === Size.NonEmpty ? `non-empty-array` : `array`
            const innerArrayTypeString = elem.type ? `<${elem.type.toString({ showDetails })}>` : ``
            typeStrings.push(`::${arrayTypeName}${innerArrayTypeString}`)
          })
        } else {
          typeStrings.push(`::${typeName}`)
        }
        bits &= ~bitmask
      }
    }

    return typeStrings.length > 0 ? typeStrings.join(` | `) : `::never`
  }
}

function stringifyBitMask(bitmask: number): string {
  let mask = ``

  for (let index = 19; index >= 0; index -= 1) {
    const bitValue = 1 << index
    const zeroOrOne = bitmask & bitValue ? `1` : `0`
    const space = index !== 19 && (index + 1) % 4 === 0 ? ` ` : ``
    mask += `${space}${zeroOrOne}`
  }
  return mask
}
