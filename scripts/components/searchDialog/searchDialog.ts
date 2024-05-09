import { createStyles, css } from '../../styles'

const styles = createStyles({
  SearchResult: css`
    @apply flex;
    @apply flex-col;
    @apply gap-4;
    @apply w-full;
    @apply px-4;
    @apply text-xl;
    @apply text-color-gray-500;
    @apply h-full;
    overflow-y: auto;
  `,
  Dialog: css`
    @apply text-color-gray-500;
    @apply bg-gray-700;
    width: 500px;
    border-radius: 5px;
    @apply border;
    @apply border-gray-500;
    @apply border-solid;
  `,
})

export function getSearchDialog() {
  return `
    <div id="search-dialog-overlay" class="dialog-overlay">
      <div class="dialog-wrapper">
        <div id="search-dialog" ${styles('Dialog')}>
          <div ${styles('flex', 'flex-col', 'gap-4', 'py-4', 'h-full')}>
            <div ${styles('px-4')}>
              <input placeholder="Search" id="search-input" ${styles('w-full', 'px-3', 'py-2')}/>
            </div>
            <div id="no-search-result" ${styles('self-center', 'm-8', 'text-xl', 'text-color-gray-500')}>
              Search for functions and special expressions
            </div>
            <div id="search-result" ${styles('SearchResult')} class="fancy-scroll">
            </div>
          </div>
        </div>
      </div>
    <div>
    `
}
