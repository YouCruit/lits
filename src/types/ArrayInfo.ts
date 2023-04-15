import { type Type } from './Type'

export enum Size {
  Empty = 0,
  NonEmpty = 1,
  Unknown = 2,
}

type ArrayInstanceInfo = {
  size: Size
  type: Type | null
}

export type ArrayInfo = ArrayInstanceInfo[]

// export function arrayInfoOr(types: Type[], unknownType: Type): ArrayInfo {
//   return simplifyArrayInfo(
//     types.flatMap(type => type.arrayInfo ?? []),
//     unknownType,
//   )
// }

export function arrayInfoOr(a: ArrayInfo | null, b: ArrayInfo | null, unknownType: Type): ArrayInfo | null {
  return simplifyArrayInfo([...(a ?? []), ...(b ?? [])], unknownType)
}

export function arrayInfoIs(a: ArrayInfo | null, b: ArrayInfo | null, unknownType: Type): boolean {
  const simpleA = simplifyArrayInfo(a, unknownType)
  const simpleB = simplifyArrayInfo(b, unknownType)
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

export function arrayInfoExclude(a: ArrayInfo | null, b: ArrayInfo | null, unknownType: Type): ArrayInfo | null {
  const simpleA = simplifyArrayInfo(a, unknownType)
  const simpleB = simplifyArrayInfo(b, unknownType)

  if (!simpleA) {
    return null
  }
  if (!simpleB) {
    return a
  }

  return simplifyArrayInfo(
    simpleA.flatMap(aElem => {
      const result = { ...aElem }
      for (const bElem of simpleB) {
        if (bElem.size === Size.Empty || bElem.size === Size.Unknown) {
          if (result.size === Size.Empty) {
            return []
          } else {
            result.size = Size.NonEmpty
          }
          result.size = bElem.size === Size.Empty ? Size.NonEmpty : Size.Empty
        }
        if ((result.type ?? unknownType).equals(bElem.type ?? unknownType)) {
          switch (result.size) {
            case Size.Empty:
              return bElem.size !== Size.NonEmpty ? [] : result
            case Size.NonEmpty:
              return bElem.size !== Size.Empty ? [] : result
            case Size.Unknown:
              if (bElem.size === Size.Unknown) {
                return []
              }
              result.size = bElem.size === Size.Empty ? Size.NonEmpty : Size.Empty
              return result
          }
        }
      }
      return result
    }),
    unknownType,
  )
}

export function simplifyArrayInfo(arrayInfo: ArrayInfo | null, unknownType: Type): ArrayInfo | null {
  if (!arrayInfo) {
    return null
  }
  const input: Array<ArrayInfo[number] | null> = arrayInfo
  const result: ArrayInfo = []
  const size = arrayInfo.length

  for (let i = 0; i < size; i += 1) {
    const a = input[i]
    if (!a) {
      continue
    }
    const elem: ArrayInfo[number] = { ...a }

    for (let j = i + 1; j < size; j += 1) {
      const b = input[j]
      if (!b) {
        continue
      }
      const aType = a.type ?? unknownType
      const bType = b.type ?? unknownType
      if (aType.equals(bType)) {
        if (a.size === Size.Unknown || b.size === Size.Unknown || a.size !== b.size) {
          elem.size = Size.Unknown
        }
        input[j] = null
      }
    }
    result.push(elem)
  }
  return result.length > 0 ? result : null
}
