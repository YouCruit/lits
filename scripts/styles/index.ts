import type { CssClass } from './classes'
import { getColorStyles } from './colorStyles'
import { getSpacingStyles } from './spacingStyles'
import { getTextStyles } from './textStyles'
import { getFlexStyles } from './flexStyles'
import { getUtilityStyles } from './utilityStyles'
import { getAlignAndJustifyStyles } from './alignAndJustifyStyles'
import { getWhitespaceStyles } from './whitespaceStyles'
import { getCursorStyles } from './cursorStyles'
import { getBorderStyles } from './borderStyles'
import { getSizeStyles } from './sizeStyles'
import { getZStyles } from './zStyles'
import { getPositionStyles } from './positionStyles'
import { getDisplayStyles } from './displayStyles'
import { getFloatStyles } from './floatStyles'
import { getTopRightBottomLeftStyles } from './topRightBottomLeftStyles'

export type Styles = Record<CssClass, string[]>
export type CssTemplateFunction = ReturnType<typeof createCssTag>

const css = createCssTag()

const basicStyles = {
  ...getColorStyles(css),
  ...getTextStyles(css),
  ...getSpacingStyles(css),
  ...getFlexStyles(css),
  ...getAlignAndJustifyStyles(css),
  ...getWhitespaceStyles(css),
  ...getCursorStyles(css),
  ...getBorderStyles(css),
  ...getSizeStyles(css),
  ...getZStyles(css),
  ...getPositionStyles(css),
  ...getDisplayStyles(css),
  ...getTopRightBottomLeftStyles(css),
  ...getFloatStyles(css),
} satisfies Partial<Styles>

const utilityStyles = getUtilityStyles(createCssTag(basicStyles))

const allStyles: Styles = { ...basicStyles, ...utilityStyles }

type StylesParam = CssClass | `${string}: ${string};`

export function styles(...classes: StylesParam[]): string {
  return `style="${[...new Set(classes)].flatMap((c) => {
    if (c.includes(':'))
      return c
    else 
    return allStyles[c as CssClass]
}).join(' ')}"`
}

export function createCssTag(dependencies: Partial<Styles> = {}) {
  return (strings: TemplateStringsArray, ...values: string[]): string[] => {
    const rawString = String.raw({ raw: strings }, ...values)
    return rawString
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .flatMap((expression) => {
        const applyMatch = expression.match(/^@apply (\S+);$/)
        if (applyMatch) {
          const cssClass = applyMatch[1] as CssClass
          const cssRules = dependencies[cssClass]
          if (!cssRules)
            throw new Error(`Unknown class: ${expression.slice(7)}`)

          return cssRules
        }
        else { return expression }
      })
  }
}
