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

            return `
              <div ${styles('text-sm', 'font-mono', 'flex', 'flex-col', 'gap-2')} >
                <div ${styles('flex', 'flex-row', 'gap-2')}>
                  <span ${styles('color-gray-300', 'font-bold')}>=&gt</span>
                  <div ${styles('whitespace-pre', 'cursor-pointer')} class="hover-bold" onclick="addToPlayground(\`${encodedUriExample}\`)">${formattedExample}</div>
                </div>
                <div ${styles('whitespace-pre', 'ml-2', 'color-gray-400')}>${stringifiedResult}</div>
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
