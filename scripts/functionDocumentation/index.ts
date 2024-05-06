import { type Category, type Reference, isNormalExpressionParameter, isSpecialExpressionParameter } from '../../reference'
import { styles } from '../styles'
import { getClojureDocsLink } from './clojureDocs'
import { formatDescription } from './description'
import { getFunctionExamples } from './functionExamples'
import { getParameterInfo } from './parameterInfo'
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
 
    ${getSection('Parameters', getParameterInfo(reference))}

    ${getSection('Examples', getFunctionExamples(examples))}

  </div>
  `
}

function getSyntax({ name, variants, parameters }: Reference<Category>) {
  return variants.map(variant =>
    `(<span ${styles('color-FunctionName')}>${name}</span> ${variant.parameterNames.map((parameterName) => {
      let result = ''
      const parameter = parameters[parameterName]
      if (isNormalExpressionParameter(parameter)) {
        if (parameter.rest)
          result += '& '
        result += `<span ${styles('color-Parameter')}>${parameterName}</span>`
      }
      else if (isSpecialExpressionParameter(parameter)) {
        result += `<span ${styles('color-Parameter')}>${parameterName}</span>`
      }
      return result
    }).join(' ')})`).join('<br>',
  )
}
