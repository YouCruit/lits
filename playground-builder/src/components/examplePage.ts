import { examples } from '../../../reference/examples'
import { styles } from '../styles'

export function getExamplePage(): string {
  return `
  <div id="example-page" class="content">
    <h1>Examples</h1>
    <br />
    <ul>
    ${examples
      .map((example) => {
        const encodedExample = btoa(JSON.stringify(example))
        return `
        <li>
          <div ${styles('flex', 'justify-between', 'items-center')}>
            <div ${styles('flex', 'flex-col')}>
              <div class="example-name">${example.name}</div>
              <div class="example-description">${example.description}</div>
            </div>
            <span class="button" onclick="Playground.setPlayground('${example.name}', \`${encodedExample}\`)">Show in playground</span>
          </div>
        </li>
      `
      })
      .join('\n')}
    </ul>
  </div>
  `
}
