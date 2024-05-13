import { clearIcon, hamburgerIcon, labIcon, playIcon, tokenIcon, treeIcon } from '../icons'
import { styles } from '../styles'

export function getPlayground() {
  return `
  <div id="playground" ${styles(
    'fixed',
    'bottom-0',
    'left-0',
    'right-0',
    'bg-gray-800',
    'bg-transparent',
  )}>
    <div id="resize-playground" ${styles('height: 5px;', 'bg-gray-600', 'cursor-row-resize')}></div>
    <div ${styles('inline-block', 'absolute', 'right-0', 'top: -23px;', 'justify-end', 'bg-transparent', 'text-sm', 'text-color-gray-400')}>
      <a ${styles('pr-4', 'p-1', 'background-color: #222222;', 'mr-2')} onclick="Playground.resetPlayground()">Reset Playground</a>
    </div>

    <div id="panels-container" ${styles('h-full', 'w-full', 'flex', 'flex-row', 'whitespace-nowrap')}>
      <div id="params-panel" ${styles('h-full')}>
        <div id="params-links" ${styles('relative', 'top-1', 'float-right', 'mr-2', 'text-color-gray-400')}>
          <div ${styles('flex', 'flex-row', 'gap-2', 'text-sm', 'text-color-gray-400')}>
            <a onclick="Playground.resetParams()" ${styles('text-xl')}>${clearIcon}</a>
          </div>
        </div>
        <textarea ${styles('h-full', 'border-0', 'pb-1')} id="params-textarea" placeholder="Parameters" class="fancy-scroll" spellcheck="false"></textarea>
      </div
  
      ><div id="resize-divider-1" ${styles('width: 5px;', 'h-full', 'cursor-col-resize', 'bg-gray-600')}></div
  
      ><div id="lits-panel" ${styles('h-full')}>
        <div
          id="lits-links"
          onclick="event.preventDefault(); event.stopPropagation()"
          ${styles('relative', 'top: 6px;', 'float-right', 'mr-2', 'text-color-gray-400')}
        >
          <div ${styles('flex', 'flex-row', 'gap-1', 'text-sm', 'text-color-gray-400')}>
            <a onclick="Playground.run()" ${styles('text-xl')}>${playIcon}</a>
            <a onclick="Playground.resetLitsCode()" ${styles('text-xl')}>${clearIcon}</a>
            <div>
              <a onclick="Playground.toggleMoreMenu()" ${styles('text-xl')}>${hamburgerIcon}</a>
              <div id="more-menu" ${styles('hidden', 'max-width: 20rem;', 'absolute', 'right-0', 'p-2', 'border-0', 'border-solid', 'border-gray-300', 'bg-gray-700')}>
                <div ${styles('flex', 'flex-col', 'gap-2', 'text-base')}>
                  <a ${styles('flex', 'justify-between', 'w-full')} onclick="Playground.closeMoreMenu(); Playground.run()">
                    <div ${styles('flex', 'gap-2', 'w-full')}>
                      <span ${styles('text-color-gray-200')}>${playIcon}</span>
                      Run
                    </div>
                    F5
                  </a>
                  <a ${styles('flex', 'gap-2', 'w-full')} onclick="Playground.closeMoreMenu(); Playground.analyze()">
                    <span ${styles('text-color-FunctionName')}>${labIcon}</span>
                    Analyze
                  </a>
                  <a ${styles('flex', 'gap-2', 'w-full')} onclick="Playground.closeMoreMenu(); Playground.tokenize(false)">
                    <span ${styles('text-color-Name')}>${tokenIcon}</span>
                    Tokenize
                  </a>
                  <a ${styles('flex', 'gap-2', 'w-full')} onclick="Playground.closeMoreMenu(); Playground.parse(false)">
                    <span ${styles('text-color-Argument')}>${treeIcon}</span>
                    Parse
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <textarea ${styles('h-full', 'border-0', 'pb-8')} id="lits-textarea" placeholder="Lits code" class="fancy-scroll" spellcheck="false"></textarea>
      </div
  
      ><div id="resize-divider-2" ${styles('width: 5px;', 'h-full', 'cursor-col-resize', 'bg-gray-600', 'h-full')}></div
  
      ><div class="fancy-scroll" id="output-panel" ${styles('h-full', 'overflow-y: auto;')}>
        <div
          id="output-links"
          onclick="event => event.preventDefault()"
          ${styles('relative', 'top-1', 'float-right', 'mr-2', 'text-color-gray-400')}
        >
          <div ${styles('flex', 'flex-row', 'gap-2', 'text-sm', 'text-color-gray-400')}>
          <a onclick="Playground.resetOutput()" ${styles('text-xl')}>${clearIcon}</a>
          </div>
        </div>
        <div ${styles('h-full', 'p-2')}>
          <div id="output-placeholder" ${styles('text-color-gray-500', 'text-base', 'font-mono')}>Output</div>
          <div ${styles('text-sm', 'flex', 'flex-col', 'gap-2')} id="output-result"></div>
        </div>
      </div>
    </div>
  </div>
  `
}
