/* eslint-disable no-console */
/* eslint-disable no-alert */
/* eslint-disable unused-imports/no-unused-vars */
const defaultProgram = `(defn factorial [x]
  (if (= x 1)
    1
    (* x (factorial (dec x)))
  )
)

(factorial 10)
`

const DEFAULT_PLAYGROUND_HEIGHT = 500
const DEFAULT_RESIZE_DIVIDER1_X_PERCENT = 15
const DEFAULT_RESIZE_DIVIDER2_X_PERCENT = 80

let moveParams = null
let playgroundHeight = null
let resizeDivider1XPercent = null
let resizeDivider2XPercent = null
let windowHeight = null
let windowWidth = null
let availablePanelsWidth = null
let search = localStorage.getItem('search') || ''

function calculateDimensions() {
  windowHeight = window.innerHeight
  windowWidth = window.innerWidth
  availablePanelsWidth = windowWidth - 26
}

function layout() {
  calculateDimensions()

  const wrapper = document.getElementById('wrapper')
  const playground = document.getElementById('playground')
  const sidebar = document.getElementById('sidebar')
  const mainPanel = document.getElementById('main-panel')
  const paramsTextarea = document.getElementById('params-textarea')
  const litsTextarea = document.getElementById('lits-textarea')
  const outputTextarea = document.getElementById('output-textarea')
  const paramsPanel = document.getElementById('params-panel')
  const litsPanel = document.getElementById('lits-panel')
  const outputPanel = document.getElementById('output-panel')
  const resizeDivider1 = document.getElementById('resize-divider-1')
  const resizeDivider2 = document.getElementById('resize-divider-2')
  const clearSearchLink = document.getElementById('search-clear')

  const textAreaHeight = playgroundHeight - 77
  const topPanelsBottom = playgroundHeight + 8

  const paramsPanelWidth = (availablePanelsWidth * resizeDivider1XPercent) / 100
  const outputPanelWidth = (availablePanelsWidth * (100 - resizeDivider2XPercent)) / 100
  const litsPanelWidth = availablePanelsWidth - paramsPanelWidth - outputPanelWidth

  playground.style.height = `${playgroundHeight}px`
  resizeDivider1.style.height = `${playgroundHeight - 78}px`
  resizeDivider2.style.height = `${playgroundHeight - 78}px`
  resizeDivider1.style.marginTop = '20px'
  resizeDivider2.style.marginTop = '20px'
  paramsTextarea.style.height = `${textAreaHeight}px`
  litsTextarea.style.height = `${textAreaHeight}px`
  outputTextarea.style.height = `${textAreaHeight}px`

  paramsPanel.style.width = `${paramsPanelWidth}px`
  litsPanel.style.width = `${litsPanelWidth}px`
  outputPanel.style.width = `${outputPanelWidth}px`

  sidebar.style.bottom = `${topPanelsBottom}px`
  mainPanel.style.bottom = `${topPanelsBottom}px`

  wrapper.style.display = 'block'

  clearSearchLink.style.visibility = search ? 'visible' : 'hidden'
  filterSidebar()
}

function filterSidebar() {
  const sidebar = document.getElementById('sidebar')
  const sidebarEntries = Array.from(sidebar.getElementsByTagName('li'))

  sidebarEntries.forEach((entry) => {
    if (!search) {
      entry.style.display = 'block'
      entry.style.color = '#cccccc'
    }
    else {
      const text = entry.textContent
      if (text.toLowerCase().includes(search.toLowerCase())) {
        entry.style.display = 'block'
        entry.style.color = 'yellow'
      }
      else {
        entry.style.display = 'none'
        entry.style.color = undefined
      }
    }
  })
}

function resetPlayground() {
  if (confirm('Clear all data?')) {
    resetParams()
    resetLits()
    resetOutput()

    localStorage.removeItem('playground-height')
    localStorage.removeItem('resize-divider-1-percent')
    localStorage.removeItem('resize-divider-2-percent')
    playgroundHeight = DEFAULT_PLAYGROUND_HEIGHT
    resizeDivider1XPercent = DEFAULT_RESIZE_DIVIDER1_X_PERCENT
    resizeDivider2XPercent = DEFAULT_RESIZE_DIVIDER2_X_PERCENT
    clearSearch()
  }
}

function resetParams() {
  document.getElementById('params-textarea').value = ''
  localStorage.removeItem('params-textarea')
}

function resetLits() {
  document.getElementById('lits-textarea').value = ''
  localStorage.removeItem('lits-textarea')
}

function resetOutput() {
  document.getElementById('output-textarea').value = ''
}

function initializeSearch() {
  const searchInput = document.getElementById('search-input')
  searchInput.value = search
  searchInput.oninput = (event) => {
    search = event.target.value
    localStorage.setItem('search', search)
    layout()
  }
  searchInput.onkeyup = (event) => {
    if (event.key === 'Escape') {
      clearSearch()
      event.preventDefault()
    }
  }
}

function clearSearch() {
  const searchInput = document.getElementById('search-input')
  search = ''
  localStorage.setItem('search', search)
  searchInput.value = search
  layout()
}
window.onload = function () {
  const storedPlaygroundHeight = localStorage.getItem('playground-height')
  const storedResizeDivider1XPercent = localStorage.getItem('resize-divider-1-percent')
  const storedResizeDivider2XPercent = localStorage.getItem('resize-divider-2-percent')

  playgroundHeight = storedPlaygroundHeight ? Number(storedPlaygroundHeight) : DEFAULT_PLAYGROUND_HEIGHT
  resizeDivider1XPercent = storedResizeDivider1XPercent
    ? Number(storedResizeDivider1XPercent)
    : DEFAULT_RESIZE_DIVIDER1_X_PERCENT
  resizeDivider2XPercent = storedResizeDivider2XPercent
    ? Number(storedResizeDivider2XPercent)
    : DEFAULT_RESIZE_DIVIDER2_X_PERCENT

  lits = new Lits.Lits({ debug: true })
  litsNoDebug = new Lits.Lits({ debug: false })

  document.getElementById('resize-playground').onmousedown = (event) => {
    moveParams = {
      id: 'playground',
      startMoveY: event.clientY,
      heightBeforeMove: playgroundHeight,
    }
  }

  document.getElementById('resize-divider-1').onmousedown = (event) => {
    moveParams = {
      id: 'resize-divider-1',
      startMoveX: event.clientX,
      percentBeforeMove: resizeDivider1XPercent,
    }
  }

  document.getElementById('resize-divider-2').onmousedown = (event) => {
    moveParams = {
      id: 'resize-divider-2',
      startMoveX: event.clientX,
      percentBeforeMove: resizeDivider2XPercent,
    }
  }

  window.onresize = layout
  window.onmouseup = () => {
    document.body.classList.remove('no-select')
    moveParams = null
  }

  window.onmousemove = (event) => {
    if (moveParams === null)
      return

    document.body.classList.add('no-select')

    if (moveParams.id === 'playground') {
      playgroundHeight = moveParams.heightBeforeMove + moveParams.startMoveY - event.clientY
      if (playgroundHeight < 45)
        playgroundHeight = 45

      if (playgroundHeight > windowHeight - 89)
        playgroundHeight = windowHeight - 89

      localStorage.setItem('playground-height', playgroundHeight)
    }
    else if (moveParams.id === 'resize-divider-1') {
      resizeDivider1XPercent
        = moveParams.percentBeforeMove + ((event.clientX - moveParams.startMoveX) / availablePanelsWidth) * 100
      if (resizeDivider1XPercent < 10)
        resizeDivider1XPercent = 10

      if (resizeDivider1XPercent > resizeDivider2XPercent - 10)
        resizeDivider1XPercent = resizeDivider2XPercent - 10

      localStorage.setItem('resize-divider-1-percent', resizeDivider1XPercent)
    }
    else if (moveParams.id === 'resize-divider-2') {
      resizeDivider2XPercent
        = moveParams.percentBeforeMove + ((event.clientX - moveParams.startMoveX) / availablePanelsWidth) * 100
      if (resizeDivider2XPercent < resizeDivider1XPercent + 10)
        resizeDivider2XPercent = resizeDivider1XPercent + 10

      if (resizeDivider2XPercent > 90)
        resizeDivider2XPercent = 90

      localStorage.setItem('resize-divider-2-percent', resizeDivider2XPercent)
    }

    layout()
  }

  window.addEventListener('keydown', (evt) => {
    if (evt.key === 'F2') {
      evt.preventDefault()
      run()
    }
    if (evt.key === 'F3') {
      evt.preventDefault()
      analyze()
    }
    if (evt.key === 'F4') {
      evt.preventDefault()
      tokenize(false)
    }
    if (evt.key === 'F5') {
      evt.preventDefault()
      tokenize(true)
    }
    if (evt.key === 'F6') {
      evt.preventDefault()
      parse(false)
    }
    if (evt.key === 'F7') {
      evt.preventDefault()
      parse(true)
    }
    if (evt.key === 'k' || evt.key === 'K') {
      if (evt.ctrlKey || evt.commandKey) {
        evt.preventDefault()
        clearSearch()
      }
      const searchInput = document.getElementById('search-input')
      searchInput.select()
      searchInput.focus()

      evt.preventDefault()
    }
  })
  document.getElementById('lits-textarea').addEventListener('keydown', keydownHandler)
  document
    .getElementById('lits-textarea')
    .addEventListener('input', e => localStorage.setItem('lits-textarea', e.target.value))
  document.getElementById('params-textarea').addEventListener('keydown', keydownHandler)
  document
    .getElementById('params-textarea')
    .addEventListener('input', e => localStorage.setItem('params-textarea', e.target.value))

  const id = location.hash.substring(1) || 'index'
  showPage(id, 'replace')

  const urlParams = new URLSearchParams(window.location.search)

  const program = urlParams.get('program')
  const litsTextArea = document.getElementById('lits-textarea')
  if (program)
    litsTextArea.value = decodeURIComponent(program)
  else
    litsTextArea.value = localStorage.getItem('lits-textarea') || defaultProgram

  const paramsTextArea = document.getElementById('params-textarea')
  paramsTextArea.value = localStorage.getItem('params-textarea') || ''

  layout()
  initializeSearch()
}

function keydownHandler(e) {
  if (['Tab', 'Backspace', 'Enter', 'Delete'].includes(e.key)) {
    const start = this.selectionStart
    const end = this.selectionEnd

    const indexOfReturn = this.value.lastIndexOf('\n', start - 1)
    const rowLength = start - indexOfReturn - 1
    const onTabStop = rowLength % 2 === 0
    if (e.key === 'Tab') {
      e.preventDefault()
      if (!e.shiftKey) {
        this.value = this.value.substring(0, start) + (onTabStop ? '  ' : ' ') + this.value.substring(end)
        this.selectionStart = this.selectionEnd = start + (onTabStop ? 2 : 1)
      }
    }
    if (e.key === 'Backspace') {
      if (onTabStop && start === end && this.value.substr(start - 2, 2) === '  ') {
        e.preventDefault()
        this.value = this.value.substring(0, start - 2) + this.value.substring(end)
        this.selectionStart = this.selectionEnd = start - 2
      }
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      const spaceCount = this.value.substring(indexOfReturn + 1, start).replace(/^( *).*/, '$1').length
      this.value = `${this.value.substring(0, start)}\n${' '.repeat(spaceCount)}${this.value.substring(end)}`
      this.selectionStart = this.selectionEnd = start + 1 + spaceCount
    }
    if (e.key === 'Delete') {
      if (onTabStop && start === end && this.value.substr(start, 2) === '  ') {
        e.preventDefault()
        this.value = this.value.substring(0, start) + this.value.substring(end + 2)
        this.selectionStart = this.selectionEnd = start
      }
    }
  }
}

window.addEventListener('popstate', () => {
  const id = location.hash.substring(1) || 'index'
  showPage(id, 'none')
})

function run() {
  const code = document.getElementById('lits-textarea').value
  const paramsString = document.getElementById('params-textarea').value
  const output = document.getElementById('output-textarea')
  output.value = ''
  let params
  try {
    params
      = paramsString.trim().length > 0
        ? JSON.parse(paramsString, (_, val) =>
          // eslint-disable-next-line no-eval
          typeof val === 'string' && val.startsWith('EVAL:') ? eval(val.substring(5)) : val)
        : {}
  }
  catch (e) {
    output.value = `Error: Could not parse params: ${paramsString}`
    output.classList.add('error')
    return
  }
  let result
  const oldLog = console.log
  console.log = function (...args) {
    oldLog.apply(console, args)
    const logRow = args.map(arg => stringifyValue(arg)).join(' ')
    const oldContent = output.value
    const newContent = oldContent ? `${oldContent}\n${logRow}` : logRow
    output.value = newContent
    output.scrollTop = output.scrollHeight
  }
  const oldWarn = console.warn
  console.warn = function (...args) {
    oldWarn.apply(console, args)
    const logRow = args[0]
    const oldContent = output.value
    const newContent = oldContent ? `${oldContent}\n${logRow}` : logRow
    output.value = newContent
    output.scrollTop = output.scrollHeight
  }
  try {
    result = lits.run(code, params)
  }
  catch (error) {
    output.value = error
    output.classList.add('error')
    return
  }
  finally {
    console.log = oldLog
    console.warn = oldWarn
  }
  output.classList.remove('error')
  const content = stringifyValue(result)

  const oldContent = output.value
  const newContent = oldContent ? `${oldContent}\n${content}` : content
  output.value = newContent
  output.scrollTop = output.scrollHeight

  output.value = newContent
}

function analyze() {
  const code = document.getElementById('lits-textarea').value
  const output = document.getElementById('output-textarea')
  output.value = ''
  let result
  const oldLog = console.log
  console.log = function (...args) {
    oldLog.apply(console, args)
    const logRow = args.map(arg => stringifyValue(arg)).join(' ')
    const oldContent = output.value
    const newContent = oldContent ? `${oldContent}\n${logRow}` : logRow
    output.value = newContent
    output.scrollTop = output.scrollHeight
  }
  const oldWarn = console.warn
  console.warn = function (...args) {
    oldWarn.apply(console, args)
    const logRow = args[0]
    const oldContent = output.value
    const newContent = oldContent ? `${oldContent}\n${logRow}` : logRow
    output.value = newContent
    output.scrollTop = output.scrollHeight
  }
  try {
    result = lits.analyze(code)
  }
  catch (error) {
    output.value = error
    output.classList.add('error')
    return
  }
  finally {
    console.log = oldLog
    console.warn = oldWarn
  }
  output.classList.remove('error')
  const content = `Undefined symbols: ${stringifyValue([...result.undefinedSymbols])}`

  const oldContent = output.value
  const newContent = oldContent ? `${oldContent}\n${content}` : content
  output.value = newContent
  output.scrollTop = output.scrollHeight

  output.value = newContent
}

function parse(debug) {
  const code = document.getElementById('lits-textarea').value
  const output = document.getElementById('output-textarea')
  output.value = ''
  let result
  const oldLog = console.log
  console.log = function (...args) {
    oldLog.apply(console, args)
    const logRow = args.map(arg => stringifyValue(arg)).join(' ')
    const oldContent = output.value
    const newContent = oldContent ? `${oldContent}\n${logRow}` : logRow
    output.value = newContent
    output.scrollTop = output.scrollHeight
  }
  const oldWarn = console.warn
  console.warn = function (...args) {
    oldWarn.apply(console, args)
    const logRow = args[0]
    const oldContent = output.value
    const newContent = oldContent ? `${oldContent}\n${logRow}` : logRow
    output.value = newContent
    output.scrollTop = output.scrollHeight
  }
  try {
    if (debug) {
      const tokens = lits.tokenize(code)
      result = lits.parse(tokens)
    }
    else {
      const tokens = litsNoDebug.tokenize(code, { debug: false })
      result = litsNoDebug.parse(tokens)
    }
  }
  catch (error) {
    output.value = error
    output.classList.add('error')
    return
  }
  finally {
    console.log = oldLog
    console.warn = oldWarn
  }
  output.classList.remove('error')
  const content = JSON.stringify(result, null, 2)

  const oldContent = output.value
  const newContent = oldContent ? `${oldContent}\n${content}` : content
  output.value = newContent
  output.scrollTop = output.scrollHeight

  output.value = newContent
}

function tokenize(debug) {
  const code = document.getElementById('lits-textarea').value
  const output = document.getElementById('output-textarea')
  output.value = ''
  let result
  const oldLog = console.log
  console.log = function (...args) {
    oldLog.apply(console, args)
    const logRow = args.map(arg => stringifyValue(arg)).join(' ')
    const oldContent = output.value
    const newContent = oldContent ? `${oldContent}\n${logRow}` : logRow
    output.value = newContent
    output.scrollTop = output.scrollHeight
  }
  const oldWarn = console.warn
  console.warn = function (...args) {
    oldWarn.apply(console, args)
    const logRow = args[0]
    const oldContent = output.value
    const newContent = oldContent ? `${oldContent}\n${logRow}` : logRow
    output.value = newContent
    output.scrollTop = output.scrollHeight
  }
  try {
    if (debug)
      result = lits.tokenize(code)
    else
      result = litsNoDebug.tokenize(code, { debug: false })
  }
  catch (error) {
    output.value = error
    output.classList.add('error')
    return
  }
  finally {
    console.log = oldLog
    console.warn = oldWarn
  }
  output.classList.remove('error')
  const content = JSON.stringify(result, null, 2)

  const oldContent = output.value
  const newContent = oldContent ? `${oldContent}\n${content}` : content
  output.value = newContent
  output.scrollTop = output.scrollHeight

  output.value = newContent
}

function showPage(id, historyEvent) {
  inactivateAll()

  const page = document.getElementById(id)
  const link = document.getElementById(`${id}_link`)

  if (page) {
    page.classList.add('active-content')
    if (link)
      link.classList.add('active-sidebar-entry')
  }
  else {
    showPage('index', 'replace')
    return
  }

  if (historyEvent === 'replace')
    history.replaceState(null, '', `#${id}`)

  else if (historyEvent !== 'none')
    history.pushState(null, '', `#${id}`)
}

function inactivateAll() {
  let els = document.getElementsByClassName('active-content')
  while (els[0])
    els[0].classList.remove('active-content')

  els = document.getElementsByClassName('active-sidebar-entry')
  while (els[0])
    els[0].classList.remove('active-sidebar-entry')
}

function stringifyValue(value) {
  if (Lits.isLitsFunction(value)) {
    if (value.builtin)
      return `<builtin function ${value.builtin}>`
    else
      return `<function ${value.name || '\u03BB'}>`
  }
  if (value === null)
    return 'null'

  if (typeof value === 'object' && value instanceof RegExp)
    return `${value}`

  if (typeof value === 'object' && value instanceof Error)
    return value.toString()

  if (value === Number.POSITIVE_INFINITY)
    return Number.POSITIVE_INFINITY

  if (value === Number.NEGATIVE_INFINITY)
    return Number.NEGATIVE_INFINITY

  if (typeof value === 'number' && Number.isNaN(value))
    return 'NaN'

  return JSON.stringify(value)
}

function addToPlayground(uriEncodedExample) {
  example = decodeURIComponent(uriEncodedExample)
  const textarea = document.getElementById('lits-textarea')

  if (textarea.value)
    textarea.value = `${textarea.value}\n\n${example}`
  else
    textarea.value = example

  localStorage.setItem('lits-textarea', textarea.value)
}

function setPlayground(uriEncodedExample) {
  const example = JSON.parse(decodeURIComponent(uriEncodedExample))

  const params = example.params
    ? JSON.stringify(example.params, (_k, v) => (v === undefined ? null : v), 2)
    : ''
  document.getElementById('params-textarea').value = params
  localStorage.setItem('params-textarea', params)

  const code = example.code ? example.code : ''
  document.getElementById('lits-textarea').value = code
  localStorage.setItem('lits-textarea', code)

  run()
}
