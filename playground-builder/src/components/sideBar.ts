import type { Reference } from '../../../reference'
import { apiReference } from '../../../reference'
import { categories } from '../../../reference/api'
import { searchIcon } from '../icons'
import { styles } from '../styles'

export function getSideBar() {
  const categoryCollections = Object.values(apiReference).reduce((result: Record<string, Reference[]>, obj) => {
    result[obj.category] = result[obj.category] || []
    result[obj.category]!.push(obj)
    return result
  }, {})

  return `
  <nav id="sidebar" class="fancy-scroll-background">
    <div ${styles('py-1', 'px-2', 'text-color-gray-400', 'flex', 'items-center', 'justify-between', 'gap-2', 'mb-4', 'cursor-pointer', 'border-gray-300', 'border', 'border-solid')} onclick="Playground.Search.openSearch()">
      <span ${styles('flex', 'items-center', 'gap-1')}>
        ${searchIcon}
        <span>Search</span>
      </span>
      <span ${styles('text-sm')}>F3</span>
    </div>
    <label class="link" onclick="Playground.showPage('index')">Home</label>
    <br />
    <label class="link" onclick="Playground.showPage('example-page')">Examples</label>
    <br />
    ${categories
      .map((categoryKey) => {
        return `
          <label>${categoryKey}</label>
          <ul>
            ${
              categoryCollections[categoryKey]
                ? categoryCollections[categoryKey]!
                    .sort((a, b) => (a.title < b.title ? -1 : a.title > b.title ? 1 : 0))
                    .map((obj) => {
                      const linkName = obj.linkName
                      const name = escape(obj.title)
                      return `<li id="${linkName}_link" ${styles('scroll-my-2')}onclick="Playground.showPage('${linkName}')">${name}</li>`
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
