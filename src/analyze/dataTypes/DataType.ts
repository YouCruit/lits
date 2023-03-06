export const typeToBitRecord = {
  nil: 1 << 0,
  emptyString: 1 << 1,
  nonEmptyString: 1 << 2,
  zero: 1 << 3,
  nonZeroNumber: 1 << 4,
  true: 1 << 5,
  false: 1 << 6,
  emptyArray: 1 << 7,
  nonEmptyArray: 1 << 8,
  emptyObject: 1 << 9,
  nonEmptyObject: 1 << 10,
  function: 1 << 11,
  regexp: 1 << 12,
}

const allBitValues = Object.values(typeToBitRecord)

// All bits set to 1
const UNKNWON_BITS = allBitValues.reduce((result, bit) => result | bit, 0)

const FALSY_BITS = typeToBitRecord.nil | typeToBitRecord.zero | typeToBitRecord.emptyString | typeToBitRecord.false

// All non falsy bits
const TRUTHY_BITS = UNKNWON_BITS & ~FALSY_BITS

export class DataType {
  public readonly bits: number

  public static nil = new DataType(typeToBitRecord.nil)

  public static emptyString = new DataType(typeToBitRecord.emptyString)
  public static nonEmptyString = new DataType(typeToBitRecord.nonEmptyString)
  public static string = new DataType(typeToBitRecord.emptyString | typeToBitRecord.nonEmptyString)
  public static zero = new DataType(typeToBitRecord.zero)
  public static nonZeroNumber = new DataType(typeToBitRecord.nonZeroNumber)
  public static number = new DataType(typeToBitRecord.zero | typeToBitRecord.nonZeroNumber)
  public static true = new DataType(typeToBitRecord.true)
  public static false = new DataType(typeToBitRecord.false)
  public static boolean = new DataType(typeToBitRecord.true | typeToBitRecord.false)
  public static emptyArray = new DataType(typeToBitRecord.emptyArray)
  public static nonEmptyArray = new DataType(typeToBitRecord.nonEmptyArray)
  public static array = new DataType(typeToBitRecord.emptyArray | typeToBitRecord.nonEmptyArray)
  public static emptyObject = new DataType(typeToBitRecord.emptyObject)
  public static nonEmptyObject = new DataType(typeToBitRecord.nonEmptyObject)
  public static object = new DataType(typeToBitRecord.emptyObject | typeToBitRecord.nonEmptyObject)
  public static regexp = new DataType(typeToBitRecord.regexp)
  public static function = new DataType(typeToBitRecord.function)

  public static nilableEmptyString = new DataType(typeToBitRecord.nil | typeToBitRecord.emptyString)
  public static nilableNonEmptyString = new DataType(typeToBitRecord.nil | typeToBitRecord.nonEmptyString)
  public static nilableString = new DataType(
    typeToBitRecord.nil | typeToBitRecord.emptyString | typeToBitRecord.nonEmptyString,
  )
  public static nilableZero = new DataType(typeToBitRecord.nil | typeToBitRecord.zero)
  public static nilableNonZeroNumber = new DataType(typeToBitRecord.nil | typeToBitRecord.nonZeroNumber)
  public static nilableNumber = new DataType(typeToBitRecord.nil | typeToBitRecord.zero | typeToBitRecord.nonZeroNumber)
  public static nilableTrue = new DataType(typeToBitRecord.nil | typeToBitRecord.true)
  public static nilableFalse = new DataType(typeToBitRecord.nil | typeToBitRecord.false)
  public static nilableBoolean = new DataType(typeToBitRecord.nil | typeToBitRecord.true | typeToBitRecord.false)
  public static nilableEmptyArray = new DataType(typeToBitRecord.nil | typeToBitRecord.emptyArray)
  public static nilableNonEmptyArray = new DataType(typeToBitRecord.nil | typeToBitRecord.nonEmptyArray)
  public static nilableArray = new DataType(
    typeToBitRecord.nil | typeToBitRecord.emptyArray | typeToBitRecord.nonEmptyArray,
  )
  public static nilableEmptyObject = new DataType(typeToBitRecord.nil | typeToBitRecord.emptyObject)
  public static nilableNonEmptyObject = new DataType(typeToBitRecord.nil | typeToBitRecord.nonEmptyObject)
  public static nilableObject = new DataType(
    typeToBitRecord.nil | typeToBitRecord.emptyObject | typeToBitRecord.nonEmptyObject,
  )
  public static nilableRegexp = new DataType(typeToBitRecord.nil | typeToBitRecord.regexp)
  public static nilableFunction = new DataType(typeToBitRecord.nil | typeToBitRecord.function)

  public static unknown = new DataType(UNKNWON_BITS)
  public static truthy = new DataType(TRUTHY_BITS)
  public static falsy = new DataType(FALSY_BITS)
  public static emptyCollection = new DataType(
    typeToBitRecord.emptyString | typeToBitRecord.emptyArray | typeToBitRecord.emptyObject,
  )
  public static nonEmptyCollection = new DataType(
    typeToBitRecord.nonEmptyString | typeToBitRecord.nonEmptyArray | typeToBitRecord.nonEmptyObject,
  )
  public static collection = new DataType(
    typeToBitRecord.emptyString |
      typeToBitRecord.nonEmptyString |
      typeToBitRecord.emptyArray |
      typeToBitRecord.nonEmptyArray |
      typeToBitRecord.emptyObject |
      typeToBitRecord.nonEmptyObject,
  )

  public static or(type: DataType, ...types: DataType[]): DataType {
    const newTypeMask = [type, ...types].reduce((result, type) => {
      return result | type.bits
    }, 0)
    return new DataType(newTypeMask)
  }

  public static and(type: DataType, ...types: DataType[]): DataType {
    const newTypeMask = [type, ...types].reduce((result, type) => {
      return result & type.bits
    }, UNKNWON_BITS)
    return new DataType(newTypeMask)
  }

  public static exclude(type: DataType, ...types: DataType[]): DataType {
    const typeMask = types.reduce((result, type) => {
      return result | type.bits
    }, 0)

    const newTypeMask = type.bits & ~typeMask
    return new DataType(newTypeMask)
  }

  public static is(dataType1: DataType, dataType2: DataType): boolean {
    const bits = dataType2.bits
    return (dataType1.bits & bits) > 0 && (dataType1.bits & ~bits) === 0
  }

  public static equals(dataType1: DataType, dataType2: DataType): boolean {
    return dataType1.bits === dataType2.bits
  }

  public static isUnionType(dataType: DataType): boolean {
    return !allBitValues.includes(dataType.bits)
  }

  private constructor(bitMask: number) {
    if (bitMask < 0 || bitMask > UNKNWON_BITS) {
      throw Error(`Illegal bitMask. Should be between 1 and ${UNKNWON_BITS}, got ${bitMask}`)
    }
    this.bits = bitMask
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

  public equals(dataType: DataType): boolean {
    return DataType.equals(this, dataType)
  }

  public isUnionType(): boolean {
    return DataType.isUnionType(this)
  }

  isUnknown(): boolean {
    return this.bits === UNKNWON_BITS
  }

  toString(): string {
    if (this.isUnknown()) {
      return `unknown`
    }
    const types = Object.entries(typeToBitRecord).reduce((result: string[], entry) => {
      const [name, bitValue] = entry
      if (this.bits & bitValue) {
        result.push(name)
      }
      return result
    }, [])
    return types.join(` | `)
  }
}
