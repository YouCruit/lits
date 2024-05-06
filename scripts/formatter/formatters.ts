import { styles } from '../styles'
import { createFormatter } from './createFormatter'
import { litsExpressionRules } from './rules'

export const formatLitsExpression = createFormatter(litsExpressionRules, {
  prefix: `<div ${styles('color-gray-200')}>`,
  suffix: '</div>',
})
