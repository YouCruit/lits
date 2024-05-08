import { styles } from '../styles'

export function getSearchDialog() {
  return `
    <div id="search-dialog-overlay" class="dialog-overlay">
      <div class="dialog-wrapper">
        <div id="search-dialog" class="dialog fancy-scroll">
          <div ${styles('flex', 'flex-col', 'gap-4', 'p-4')}>
            <input placeholder="Search" id="search-input" ${styles('w-full', 'p-2')}/>
            <div id="no-search-result" ${styles('self-center', 'm-8', 'text-xl', 'text-color-gray-500')}>
              Search for functions and special expressions
            </div>
            <div id="search-result" ${styles('self-center', 'm-8', 'text-xl', 'text-color-gray-500')}>
              Cool stuff found
            </div>
          </div>
        </div>
      </div>
    <div>
    `
}
