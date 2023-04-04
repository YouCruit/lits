import { Type, builtinTypesBitMasks, orderedTypeNames, typeToBitRecord } from '../src/types/Type'

describe(`Type`, () => {
  test(`orderedTypeNames`, () => {
    const set = new Set(orderedTypeNames)
    expect(set.size + 1).toBe(Object.keys(builtinTypesBitMasks).length)
    expect(orderedTypeNames.includes(`never`)).toBe(false)
  })
  test(`standard types.`, () => {
    expect(Type.nil.bitmask).toBe(typeToBitRecord.nil)

    expect(Type.true.bitmask).toBe(typeToBitRecord.true)
    expect(Type.false.bitmask).toBe(typeToBitRecord.false)
    expect(Type.boolean.bitmask).toBe(typeToBitRecord.true | typeToBitRecord.false)
    expect(Type.emptyString.bitmask).toBe(typeToBitRecord[`empty-string`])
    expect(Type.nonEmptyString.bitmask).toBe(typeToBitRecord[`non-empty-string`])
    expect(Type.string.bitmask).toBe(typeToBitRecord[`empty-string`] | typeToBitRecord[`non-empty-string`])
    expect(Type.zero.bitmask).toBe(typeToBitRecord[`positive-zero`] | typeToBitRecord[`negative-zero`])
    expect(Type.positiveFloat.bitmask).toBe(
      typeToBitRecord[`positive-integer`] | typeToBitRecord[`positive-non-integer`],
    )
    expect(Type.negativeFloat.bitmask).toBe(
      typeToBitRecord[`negative-integer`] | typeToBitRecord[`negative-non-integer`],
    )
    expect(Type.float.bitmask).toBe(
      typeToBitRecord[`positive-zero`] |
        typeToBitRecord[`negative-zero`] |
        typeToBitRecord[`positive-integer`] |
        typeToBitRecord[`positive-non-integer`] |
        typeToBitRecord[`negative-integer`] |
        typeToBitRecord[`negative-non-integer`],
    )
    expect(Type.integer.bitmask).toBe(
      typeToBitRecord[`positive-zero`] |
        typeToBitRecord[`negative-zero`] |
        typeToBitRecord[`positive-integer`] |
        typeToBitRecord[`negative-integer`],
    )
    expect(Type.nonEmptyArray.bitmask).toBe(typeToBitRecord[`non-empty-array`])
    expect(Type.emptyArray.bitmask).toBe(typeToBitRecord[`empty-array`])
    expect(Type.array.bitmask).toBe(typeToBitRecord[`non-empty-array`] | typeToBitRecord[`empty-array`])
    expect(Type.nonEmptyObject.bitmask).toBe(typeToBitRecord[`non-empty-object`])
    expect(Type.emptyObject.bitmask).toBe(typeToBitRecord[`empty-object`])
    expect(Type.object.bitmask).toBe(typeToBitRecord[`non-empty-object`] | typeToBitRecord[`empty-object`])
    expect(Type.regexp.bitmask).toBe(typeToBitRecord.regexp)

    expect(Type.unknown.bitmask).toBe(Object.values(typeToBitRecord).reduce((result, value) => result | value, 0))

    expect(Type.falsy.bitmask).toBe(
      typeToBitRecord.nan |
        typeToBitRecord.nil |
        typeToBitRecord[`empty-string`] |
        typeToBitRecord[`positive-zero`] |
        typeToBitRecord[`negative-zero`] |
        typeToBitRecord.false,
    )
    expect(Type.truthy.bitmask).toBe(
      typeToBitRecord[`non-empty-string`] |
        typeToBitRecord[`positive-integer`] |
        typeToBitRecord[`positive-non-integer`] |
        typeToBitRecord[`negative-integer`] |
        typeToBitRecord[`negative-non-integer`] |
        typeToBitRecord.true |
        typeToBitRecord[`non-empty-array`] |
        typeToBitRecord[`empty-array`] |
        typeToBitRecord[`non-empty-object`] |
        typeToBitRecord[`empty-object`] |
        typeToBitRecord.function |
        typeToBitRecord.regexp |
        typeToBitRecord[`positive-infinity`] |
        typeToBitRecord[`negative-infinity`],
    )

    expect(Type.emptyCollection.bitmask).toBe(
      typeToBitRecord[`empty-array`] | typeToBitRecord[`empty-object`] | typeToBitRecord[`empty-string`],
    )
    expect(Type.nonEmptyCollection.bitmask).toBe(
      typeToBitRecord[`non-empty-array`] | typeToBitRecord[`non-empty-object`] | typeToBitRecord[`non-empty-string`],
    )
    expect(Type.collection.bitmask).toBe(
      typeToBitRecord[`empty-array`] |
        typeToBitRecord[`empty-object`] |
        typeToBitRecord[`empty-string`] |
        typeToBitRecord[`non-empty-array`] |
        typeToBitRecord[`non-empty-object`] |
        typeToBitRecord[`non-empty-string`],
    )
  })
  describe(`Type.and`, () => {
    test(`samples`, () => {
      expect(Type.truthy.and(Type.string)).toEqual(Type.nonEmptyString)
      expect(Type.truthy.and(Type.string.or(Type.float))).toEqual(
        Type.nonEmptyString.or(Type.positiveFloat).or(Type.negativeFloat),
      )
    })
  })

  describe(`Type.exclude`, () => {
    test(`samples`, () => {
      expect(Type.truthy.exclude(Type.string)).toEqual(
        Type.or(
          Type.positiveFloat,
          Type.negativeFloat,
          Type.true,
          Type.array,
          Type.object,
          Type.regexp,
          Type.function,
          Type.positiveInfinity,
          Type.negativeInfinity,
        ),
      )

      expect(Type.truthy.exclude(Type.string.or(Type.float))).toEqual(
        Type.or(
          Type.true,
          Type.array,
          Type.object,
          Type.function,
          Type.regexp,
          Type.positiveInfinity,
          Type.negativeInfinity,
        ),
      )

      expect(Type.unknown.exclude(Type.truthy)).toEqual(Type.falsy)
      expect(Type.unknown.exclude(Type.falsy)).toEqual(Type.truthy)
    })
  })

  describe(`Type.intersects`, () => {
    test(`samples`, () => {
      expect(Type.nonZeroInteger.intersects(Type.negativeFloat)).toBe(true)
    })
  })

  describe(`negateNumber`, () => {
    test(`samples`, () => {
      expect(Type.zero.negateNumber()).toEqual(Type.zero)
      expect(Type.float.negateNumber()).toEqual(Type.float)
      expect(Type.integer.negateNumber()).toEqual(Type.integer)
      expect(Type.nonZeroFloat.negateNumber()).toEqual(Type.nonZeroFloat)
      expect(Type.nonZeroInteger.negateNumber()).toEqual(Type.nonZeroInteger)
      expect(Type.positiveFloat.negateNumber().toString()).toEqual(Type.negativeFloat.toString())
      expect(Type.nonPositiveFloat.negateNumber()).toEqual(Type.nonNegativeFloat)
      expect(Type.positiveInteger.negateNumber()).toEqual(Type.negativeInteger)
      expect(Type.nonPositiveInteger.negateNumber()).toEqual(Type.nonNegativeInteger)
      expect(Type.negativeFloat.negateNumber()).toEqual(Type.positiveFloat)
      expect(Type.nonNegativeFloat.negateNumber()).toEqual(Type.nonPositiveFloat)
      expect(Type.negativeInteger.negateNumber()).toEqual(Type.positiveInteger)
      expect(Type.nonNegativeInteger.negateNumber()).toEqual(Type.nonPositiveInteger)
    })
  })

  describe(`Type.or`, () => {
    test(`samples`, () => {
      expect(Type.or(Type.truthy, Type.falsy)).toEqual(Type.unknown)
    })
    test(`create nilable types`, () => {
      expect(Type.or(Type.nil, Type.boolean).bitmask).toBe(
        typeToBitRecord.true | typeToBitRecord.false | typeToBitRecord.nil,
      )
      expect(Type.or(Type.nil, Type.string).bitmask).toBe(
        typeToBitRecord[`empty-string`] | typeToBitRecord[`non-empty-string`] | typeToBitRecord.nil,
      )
      expect(Type.or(Type.nil, Type.float).bitmask).toBe(
        typeToBitRecord[`positive-zero`] |
          typeToBitRecord[`negative-zero`] |
          typeToBitRecord[`positive-integer`] |
          typeToBitRecord[`positive-non-integer`] |
          typeToBitRecord[`negative-integer`] |
          typeToBitRecord[`negative-non-integer`] |
          typeToBitRecord.nil,
      )
      expect(Type.or(Type.nil, Type.array).bitmask).toBe(
        typeToBitRecord[`non-empty-array`] | typeToBitRecord[`empty-array`] | typeToBitRecord.nil,
      )
      expect(Type.or(Type.nil, Type.object).bitmask).toBe(
        typeToBitRecord[`non-empty-object`] | typeToBitRecord[`empty-object`] | typeToBitRecord.nil,
      )
      expect(Type.or(Type.nil, Type.function).bitmask).toBe(typeToBitRecord.function | typeToBitRecord.nil)
      expect(Type.or(Type.nil, Type.regexp).bitmask).toBe(typeToBitRecord.regexp | typeToBitRecord.nil)
    })
    test(`the disjunction over all types should be unknown`, () => {
      const unknown1 = Type.or(
        Type.nil,
        Type.boolean,
        Type.string,
        Type.float,
        Type.array,
        Type.object,
        Type.regexp,
        Type.function,
        Type.infinity,
        Type.nan,
      )
      const unknown2 = Type.or(
        Type.nil,
        Type.true,
        Type.false,
        Type.emptyString,
        Type.nonEmptyString,
        Type.zero,
        Type.positiveFloat,
        Type.negativeFloat,
        Type.array,
        Type.object,
        Type.regexp,
        Type.function,
        Type.nan,
        Type.positiveInfinity,
        Type.negativeInfinity,
      )
      expect(unknown1.isUnknown()).toBe(true)
      expect(unknown1).toEqual(Type.unknown)
      expect(unknown2.isUnknown()).toBe(true)
      expect(unknown2).toEqual(Type.unknown)
    })
  })
  describe(`primitives`, () => {
    test(`isFalsy`, () => {
      expect(Type.nil.is(Type.falsy)).toBe(true)

      expect(Type.true.is(Type.falsy)).toBe(false)
      expect(Type.false.is(Type.falsy)).toBe(true)
      expect(Type.boolean.is(Type.falsy)).toBe(false)
      expect(Type.emptyString.is(Type.falsy)).toBe(true)
      expect(Type.nonEmptyString.is(Type.falsy)).toBe(false)
      expect(Type.string.is(Type.falsy)).toBe(false)
      expect(Type.zero.is(Type.falsy)).toBe(true)
      expect(Type.positiveFloat.is(Type.falsy)).toBe(false)
      expect(Type.negativeFloat.is(Type.falsy)).toBe(false)
      expect(Type.float.is(Type.falsy)).toBe(false)
      expect(Type.array.is(Type.falsy)).toBe(false)
      expect(Type.object.is(Type.falsy)).toBe(false)
      expect(Type.regexp.is(Type.falsy)).toBe(false)
      expect(Type.function.is(Type.falsy)).toBe(false)
      expect(Type.unknown.is(Type.falsy)).toBe(false)
      expect(Type.or(Type.nil, Type.false, Type.emptyString, Type.zero).is(Type.falsy)).toBe(true)
      expect(Type.or(Type.array, Type.nil, Type.false, Type.emptyString, Type.zero).is(Type.falsy)).toBe(false)
    })
    test(`isTruthy`, () => {
      expect(Type.nil.is(Type.truthy)).toBe(false)
      expect(Type.true.is(Type.truthy)).toBe(true)
      expect(Type.false.is(Type.truthy)).toBe(false)
      expect(Type.boolean.is(Type.truthy)).toBe(false)
      expect(Type.emptyString.is(Type.truthy)).toBe(false)
      expect(Type.nonEmptyString.is(Type.truthy)).toBe(true)
      expect(Type.string.is(Type.truthy)).toBe(false)
      expect(Type.zero.is(Type.truthy)).toBe(false)
      expect(Type.positiveFloat.is(Type.truthy)).toBe(true)
      expect(Type.negativeFloat.is(Type.truthy)).toBe(true)
      expect(Type.float.is(Type.truthy)).toBe(false)
      expect(Type.array.is(Type.truthy)).toBe(true)
      expect(Type.object.is(Type.truthy)).toBe(true)
      expect(Type.regexp.is(Type.truthy)).toBe(true)
      expect(Type.function.is(Type.truthy)).toBe(true)
      expect(Type.unknown.is(Type.truthy)).toBe(false)
      expect(
        Type.or(
          Type.true,
          Type.nonEmptyString,
          Type.positiveFloat,
          Type.negativeFloat,
          Type.function,
          Type.regexp,
          Type.function,
          Type.array,
          Type.object,
        ).is(Type.truthy),
      ).toBe(true)
      expect(
        Type.or(
          Type.string,
          Type.true,
          Type.nonEmptyString,
          Type.positiveFloat,
          Type.negativeFloat,
          Type.function,
          Type.regexp,
          Type.function,
          Type.array,
          Type.object,
        ).is(Type.truthy),
      ).toBe(false)
    })
  })
  describe(`Type.is`, () => {
    test(`Everything is unknown`, () => {
      expect(Type.nil.is(Type.unknown)).toBe(true)

      expect(Type.true.is(Type.unknown)).toBe(true)
      expect(Type.false.is(Type.unknown)).toBe(true)
      expect(Type.boolean.is(Type.unknown)).toBe(true)
      expect(Type.emptyString.is(Type.unknown)).toBe(true)
      expect(Type.nonEmptyString.is(Type.unknown)).toBe(true)
      expect(Type.string.is(Type.unknown)).toBe(true)
      expect(Type.zero.is(Type.unknown)).toBe(true)
      expect(Type.positiveFloat.is(Type.unknown)).toBe(true)
      expect(Type.negativeFloat.is(Type.unknown)).toBe(true)
      expect(Type.float.is(Type.unknown)).toBe(true)
      expect(Type.array.is(Type.unknown)).toBe(true)
      expect(Type.function.is(Type.unknown)).toBe(true)
      expect(Type.object.is(Type.unknown)).toBe(true)
      expect(Type.regexp.is(Type.unknown)).toBe(true)

      expect(Type.unknown.is(Type.unknown)).toBe(true)
      expect(Type.falsy.is(Type.unknown)).toBe(true)
      expect(Type.truthy.is(Type.unknown)).toBe(true)

      expect(Type.or(Type.string, Type.float, Type.boolean).is(Type.unknown)).toBe(true)
    })
    test(`nil samples`, () => {
      expect(Type.nil.is(Type.or(Type.array, Type.true, Type.nil))).toBe(true)
    })
  })

  describe(`Type.equals`, () => {
    test(`sampples`, () => {
      expect(Type.truthy.or(Type.falsy).equals(Type.unknown)).toBe(true)
    })
  })

  describe(`Type.isUnionType`, () => {
    test(`sampples`, () => {
      expect(Type.emptyCollection.isUnionType()).toBe(true)
      expect(Type.nonEmptyCollection.isUnionType()).toBe(true)
      expect(Type.collection.isUnionType()).toBe(true)
      expect(Type.emptyArray.isUnionType()).toBe(false)
      expect(Type.nonEmptyArray.isUnionType()).toBe(false)
      expect(Type.array.isUnionType()).toBe(true)
      expect(Type.emptyObject.isUnionType()).toBe(false)
      expect(Type.nonEmptyObject.isUnionType()).toBe(false)
      expect(Type.object.isUnionType()).toBe(true)
      expect(Type.true.isUnionType()).toBe(false)
      expect(Type.false.isUnionType()).toBe(false)
      expect(Type.boolean.isUnionType()).toBe(true)
      expect(Type.emptyString.isUnionType()).toBe(false)
      expect(Type.nonEmptyString.isUnionType()).toBe(false)
      expect(Type.string.isUnionType()).toBe(true)
      expect(Type.zero.isUnionType()).toBe(true)
      expect(Type.positiveZero.isUnionType()).toBe(false)
      expect(Type.negativeZero.isUnionType()).toBe(false)
      expect(Type.positiveFloat.isUnionType()).toBe(true)
      expect(Type.negativeFloat.isUnionType()).toBe(true)
      expect(Type.float.isUnionType()).toBe(true)
      expect(Type.truthy.isUnionType()).toBe(true)
      expect(Type.falsy.isUnionType()).toBe(true)
    })
  })

  describe(`Type.toString`, () => {
    test(`samples`, () => {
      expect(Type.unknown.toString()).toBe(`::unknown [Bitmask = 1111 1111 1111 1111 1111  (1048575)]`)
      expect(Type.nil.toString()).toBe(`::nil [Bitmask = 0000 0000 0000 0000 0001  (1)]`)
      expect(Type.string.toString()).toBe(`::string [Bitmask = 0000 0011 0000 0000 0000  (12288)]`)
      expect(Type.string.nilable().toString()).toBe(`::string | ::nil [Bitmask = 0000 0011 0000 0000 0001  (12289)]`)
    })
  })
})
