export type DataTypePrimitive = `string` | `number` | `boolean` | `array` | `object` | `nil` | `regexp` | `function`

const bitValues: Record<DataTypePrimitive, number> = {
  nil: 1,
  string: 2,
  number: 4,
  boolean: 8,
  array: 16,
  object: 32,
  function: 64,
  regexp: 128,
}

const UNKNWON = 255

export class DataType {
  public readonly typeMask: number

  public static nil = new DataType(bitValues[`nil`])

  public static string = new DataType(bitValues[`string`])

  public static nilableString = new DataType(bitValues[`nil`] + bitValues[`string`])

  public static number = new DataType(bitValues[`number`])

  public static nilableNumber = new DataType(bitValues[`nil`] + bitValues[`number`])

  public static boolean = new DataType(bitValues[`boolean`])

  public static nilableBoolean = new DataType(bitValues[`nil`] + bitValues[`boolean`])

  public static array = new DataType(bitValues[`array`])

  public static nilableArray = new DataType(bitValues[`nil`] + bitValues[`array`])

  public static object = new DataType(bitValues[`object`])

  public static nilableObject = new DataType(bitValues[`nil`] + bitValues[`object`])

  public static regexp = new DataType(bitValues[`regexp`])

  public static nilableRegexp = new DataType(bitValues[`nil`] + bitValues[`regexp`])

  public static function = new DataType(bitValues[`function`])

  public static nilableFunction = new DataType(bitValues[`nil`] + bitValues[`function`])

  public static unknown = new DataType(UNKNWON)

  public static or(...types: DataType[]): DataType {
    const newTypeMask = types.reduce((result, type) => {
      return result | type.typeMask
    }, 0)
    return new DataType(newTypeMask)
  }

  private constructor(typeMask: number) {
    this.typeMask = typeMask
  }

  private is(primitive: DataTypePrimitive): boolean {
    return this.typeMask === bitValues[primitive]
  }

  private isNilable(primitive: DataTypePrimitive): boolean {
    return this.typeMask === bitValues[primitive] + bitValues[`nil`]
  }

  isUnknown(): boolean {
    return this.typeMask === UNKNWON
  }

  isNil(): boolean {
    return this.is(`nil`)
  }

  isBoolean(): boolean {
    return this.is(`boolean`)
  }

  isString(): boolean {
    return this.is(`string`)
  }

  isNumber(): boolean {
    return this.is(`number`)
  }

  isArray(): boolean {
    return this.is(`array`)
  }

  isObject(): boolean {
    return this.is(`object`)
  }

  isFunction(): boolean {
    return this.is(`function`)
  }

  isRegexp(): boolean {
    return this.is(`regexp`)
  }

  isNilableBoolean(): boolean {
    return this.isNilable(`boolean`)
  }

  isNilableString(): boolean {
    return this.isNilable(`string`)
  }

  isNilableNumber(): boolean {
    return this.isNilable(`number`)
  }

  isNilableArray(): boolean {
    return this.isNilable(`array`)
  }

  isNilableObject(): boolean {
    return this.isNilable(`object`)
  }

  isNilableFunction(): boolean {
    return this.isNilable(`function`)
  }

  isNilableRegexp(): boolean {
    return this.isNilable(`regexp`)
  }

  toString(): string {
    if (this.isUnknown()) {
      return `unknown`
    }
    if (this.isNilableArray()) {
      return `nilableArray`
    }
    if (this.isNilableBoolean()) {
      return `nilableBoolean`
    }
    if (this.isNilableFunction()) {
      return `nilableFunction`
    }
    if (this.isNilableNumber()) {
      return `nilableNumber`
    }
    if (this.isNilableObject()) {
      return `nilableObject`
    }
    if (this.isNilableRegexp()) {
      return `nilableRegexp`
    }
    if (this.isNilableString()) {
      return `nilableString`
    }
    const types = Object.entries(bitValues).reduce((result: string[], entry) => {
      const [name, bitValue] = entry
      if (this.typeMask & bitValue) {
        result.push(name)
      }
      return result
    }, [])
    return types.join(` | `)
  }
}
