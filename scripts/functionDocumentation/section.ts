import { styles } from '../styles'

export function getSection(name: string, content: string): string {
  if (!content)
    return ''

  return `
    <div ${styles('mb-6')}>
    <div ${styles('SubHeader')}>${name}</div>
    ${content}
  </div>`
}
