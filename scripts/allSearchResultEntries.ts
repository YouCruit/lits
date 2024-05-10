import { type Category, type Reference, functionReference } from '../reference'
import { formatDescription } from './components/functionDocumentation/description'
import { getFunctionSignature } from './components/functionDocumentation/functionSignature'
import { styles } from './styles'

const shortDescriptionRegExp = /(.*?)(  \n|\n\n|$)/
export interface SearchResultEntry {
  name: string
  html: string
}

const searchables: Reference<Category>[] = Object
  .values(functionReference)
  .sort((a, b) => a.name.localeCompare(b.name))

export const allSearchResultEntries: SearchResultEntry[] = searchables.map((reference) => {
  const match = shortDescriptionRegExp.exec(reference.description)
  const description = match?.[1] ?? reference.description
  return {
    name: reference.name,
    html: `
      <div onclick="showPage('${reference.linkName}')" class="search-entry" ${styles('w-full', 'flex', 'flex-col', 'p-4', 'scroll-my-4', 'bg-gray-600', 'cursor-pointer')}>
        <div ${styles('mb-4', 'flex', 'justify-between', 'items-baseline')}>
          <div ${styles('text-lg', 'font-bold', 'text-color-gray-300')}>${reference.name}</div>
          <div ${styles('text-base', 'text-color-gray-400')}>${reference.category}</div>
        </div>
        <div ${styles('text-base', 'mb-4')}>
          ${getFunctionSignature(reference)}
        </div>
        <div ${styles('text-base', 'mb-4')}>
          ${formatDescription(description, reference)}
        </div>
      </div>
    `,
  }
})
