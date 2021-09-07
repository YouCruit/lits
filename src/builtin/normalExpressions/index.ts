import { BuiltinNormalExpressions } from './interface'
import { string } from './string'
import { list } from './list'
import { math } from './math'
import { predicates } from './predicates'
import { misc } from './misc'

export const normalExpressions: BuiltinNormalExpressions = {
  ...predicates,
  ...math,
  ...list,
  ...string,
  ...misc,
}
