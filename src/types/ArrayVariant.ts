import { type Type } from './Type'

enum Size {
  Empty = 0,
  NonEmpty = 1,
  Unknown = 2,
}

export class ArrayVariant {
  static Size = Size
  static unknownType: Type
  size: Size
  type: Type | null

  private constructor(size: Size, type: Type | null) {
    this.size = size
    this.type = type
  }

  static create(type: Type | null = null): ArrayVariant {
    return new ArrayVariant(Size.Unknown, type)
  }

  static createEmpty(): ArrayVariant {
    return new ArrayVariant(Size.Empty, null)
  }

  static createNonEmpty(type: Type | null = null): ArrayVariant {
    return new ArrayVariant(Size.NonEmpty, type)
  }

  static or(a: ArrayVariant[] | null, b: ArrayVariant[] | null): ArrayVariant[] | null {
    return simplifyArrayVariants([...(a ?? []), ...(b ?? [])])
  }

  static and(a: ArrayVariant[] | null, b: ArrayVariant[] | null): ArrayVariant[] | null {
    if (a === null || b === null) {
      return null
    }

    return simplifyArrayVariants(
      a.flatMap(aVariant => {
        const aType = aVariant.type ?? ArrayVariant.unknownType
        for (const bVariant of b) {
          const bType = bVariant.type ?? ArrayVariant.unknownType
          if (aType.equals(bType)) {
            const size: null | Size =
              aVariant.size === Size.Empty && bVariant.size !== Size.NonEmpty
                ? Size.Empty
                : aVariant.size === Size.NonEmpty && bVariant.size !== Size.Empty
                ? Size.NonEmpty
                : aVariant.size === Size.Unknown
                ? bVariant.size
                : null
            if (size === null) {
              return []
            }
            return new ArrayVariant(size, aType)
          }
        }
        return []
      }),
    )
  }
  static equals(a: ArrayVariant[] | null, b: ArrayVariant[] | null): boolean {
    if (!a && !b) {
      return true
    }
    if (!a || !b) {
      return false
    }
    if (a.length !== b.length) {
      return false
    }

    return a.every(aVariant => {
      const aSize = aVariant.size
      const aType = aVariant.type
      for (const bVariant of b) {
        const bSize = bVariant.size
        const bType = bVariant.type

        if (aSize === bSize) {
          if (!aType && !bType) {
            return true
          }
          if (!aType || !bType) {
            continue
          }
          if (aType.equals(bType)) {
            return true
          }
        }
      }
      return false
    })
  }

  static is(a: ArrayVariant[] | null, b: ArrayVariant[] | null, unknownType: Type): boolean {
    const simpleA = simplifyArrayVariants(a)
    const simpleB = simplifyArrayVariants(b)
    if (!simpleA && !simpleB) {
      return true
    }
    if (!simpleA || !simpleB) {
      return false
    }
    return simpleA.every(aElem => {
      const aType = aElem.type ?? unknownType
      return simpleB.some(bElem => {
        const bType = bElem.type
        if (!bType) {
          return true
        }
        if (!aType.is(bType)) {
          return false
        }
        return bElem.size === Size.Unknown || bElem.size === aElem.size
      })
    })
  }

  static exclude(aTypeVariants: ArrayVariant[] | null, bTypeVariants: ArrayVariant[] | null): ArrayVariant[] | null {
    if (!aTypeVariants) {
      return null
    }
    if (!bTypeVariants) {
      return aTypeVariants
    }

    return simplifyArrayVariants(
      aTypeVariants.flatMap(aVariant => {
        const typeVariants = aVariant.clone()
        for (const bVariant of bTypeVariants) {
          if (bVariant.size === Size.Empty || bVariant.size === Size.Unknown) {
            if (typeVariants.size === Size.Empty) {
              return []
            } else {
              typeVariants.size = Size.NonEmpty
            }
            typeVariants.size = bVariant.size === Size.Empty ? Size.NonEmpty : Size.Empty
          }
          if ((typeVariants.type ?? ArrayVariant.unknownType).equals(bVariant.type ?? ArrayVariant.unknownType)) {
            switch (typeVariants.size) {
              case Size.Empty:
                return bVariant.size !== Size.NonEmpty ? [] : typeVariants
              case Size.NonEmpty:
                return bVariant.size !== Size.Empty ? [] : typeVariants
              case Size.Unknown:
                if (bVariant.size === Size.Unknown) {
                  return []
                }
                typeVariants.size = bVariant.size === Size.Empty ? Size.NonEmpty : Size.Empty
                return typeVariants
            }
          }
        }
        return typeVariants
      }),
    )
  }

  clone(): ArrayVariant {
    return new ArrayVariant(this.size, this.type)
  }
}

function simplifyArrayVariants(arrayVariants: ArrayVariant[] | null): ArrayVariant[] | null {
  if (!arrayVariants) {
    return null
  }
  const input: Array<ArrayVariant[][number] | null> = [...arrayVariants].sort((a, b) => b.size - a.size)
  const resultArrayVariants: ArrayVariant[] = []
  const size = arrayVariants.length

  for (let i = 0; i < size; i += 1) {
    const aVariant = input[i]
    if (!aVariant) {
      continue
    }
    const resultVariant: ArrayVariant = aVariant.clone()

    for (let j = i + 1; j < size; j += 1) {
      const bVariant = input[j]
      if (!bVariant) {
        continue
      }
      const aType = aVariant.type ?? ArrayVariant.unknownType
      const bType = bVariant.type ?? ArrayVariant.unknownType
      if (aType.equals(bType)) {
        if (aVariant.size === Size.Unknown || bVariant.size === Size.Unknown || aVariant.size !== bVariant.size) {
          resultVariant.size = Size.Unknown
        }
        input[j] = null
      }
      if (bVariant.size === Size.Empty) {
        if (resultVariant.size === Size.NonEmpty) {
          resultVariant.size = Size.Unknown
        }
        input[j] = null
      }
    }
    resultArrayVariants.push(resultVariant)
  }
  return resultArrayVariants.length > 0 ? resultArrayVariants : null
}
