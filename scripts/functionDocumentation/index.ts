import { type Category, type Reference, isNormalExpressionArgument, isSpecialExpressionArgument } from '../../reference'
import { styles } from '../styles'
import { getClojureDocsLink } from './clojureDocs'
import { formatDescription } from './description'
import { getFunctionExamples } from './functionExamples'
import { getArgumentInfo } from './argumentInfo'
import { getReturnType } from './returnType'
import { getSection } from './section'

export function getFunctionDocumentation(reference: Reference<Category>) {
  const { name, linkName, examples, clojureDocs, category } = reference
  const clojureDocsLink = getClojureDocsLink(name, clojureDocs)

  return `
  <div id="${linkName}" class="content function">
  
    <div class="function-header row">
      <div class="column">${name}</div>
      ${
        clojureDocsLink
          ? `<div class="column right"><a target="_blank" class="link" href="${clojureDocsLink}">Clojure docs</a></div>`
          : ''
      }
    </div>
  
    ${category === 'Special expression' ? '<h3>Special Expression</h3>' : ''}

    <div ${styles('mb-6', 'mt-4', 'font-mono')}>${getSyntax(reference)}</div>
  
    ${getSection('Description', formatDescription(reference.description, reference))}
  
    ${getSection('Returns', getReturnType(reference))}
 
    ${getSection('Arguments', getArgumentInfo(reference))}

    ${getSection('Examples', getFunctionExamples(examples))}

  </div>
  `
}

function getSyntax({ name, variants, args }: Reference<Category>) {
  return variants.map(variant =>
    `(<span ${styles('color-FunctionName')}>${name}</span> ${variant.argumentNames.map((argName) => {
      let result = ''
      const arg = args[argName]
      if (isNormalExpressionArgument(arg)) {
        if (arg.rest)
          result += '& '
        result += `<span ${styles('color-Argument')}>${argName}</span>`
      }
      else if (isSpecialExpressionArgument(arg)) {
        result += `<span ${styles('color-Argument')}>${argName}</span>`
      }
      return result
    }).join(' ')})`).join('<br>',
  )
}
