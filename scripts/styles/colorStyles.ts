import type { CssTemplateFunction, Styles } from '.'

enum Color {
  Argument = '#c586c0',
  Name = '#4ec9b0',
  FunctionName = '#569cd6',
  Number = '#dcdcaa',
  String = '#cc8f77',
  Keyword = '#d16969',
  White = '#ffffff',
  Gray_50 = 'rgb(250 250 250)',
  Gray_100 = 'rgb(245 245 245)',
  Gray_200 = 'rgb(229 229 229)',
  Gray_300 = 'rgb(212 212 212)',
  Gray_400 = 'rgb(163 163 163)',
  Gray_500 = 'rgb(115 115 115)',
  Gray_600 = 'rgb(82 82 82)',
  Gray_700 = 'rgb(64 64 64)',
  Gray_800 = 'rgb(38 38 38)',
  Gray_900 = 'rgb(23 23 23)',
  Gray_950 = 'rgb(10 10 10)',
  Black = '#000000',
}

export function getColorStyles(css: CssTemplateFunction) {
  const colorStyles = {
    'text-color-Comment': css`
      color: ${Color.Gray_500};
    `,
    'text-color-Argument': css`
      color: ${Color.Argument};
    `,
    'text-color-Name': css`
      color: ${Color.Name};
    `,
    'text-color-FunctionName': css`
      color: ${Color.FunctionName};
    `,
    'text-color-Number': css`
      color: ${Color.Number};
    `,
    'text-color-String': css`
      color: ${Color.String};
    `,
    'text-color-Operator': css`
      color: ${Color.Gray_200};
    `,
    'text-color-Keyword': css`
      color: ${Color.Keyword};
    `,
    'text-color-inherit': css`
      color: inherit;
    `,
    'text-color-current': css`
      color: currentColor;
    `,
    'text-color-transparent': css`
      color: transparent;
    `,
    'text-color-white': css`
      color: ${Color.White};
    `,
    'text-color-gray-50': css`
      color: ${Color.Gray_50};
    `,
    'text-color-gray-100': css`
      color: ${Color.Gray_100};
    `,
    'text-color-gray-200': css`
      color: ${Color.Gray_200};
    `,
    'text-color-gray-300': css`
      color: ${Color.Gray_300};
    `,
    'text-color-gray-400': css`
      color: ${Color.Gray_400};
    `,
    'text-color-gray-500': css`
      color: ${Color.Gray_500};
    `,
    'text-color-gray-600': css`
      color: ${Color.Gray_600};
    `,
    'text-color-gray-700': css`
      color: ${Color.Gray_700};
    `,
    'text-color-gray-800': css`
      color: ${Color.Gray_800};
    `,
    'text-color-gray-900': css`
      color: ${Color.Gray_900};
    `,
    'text-color-gray-950': css`
      color: ${Color.Gray_950};
    `,
    'text-color-black': css`
      color: ${Color.Black};
    `,
    'bg-inherit': css`
      background-color: inherit;
    `,
    'bg-current': css`
      background-color: currentColor;
    `,
    'bg-transparent': css`
      background-color: transparent;
    `,
    'bg-white': css`
      background-color: ${Color.White};
    `,
    'bg-gray-50': css`
      background-color: ${Color.Gray_50};
    `,
    'bg-gray-100': css`
      background-color: ${Color.Gray_100};
    `,
    'bg-gray-200': css`
      background-color: ${Color.Gray_200};
    `,
    'bg-gray-300': css`
      background-color: ${Color.Gray_300};
    `,
    'bg-gray-400': css`
      background-color: ${Color.Gray_400};
    `,
    'bg-gray-500': css`
      background-color: ${Color.Gray_500};
    `,
    'bg-gray-600': css`
      background-color: ${Color.Gray_600};
    `,
    'bg-gray-700': css`
      background-color: ${Color.Gray_700};
    `,
    'bg-gray-800': css`
      background-color: ${Color.Gray_800};
    `,
    'bg-gray-900': css`
      background-color: ${Color.Gray_900};
    `,
    'bg-gray-950': css`
      background-color: ${Color.Gray_950};
    `,
    'bg-black': css`
      background-color: ${Color.Black};
    `,
    'border-inherit': css`
      color: inherit;
    `,
    'border-current': css`
      color: currentColor;
    `,
    'border-transparent': css`
      color: transparent;
    `,
    'border-white': css`
      border-color: ${Color.White};
    `,
    'border-gray-50': css`
      border-color: ${Color.Gray_50};
    `,
    'border-gray-100': css`
      border-color: ${Color.Gray_100};
    `,
    'border-gray-200': css`
      border-color: ${Color.Gray_200};
    `,
    'border-gray-300': css`
      border-color: ${Color.Gray_300};
    `,
    'border-gray-400': css`
      border-color: ${Color.Gray_400};
    `,
    'border-gray-500': css`
      border-color: ${Color.Gray_500};
    `,
    'border-gray-600': css`
      border-color: ${Color.Gray_600};
    `,
    'border-gray-700': css`
      border-color: ${Color.Gray_700};
    `,
    'border-gray-800': css`
      border-color: ${Color.Gray_800};
    `,
    'border-gray-900': css`
      border-color: ${Color.Gray_900};
    `,
    'border-gray-950': css`
      border-color: ${Color.Gray_950};
    `,
    'border-black': css`
      border-color: ${Color.Black};
    `,
  } satisfies Partial<Styles>

  return colorStyles
}
