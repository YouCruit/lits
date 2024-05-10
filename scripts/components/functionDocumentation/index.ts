import { type Category, type Reference, functionReference } from '../../../reference'
import { styles } from '../../styles'
import { formatDescription } from './description'
import { getFunctionExamples } from './functionExamples'
import { getArgumentInfo } from './argumentInfo'
import { getSection } from './section'
import { getFunctionSignature } from './functionSignature'

export function getFunctionDocumentations() {
  return Object.values(functionReference)
    .map(obj => getFunctionDocumentation(obj))
    .join('\n')
}

function getFunctionDocumentation(reference: Reference<Category>) {
  const { name, linkName, category } = reference

  return `
  <div id="${linkName}" class="content function">
    <div ${styles('flex', 'justify-between', 'text-2xl', 'items-center', 'bg-gray-700', 'p-2', 'px-4')}">
    <div ${styles('text-color-gray-200')}>${name}</div>
    <div ${styles('text-color-gray-400')}>${category}</div>
  </div>

  ${category === 'Special expression' ? '<h3>Special Expression</h3>' : ''}

  <div ${styles('mb-6', 'mt-4', 'font-mono', 'text-base')}>${getFunctionSignature(reference)}</div>

  ${getSection('Description', formatDescription(reference.description, reference))}

  ${getSection('Arguments', getArgumentInfo(reference))}

  ${getSection('Examples', getFunctionExamples(reference))}

</div>`
}
