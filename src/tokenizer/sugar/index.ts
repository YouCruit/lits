import type { Token } from '../interface'
import { applyCollectionAccessors } from './applyCollectionAccessor'

export type SugarFunction = (tokens: Token[]) => Token[]

export function getSugar(): SugarFunction[] {
  return [applyCollectionAccessors]
}
