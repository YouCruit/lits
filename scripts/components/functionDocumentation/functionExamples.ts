import { formatLitsExpression } from '../../formatter/formatters'
import { stringifyValue } from '../../utils/utils'
import { Lits } from '../../../src'
import { styles } from '../../styles'
import type { Category, Reference } from '../../../reference/index.ts'
import { penIcon } from '../../icons'

const lits = new Lits({ debug: false })

export function getFunctionExamples(reference: Reference<Category>) {
  const { examples, name } = reference
  return `
    <div ${styles('flex', 'flex-col', 'gap-8')}>
      ${examples
        .map(example => example.trim())
        .map((example) => {
          const oldLog = console.log
          console.log = function () {}
          const oldWarn = console.warn
          console.warn = function () {}
          let result
          const encodedUriExample = btoa(example)
          try {
            result = lits.run(`(try (do ${example}) (catch e e))`)
            const stringifiedResult = stringifyValue(result)

            const formattedExample = formatLitsExpression(example)

            return `
              <div ${styles('flex', 'gap-3')} >
              <a onclick="Playground.addToPlayground(';; ${name} example', '${encodedUriExample}')"> ${penIcon} </a>
              <div ${styles('text-sm', 'font-mono', 'flex', 'flex-col', 'gap-3')} >
                <div ${styles('whitespace-pre-wrap')}>${formattedExample}</div>
                <div ${styles('whitespace-pre-wrap', 'text-color-gray-400')}>${stringifiedResult}</div>
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
