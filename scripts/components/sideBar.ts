import type { Category, Reference } from '../../reference'
import { categorizedFunctions, functionReference } from '../../reference'
import { styles } from '../styles'

export function getSideBar() {
  const categoryCollections = Object.values(functionReference).reduce((result: Record<string, Reference<Category>[]>, obj) => {
    result[obj.category] = result[obj.category] || []
    result[obj.category]!.push(obj)
    return result
  }, {})

  return `
  <nav id="sidebar" class="fancy-scroll">
    <div ${styles('p-1', 'pl-2', 'text-color-gray-500', 'flex', 'items-center', 'gap-2', 'mb-4', 'cursor-pointer', 'border-gray-500', 'border', 'border-solid')} onclick="Playground.Search.openSearch()">
      Search
    </div>
    <label class="link" onclick="showPage('index')">Home</label>
    <br />
    <label class="link" onclick="showPage('example-page')">Examples</label>
    <br />
    ${categorizedFunctions
      .map((categoryKey) => {
        return `
          <label>${categoryKey}</label>
          <ul>
            ${
              categoryCollections[categoryKey]
                ? categoryCollections[categoryKey]!
                    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
                    .map((obj) => {
                      const linkName = obj.linkName
                      const name = escape(obj.name)
                      return `<li id="${linkName}_link" onclick="showPage('${linkName}')">${name}</li>`
                    })
                    .join('\n')
                : ''
            }
          </ul>`
      })
      .join('\n')}
  </nav>
  `
}

function escape(str: string) {
  str = str.replace(/>/g, '&gt;')
  str = str.replace(/</g, '&lt;')
  return str
}
