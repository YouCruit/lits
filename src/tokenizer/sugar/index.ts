import { Token } from '../interface'
import { applyDots } from './applyDots'

export type SugarFunction = (tokens: Token[]) => Token[]

export function getSugar(): SugarFunction[] {
  return [applyDots]
}
