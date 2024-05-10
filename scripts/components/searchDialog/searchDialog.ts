import { createStyles, css } from '../../styles'
import { Color } from '../../styles/colorStyles'

const styles = createStyles({
  Wrapper: css`
    display: flex;
    justify-content: center;
    align-items: top;
    padding-top: 100px;
    max-height: calc(100% - 100px);
  `,

  SearchResult: css`
    @apply hidden;
    @apply flex-col;
    @apply gap-4;
    @apply w-full;
    @apply px-4;
    @apply py-3;
    @apply text-xl;
    @apply text-color-gray-500;
    @apply h-full;
    overflow-y: auto;
  `,
  Dialog: css`
    @apply text-color-gray-500;
    @apply bg-gray-700;
    @apply border;
    @apply border-gray-600;
    @apply border-solid;
    width: 600px;
    border-radius: 3px;
  `,
  SearchIntro: css`
    flex: 0;
    @apply hidden;
    @apply self-center;
    @apply text-xl;
    @apply h-full;
    @apply text-color-gray-400;
  `,
  NoResult: css`
    @apply hidden;
    @apply self-center;
    @apply m-8;
    @apply text-xl;
    @apply h-full;
    @apply text-color-gray-400;
  `,
})

export function getSearchDialog() {
  return `
    <style>
      .search-entry:hover {
        box-shadow: 0 0 10px ${Color.Gray_900};
      }
      .search-entry.selected {
        outline: 1px solid ${Color.Gray_300};
      }
    </style>
    <div id="search-dialog-overlay" class="dialog-overlay">
    
      <div ${styles('Wrapper')}>
        <div id="search-dialog" ${styles('Dialog')}>
          <div ${styles('flex', 'flex-col', 'gap-4', 'py-4', 'h-full')}>
            <div ${styles('px-4')}>
              <form autocomplete="off">
                <input placeholder="Search" id="search-input" ${styles('w-full', 'px-3', 'pt-2')}/>
              </form>
            </div>
            <div id="search-intro" ${styles('SearchIntro')}>
              Search for functions and special expressions
            </div>
            <div id="no-search-result" ${styles('NoResult')}>
              Nothing found
            </div>
            <div id="search-result" ${styles('SearchResult')} class="fancy-scroll">
            </div>
          </div>
        </div>
      </div>
    <div>
    `
}
