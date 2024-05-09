/* eslint-disable no-console */

/* eslint-disable unused-imports/no-unused-vars */

const DEFAULT_PLAYGROUND_HEIGHT = 350
const DEFAULT_RESIZE_DIVIDER1_X_PERCENT = 15
const DEFAULT_RESIZE_DIVIDER2_X_PERCENT = 80

let moveParams = null
let playgroundHeight = null
let resizeDivider1XPercent = null
let resizeDivider2XPercent = null
let windowHeight = null
let windowWidth = null
let availablePanelsWidth = null
let search = ''

function calculateDimensions() {
  windowHeight = window.innerHeight
  windowWidth = window.innerWidth
  availablePanelsWidth = windowWidth
}

function toggleMoreMenu() {
  const moreMenu = document.getElementById('more-menu')
  moreMenu.style.display = moreMenu.style.display === 'block' ? 'none' : 'block'
}

function onDocumentClick(event) {
  if (event.target.closest('#more-menu'))
    return

  if (document.getElementById('more-menu').style.display === 'block') {
    event.stopPropagation()
    closeMoreMenu()
  }
}

function closeMoreMenu() {
  const moreMenu = document.getElementById('more-menu')
  moreMenu.style.display = 'none'
}

function layout() {
  calculateDimensions()

  const wrapper = document.getElementById('wrapper')
  const playground = document.getElementById('playground')
  const sidebar = document.getElementById('sidebar')
  const mainPanel = document.getElementById('main-panel')
  const paramsPanel = document.getElementById('params-panel')
  const litsPanel = document.getElementById('lits-panel')
  const outputPanel = document.getElementById('output-panel')

  const topPanelsBottom = playgroundHeight

  const paramsPanelWidth = (availablePanelsWidth * resizeDivider1XPercent) / 100
  const outputPanelWidth = (availablePanelsWidth * (100 - resizeDivider2XPercent)) / 100
  const litsPanelWidth = availablePanelsWidth - paramsPanelWidth - outputPanelWidth

  playground.style.height = `${playgroundHeight}px`

  paramsPanel.style.width = `${paramsPanelWidth}px`
  litsPanel.style.width = `${litsPanelWidth}px`
  outputPanel.style.width = `${outputPanelWidth}px`

  sidebar.style.bottom = `${topPanelsBottom}px`
  mainPanel.style.bottom = `${topPanelsBottom}px`

  wrapper.style.display = 'block'

  populateSearchResult()
}

function populateSearchResult() {
  const searchResult = document.getElementById('search-result')
  const noSearchResult = document.getElementById('no-search-result')
  if (!search) {
    noSearchResult.style.display = 'block'
    searchResult.style.display = 'none'
  }
  else {
    noSearchResult.style.display = 'none'
    searchResult.style.display = 'block'
  }
}

function resetPlayground() {
  resetParams()
  resetLitsCode()
  resetOutput()

  localStorage.removeItem('playground-height')
  localStorage.removeItem('resize-divider-1-percent')
  localStorage.removeItem('resize-divider-2-percent')
  playgroundHeight = DEFAULT_PLAYGROUND_HEIGHT
  resizeDivider1XPercent = DEFAULT_RESIZE_DIVIDER1_X_PERCENT
  resizeDivider2XPercent = DEFAULT_RESIZE_DIVIDER2_X_PERCENT
  clearSearch()
  layout()
}

function resetParams() {
  document.getElementById('params-textarea').value = ''
  localStorage.removeItem('params-textarea')
  updateParamsLinks()
}

function setParams(value) {
  const paramsTextArea = document.getElementById('params-textarea')
  paramsTextArea.value = value
  localStorage.setItem('params-textarea', value)
  updateParamsLinks()
}

function getParams() {
  return document.getElementById('params-textarea').value
}

function resetLitsCode() {
  const litsTextArea = document.getElementById('lits-textarea')
  litsTextArea.value = ''
  localStorage.removeItem('lits-textarea')
  litsTextArea.focus()
  updateLitsCodeLinks()
}

function setLitsCode(value) {
  const litsTextArea = document.getElementById('lits-textarea')
  litsTextArea.value = value
  localStorage.setItem('lits-textarea', value)
  litsTextArea.scrollTop = litsTextArea.scrollHeight
  updateLitsCodeLinks()
  litsTextArea.focus()
}

function appendLitsCode(value) {
  const litsTextArea = document.getElementById('lits-textarea')
  const oldContent = litsTextArea.value.trimEnd()

  const newContent = oldContent ? `${oldContent}\n\n${value}` : value.trim()
  litsTextArea.value = newContent
  localStorage.setItem('lits-textarea', newContent)
  litsTextArea.scrollTop = litsTextArea.scrollHeight
  updateLitsCodeLinks()
  litsTextArea.focus()
}

function getLitsCode() {
  return document.getElementById('lits-textarea').value
}

function resetOutput() {
  setOutput('')
  updateOutputLinks()
}

function appendOutput(value) {
  const output = document.getElementById('output-textarea')
  output.classList.remove('error')
  const oldContent = output.value
  const newContent = oldContent ? `${oldContent}\n${value}` : value
  output.value = newContent
  output.scrollTop = output.scrollHeight
  updateOutputLinks()
}

function setOutput(value) {
  const output = document.getElementById('output-textarea')
  output.classList.remove('error')
  output.value = value
  output.scrollTop = output.scrollHeight
  updateOutputLinks()
}

function setOutputError(value) {
  const output = document.getElementById('output-textarea')
  output.classList.add('error')
  output.value = value
  output.scrollTop = output.scrollHeight
  updateOutputLinks()
}

function getOutput() {
  return document.getElementById('output-textarea').value
}

function updateLinks() {
  updateLitsCodeLinks()
  updateOutputLinks()
  updateParamsLinks()
}

function updateParamsLinks() {
  const paramsLinks = document.getElementById('params-links')

  if (getParams())
    paramsLinks.style.display = 'block'
  else
    paramsLinks.style.display = 'none'
}

function updateLitsCodeLinks() {
  const litsLinks = document.getElementById('lits-links')

  if (getLitsCode())
    litsLinks.style.display = 'block'
  else
    litsLinks.style.display = 'none'
}

function updateOutputLinks() {
  const outputLinks = document.getElementById('output-links')

  if (getOutput())
    outputLinks.style.display = 'block'
  else
    outputLinks.style.display = 'none'
}

function initializeSearch() {
  const searchInput = document.getElementById('search-input')
  searchInput.value = search
  searchInput.oninput = (event) => {
    search = event.target.value
    layout()
  }
}

function clearSearch() {
  const searchInput = document.getElementById('search-input')
  search = ''
  searchInput.value = search
}

window.onload = function () {
  document.addEventListener('click', onDocumentClick, true)

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
      if (playgroundHeight < 26)
        playgroundHeight = 26

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
    if (evt.key === 'F5') {
      evt.preventDefault()
      run()
    }
    if (evt.key === 'k' || evt.key === 'K') {
      if (evt.ctrlKey || evt.metaKey) {
        openSearch()
        evt.preventDefault()
      }
    }
    if (evt.key === 'F3') {
      openSearch()
      evt.preventDefault()
    }
    if (evt.key === 'Escape') {
      closeSearch()
      closeMoreMenu()
      evt.preventDefault()
    }
  })
  document.getElementById('lits-textarea').addEventListener('keydown', keydownHandler)
  document
    .getElementById('lits-textarea')
    .addEventListener('input', e => setLitsCode(e.target.value))
  document.getElementById('params-textarea').addEventListener('keydown', keydownHandler)
  document
    .getElementById('params-textarea')
    .addEventListener('input', e => setParams(e.target.value))

  const id = location.hash.substring(1) || 'index'
  showPage(id, 'replace')

  const urlParams = new URLSearchParams(window.location.search)

  const program = urlParams.get('program')
  const litsCode = program ? atob(program) : localStorage.getItem('lits-textarea') || ''
  setLitsCode(litsCode)

  setParams(localStorage.getItem('params-textarea') || '')

  updateLinks()
  layout()
  initializeSearch()
  document.getElementById('lits-textarea').focus()
}

function openSearch() {
  const searchOverlay = document.getElementById('search-dialog-overlay')
  const searchDialod = document.getElementById('search-dialog')
  searchOverlay.style.display = 'block'
  searchDialod.open = 'open'
  const searchInput = document.getElementById('search-input')
  searchInput.focus()
}

function closeSearch() {
  const searchOverlay = document.getElementById('search-dialog-overlay')
  const searchDialod = document.getElementById('search-dialog')
  searchOverlay.style.display = 'none'
  searchDialod.open = 'closed'
  clearSearch()
  layout()
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
  const code = getLitsCode()
  const paramsString = getParams()
  setOutput('')
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
    setOutputError(`Error: Could not parse params: ${paramsString}`)
    return
  }
  let result
  const oldLog = console.log
  console.log = function (...args) {
    oldLog.apply(console, args)
    const logRow = args.map(arg => stringifyValue(arg)).join(' ')
    appendOutput(logRow)
  }
  const oldWarn = console.warn
  console.warn = function (...args) {
    oldWarn.apply(console, args)
    const logRow = args[0]
    appendOutput(logRow)
    const oldContent = getOutput()
    const newContent = oldContent ? `${oldContent}\n${logRow}` : logRow
    setOutput(newContent)
  }
  try {
    result = lits.run(code, params)
  }
  catch (error) {
    setOutputError(error)
    return
  }
  finally {
    console.log = oldLog
    console.warn = oldWarn
  }
  const content = stringifyValue(result)

  appendOutput(content)
}

function analyze() {
  const code = getLitsCode()
  resetOutput()
  let result
  const oldLog = console.log
  console.log = function (...args) {
    oldLog.apply(console, args)
    const logRow = args.map(arg => stringifyValue(arg)).join(' ')
    const oldContent = getOutput()
    const newContent = oldContent ? `${oldContent}\n${logRow}` : logRow
    setOutput(newContent)
  }
  const oldWarn = console.warn
  console.warn = function (...args) {
    oldWarn.apply(console, args)
    const logRow = args[0]
    const oldContent = getOutput()
    const newContent = oldContent ? `${oldContent}\n${logRow}` : logRow
    setOutput(newContent)
  }
  try {
    result = lits.analyze(code)
  }
  catch (error) {
    setOutputError(error)
    return
  }
  finally {
    console.log = oldLog
    console.warn = oldWarn
  }
  const undefinedSymbols = [...result.undefinedSymbols].map(s => s.symbol).join(', ')
  const content = undefinedSymbols
    ? `Undefined symbols: ${undefinedSymbols}`
    : 'No undefined symbols'

  appendOutput(content)
}

function parse(debug) {
  const code = getLitsCode()
  resetOutput()
  let result
  const oldLog = console.log
  console.log = function (...args) {
    oldLog.apply(console, args)
    const logRow = args.map(arg => stringifyValue(arg)).join(' ')
    const oldContent = getOutput()
    const newContent = oldContent ? `${oldContent}\n${logRow}` : logRow
    setOutput(newContent)
  }
  const oldWarn = console.warn
  console.warn = function (...args) {
    oldWarn.apply(console, args)
    const logRow = args[0]
    const oldContent = getOutput()
    const newContent = oldContent ? `${oldContent}\n${logRow}` : logRow
    setOutput(newContent)
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
    setOutputError(error)
    return
  }
  finally {
    console.log = oldLog
    console.warn = oldWarn
  }
  const content = JSON.stringify(result, null, 2)

  appendOutput(content)
}

function tokenize(debug) {
  const code = getLitsCode()
  resetOutput()
  let result
  const oldLog = console.log
  console.log = function (...args) {
    oldLog.apply(console, args)
    const logRow = args.map(arg => stringifyValue(arg)).join(' ')
    const oldContent = getOutput()
    const newContent = oldContent ? `${oldContent}\n${logRow}` : logRow
    setOutput(newContent)
  }
  const oldWarn = console.warn
  console.warn = function (...args) {
    oldWarn.apply(console, args)
    const logRow = args[0]
    const oldContent = getOutput()
    const newContent = oldContent ? `${oldContent}\n${logRow}` : logRow
    setOutput(newContent)
  }
  try {
    if (debug)
      result = lits.tokenize(code)
    else
      result = litsNoDebug.tokenize(code, { debug: false })
  }
  catch (error) {
    setOutputError(error)
    return
  }
  finally {
    console.log = oldLog
    console.warn = oldWarn
  }
  const content = JSON.stringify(result, null, 2)

  appendOutput(content)
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

function addToPlayground(comment, uriEncodedExample) {
  const example = atob(uriEncodedExample)
  appendLitsCode(`${comment}\n${example}`)

  run()
}

function setPlayground(uriEncodedExample) {
  const example = JSON.parse(decodeURIComponent(uriEncodedExample))

  const params = example.params
    ? JSON.stringify(example.params, (_k, v) => (v === undefined ? null : v), 2)
    : ''

  setParams(params)

  const code = example.code ? example.code : ''
  setLitsCode(code)

  run()
}
