import { apiReference, isFunctionReference } from '../../../reference'
// import type { Reference } from '../../../reference'
// import { formatDescription } from './description.ts'
// import { getFunctionExamples } from './functionExamples.ts'
// import { getArgumentInfo } from './argumentInfo.ts'
// import { getSection } from './section'
import type { TextFormatter } from '../../../common/textFormatter'
import { isApiName } from '../../../reference/api'
import { getFunctionSignature } from './functionSignature'
// import { getClojureDocsLink } from './clojureDocs'
import { getTitle } from './title'

export function getDocumentation(fmt: TextFormatter, name: string) {
  if (!isApiName(name))
    return `No documentation available for ${name}`

  const reference = apiReference[name]

  // const clojureDocsLink = getClojureDocsLink(reference.title, reference.clojureDocs)
  // const functionReferences = reference.seeAlso?.map(apiName => apiReference[apiName])

  return `${getTitle(fmt, reference)}
${isFunctionReference(reference) ? getFunctionSignature(fmt, reference) : ''}`

  //   ${getSection('Description', formatDescription(reference.description, reference), 'mb-3', 'text-base')}

  //   ${functionReferences
  //     ? getSection(
  //         'See also',
  //         getSeeAlsoLinks(functionReferences),
  //         'my-3',
  //         'text-base',
  //         'text-color-gray-400',
  //       )
  //     : ''}

  //   ${
  //     clojureDocsLink
  //       ? `<a target="_blank" ${styles('flex', 'gap-1', 'items-center', 'text-sm', 'underline', 'mt-3', 'mb-6')} href="${clojureDocsLink}">
  //           <span ${styles('pt-1')}>${externalLinkIcon}</span>
  //           <span>Clojure docs</span>
  //         </a>`
  //       : `<div ${styles('height: 0.75rem;')}></div>`
  //   }

  //   ${isFunctionReference(reference) ? getSection('Arguments', getArgumentInfo(reference)) : ''}

  //   ${getSection('Examples', getFunctionExamples(reference))}

  // </div>`
}

// function getSeeAlsoLinks(references: Reference[]) {
//   return `<div ${styles('flex', 'flex-col')}>
//     ${references.map((reference) => {
//       return `<a onclick="Playground.showPage('${reference.linkName}')"><span>${escapeTitle(reference.title)}</span></a>`
//     }).join('')}
//   </div>`
// }
