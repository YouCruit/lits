import { type Reference, apiReference, isDatatypeReference, isFunctionReference, isShorthandReference } from '../../reference'
import { formatDescription } from './components/functionDocumentation/description'
import { getFunctionSignature } from './components/functionDocumentation/functionSignature'
import { styles } from './styles'

const shortDescriptionRegExp = /(.*?)( {2}\n|\n\n|$)/
export interface SearchResultEntry {
  title: string
  search: string
  html: string
}

const searchables: Reference[] = Object
  .values(apiReference)
  .sort((a, b) => a.title.localeCompare(b.title))

export const allSearchResultEntries: SearchResultEntry[] = searchables.map((reference) => {
  const match = shortDescriptionRegExp.exec(reference.description)
  const description = match?.[1] ?? reference.description

  return {
    title: reference.title,
    search: `${reference.title.replace(/&quot;/g, '"')} ${reference.category}`,
    html: getHtml(description, reference),
  }
})

function getHtml(description: string, reference: Reference) {
  const title = escapeTitle(reference.title)

  if (isFunctionReference(reference)) {
    return `
    <div onclick="Playground.showPage('${reference.linkName}')" class="search-entry" ${styles('w-full', 'flex', 'flex-col', 'p-4', 'scroll-my-4', 'cursor-pointer')}>
      <div ${styles('mb-4', 'flex', 'justify-between', 'items-baseline')}>
        <div ${styles('text-lg', 'font-bold', 'text-color-gray-300')}>${title}</div>
        <div ${styles('text-base', 'text-color-gray-400')}>${reference.category}</div>
      </div>
      <div ${styles('text-base', 'mb-4')}>
        ${getFunctionSignature(reference)}
      </div>
      <div ${styles('text-base')}>
        ${formatDescription(description, reference)}
      </div>
    </div>
  `
  }
  else if (isShorthandReference(reference) || isDatatypeReference(reference)) {
    return `
    <div onclick="Playground.showPage('${reference.linkName}')" class="search-entry" ${styles('w-full', 'flex', 'flex-col', 'p-4', 'scroll-my-4', 'cursor-pointer')}>
      <div ${styles('mb-4', 'flex', 'justify-between', 'items-baseline')}>
        <div ${styles('text-lg', 'font-bold', 'text-color-gray-300')}>${title}</div>
        <div ${styles('text-base', 'text-color-gray-400')}>${reference.category}</div>
      </div>
      <div ${styles('text-base')}>
        ${formatDescription(description, reference)}
      </div>
    </div>
  `
  }

  return ''
}

function escapeTitle(title: string) {
  return title.replace(/"/g, '&quot;')
}
