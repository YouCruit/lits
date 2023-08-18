import { Token } from '../interface'
import { applyCollectionAccessors } from './applyDots'

export type SugarFunction = (tokens: Token[]) => Token[]

export function getSugar(): SugarFunction[] {
  return [applyCollectionAccessors]
}
