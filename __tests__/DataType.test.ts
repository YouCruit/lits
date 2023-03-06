import { DataType, typeToBitRecord } from '../src/analyze/dataTypes/DataType'

describe(`DataType`, () => {
  test(`standard types.`, () => {
    expect(DataType.nil.bitMask).toBe(typeToBitRecord.nil)

    expect(DataType.true.bitMask).toBe(typeToBitRecord.true)
    expect(DataType.false.bitMask).toBe(typeToBitRecord.false)
    expect(DataType.boolean.bitMask).toBe(typeToBitRecord.true | typeToBitRecord.false)
    expect(DataType.emptyString.bitMask).toBe(typeToBitRecord.emptyString)
    expect(DataType.nonEmptyString.bitMask).toBe(typeToBitRecord.nonEmptyString)
    expect(DataType.string.bitMask).toBe(typeToBitRecord.emptyString | typeToBitRecord.nonEmptyString)
    expect(DataType.zero.bitMask).toBe(typeToBitRecord.zero)
    expect(DataType.nonZeroNumber.bitMask).toBe(typeToBitRecord.nonZeroNumber)
    expect(DataType.number.bitMask).toBe(typeToBitRecord.zero | typeToBitRecord.nonZeroNumber)
    expect(DataType.nonEmptyArray.bitMask).toBe(typeToBitRecord.nonEmptyArray)
    expect(DataType.emptyArray.bitMask).toBe(typeToBitRecord.emptyArray)
    expect(DataType.array.bitMask).toBe(typeToBitRecord.nonEmptyArray | typeToBitRecord.emptyArray)
    expect(DataType.nonEmptyObject.bitMask).toBe(typeToBitRecord.nonEmptyObject)
    expect(DataType.emptyObject.bitMask).toBe(typeToBitRecord.emptyObject)
    expect(DataType.object.bitMask).toBe(typeToBitRecord.nonEmptyObject | typeToBitRecord.emptyObject)
    expect(DataType.function.bitMask).toBe(typeToBitRecord.function)
    expect(DataType.regexp.bitMask).toBe(typeToBitRecord.regexp)

    expect(DataType.nilableTrue.bitMask).toBe(typeToBitRecord.nil | typeToBitRecord.true)
    expect(DataType.nilableFalse.bitMask).toBe(typeToBitRecord.nil | typeToBitRecord.false)
    expect(DataType.nilableBoolean.bitMask).toBe(typeToBitRecord.nil | typeToBitRecord.true | typeToBitRecord.false)
    expect(DataType.nilableEmptyString.bitMask).toBe(typeToBitRecord.nil | typeToBitRecord.emptyString)
    expect(DataType.nilableNonEmptyString.bitMask).toBe(typeToBitRecord.nil | typeToBitRecord.nonEmptyString)
    expect(DataType.nilableString.bitMask).toBe(
      typeToBitRecord.nil | typeToBitRecord.emptyString | typeToBitRecord.nonEmptyString,
    )
    expect(DataType.nilableZero.bitMask).toBe(typeToBitRecord.nil | typeToBitRecord.zero)
    expect(DataType.nilableNonZeroNumber.bitMask).toBe(typeToBitRecord.nil | typeToBitRecord.nonZeroNumber)
    expect(DataType.nilableNumber.bitMask).toBe(
      typeToBitRecord.nil | typeToBitRecord.zero | typeToBitRecord.nonZeroNumber,
    )
    expect(DataType.nilableNonEmptyArray.bitMask).toBe(typeToBitRecord.nil | typeToBitRecord.nonEmptyArray)
    expect(DataType.nilableEmptyArray.bitMask).toBe(typeToBitRecord.nil | typeToBitRecord.emptyArray)
    expect(DataType.nilableArray.bitMask).toBe(
      typeToBitRecord.nil | typeToBitRecord.nonEmptyArray | typeToBitRecord.emptyArray,
    )
    expect(DataType.nilableNonEmptyObject.bitMask).toBe(typeToBitRecord.nil | typeToBitRecord.nonEmptyObject)
    expect(DataType.nilableEmptyObject.bitMask).toBe(typeToBitRecord.nil | typeToBitRecord.emptyObject)
    expect(DataType.nilableObject.bitMask).toBe(
      typeToBitRecord.nil | typeToBitRecord.nonEmptyObject | typeToBitRecord.emptyObject,
    )
    expect(DataType.nilableFunction.bitMask).toBe(typeToBitRecord.nil | typeToBitRecord.function)
    expect(DataType.nilableRegexp.bitMask).toBe(typeToBitRecord.nil | typeToBitRecord.regexp)

    expect(DataType.unknown.bitMask).toBe((1 << Object.keys(typeToBitRecord).length) - 1)

    expect(DataType.falsy.bitMask).toBe(
      typeToBitRecord.nil | typeToBitRecord.emptyString | typeToBitRecord.zero | typeToBitRecord.false,
    )
    expect(DataType.truthy.bitMask).toBe(
      typeToBitRecord.nonEmptyString |
        typeToBitRecord.nonZeroNumber |
        typeToBitRecord.true |
        typeToBitRecord.nonEmptyArray |
        typeToBitRecord.emptyArray |
        typeToBitRecord.nonEmptyObject |
        typeToBitRecord.emptyObject |
        typeToBitRecord.function |
        typeToBitRecord.regexp,
    )

    expect(DataType.emptyCollection.bitMask).toBe(
      typeToBitRecord.emptyArray | typeToBitRecord.emptyObject | typeToBitRecord.emptyString,
    )
    expect(DataType.nonEmptyCollection.bitMask).toBe(
      typeToBitRecord.nonEmptyArray | typeToBitRecord.nonEmptyObject | typeToBitRecord.nonEmptyString,
    )
    expect(DataType.collection.bitMask).toBe(
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
        DataType.nonEmptyString.or(DataType.nonZeroNumber),
      )
    })
  })

  describe(`DataType.exclude`, () => {
    test(`samples`, () => {
      expect(DataType.truthy.exclude(DataType.string)).toEqual(
        DataType.nonZeroNumber
          .or(DataType.true)
          .or(DataType.array)
          .or(DataType.object)
          .or(DataType.function)
          .or(DataType.regexp),
      )
      expect(DataType.truthy.exclude(DataType.string.or(DataType.number))).toEqual(
        DataType.true.or(DataType.array).or(DataType.object).or(DataType.function).or(DataType.regexp),
      )
      expect(DataType.unknown.exclude(DataType.truthy)).toEqual(DataType.falsy)
      expect(DataType.unknown.exclude(DataType.falsy)).toEqual(DataType.truthy)
    })
  })

  describe(`DataType.or`, () => {
    test(`samples`, () => {
      expect(DataType.or(DataType.truthy, DataType.falsy)).toEqual(DataType.unknown)
    })
    test(`create nilable types`, () => {
      expect(DataType.or(DataType.nil, DataType.boolean).bitMask).toBe(
        typeToBitRecord.true | typeToBitRecord.false | typeToBitRecord.nil,
      )
      expect(DataType.or(DataType.nil, DataType.string).bitMask).toBe(
        typeToBitRecord.emptyString | typeToBitRecord.nonEmptyString | typeToBitRecord.nil,
      )
      expect(DataType.or(DataType.nil, DataType.number).bitMask).toBe(
        typeToBitRecord.zero | typeToBitRecord.nonZeroNumber | typeToBitRecord.nil,
      )
      expect(DataType.or(DataType.nil, DataType.array).bitMask).toBe(
        typeToBitRecord.nonEmptyArray | typeToBitRecord.emptyArray | typeToBitRecord.nil,
      )
      expect(DataType.or(DataType.nil, DataType.object).bitMask).toBe(
        typeToBitRecord.nonEmptyObject | typeToBitRecord.emptyObject | typeToBitRecord.nil,
      )
      expect(DataType.or(DataType.nil, DataType.function).bitMask).toBe(typeToBitRecord.function | typeToBitRecord.nil)
      expect(DataType.or(DataType.nil, DataType.regexp).bitMask).toBe(typeToBitRecord.regexp | typeToBitRecord.nil)
    })
    test(`the disjunction over all types should be unknown`, () => {
      const unknown1 = DataType.or(
        DataType.nil,
        DataType.boolean,
        DataType.string,
        DataType.number,
        DataType.array,
        DataType.object,
        DataType.function,
        DataType.regexp,
      )
      const unknown2 = DataType.or(
        DataType.nil,
        DataType.true,
        DataType.false,
        DataType.emptyString,
        DataType.nonEmptyString,
        DataType.zero,
        DataType.nonZeroNumber,
        DataType.array,
        DataType.object,
        DataType.function,
        DataType.regexp,
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
      expect(DataType.nonZeroNumber.is(DataType.falsy)).toBe(false)
      expect(DataType.number.is(DataType.falsy)).toBe(false)
      expect(DataType.array.is(DataType.falsy)).toBe(false)
      expect(DataType.object.is(DataType.falsy)).toBe(false)
      expect(DataType.regexp.is(DataType.falsy)).toBe(false)
      expect(DataType.function.is(DataType.falsy)).toBe(false)

      expect(DataType.nilableTrue.is(DataType.falsy)).toBe(false)
      expect(DataType.nilableFalse.is(DataType.falsy)).toBe(true)
      expect(DataType.nilableBoolean.is(DataType.falsy)).toBe(false)
      expect(DataType.nilableEmptyString.is(DataType.falsy)).toBe(true)
      expect(DataType.nilableNonEmptyString.is(DataType.falsy)).toBe(false)
      expect(DataType.nilableString.is(DataType.falsy)).toBe(false)
      expect(DataType.nilableZero.is(DataType.falsy)).toBe(true)
      expect(DataType.nilableNonZeroNumber.is(DataType.falsy)).toBe(false)
      expect(DataType.nilableNumber.is(DataType.falsy)).toBe(false)
      expect(DataType.nilableArray.is(DataType.falsy)).toBe(false)
      expect(DataType.nilableObject.is(DataType.falsy)).toBe(false)
      expect(DataType.nilableRegexp.is(DataType.falsy)).toBe(false)
      expect(DataType.nilableFunction.is(DataType.falsy)).toBe(false)

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
      expect(DataType.nonZeroNumber.is(DataType.truthy)).toBe(true)
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
          DataType.nonZeroNumber,
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
          DataType.nonZeroNumber,
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
      expect(DataType.nonZeroNumber.is(DataType.unknown)).toBe(true)
      expect(DataType.number.is(DataType.unknown)).toBe(true)
      expect(DataType.array.is(DataType.unknown)).toBe(true)
      expect(DataType.function.is(DataType.unknown)).toBe(true)
      expect(DataType.object.is(DataType.unknown)).toBe(true)
      expect(DataType.regexp.is(DataType.unknown)).toBe(true)

      expect(DataType.nilableTrue.is(DataType.unknown)).toBe(true)
      expect(DataType.nilableFalse.is(DataType.unknown)).toBe(true)
      expect(DataType.nilableBoolean.is(DataType.unknown)).toBe(true)
      expect(DataType.nilableEmptyString.is(DataType.unknown)).toBe(true)
      expect(DataType.nilableNonEmptyString.is(DataType.unknown)).toBe(true)
      expect(DataType.nilableString.is(DataType.unknown)).toBe(true)
      expect(DataType.nilableZero.is(DataType.unknown)).toBe(true)
      expect(DataType.nilableNonZeroNumber.is(DataType.unknown)).toBe(true)
      expect(DataType.nilableNumber.is(DataType.unknown)).toBe(true)
      expect(DataType.nilableArray.is(DataType.unknown)).toBe(true)
      expect(DataType.nilableFunction.is(DataType.unknown)).toBe(true)
      expect(DataType.nilableObject.is(DataType.unknown)).toBe(true)
      expect(DataType.nilableRegexp.is(DataType.unknown)).toBe(true)

      expect(DataType.unknown.is(DataType.unknown)).toBe(true)
      expect(DataType.falsy.is(DataType.unknown)).toBe(true)
      expect(DataType.truthy.is(DataType.unknown)).toBe(true)

      expect(DataType.or(DataType.string, DataType.number, DataType.boolean).is(DataType.unknown)).toBe(true)
    })
    test(`nil samples`, () => {
      expect(DataType.nil.is(DataType.nilableBoolean)).toBe(true)
      expect(DataType.nil.is(DataType.or(DataType.array, DataType.true, DataType.nil))).toBe(true)
    })
  })

  describe(`DataType.equals`, () => {
    test(`sampples`, () => {
      expect(DataType.truthy.or(DataType.falsy).equals(DataType.unknown)).toBe(true)
      expect(DataType.nil.or(DataType.boolean).equals(DataType.nilableBoolean)).toBe(true)
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
      expect(DataType.nonZeroNumber.isUnionType()).toBe(false)
      expect(DataType.number.isUnionType()).toBe(true)
      expect(DataType.truthy.isUnionType()).toBe(true)
      expect(DataType.falsy.isUnionType()).toBe(true)
    })
  })

  describe(`DataType.toString`, () => {
    test(`samples`, () => {
      expect(DataType.unknown.toString()).toBe(`unknown [Bitmask = 0001 1111 1111 1111  (8191)]`)
      expect(DataType.nil.toString()).toBe(`nil [Bitmask = 0000 0000 0000 0001  (1)]`)
      expect(DataType.string.toString()).toBe(`emptyString | nonEmptyString [Bitmask = 0000 0000 0000 0110  (6)]`)
      expect(DataType.nil.or(DataType.string).toString()).toBe(
        `nil | emptyString | nonEmptyString [Bitmask = 0000 0000 0000 0111  (7)]`,
      )
    })
  })
})
