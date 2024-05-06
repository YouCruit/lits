import type { CssTemplateFunction, Styles } from '.'

type UtilityStyles = Record<Capitalize<string>, unknown>

export function getUtilityStyles(css: CssTemplateFunction) {
  const utilityStyles = {
    Description: css`
      @apply color-gray-400;
      @apply font-sans;
      @apply text-base;
    `,
    Description_argument: css`
      @apply px-0.5; 
      @apply font-mono;
      @apply color-Argument;
    `,
    SubHeader: css`
      @apply color-gray-200;
      @apply text-base;
      @apply font-bold;
      @apply mb-2;
    `,
  } satisfies Partial<Styles> & UtilityStyles

  return utilityStyles
}
