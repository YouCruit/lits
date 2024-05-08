import { styles } from "../styles";

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
    <div ${styles('flex', 'justify-end', 'bg-transparent', 'text-sm', 'w-full', 'text-color-gray-300')}>
      <a ${styles('pr-2', 'pb-1') } onclick="resetPlayground()">Reset Playground</a>
    </div>
    <div id="resize-playground" ${styles('height: 5px;', 'bg-gray-600', 'cursor-row-resize')}></div>
    ${
    // <div class="header row">
    // <div class="column shrink">Playground</span></div>
    // <div class="column right">
    //   <span class="button" onclick="run()">Run [F2]</span>
    //   <span class="button" onclick="analyze()">Analyze [F3]</span>
    //   <span class="button" onclick="tokenize(false)">Tokenize [F4]</span>
    //   <span class="button" onclick="tokenize(true)">Tokenize (debug) [F5]</span>
    //   <span class="button" onclick="parse(false)">Parse [F6]</span>
    //   <span class="button" onclick="parse(true)">Parse (debug) [F7]</span>
    //   <span class="button" onclick="resetPlayground()">Reset</span>
    // </div>
    // </div>
    ''}
    <div id="panels-container" ${styles('h-full', 'w-full', 'flex', 'flex-row', 'whitespace-nowrap')}>
      <div id="params-panel" ${styles('h-full')}>
        <div id="params-links" ${styles('relative', 'top-1', 'float-right', 'mr-2')}>
          <div ${styles('flex', 'flex-row', 'gap-2', 'text-sm', 'text-color-gray-300')}>
            <a onclick="resetParams()">Clear</a>
          </div>
        </div>
        <textarea ${styles('h-full', 'border-0', 'pb-1')} id="params-textarea" placeholder="Parameters" class="fancy-scroll" spellcheck="false"></textarea>
      </div
  
      ><div id="resize-divider-1" ${styles('width: 5px;', 'h-full', 'cursor-col-resize', 'bg-gray-600')}></div
  
      ><div id="lits-panel" ${styles('h-full')}>
        <div id="lits-links" ${styles('relative', 'top-1', 'float-right', 'mr-2')}>
          <div ${styles('flex', 'flex-row', 'gap-2', 'text-sm', 'text-color-gray-300')}>
            <a onclick="run()">Run</a>
            ${
            // <a onclick="analyze()">Analyze [F3]</a>
            // <a onclick="tokenize(false)">Tokenize [F4]</a>
            // <a onclick="tokenize(true)">Tokenize (debug) [F5]</a>
            // <a onclick="parse(false)">Parse [F6]</a>
            // <a onclick="parse(true)">Parse (debug) [F7]</a>
            ''}
            <a onclick="resetLitsCode()">Clear</a>
          </div>
        </div>
        <textarea ${styles('h-full', 'border-0', 'pb-8')} id="lits-textarea" placeholder="Lits code, F2 to run" class="fancy-scroll" spellcheck="false"></textarea>
      </div
  
      ><div id="resize-divider-2" ${styles('width: 5px;', 'h-full', 'cursor-col-resize', 'bg-gray-600', 'h-full')}></div
  
      ><div id="output-panel" ${styles('h-full')}>
        <div id="output-links" ${styles('relative', 'top-1', 'float-right', 'mr-2')}>
          <div ${styles('flex', 'flex-row', 'gap-2', 'text-sm', 'text-color-gray-300')}>
            <a onclick="resetOutput()">Clear</a>
          </div>
        </div>
        <textarea ${styles('h-full', 'border-0')} id="output-textarea" class="fancy-scroll" readonly spellcheck="false" placeholder="Output" ></textarea>
      </div>
    </div>
  </div>
  `
  }