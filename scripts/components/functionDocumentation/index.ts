import { type Category, type Reference, functionReference, isNormalExpressionArgument, isSpecialExpressionArgument } from '../../../reference'
import { styles } from '../../styles'
import { getClojureDocsLink } from './clojureDocs'
import { formatDescription } from './description'
import { getFunctionExamples } from './functionExamples'
import { getArgumentInfo } from './argumentInfo'
import { getReturnType } from './returnType'
import { getSection } from './section'

export function getFunctionDocumentations() {
  return Object.values(functionReference)
    .map(obj => getFunctionDocumentation(obj))
    .join('\n')
}

function getFunctionDocumentation(reference: Reference<Category>) {
  const { name, linkName, clojureDocs, category } = reference
  const clojureDocsLink = getClojureDocsLink(name, clojureDocs)

  return `
  <div id="${linkName}" class="content function">
  
    <div ${styles('flex', 'justify-between', 'text-2xl', 'items-center', 'bg-gray-700', 'p-2', 'px-4')}">
      <div ${styles('text-color-gray-200')}>${name}</div>
      <div>
        ${
          clojureDocsLink
            ? `<a target="_blank" ${styles('text-color-gray-400', 'text-lg')} href="${clojureDocsLink}">Clojure docs</a>`
            : ''
        }
      </div>
    </div>
  
    ${category === 'Special expression' ? '<h3>Special Expression</h3>' : ''}

    <div ${styles('mb-6', 'mt-4', 'font-mono')}>${getSyntax(reference)}</div>
  
    ${getSection('Description', formatDescription(reference.description, reference))}
  
    ${getSection('Returns', getReturnType(reference))}
 
    ${getSection('Arguments', getArgumentInfo(reference))}

    ${getSection('Examples', getFunctionExamples(reference))}

  </div>
  `
}

function getSyntax({ name, variants, args }: Reference<Category>) {
  return variants.map(variant =>
    `(<span ${styles('text-color-FunctionName')}>${name}</span> ${variant.argumentNames.map((argName) => {
      let result = ''
      const arg = args[argName]
      if (isNormalExpressionArgument(arg)) {
        if (arg.rest)
          result += '& '
        result += `<span ${styles('text-color-Argument')}>${argName}</span>`
      }
      else if (isSpecialExpressionArgument(arg)) {
        result += `<span ${styles('text-color-Argument')}>${argName}</span>`
      }
      return result
    }).join(' ')})`).join('<br>',
  )
}
