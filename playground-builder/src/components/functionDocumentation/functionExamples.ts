/* eslint-disable no-console */
import { Lits } from '../../../../src'
import { styles } from '../../styles/index'
import type { Reference } from '../../../../reference'
import { penIcon } from '../../icons'
import { formatLitsExpression } from '../../formatter/rules'
import { stringifyValue } from '../../../../common/utils'

const lits = new Lits({ debug: false })

export function getFunctionExamples(reference: Reference) {
  const { examples, title: name } = reference
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
              <a onclick="Playground.addToPlayground('${name}', '${encodedUriExample}')"> ${penIcon} </a>
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
