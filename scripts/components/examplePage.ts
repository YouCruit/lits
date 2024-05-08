import { examples } from "../../reference/examples"

export function getExamplePage(): string {
  return `
  <div id="example-page" class="content">
    <h1>Examples</h1>
    <br />
    <ul>
    ${examples
      .map((example) => {
        const uriEncodedExample = encodeURIComponent(JSON.stringify(example))
        return `
        <li>
          <div class="row example-item">
            <div class="column wide">
              <div class="example-name">${example.name}</div>
              <div class="example-description">${example.description}</div>
            </div>
            <div class="column right">
              <span class="button" onclick="setPlayground(\`${uriEncodedExample}\`)">Show in playground</span>
            </div>
          </div>
        </li>
      `
      })
      .join('\n')}
    </ul>
  </div>
  `
}
