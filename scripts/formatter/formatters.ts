import { styles } from '../styles'
import { functionNameRule, litsKeywordRule, nameRule, numberRule, shortcutStringRule, stringRule } from './rules'
import { createFormatter } from './createFormatter'

const litsExpressionRules = [
  stringRule,
  shortcutStringRule,
  functionNameRule,
  numberRule,
  litsKeywordRule,
  nameRule,
]
export const formatLitsExpression = createFormatter(litsExpressionRules, {
  prefix: `<div ${styles('color-gray-200')}>`,
  suffix: '</div>',
})
