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

export type Styles = Record<CssClass, string[]>
export type CssTemplateFunction = ReturnType<typeof createCssTag>

const simpleCss = createCssTag()

const basicStyles = {
  ...getColorStyles(simpleCss),
  ...getTextStyles(simpleCss),
  ...getSpacingStyles(simpleCss),
  ...getFlexStyles(simpleCss),
  ...getAlignAndJustifyStyles(simpleCss),
  ...getWhitespaceStyles(simpleCss),
  ...getCursorStyles(simpleCss),
  ...getBorderStyles(simpleCss),
} satisfies Partial<Styles>

const utilityStyles = getUtilityStyles(createCssTag(basicStyles))

const allStyles: Styles = { ...basicStyles, ...utilityStyles }

export function styles(...classes: CssClass[]): string {
  return `style="${[...new Set(classes)].flatMap(c => allStyles[c]).join(' ')}"`
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
