import { formatLitsExpression } from '../formatter/formatters'
import { stringifyValue } from '../utils'
import { Lits } from '../../src'
import { styles } from '../styles'

const lits = new Lits({ debug: true })

export function getFunctionExamples(examples: string[]) {
  return `
    <div ${styles('flex', 'flex-col', 'gap-6')}>
      ${examples
        .map(example => example.trim())
        .map((example) => {
          const oldLog = console.log
          console.log = function () {}
          const oldWarn = console.warn
          console.warn = function () {}
          let result
          const encodedUriExample = encodeURIComponent(example)
          try {
            result = lits.run(example)
            const stringifiedResult = stringifyValue(result)

            const formattedExample = formatLitsExpression(example)
            // const formattedResult = formatResultExpression(stringifiedResult)

            return `
              <div ${styles('pl-3', 'border-solid', 'border-0', 'border-l-3', 'border-gray-400', 'text-sm', 'font-mono', 'flex', 'flex-col', 'gap-2')} >
                <div ${styles('whitespace-pre', 'cursor-pointer')} class="hover-bold" onclick="addToPlayground(\`${encodedUriExample}\`)">${formattedExample}</div>
                <div ${styles('flex', 'flex-row', 'gap-2', 'color-gray-400')}>
                  <span ${styles('color-gray-400', 'font-bold')}>-&gt</span>
                  <div ${styles('whitespace-pre')}>${stringifiedResult}</div>
                </div>
              </div>`
          }
          finally {
            console.log = oldLog
            console.warn = oldWarn
          }
        })
        .join('\n')}
    </div>`
}
