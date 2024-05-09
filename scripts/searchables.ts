import { type Category, type Reference, functionReference } from '../reference'

export interface Searchable {
  type: 'Reference'
  reference: Reference<Category>
}

export const searchables: Searchable[] = Object.values(functionReference).slice(-1).map(reference => ({
  type: 'Reference',
  reference,
}))
