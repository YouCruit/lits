import { type Category, type Reference, functionReference } from '../reference'
import { styles } from './styles'

export interface SearchResultEntry {
  name: string
  html: string
}

const searchables: Reference<Category>[] = Object
  .values(functionReference)
  .sort((a, b) => a.name.localeCompare(b.name))

export const allSearchResultEntries: SearchResultEntry[] = searchables.map((reference) => {
  return {
    name: reference.name,
    html: `
      <div ${styles('w-full', 'flex', 'flex-col', 'p-4', 'bg-gray-600')}>
        <div class="search-result-name">${reference.name}</div>
        <div class="search-result-category">${reference.category}</div>
      </div>
    `,
  }
})
