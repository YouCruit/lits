/* eslint-disable no-console */
import { stringifyValue } from '../../common/utils'
import type { Example } from '../../reference/examples'
import { Lits, type LitsParams } from '../../src'
import { UserDefinedError } from '../../src/errors'
import type { UnknownRecord } from '../../src/interface'
import { asUnknownRecord } from '../../src/typeGuards'
import { Search } from './Search'
import { applyEncodedState, clearAllStates, clearState, encodeState, getState, redoState, saveState, setHistoryListener, undoState } from './state'
import { isMac, throttle } from './utils'

const getLits: (forceDebug?: 'debug') => Lits = (() => {
  const lits = new Lits({ debug: true })
  const litsNoDebug = new Lits({ debug: false })
  return (forceDebug?: 'debug') => forceDebug || getState('debug') ? lits : litsNoDebug
})()

const elements = {
  wrapper: document.getElementById('wrapper') as HTMLElement,
  playground: document.getElementById('playground') as HTMLElement,
  sidebar: document.getElementById('sidebar') as HTMLElement,
  mainPanel: document.getElementById('main-panel') as HTMLElement,
  contextPanel: document.getElementById('context-panel') as HTMLElement,
  litsPanel: document.getElementById('lits-panel') as HTMLElement,
  outputPanel: document.getElementById('output-panel') as HTMLElement,
  moreMenu: document.getElementById('more-menu') as HTMLElement,
  addContextMenu: document.getElementById('add-context-menu') as HTMLElement,
  newContextName: document.getElementById('new-context-name') as HTMLInputElement,
  newContextValue: document.getElementById('new-context-value') as HTMLTextAreaElement,
  newContextError: document.getElementById('new-context-error') as HTMLSpanElement,
  contextTextArea: document.getElementById('context-textarea') as HTMLTextAreaElement,
  outputResult: document.getElementById('output-result') as HTMLElement,
  litsTextArea: document.getElementById('lits-textarea') as HTMLTextAreaElement,
  resizePlayground: document.getElementById('resize-playground') as HTMLElement,
  resizeDevider1: document.getElementById('resize-divider-1') as HTMLElement,
  resizeDevider2: document.getElementById('resize-divider-2') as HTMLElement,
  toggleDebugMenuLabel: document.getElementById('toggle-debug-menu-label') as HTMLSpanElement,
  litsPanelDebugInfo: document.getElementById('lits-panel-debug-info') as HTMLDivElement,
  undoButton: document.getElementById('undo-button') as HTMLAnchorElement,
  redoButton: document.getElementById('redo-button') as HTMLAnchorElement,
}

type MoveParams = {
  id: 'playground'
  startMoveY: number
  heightBeforeMove: number
} | {
  id: 'resize-divider-1' | 'resize-divider-2'
  startMoveX: number
  percentBeforeMove: number
}

type OutputType =
  | 'error'
  | 'output'
  | 'result'
  | 'analyze'
  | 'tokenize'
  | 'parse'
  | 'comment'
  | 'warn'

let moveParams: MoveParams | null = null
let ignoreSelectionChange = false

function calculateDimensions() {
  return {
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth,
  }
}

export function openMoreMenu() {
  elements.moreMenu.style.display = 'block'
}

export function closeMoreMenu() {
  elements.moreMenu.style.display = 'none'
}

export function openAddContextMenu() {
  elements.newContextName.value = getState('new-context-name')
  elements.newContextValue.value = getState('new-context-value')
  elements.addContextMenu.style.display = 'block'
  elements.newContextName.focus()
}

export function closeAddContextMenu() {
  elements.addContextMenu.style.display = 'none'
  elements.newContextError.style.display = 'none'
  elements.newContextError.textContent = ''
  elements.newContextName.value = ''
  elements.newContextValue.value = ''
}

export function share() {
  addOutputSeparator()
  appendOutput('Sharable link:', 'comment')
  const href = `${location.origin}${location.pathname}?state=${encodeState()}`
  const a = document.createElement('a')
  a.textContent = href
  a.className = 'share-link'
  a.href = href
  addOutputElement(a)
}

function onDocumentClick(event: Event) {
  const target = event.target as HTMLInputElement | undefined

  if (!target?.closest('#more-menu') && elements.moreMenu.style.display === 'block')
    closeMoreMenu()

  if (!target?.closest('#add-context-menu') && elements.addContextMenu.style.display === 'block')
    closeAddContextMenu()
}

const layout = throttle(() => {
  const { windowWidth } = calculateDimensions()

  const playgroundHeight = getState('playground-height')

  const contextPanelWidth = (windowWidth * getState('resize-divider-1-percent')) / 100
  const outputPanelWidth = (windowWidth * (100 - getState('resize-divider-2-percent'))) / 100
  const litsPanelWidth = windowWidth - contextPanelWidth - outputPanelWidth

  elements.playground.style.height = `${playgroundHeight}px`
  elements.contextPanel.style.width = `${contextPanelWidth}px`
  elements.litsPanel.style.width = `${litsPanelWidth}px`
  elements.outputPanel.style.width = `${outputPanelWidth}px`
  elements.sidebar.style.bottom = `${playgroundHeight}px`
  elements.mainPanel.style.bottom = `${playgroundHeight}px`
  elements.wrapper.style.display = 'block'
})

export const undo = throttle(() => {
  ignoreSelectionChange = true
  if (undoState())
    applyState()
  setTimeout(() => ignoreSelectionChange = false)
})

export const redo = throttle(() => {
  ignoreSelectionChange = true
  if (redoState())
    applyState()
  setTimeout(() => ignoreSelectionChange = false)
})

export function resetPlayground() {
  clearAllStates()

  resetContext()
  resetLitsCode()
  resetOutput()
  Search.closeSearch()
  Search.clearSearch()

  layout()
  renderDebugInfo()
}

export function resetContext() {
  elements.contextTextArea.value = ''
  clearState('context')
}

function setContext(value: string, pushToHistory: boolean, scroll?: 'top' | 'bottom') {
  elements.contextTextArea.value = value

  if (pushToHistory) {
    saveState({
      'context': value,
      'context-selection-start': elements.contextTextArea.selectionStart,
      'context-selection-end': elements.contextTextArea.selectionEnd,
    }, true)
  }
  else {
    saveState({ context: value }, false)
  }

  if (scroll === 'top')
    elements.contextTextArea.scrollTo(0, 0)
  else if (scroll === 'bottom')
    elements.contextTextArea.scrollTo({ top: elements.contextTextArea.scrollHeight, behavior: 'smooth' })
}

function getParsedContext(): Record<string, unknown> {
  try {
    return asUnknownRecord(JSON.parse(getState('context')))
  }
  catch (e) {
    return {}
  }
}

export function addContextEntry() {
  const name = elements.newContextName.value
  if (name === '') {
    elements.newContextError.textContent = 'Name is required'
    elements.newContextError.style.display = 'block'
    elements.newContextName.focus()
    return
  }

  const value = elements.newContextValue.value

  try {
    const parsedValue = JSON.parse(value) as unknown
    const context = getParsedContext()
    const values: UnknownRecord = Object.assign({}, context.values)
    values[name] = parsedValue
    context.values = values
    setContext(JSON.stringify(context, null, 2), true)

    closeAddContextMenu()
  }
  catch (e) {
    elements.newContextError.textContent = 'Invalid JSON'
    elements.newContextError.style.display = 'block'
    elements.newContextValue.focus()
  }

  clearState('new-context-name')
  clearState('new-context-value')
}

export function addSampleContext() {
  const context = getParsedContext()
  const values = {
    'a-number': 42,
    'a-string': 'foo bar',
    'an-array': ['foo', 'bar', 1, 2, true, false, null],
    'an-object': {
      name: 'John Doe',
      age: 42,
      married: true,
      children: ['Alice', 'Bob'],
      address: {
        street: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zip: '62701',
      },
    },
  }

  context.values = Object.assign(values, context.values)

  setContext(JSON.stringify(context, null, 2), true)
}

export function resetLitsCode() {
  elements.litsTextArea.value = ''
  clearState('lits-code')
}

function setLitsCode(value: string, pushToHistory: boolean, scroll?: 'top' | 'bottom') {
  elements.litsTextArea.value = value

  if (pushToHistory) {
    saveState({
      'lits-code': value,
      'lits-code-selection-start': elements.litsTextArea.selectionStart,
      'lits-code-selection-end': elements.litsTextArea.selectionEnd,
    }, true)
  }
  else {
    saveState({ 'lits-code': value }, false)
  }

  if (scroll === 'top')
    elements.litsTextArea.scrollTo(0, 0)
  else if (scroll === 'bottom')
    elements.litsTextArea.scrollTo({ top: elements.litsTextArea.scrollHeight, behavior: 'smooth' })
}

function appendLitsCode(value: string) {
  const oldContent = getState('lits-code').trimEnd()

  const newContent = oldContent ? `${oldContent}\n\n${value}` : value.trim()
  setLitsCode(newContent, true, 'bottom')
}

export function resetOutput() {
  elements.outputResult.innerHTML = ''
  clearState('output')
}

function hasOutput() {
  return getState('output').trim() !== ''
}

function setOutput(value: string, pushToHistory: boolean) {
  elements.outputResult.innerHTML = value
  saveState({ output: value }, pushToHistory)
}

function appendOutput(output: unknown, className: OutputType) {
  const outputElement = document.createElement('span')
  outputElement.className = className
  outputElement.textContent = `${output}`
  addOutputElement(outputElement)
}

function addOutputSeparator() {
  if (hasOutput()) {
    const separator = document.createElement('div')
    separator.className = 'separator'
    addOutputElement(separator)
  }
}

function addOutputElement(element: HTMLElement) {
  elements.outputResult.appendChild(element)
  elements.outputResult.scrollTop = elements.outputResult.scrollHeight

  saveState({ output: elements.outputResult.innerHTML })
}

window.onload = function () {
  elements.undoButton.classList.add('disabled')
  elements.redoButton.classList.add('disabled')
  setHistoryListener((status) => {
    if (status.canUndo) {
      elements.undoButton.classList.remove('disabled')
    }
    else {
      elements.undoButton.classList.add('disabled')
    }

    if (status.canRedo) {
      elements.redoButton.classList.remove('disabled')
    }
    else {
      elements.redoButton.classList.add('disabled')
    }
  })

  document.addEventListener('click', onDocumentClick, true)

  elements.resizePlayground.onmousedown = (event) => {
    moveParams = {
      id: 'playground',
      startMoveY: event.clientY,
      heightBeforeMove: getState('playground-height'),
    }
  }

  elements.resizeDevider1.onmousedown = (event) => {
    moveParams = {
      id: 'resize-divider-1',
      startMoveX: event.clientX,
      percentBeforeMove: getState('resize-divider-1-percent'),
    }
  }

  elements.resizeDevider2.onmousedown = (event) => {
    moveParams = {
      id: 'resize-divider-2',
      startMoveX: event.clientX,
      percentBeforeMove: getState('resize-divider-2-percent'),
    }
  }

  window.onresize = layout
  window.onmouseup = () => {
    document.body.classList.remove('no-select')
    moveParams = null
  }

  window.onmousemove = (event: MouseEvent) => {
    const { windowHeight, windowWidth } = calculateDimensions()
    if (moveParams === null)
      return

    document.body.classList.add('no-select')

    if (moveParams.id === 'playground') {
      let playgroundHeight = moveParams.heightBeforeMove + moveParams.startMoveY - event.clientY
      if (playgroundHeight < 30)
        playgroundHeight = 30

      if (playgroundHeight > windowHeight)
        playgroundHeight = windowHeight

      saveState({ 'playground-height': playgroundHeight })
      layout()
    }
    else if (moveParams.id === 'resize-divider-1') {
      let resizeDivider1XPercent
        = moveParams.percentBeforeMove + ((event.clientX - moveParams.startMoveX) / windowWidth) * 100
      if (resizeDivider1XPercent < 10)
        resizeDivider1XPercent = 10

      if (resizeDivider1XPercent > getState('resize-divider-2-percent') - 10)
        resizeDivider1XPercent = getState('resize-divider-2-percent') - 10

      saveState({ 'resize-divider-1-percent': resizeDivider1XPercent })
      layout()
    }
    else if (moveParams.id === 'resize-divider-2') {
      let resizeDivider2XPercent
        = moveParams.percentBeforeMove + ((event.clientX - moveParams.startMoveX) / windowWidth) * 100
      if (resizeDivider2XPercent < getState('resize-divider-1-percent') + 10)
        resizeDivider2XPercent = getState('resize-divider-1-percent') + 10

      if (resizeDivider2XPercent > 90)
        resizeDivider2XPercent = 90

      saveState({ 'resize-divider-2-percent': resizeDivider2XPercent })
      layout()
    }
  }

  window.addEventListener('keydown', (evt) => {
    if (Search.handleKeyDown(evt))
      return

    if (evt.ctrlKey) {
      switch (evt.key) {
        case 'r':
          evt.preventDefault()
          run()
          break
        case 'a':
          evt.preventDefault()
          analyze()
          break
        case 't':
          evt.preventDefault()
          tokenize()
          break
        case 'p':
          evt.preventDefault()
          parse()
          break
        case 'f':
          evt.preventDefault()
          format()
          break
        case 'd':
          evt.preventDefault()
          toggleDebug()
          break
        case '1':
          evt.preventDefault()
          elements.contextTextArea.focus()
          break
        case '2':
          evt.preventDefault()
          elements.litsTextArea.focus()
          break
      }
    }
    if (evt.key === 'Escape') {
      closeMoreMenu()
      closeAddContextMenu()
      evt.preventDefault()
    }
    if ((isMac() && evt.metaKey || !isMac && evt.ctrlKey) && !evt.shiftKey && evt.key === 'z') {
      evt.preventDefault()
      undo()
    }
    if ((isMac() && evt.metaKey || !isMac && evt.ctrlKey) && evt.shiftKey && evt.key === 'z') {
      evt.preventDefault()
      redo()
    }
  })
  elements.contextTextArea.addEventListener('keydown', (evt) => {
    keydownHandler(evt, () => setContext(elements.contextTextArea.value, true))
  })
  elements.contextTextArea.addEventListener('input', () => {
    setContext(elements.contextTextArea.value, true)
  })
  elements.contextTextArea.addEventListener('scroll', () => {
    saveState({ 'context-scroll-top': elements.contextTextArea.scrollTop })
  })
  elements.contextTextArea.addEventListener('selectionchange', () => {
    if (!ignoreSelectionChange) {
      saveState({
        'context-selection-start': elements.contextTextArea.selectionStart,
        'context-selection-end': elements.contextTextArea.selectionEnd,
      })
    }
  })
  elements.contextTextArea.addEventListener('focusin', () => {
    saveState({ 'focused-panel': 'context' })
  })
  elements.contextTextArea.addEventListener('focusout', () => {
    saveState({ 'focused-panel': null })
  })

  elements.litsTextArea.addEventListener('keydown', (evt) => {
    keydownHandler(evt, () => setLitsCode(elements.litsTextArea.value, true))
  })
  elements.litsTextArea.addEventListener('input', () => {
    setLitsCode(elements.litsTextArea.value, true)
  })
  elements.litsTextArea.addEventListener('scroll', () => {
    saveState({ 'lits-code-scroll-top': elements.litsTextArea.scrollTop })
  })
  elements.litsTextArea.addEventListener('selectionchange', () => {
    if (!ignoreSelectionChange) {
      saveState({
        'lits-code-selection-start': elements.litsTextArea.selectionStart,
        'lits-code-selection-end': elements.litsTextArea.selectionEnd,
      })
    }
  })
  elements.litsTextArea.addEventListener('focusin', () => {
    saveState({ 'focused-panel': 'lits-code' })
  })
  elements.litsTextArea.addEventListener('focusout', () => {
    saveState({ 'focused-panel': null })
  })

  elements.outputResult.addEventListener('scroll', () => {
    saveState({ 'output-scroll-top': elements.outputResult.scrollTop })
  })

  elements.newContextName.addEventListener('input', () => {
    saveState({ 'new-context-name': elements.newContextName.value })
  })
  elements.newContextValue.addEventListener('input', () => {
    saveState({ 'new-context-value': elements.newContextValue.value })
  })

  applyState(true)

  const id = location.hash.substring(1) || 'index'
  showPage(id, 'instant', 'replace')

  Search.onClose(() => {
    applyState()
  })
}

function getDataFromUrl() {
  const urlParams = new URLSearchParams(window.location.search)
  const urlState = urlParams.get('state')
  if (urlState) {
    addOutputSeparator()
    if (applyEncodedState(urlState))
      appendOutput(`Data parsed from url parameter state: ${urlState}`, 'comment')
    else
      appendOutput(`Invalid url parameter state: ${urlState}`, 'error')

    urlParams.delete('state')
    history.replaceState(null, '', `${location.pathname}${urlParams.toString() ? '?' : ''}${urlParams.toString()}`)
  }
}

function keydownHandler(evt: KeyboardEvent, onChange: () => void): void {
  if (['Tab', 'Backspace', 'Enter', 'Delete'].includes(evt.key)) {
    const target = evt.target as HTMLTextAreaElement
    const start = target.selectionStart
    const end = target.selectionEnd

    const indexOfReturn = target.value.lastIndexOf('\n', start - 1)
    const rowLength = start - indexOfReturn - 1
    const onTabStop = rowLength % 2 === 0
    switch (evt.key) {
      case 'Tab':
        evt.preventDefault()
        if (!evt.shiftKey) {
          target.value = target.value.substring(0, start) + (onTabStop ? '  ' : ' ') + target.value.substring(end)
          target.selectionStart = target.selectionEnd = start + (onTabStop ? 2 : 1)
          onChange()
        }
        break
      case 'Backspace':
        if (onTabStop && start === end && target.value.substring(start - 2, start + 2) === '  ') {
          evt.preventDefault()
          target.value = target.value.substring(0, start - 2) + target.value.substring(end)
          target.selectionStart = target.selectionEnd = start - 2
          onChange()
        }
        break
      case 'Enter': {
        evt.preventDefault()
        // eslint-disable-next-line regexp/optimal-quantifier-concatenation
        const spaceCount = target.value.substring(indexOfReturn + 1, start).replace(/^( *).*/, '$1').length
        target.value = `${target.value.substring(0, start)}\n${' '.repeat(spaceCount)}${target.value.substring(end)}`
        target.selectionStart = target.selectionEnd = start + 1 + spaceCount
        onChange()
        break
      }

      case 'Delete':
        if (onTabStop && start === end && target.value.substring(start, start + 2) === '  ') {
          evt.preventDefault()
          target.value = target.value.substring(0, start) + target.value.substring(end + 2)
          target.selectionStart = target.selectionEnd = start
          onChange()
        }
        break
    }
  }
}

window.addEventListener('popstate', () => {
  const id = location.hash.substring(1) || 'index'
  showPage(id, 'instant', 'none')
})

function truncateCode(text: string, count = 1000) {
  const oneLiner = text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .filter(line => !line.startsWith(';'))
    .join(' ')
  if (oneLiner.length <= count)
    return oneLiner
  else
    return `${oneLiner.substring(0, count - 3)}...`
}
export function run() {
  addOutputSeparator()
  const selectedCode = getSelectedLitsCode()
  const code = selectedCode.code || getState('lits-code')
  const title = selectedCode.code ? 'Run selection' : 'Run'

  appendOutput(`${title}: ${truncateCode(code)}`, 'comment')

  const contextString = getState('context')
  let context: LitsParams
  try {
    context
      = contextString.trim().length > 0
        ? JSON.parse(contextString, (_, val) =>
          // eslint-disable-next-line no-eval, ts/no-unsafe-return
          typeof val === 'string' && val.startsWith('EVAL:') ? eval(val.substring(5)) : val) as LitsParams
        : {}
  }
  catch {
    appendOutput(`Error: Could not parse context: ${contextString}`, 'error')
    elements.contextTextArea.focus()
    return
  }

  const hijacker = hijackConsole()
  try {
    const result = getLits('debug').run(code, context)
    const content = stringifyValue(result, false)
    appendOutput(content, 'result')
  }
  catch (error) {
    appendOutput(error, 'error')
  }
  finally {
    hijacker.releaseConsole()
    elements.litsTextArea.focus()
  }
}

export function analyze() {
  addOutputSeparator()

  const selectedCode = getSelectedLitsCode()
  const code = selectedCode.code || getState('lits-code')
  const title = selectedCode.code ? 'Analyze selection' : 'Analyze'

  appendOutput(`${title}: ${truncateCode(code)}`, 'comment')

  const contextString = getState('context')
  let context: LitsParams
  try {
    context
      = contextString.trim().length > 0
        ? JSON.parse(contextString, (_, val) =>
          // eslint-disable-next-line no-eval, ts/no-unsafe-return
          typeof val === 'string' && val.startsWith('EVAL:') ? eval(val.substring(5)) : val) as LitsParams
        : {}
  }
  catch {
    appendOutput(`Error: Could not parse context: ${contextString}`, 'error')
    elements.contextTextArea.focus()
    return
  }

  const hijacker = hijackConsole()
  try {
    const result = getLits('debug').analyze(code, context)
    const unresolvedIdentifiers = [...new Set([...result.unresolvedIdentifiers].map(s => s.symbol))].join(', ')
    const unresolvedIdentifiersOutput = `Unresolved identifiers: ${unresolvedIdentifiers || '-'}`

    const possibleOutcomes = result.outcomes && result.outcomes
      .map(o => o instanceof UserDefinedError
        ? `${o.name}${o.userMessage ? `("${o.userMessage}")` : ''}`
        : o instanceof Error
          ? o.name
          : stringifyValue(o, false),
      ).join(', ')
    const possibleOutcomesString = `Possible outcomes: ${possibleOutcomes || '-'}`

    appendOutput(`${unresolvedIdentifiersOutput}\n${possibleOutcomesString}`, 'analyze')
  }
  catch (error) {
    appendOutput(error, 'error')
  }
  finally {
    hijacker.releaseConsole()
    elements.litsTextArea.focus()
  }
}

export function parse() {
  addOutputSeparator()

  const selectedCode = getSelectedLitsCode()
  const code = selectedCode.code || getState('lits-code')
  const title = selectedCode.code ? 'Parse selection' : 'Parse'

  appendOutput(`${title}${getState('debug') ? ' (debug):' : ':'} ${truncateCode(code)}`, 'comment')

  const hijacker = hijackConsole()
  try {
    const tokens = getLits().tokenize(code)
    const result = getLits().parse(tokens)
    const content = JSON.stringify(result, null, 2)
    appendOutput(content, 'parse')
  }
  catch (error) {
    appendOutput(error, 'error')
  }
  finally {
    hijacker.releaseConsole()
    elements.litsTextArea.focus()
  }
}

export function tokenize() {
  addOutputSeparator()

  const selectedCode = getSelectedLitsCode()
  const code = selectedCode.code || getState('lits-code')
  const title = selectedCode.code ? 'Tokenize selection' : 'Tokenize'

  appendOutput(`${title}${getState('debug') ? ' (debug):' : ':'} ${truncateCode(code)}`, 'comment')

  const hijacker = hijackConsole()
  try {
    const result = getLits().tokenize(code)
    const content = JSON.stringify(result, null, 2)
    appendOutput(content, 'tokenize')
  }
  catch (error) {
    appendOutput(error, 'error')
    return
  }
  finally {
    hijacker.releaseConsole()
    elements.litsTextArea.focus()
  }
}

export function format() {
  addOutputSeparator()

  const selectedCode = getSelectedLitsCode()
  const code = selectedCode.code || getState('lits-code')
  const title = selectedCode.code ? 'Format selection' : 'Format'

  appendOutput(`${title}: ${truncateCode(code)}`, 'comment')

  const hijacker = hijackConsole()
  let result: string = ''
  try {
    result = getLits('debug').format(code, { lineLength: getLitsCodeCols() })
    if (selectedCode.code) {
      setLitsCode(`${selectedCode.leadingCode}${result}${selectedCode.trailingCode}`, true)
    }
    else {
      setLitsCode(result, true)
    }
  }
  catch (error) {
    appendOutput(error, 'error')
    return
  }
  finally {
    hijacker.releaseConsole()
    if (selectedCode.code) {
      saveState({
        'focused-panel': 'lits-code',
        'lits-code-selection-start': selectedCode.selectionStart,
        'lits-code-selection-end': selectedCode.selectionStart + result.length,
      })
    }
    else {
      saveState({
        'focused-panel': 'lits-code',
        'lits-code-selection-start': selectedCode.selectionStart,
        'lits-code-selection-end': selectedCode.selectionEnd,
      })
    }
    applyState()
  }
}

export function toggleDebug() {
  const debug = !getState('debug')
  saveState({ debug })
  renderDebugInfo()
  addOutputSeparator()
  appendOutput(`Debug mode toggled ${debug ? 'ON' : 'OFF'}`, 'comment')
  elements.litsTextArea.focus()
}

function getSelectedLitsCode(): {
  code: string
  leadingCode: string
  trailingCode: string
  selectionStart: number
  selectionEnd: number
} {
  const selectionStart = getState('lits-code-selection-start')
  const selectionEnd = getState('lits-code-selection-end')

  return {
    leadingCode: elements.litsTextArea.value.substring(0, selectionStart),
    trailingCode: elements.litsTextArea.value.substring(selectionEnd),
    code: elements.litsTextArea.value.substring(selectionStart, selectionEnd),
    selectionStart,
    selectionEnd,
  }
}

function applyState(scrollToTop = false) {
  const contextTextAreaSelectionStart = getState('context-selection-start')
  const contextTextAreaSelectionEnd = getState('context-selection-end')
  const litsTextAreaSelectionStart = getState('lits-code-selection-start')
  const litsTextAreaSelectionEnd = getState('lits-code-selection-end')

  setOutput(getState('output'), false)
  getDataFromUrl()

  setContext(getState('context'), false)
  elements.contextTextArea.selectionStart = contextTextAreaSelectionStart
  elements.contextTextArea.selectionEnd = contextTextAreaSelectionEnd

  setLitsCode(getState('lits-code'), false, scrollToTop ? 'top' : undefined)
  elements.litsTextArea.selectionStart = litsTextAreaSelectionStart
  elements.litsTextArea.selectionEnd = litsTextAreaSelectionEnd

  renderDebugInfo()
  layout()

  setTimeout(() => {
    if (getState('focused-panel') === 'context')
      elements.contextTextArea.focus()
    else if (getState('focused-panel') === 'lits-code')
      elements.litsTextArea.focus()

    elements.contextTextArea.scrollTop = getState('context-scroll-top')
    elements.litsTextArea.scrollTop = getState('lits-code-scroll-top')
    elements.outputResult.scrollTop = getState('output-scroll-top')
  }, 0)
}

function renderDebugInfo() {
  const debug = getState('debug')
  elements.toggleDebugMenuLabel.textContent = debug ? 'Debug: ON' : 'Debug: OFF'
  elements.litsPanelDebugInfo.style.display = debug ? 'flex' : 'none'
}

export function showPage(id: string, scroll: 'smooth' | 'instant' | 'none', historyEvent: 'replace' | 'push' | 'none' = 'push') {
  setTimeout(() => {
    inactivateAll()

    Search.closeSearch()
    const page = document.getElementById(id)
    const linkElementId = `${(!id || id === 'index') ? 'home-page' : id}_link`
    const link = document.getElementById(linkElementId)

    if (!id || id === 'index' || id === 'example-page')
      elements.mainPanel.scrollTo({ top: 0 })

    if (!page) {
      showPage('index', scroll, 'replace')
      return
    }

    page.classList.add('active-content')
    if (link) {
      link.classList.add('active-sidebar-entry')
      if (scroll !== 'none')
        link.scrollIntoView({ block: 'center', behavior: scroll })
    }

    if (id === 'index')
      history.replaceState(null, 'Lits', window.location.pathname + window.location.search)

    else if (historyEvent === 'replace')
      history.replaceState(null, '', `#${id}`)

    else if (historyEvent !== 'none')
      history.pushState(null, '', `#${id}`)
  }, 0)
}

function inactivateAll() {
  let els = document.getElementsByClassName('active-content')
  while (els[0])
    els[0].classList.remove('active-content')

  els = document.getElementsByClassName('active-sidebar-entry')
  while (els[0])
    els[0].classList.remove('active-sidebar-entry')
}

export function addToPlayground(name: string, encodedExample: string) {
  const example = atob(encodedExample)
  appendLitsCode(`;; Example - ${name} ;;\n\n${example}\n`)
  saveState({ 'focused-panel': 'lits-code' })
  applyState()
}

export function setPlayground(name: string, encodedExample: string) {
  const example = JSON.parse(atob(encodedExample)) as Example

  const context = example.context
    // eslint-disable-next-line ts/no-unsafe-return
    ? JSON.stringify(example.context, (_k, v) => (v === undefined ? null : v), 2)
    : ''

  setContext(context, true, 'top')

  const code = example.code ? example.code : ''
  const size = Math.max(name.length + 10, 40)
  const paddingLeft = Math.floor((size - name.length) / 2)
  const paddingRight = Math.ceil((size - name.length) / 2)
  setLitsCode(`
${`;;${'-'.repeat(size)};;`}
${`;;${' '.repeat(paddingLeft)}${name}${' '.repeat(paddingRight)};;`}
${`;;${'-'.repeat(size)};;`}

${code}
`.trimStart(), true, 'top')
  saveState({ 'focused-panel': 'lits-code' })
  applyState()
}

function hijackConsole() {
  const oldLog = console.log
  console.log = function (...args: unknown[]) {
    const logRow = args.map(arg => stringifyValue(arg, false)).join(' ')
    appendOutput(logRow, 'output')
  }
  const oldWarn = console.warn
  console.warn = function (...args: unknown[]) {
    oldWarn.apply(console, args)
    appendOutput(args[0], 'warn')
  }
  const oldError = console.error
  console.warn = function (...args: unknown[]) {
    oldError.apply(console, args)
    appendOutput(args[0], 'error')
  }
  return {
    releaseConsole: () => {
      console.log = oldLog
      console.warn = oldWarn
    },
  }
}

function getLitsCodeCols(): number {
  // Create a temporary element
  const { font, paddingLeft, paddingRight } = window.getComputedStyle(elements.litsTextArea)
  const tempElement = document.createElement('span')
  tempElement.style.font = font
  tempElement.style.visibility = 'hidden'
  tempElement.style.whiteSpace = 'pre'
  tempElement.textContent = 'M' // Use a common monospace character

  // Append the element to the body
  document.body.appendChild(tempElement)

  // Measure the width of the character
  const characterWidth = tempElement.getBoundingClientRect().width

  const textAreawidth = elements.litsTextArea.clientWidth
    - Number.parseInt(paddingLeft)
    - Number.parseInt(paddingRight)

  // Remove the temporary element
  document.body.removeChild(tempElement)

  return Math.max(1, Math.floor(textAreawidth / characterWidth))
}
