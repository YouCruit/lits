export function getClojureDocsLink(functionName: string, clojureDocs?: string | null) {
    return clojureDocs
      ? `https://clojuredocs.org/clojure.core/${clojureDocs ?? functionName.replace('?', '_q')}`
      : null
  }