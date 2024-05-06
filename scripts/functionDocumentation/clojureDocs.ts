export function getClojureDocsLink(functionName: string, clojureDocs?: string | null): string | null {
    const path = clojureDocs === null ? null : clojureDocs ?? functionName.replace('?', '_q')
    return path
      ? `https://clojuredocs.org/clojure.core/${path}`
      : null
  }