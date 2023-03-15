import { DataType, typeToBitRecord } from '../src/analyze/dataTypes/DataType'

describe(`DataType`, () => {
  test(`standard types.`, () => {
    expect(DataType.nil.bitmask).toBe(typeToBitRecord.nil)

    expect(DataType.true.bitmask).toBe(typeToBitRecord.true)
    expect(DataType.false.bitmask).toBe(typeToBitRecord.false)
    expect(DataType.boolean.bitmask).toBe(typeToBitRecord.true | typeToBitRecord.false)
    expect(DataType.emptyString.bitmask).toBe(typeToBitRecord.emptyString)
    expect(DataType.nonEmptyString.bitmask).toBe(typeToBitRecord.nonEmptyString)
    expect(DataType.string.bitmask).toBe(typeToBitRecord.emptyString | typeToBitRecord.nonEmptyString)
    expect(DataType.zero.bitmask).toBe(typeToBitRecord.zero)
    expect(DataType.positiveNumber.bitmask).toBe(typeToBitRecord.positiveInteger | typeToBitRecord.positiveNonInteger)
    expect(DataType.negativeNumber.bitmask).toBe(typeToBitRecord.negativeInteger | typeToBitRecord.negativeNonInteger)
    expect(DataType.number.bitmask).toBe(
      typeToBitRecord.zero |
        typeToBitRecord.positiveInteger |
        typeToBitRecord.positiveNonInteger |
        typeToBitRecord.negativeInteger |
        typeToBitRecord.negativeNonInteger,
    )
    expect(DataType.integer.bitmask).toBe(
      typeToBitRecord.zero | typeToBitRecord.positiveInteger | typeToBitRecord.negativeInteger,
    )
    expect(DataType.nonEmptyArray.bitmask).toBe(typeToBitRecord.nonEmptyArray)
    expect(DataType.emptyArray.bitmask).toBe(typeToBitRecord.emptyArray)
    expect(DataType.array.bitmask).toBe(typeToBitRecord.nonEmptyArray | typeToBitRecord.emptyArray)
    expect(DataType.nonEmptyObject.bitmask).toBe(typeToBitRecord.nonEmptyObject)
    expect(DataType.emptyObject.bitmask).toBe(typeToBitRecord.emptyObject)
    expect(DataType.object.bitmask).toBe(typeToBitRecord.nonEmptyObject | typeToBitRecord.emptyObject)
    expect(DataType.regexp.bitmask).toBe(typeToBitRecord.regexp)

    expect(DataType.unknown.bitmask).toBe(Object.values(typeToBitRecord).reduce((result, value) => result | value, 0))

    expect(DataType.falsy.bitmask).toBe(
      typeToBitRecord.nil | typeToBitRecord.emptyString | typeToBitRecord.zero | typeToBitRecord.false,
    )
    expect(DataType.truthy.bitmask).toBe(
      typeToBitRecord.nonEmptyString |
        typeToBitRecord.positiveInteger |
        typeToBitRecord.positiveNonInteger |
        typeToBitRecord.negativeInteger |
        typeToBitRecord.negativeNonInteger |
        typeToBitRecord.true |
        typeToBitRecord.nonEmptyArray |
        typeToBitRecord.emptyArray |
        typeToBitRecord.nonEmptyObject |
        typeToBitRecord.emptyObject |
        typeToBitRecord.function |
        typeToBitRecord.regexp,
    )

    expect(DataType.emptyCollection.bitmask).toBe(
      typeToBitRecord.emptyArray | typeToBitRecord.emptyObject | typeToBitRecord.emptyString,
    )
    expect(DataType.nonEmptyCollection.bitmask).toBe(
      typeToBitRecord.nonEmptyArray | typeToBitRecord.nonEmptyObject | typeToBitRecord.nonEmptyString,
    )
    expect(DataType.collection.bitmask).toBe(
      typeToBitRecord.emptyArray |
        typeToBitRecord.emptyObject |
        typeToBitRecord.emptyString |
        typeToBitRecord.nonEmptyArray |
        typeToBitRecord.nonEmptyObject |
        typeToBitRecord.nonEmptyString,
    )
  })
  describe(`DataType.and`, () => {
    test(`samples`, () => {
      expect(DataType.truthy.and(DataType.string)).toEqual(DataType.nonEmptyString)
      expect(DataType.truthy.and(DataType.string.or(DataType.number))).toEqual(
        DataType.nonEmptyString.or(DataType.positiveNumber).or(DataType.negativeNumber),
      )
    })
  })

  describe(`DataType.exclude`, () => {
    test(`samples`, () => {
      expect(DataType.truthy.exclude(DataType.string)).toEqual(
        DataType.or(
          DataType.positiveNumber,
          DataType.negativeNumber,
          DataType.true,
          DataType.array,
          DataType.object,
          DataType.regexp,
          DataType.function,
        ),
      )

      expect(DataType.truthy.exclude(DataType.string.or(DataType.number))).toEqual(
        DataType.true.or(DataType.array).or(DataType.object).or(DataType.function).or(DataType.regexp),
      )

      expect(DataType.unknown.exclude(DataType.truthy)).toEqual(DataType.falsy)
      expect(DataType.unknown.exclude(DataType.falsy)).toEqual(DataType.truthy)
    })
  })

  describe(`DataType.intersects`, () => {
    test(`samples`, () => {
      expect(DataType.nonZeroInteger.intersects(DataType.negativeNumber)).toBe(true)
    })
  })

  describe(`negateNumber`, () => {
    test(`samples`, () => {
      expect(DataType.zero.negateNumber()).toEqual(DataType.zero)
      expect(DataType.number.negateNumber()).toEqual(DataType.number)
      expect(DataType.integer.negateNumber()).toEqual(DataType.integer)
      expect(DataType.nonZeroNumber.negateNumber()).toEqual(DataType.nonZeroNumber)
      expect(DataType.nonZeroInteger.negateNumber()).toEqual(DataType.nonZeroInteger)
      expect(DataType.nonInteger.negateNumber()).toEqual(DataType.nonInteger)
      expect(DataType.positiveNumber.negateNumber().toString()).toEqual(DataType.negativeNumber.toString())
      expect(DataType.nonPositiveNumber.negateNumber()).toEqual(DataType.nonNegativeNumber)
      expect(DataType.positiveInteger.negateNumber()).toEqual(DataType.negativeInteger)
      expect(DataType.positiveNonInteger.negateNumber()).toEqual(DataType.negativeNonInteger)
      expect(DataType.nonPositiveInteger.negateNumber()).toEqual(DataType.nonNegativeInteger)
      expect(DataType.negativeNumber.negateNumber()).toEqual(DataType.positiveNumber)
      expect(DataType.nonNegativeNumber.negateNumber()).toEqual(DataType.nonPositiveNumber)
      expect(DataType.negativeInteger.negateNumber()).toEqual(DataType.positiveInteger)
      expect(DataType.negativeNonInteger.negateNumber()).toEqual(DataType.positiveNonInteger)
      expect(DataType.nonNegativeInteger.negateNumber()).toEqual(DataType.nonPositiveInteger)
    })
  })

  describe(`DataType.or`, () => {
    test(`samples`, () => {
      expect(DataType.or(DataType.truthy, DataType.falsy)).toEqual(DataType.unknown)
    })
    test(`create nilable types`, () => {
      expect(DataType.or(DataType.nil, DataType.boolean).bitmask).toBe(
        typeToBitRecord.true | typeToBitRecord.false | typeToBitRecord.nil,
      )
      expect(DataType.or(DataType.nil, DataType.string).bitmask).toBe(
        typeToBitRecord.emptyString | typeToBitRecord.nonEmptyString | typeToBitRecord.nil,
      )
      expect(DataType.or(DataType.nil, DataType.number).bitmask).toBe(
        typeToBitRecord.zero |
          typeToBitRecord.positiveInteger |
          typeToBitRecord.positiveNonInteger |
          typeToBitRecord.negativeInteger |
          typeToBitRecord.negativeNonInteger |
          typeToBitRecord.nil,
      )
      expect(DataType.or(DataType.nil, DataType.array).bitmask).toBe(
        typeToBitRecord.nonEmptyArray | typeToBitRecord.emptyArray | typeToBitRecord.nil,
      )
      expect(DataType.or(DataType.nil, DataType.object).bitmask).toBe(
        typeToBitRecord.nonEmptyObject | typeToBitRecord.emptyObject | typeToBitRecord.nil,
      )
      expect(DataType.or(DataType.nil, DataType.function).bitmask).toBe(typeToBitRecord.function | typeToBitRecord.nil)
      expect(DataType.or(DataType.nil, DataType.regexp).bitmask).toBe(typeToBitRecord.regexp | typeToBitRecord.nil)
    })
    test(`the disjunction over all types should be unknown`, () => {
      const unknown1 = DataType.or(
        DataType.nil,
        DataType.boolean,
        DataType.string,
        DataType.number,
        DataType.array,
        DataType.object,
        DataType.regexp,
        DataType.function,
      )
      const unknown2 = DataType.or(
        DataType.nil,
        DataType.true,
        DataType.false,
        DataType.emptyString,
        DataType.nonEmptyString,
        DataType.zero,
        DataType.positiveNumber,
        DataType.negativeNumber,
        DataType.array,
        DataType.object,
        DataType.regexp,
        DataType.function,
      )
      expect(unknown1.isUnknown()).toBe(true)
      expect(unknown1).toEqual(DataType.unknown)
      expect(unknown2.isUnknown()).toBe(true)
      expect(unknown2).toEqual(DataType.unknown)
    })
  })
  describe(`primitives`, () => {
    test(`isFalsy`, () => {
      expect(DataType.nil.is(DataType.falsy)).toBe(true)

      expect(DataType.true.is(DataType.falsy)).toBe(false)
      expect(DataType.false.is(DataType.falsy)).toBe(true)
      expect(DataType.boolean.is(DataType.falsy)).toBe(false)
      expect(DataType.emptyString.is(DataType.falsy)).toBe(true)
      expect(DataType.nonEmptyString.is(DataType.falsy)).toBe(false)
      expect(DataType.string.is(DataType.falsy)).toBe(false)
      expect(DataType.zero.is(DataType.falsy)).toBe(true)
      expect(DataType.positiveNumber.is(DataType.falsy)).toBe(false)
      expect(DataType.negativeNumber.is(DataType.falsy)).toBe(false)
      expect(DataType.number.is(DataType.falsy)).toBe(false)
      expect(DataType.array.is(DataType.falsy)).toBe(false)
      expect(DataType.object.is(DataType.falsy)).toBe(false)
      expect(DataType.regexp.is(DataType.falsy)).toBe(false)
      expect(DataType.function.is(DataType.falsy)).toBe(false)
      expect(DataType.unknown.is(DataType.falsy)).toBe(false)
      expect(DataType.or(DataType.nil, DataType.false, DataType.emptyString, DataType.zero).is(DataType.falsy)).toBe(
        true,
      )
      expect(
        DataType.or(DataType.array, DataType.nil, DataType.false, DataType.emptyString, DataType.zero).is(
          DataType.falsy,
        ),
      ).toBe(false)
    })
    test(`isTruthy`, () => {
      expect(DataType.nil.is(DataType.truthy)).toBe(false)
      expect(DataType.true.is(DataType.truthy)).toBe(true)
      expect(DataType.false.is(DataType.truthy)).toBe(false)
      expect(DataType.boolean.is(DataType.truthy)).toBe(false)
      expect(DataType.emptyString.is(DataType.truthy)).toBe(false)
      expect(DataType.nonEmptyString.is(DataType.truthy)).toBe(true)
      expect(DataType.string.is(DataType.truthy)).toBe(false)
      expect(DataType.zero.is(DataType.truthy)).toBe(false)
      expect(DataType.positiveNumber.is(DataType.truthy)).toBe(true)
      expect(DataType.negativeNumber.is(DataType.truthy)).toBe(true)
      expect(DataType.number.is(DataType.truthy)).toBe(false)
      expect(DataType.array.is(DataType.truthy)).toBe(true)
      expect(DataType.object.is(DataType.truthy)).toBe(true)
      expect(DataType.regexp.is(DataType.truthy)).toBe(true)
      expect(DataType.function.is(DataType.truthy)).toBe(true)
      expect(DataType.unknown.is(DataType.truthy)).toBe(false)
      expect(
        DataType.or(
          DataType.true,
          DataType.nonEmptyString,
          DataType.positiveNumber,
          DataType.negativeNumber,
          DataType.function,
          DataType.regexp,
          DataType.function,
          DataType.array,
          DataType.object,
        ).is(DataType.truthy),
      ).toBe(true)
      expect(
        DataType.or(
          DataType.string,
          DataType.true,
          DataType.nonEmptyString,
          DataType.positiveNumber,
          DataType.negativeNumber,
          DataType.function,
          DataType.regexp,
          DataType.function,
          DataType.array,
          DataType.object,
        ).is(DataType.truthy),
      ).toBe(false)
    })
  })
  describe(`DataType.is`, () => {
    test(`Everything is unknown`, () => {
      expect(DataType.nil.is(DataType.unknown)).toBe(true)

      expect(DataType.true.is(DataType.unknown)).toBe(true)
      expect(DataType.false.is(DataType.unknown)).toBe(true)
      expect(DataType.boolean.is(DataType.unknown)).toBe(true)
      expect(DataType.emptyString.is(DataType.unknown)).toBe(true)
      expect(DataType.nonEmptyString.is(DataType.unknown)).toBe(true)
      expect(DataType.string.is(DataType.unknown)).toBe(true)
      expect(DataType.zero.is(DataType.unknown)).toBe(true)
      expect(DataType.positiveNumber.is(DataType.unknown)).toBe(true)
      expect(DataType.negativeNumber.is(DataType.unknown)).toBe(true)
      expect(DataType.number.is(DataType.unknown)).toBe(true)
      expect(DataType.array.is(DataType.unknown)).toBe(true)
      expect(DataType.function.is(DataType.unknown)).toBe(true)
      expect(DataType.object.is(DataType.unknown)).toBe(true)
      expect(DataType.regexp.is(DataType.unknown)).toBe(true)

      expect(DataType.unknown.is(DataType.unknown)).toBe(true)
      expect(DataType.falsy.is(DataType.unknown)).toBe(true)
      expect(DataType.truthy.is(DataType.unknown)).toBe(true)

      expect(DataType.or(DataType.string, DataType.number, DataType.boolean).is(DataType.unknown)).toBe(true)
    })
    test(`nil samples`, () => {
      expect(DataType.nil.is(DataType.or(DataType.array, DataType.true, DataType.nil))).toBe(true)
    })
    test(`more samples`, () => {
      expect(DataType.positiveNonInteger.is(DataType.nonPositiveNumber)).toBe(false)
    })
  })

  describe(`DataType.equals`, () => {
    test(`sampples`, () => {
      expect(DataType.truthy.or(DataType.falsy).equals(DataType.unknown)).toBe(true)
    })
  })

  describe(`DataType.isUnionType`, () => {
    test(`sampples`, () => {
      expect(DataType.emptyCollection.isUnionType()).toBe(true)
      expect(DataType.nonEmptyCollection.isUnionType()).toBe(true)
      expect(DataType.collection.isUnionType()).toBe(true)
      expect(DataType.emptyArray.isUnionType()).toBe(false)
      expect(DataType.nonEmptyArray.isUnionType()).toBe(false)
      expect(DataType.array.isUnionType()).toBe(true)
      expect(DataType.emptyObject.isUnionType()).toBe(false)
      expect(DataType.nonEmptyObject.isUnionType()).toBe(false)
      expect(DataType.object.isUnionType()).toBe(true)
      expect(DataType.true.isUnionType()).toBe(false)
      expect(DataType.false.isUnionType()).toBe(false)
      expect(DataType.boolean.isUnionType()).toBe(true)
      expect(DataType.emptyString.isUnionType()).toBe(false)
      expect(DataType.nonEmptyString.isUnionType()).toBe(false)
      expect(DataType.string.isUnionType()).toBe(true)
      expect(DataType.zero.isUnionType()).toBe(false)
      expect(DataType.positiveNumber.isUnionType()).toBe(true)
      expect(DataType.negativeNumber.isUnionType()).toBe(true)
      expect(DataType.number.isUnionType()).toBe(true)
      expect(DataType.truthy.isUnionType()).toBe(true)
      expect(DataType.falsy.isUnionType()).toBe(true)
    })
  })

  describe(`DataType.toString`, () => {
    test(`samples`, () => {
      expect(DataType.unknown.toString()).toBe(`unknown [Bitmask = 0001 0011 0011 1111 0111 1111  (1261439)]`)
      expect(DataType.nil.toString()).toBe(`nil [Bitmask = 0000 0000 0000 0000 0000 0001  (1)]`)
      expect(DataType.string.toString()).toBe(
        `emptyString | nonEmptyString [Bitmask = 0000 0000 0000 0000 0010 0010  (34)]`,
      )
      expect(DataType.string.nilable().toString()).toBe(
        `nil | emptyString | nonEmptyString [Bitmask = 0000 0000 0000 0000 0010 0011  (35)]`,
      )
    })
  })
})
