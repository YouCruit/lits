import type { CssTemplateFunction, Styles } from '.'

export function getCursorStyles(css: CssTemplateFunction) {
  const cursorStyles = {
    'cursor-auto': css`
      cursor: auto;
    `,
    'cursor-default': css`
      cursor: default;
    `,
    'cursor-pointer': css`
      cursor: pointer;
    `,
    'cursor-wait': css`
      cursor: wait;
    `,
    'cursor-text': css`
      cursor: text;
    `,
    'cursor-move': css`
      cursor: move;
    `,
    'cursor-help': css`
      cursor: help;
    `,
    'cursor-not-allowed': css`
      cursor: not-allowed;
    `,
  } satisfies Partial<Styles>

  return cursorStyles
}
