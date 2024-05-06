import type { CssTemplateFunction, Styles } from '.'

enum Color {
  Argument = '#c586c0',
  Name = '#4ec9b0',
  FunctionName = '#569cd6',
  Number = '#dcdcaa',
  String = '#cc8f77',
  Keyword = '#d16969',
  White = '#ffffff',
  Gray_50	= 'rgb(249 250 251)',
  Gray_100 = 'rgb(243 244 246)',
  Gray_200 = 'rgb(229 231 235)',
  Gray_300 = 'rgb(209 213 219)',
  Gray_400 = 'rgb(156 163 175)',
  Gray_500 = 'rgb(107 114 128)',
  Gray_600 = 'rgb(75 85 99)',
  Gray_700 = 'rgb(55 65 81)',
  Gray_800 = 'rgb(31 41 55)',
  Gray_900 = 'rgb(17 24 39)',
  Gray_950 = 'rgb(3 7 18)',
  Black = '#000000',
}

export function getColorStyles(css: CssTemplateFunction) {
  const colorStyles = {
    'color-Comment': css`
      color: ${Color.Gray_500};
    `,
    'color-Argument': css`
      color: ${Color.Argument};
    `,
    'color-Name': css`
      color: ${Color.Name};
    `,
    'color-FunctionName': css`
      color: ${Color.FunctionName};
    `,
    'color-Number': css`
      color: ${Color.Number};
    `,
    'color-String': css`
      color: ${Color.String};
    `,
    'color-Operator': css`
      color: ${Color.Gray_200};
    `,
    'color-Keyword': css`
      color: ${Color.Keyword};
    `,
    'color-white': css`
      color: ${Color.White};
    `,
    'color-gray-50': css`
      color: ${Color.Gray_50};
    `,
    'color-gray-100': css`
      color: ${Color.Gray_100};
    `,
    'color-gray-200': css`
      color: ${Color.Gray_200};
    `,
    'color-gray-300': css`
      color: ${Color.Gray_300};
    `,
    'color-gray-400': css`
      color: ${Color.Gray_400};
    `,
    'color-gray-500': css`
      color: ${Color.Gray_500};
    `,
    'color-gray-600': css`
      color: ${Color.Gray_600};
    `,
    'color-gray-700': css`
      color: ${Color.Gray_700};
    `,
    'color-gray-800': css`
      color: ${Color.Gray_800};
    `,
    'color-gray-900': css`
      color: ${Color.Gray_900};
    `,
    'color-gray-950': css`
      color: ${Color.Gray_950};
    `,
    'color-black': css`
      color: ${Color.Black};
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
