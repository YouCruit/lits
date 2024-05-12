/* eslint-disable unused-imports/no-unused-vars */

import type { Example } from '../../reference/examples'
import type { LitsParams } from '../../src'
import { Lits, isBuiltinFunction, isLitsFunction, isNativeJsFunction, isUserDefinedFunction } from '../../src'
import type { UnknownRecord } from '../../src/interface'
import { Search } from './Search'

const lits = new Lits({ debug: true })
const litsNoDebug = new Lits({ debug: false })
const DEFAULT_PLAYGROUND_HEIGHT = 350
const DEFAULT_RESIZE_DIVIDER1_X_PERCENT = 15
const DEFAULT_RESIZE_DIVIDER2_X_PERCENT = 70

type MoveParams = {
  id: 'playground'
  startMoveY: number
  heightBeforeMove: number
} | {
  id: 'resize-divider-1' | 'resize-divider-2'
  startMoveX: number
  percentBeforeMove: number
}

let moveParams: MoveParams | null = null
let playgroundHeight = 0
let resizeDivider1XPercent = DEFAULT_RESIZE_DIVIDER1_X_PERCENT
let resizeDivider2XPercent = DEFAULT_RESIZE_DIVIDER2_X_PERCENT

function calculateDimensions() {
  return {
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth,
  }
}

export function toggleMoreMenu() {
  const moreMenu = document.getElementById('more-menu') as HTMLElement
  moreMenu.style.display = moreMenu.style.display === 'block' ? 'none' : 'block'
}

export function closeMoreMenu() {
  const moreMenu = document.getElementById('more-menu') as HTMLElement
  moreMenu.style.display = 'none'
}

function onDocumentClick(event: Event) {
  const target = event.target as HTMLInputElement | undefined
  if (target?.closest('#more-menu'))
    return

  const moreMenu = document.getElementById('more-menu') as HTMLElement
  if (moreMenu.style.display === 'block') {
    event.stopPropagation()
    closeMoreMenu()
  }
}

function layout() {
  const { windowWidth } = calculateDimensions()

  const wrapper = document.getElementById('wrapper') as HTMLElement
  const playground = document.getElementById('playground') as HTMLElement
  const sidebar = document.getElementById('sidebar') as HTMLElement
  const mainPanel = document.getElementById('main-panel') as HTMLElement
  const paramsPanel = document.getElementById('params-panel') as HTMLElement
  const litsPanel = document.getElementById('lits-panel') as HTMLElement
  const outputPanel = document.getElementById('output-panel') as HTMLElement

  const topPanelsBottom = playgroundHeight

  const paramsPanelWidth = (windowWidth * resizeDivider1XPercent) / 100
  const outputPanelWidth = (windowWidth * (100 - resizeDivider2XPercent)) / 100
  const litsPanelWidth = windowWidth - paramsPanelWidth - outputPanelWidth

  playground.style.height = `${playgroundHeight}px`

  paramsPanel.style.width = `${paramsPanelWidth}px`
  litsPanel.style.width = `${litsPanelWidth}px`
  outputPanel.style.width = `${outputPanelWidth}px`

  sidebar.style.bottom = `${topPanelsBottom}px`
  mainPanel.style.bottom = `${topPanelsBottom}px`

  wrapper.style.display = 'block'
}

export function resetPlayground() {
  resetParams()
  resetLitsCode()
  resetOutput()
  Search.closeSearch()
  Search.clearSearch()

  localStorage.removeItem('playground-height')
  localStorage.removeItem('resize-divider-1-percent')
  localStorage.removeItem('resize-divider-2-percent')
  playgroundHeight = DEFAULT_PLAYGROUND_HEIGHT
  resizeDivider1XPercent = DEFAULT_RESIZE_DIVIDER1_X_PERCENT
  resizeDivider2XPercent = DEFAULT_RESIZE_DIVIDER2_X_PERCENT
  layout()
}

export function resetParams() {
  const paramsTextArea = document.getElementById('params-textarea') as HTMLTextAreaElement
  paramsTextArea.value = ''
  localStorage.removeItem('params-textarea')
  updateParamsLinks()
}

function setParams(value: string) {
  const paramsTextArea = document.getElementById('params-textarea') as HTMLTextAreaElement
  paramsTextArea.value = value
  localStorage.setItem('params-textarea', value)
  updateParamsLinks()
}

function getParams() {
  const paramsTextArea = document.getElementById('params-textarea') as HTMLTextAreaElement
  return paramsTextArea.value
}

export function resetLitsCode() {
  const litsTextArea = document.getElementById('lits-textarea') as HTMLTextAreaElement
  litsTextArea.value = ''
  localStorage.removeItem('lits-textarea')
  litsTextArea.focus()
  updateLitsCodeLinks()
}

function setLitsCode(value: string) {
  const litsTextArea = document.getElementById('lits-textarea') as HTMLTextAreaElement
  litsTextArea.value = value
  localStorage.setItem('lits-textarea', value)
  litsTextArea.scrollTop = litsTextArea.scrollHeight
  updateLitsCodeLinks()
  litsTextArea.focus()
}

function appendLitsCode(value: string) {
  const litsTextArea = document.getElementById('lits-textarea') as HTMLTextAreaElement
  const oldContent = litsTextArea.value.trimEnd()

  const newContent = oldContent ? `${oldContent}\n\n${value}` : value.trim()
  litsTextArea.value = newContent
  localStorage.setItem('lits-textarea', newContent)
  litsTextArea.scrollTop = litsTextArea.scrollHeight
  updateLitsCodeLinks()
  litsTextArea.focus()
}

function getLitsCode() {
  const litsTextArea = document.getElementById('lits-textarea') as HTMLTextAreaElement
  return litsTextArea.value
}

export function resetOutput() {
  const outputPlaceholder = document.getElementById('output-placeholder') as HTMLElement
  outputPlaceholder.style.display = 'block'
  const outputResult = document.getElementById('output-result') as HTMLElement
  outputResult.innerHTML = ''
  updateOutputLinks()
}

function hasOutput() {
  const outputResult = document.getElementById('output-result') as HTMLElement
  return outputResult.children.length > 0
}

function appendOutput(output: unknown, className: 'error' | 'output' | 'result') {
  const outputPlaceholder = document.getElementById('output-placeholder') as HTMLElement
  outputPlaceholder.style.display = 'none'
  const outputElement = document.createElement('span')

  outputElement.className = className
  outputElement.textContent = `${output}`
  const outputResult = document.getElementById('output-result') as HTMLElement
  outputResult.appendChild(outputElement)
  const outputPanel = document.getElementById('output-panel') as HTMLElement
  outputPanel.scrollTop = outputPanel.scrollHeight
  updateOutputLinks()
}

function updateLinks() {
  updateLitsCodeLinks()
  updateOutputLinks()
  updateParamsLinks()
}

function updateParamsLinks() {
  const paramsLinks = document.getElementById('params-links') as HTMLElement

  if (getParams())
    paramsLinks.style.display = 'block'
  else
    paramsLinks.style.display = 'none'
}

function updateLitsCodeLinks() {
  const litsLinks = document.getElementById('lits-links') as HTMLElement

  if (getLitsCode())
    litsLinks.style.display = 'block'
  else
    litsLinks.style.display = 'none'
}

function updateOutputLinks() {
  const outputLinks = document.getElementById('output-links') as HTMLElement

  if (hasOutput())
    outputLinks.style.display = 'block'
  else
    outputLinks.style.display = 'none'
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

  const resizePlayground = document.getElementById('resize-playground') as HTMLElement
  resizePlayground.onmousedown = (event) => {
    moveParams = {
      id: 'playground',
      startMoveY: event.clientY,
      heightBeforeMove: playgroundHeight,
    }
  }

  const resizeDevider1 = document.getElementById('resize-divider-1') as HTMLElement
  resizeDevider1.onmousedown = (event) => {
    moveParams = {
      id: 'resize-divider-1',
      startMoveX: event.clientX,
      percentBeforeMove: resizeDivider1XPercent,
    }
  }

  const resizeDevider2 = document.getElementById('resize-divider-2') as HTMLElement
  resizeDevider2.onmousedown = (event) => {
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
    const { windowHeight, windowWidth } = calculateDimensions()
    if (moveParams === null)
      return

    document.body.classList.add('no-select')

    if (moveParams.id === 'playground') {
      playgroundHeight = moveParams.heightBeforeMove + moveParams.startMoveY - event.clientY
      if (playgroundHeight < 26)
        playgroundHeight = 26

      if (playgroundHeight > windowHeight - 89)
        playgroundHeight = windowHeight - 89

      localStorage.setItem('playground-height', `${playgroundHeight}`)
    }
    else if (moveParams.id === 'resize-divider-1') {
      resizeDivider1XPercent
        = moveParams.percentBeforeMove + ((event.clientX - moveParams.startMoveX) / windowWidth) * 100
      if (resizeDivider1XPercent < 10)
        resizeDivider1XPercent = 10

      if (resizeDivider1XPercent > resizeDivider2XPercent - 10)
        resizeDivider1XPercent = resizeDivider2XPercent - 10

      localStorage.setItem('resize-divider-1-percent', `${resizeDivider1XPercent}`)
    }
    else if (moveParams.id === 'resize-divider-2') {
      resizeDivider2XPercent
        = moveParams.percentBeforeMove + ((event.clientX - moveParams.startMoveX) / windowWidth) * 100
      if (resizeDivider2XPercent < resizeDivider1XPercent + 10)
        resizeDivider2XPercent = resizeDivider1XPercent + 10

      if (resizeDivider2XPercent > 90)
        resizeDivider2XPercent = 90

      localStorage.setItem('resize-divider-2-percent', `${resizeDivider2XPercent}`)
    }
    layout()
  }

  window.addEventListener('keydown', (evt) => {
    if (Search.handleKeyDown(evt))
      return

    if (evt.key === 'F5') {
      evt.preventDefault()
      run()
    }
    if (evt.key === 'Escape') {
      closeMoreMenu()
      evt.preventDefault()
    }
  })
  const litsTextarea = document.getElementById('lits-textarea') as HTMLElement
  litsTextarea.addEventListener('keydown', keydownHandler)
  litsTextarea.addEventListener('keydown', keydownHandler)
  litsTextarea.addEventListener('input', (event: Event) => {
    const target = event.target as HTMLInputElement | undefined
    if (target)
      setLitsCode(target.value)
  })

  const paramsTextarea = document.getElementById('params-textarea') as HTMLElement
  paramsTextarea.addEventListener('keydown', keydownHandler)
  paramsTextarea.addEventListener('input', (event: Event) => {
    const target = event.target as HTMLInputElement | undefined
    if (target)
      setParams(target.value)
  })

  const id = location.hash.substring(1) || 'index'
  showPage(id, 'replace')

  const urlParams = new URLSearchParams(window.location.search)

  const program = urlParams.get('program')
  const litsCode = program ? atob(program) : localStorage.getItem('lits-textarea') || ''
  setLitsCode(litsCode)

  setParams(localStorage.getItem('params-textarea') || '')

  updateLinks()

  layout()

  Search.onClose(() => {
    (document.getElementById('lits-textarea') as HTMLTextAreaElement).focus()
  })

  ;(document.getElementById('lits-textarea') as HTMLTextAreaElement).focus()
}

function keydownHandler(e: KeyboardEvent) {
  if (['Tab', 'Backspace', 'Enter', 'Delete'].includes(e.key)) {
    const target = e.target as HTMLTextAreaElement
    const start = target.selectionStart
    const end = target.selectionEnd

    const indexOfReturn = target.value.lastIndexOf('\n', start - 1)
    const rowLength = start - indexOfReturn - 1
    const onTabStop = rowLength % 2 === 0
    if (e.key === 'Tab') {
      e.preventDefault()
      if (!e.shiftKey) {
        target.value = target.value.substring(0, start) + (onTabStop ? '  ' : ' ') + target.value.substring(end)
        target.selectionStart = target.selectionEnd = start + (onTabStop ? 2 : 1)
      }
    }
    if (e.key === 'Backspace') {
      if (onTabStop && start === end && target.value.substr(start - 2, 2) === '  ') {
        e.preventDefault()
        target.value = target.value.substring(0, start - 2) + target.value.substring(end)
        target.selectionStart = target.selectionEnd = start - 2
      }
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      const spaceCount = target.value.substring(indexOfReturn + 1, start).replace(/^( *).*/, '$1').length
      target.value = `${target.value.substring(0, start)}\n${' '.repeat(spaceCount)}${target.value.substring(end)}`
      target.selectionStart = target.selectionEnd = start + 1 + spaceCount
    }
    if (e.key === 'Delete') {
      if (onTabStop && start === end && target.value.substr(start, 2) === '  ') {
        e.preventDefault()
        target.value = target.value.substring(0, start) + target.value.substring(end + 2)
        target.selectionStart = target.selectionEnd = start
      }
    }
  }
}

window.addEventListener('popstate', () => {
  const id = location.hash.substring(1) || 'index'
  showPage(id, 'none')
})

export function run() {
  const code = getLitsCode()
  const paramsString = getParams()
  let params: LitsParams
  try {
    params
      = paramsString.trim().length > 0
        ? JSON.parse(paramsString, (_, val) =>
          // eslint-disable-next-line no-eval, ts/no-unsafe-return
          typeof val === 'string' && val.startsWith('EVAL:') ? eval(val.substring(5)) : val) as LitsParams
        : {}
  }
  catch {
    appendOutput(`Error: Could not parse params: ${paramsString}`, 'error')
    return
  }
  let result
  const oldLog = console.log
  console.log = function (...args) {
    const logRow = args.map(arg => stringifyValue(arg)).join(' ')
    appendOutput(logRow, 'output')
  }
  const oldWarn = console.warn
  console.warn = function (...args: unknown[]) {
    oldWarn.apply(console, args)
    appendOutput(args[0], 'output')
  }
  try {
    result = lits.run(code, params)
  }
  catch (error) {
    appendOutput(error, 'error')
    return
  }
  finally {
    console.log = oldLog
    console.warn = oldWarn
  }
  const content = stringifyValue(result)

  appendOutput(content, 'result')
}

export function analyze() {
  const code = getLitsCode()
  let result
  const oldLog = console.log
  console.log = function (...args) {
    const logRow = args.map(arg => stringifyValue(arg)).join(' ')
    appendOutput(logRow, 'output')
  }
  const oldWarn = console.warn
  console.warn = function (...args: unknown[]) {
    oldWarn.apply(console, args)
    appendOutput(args[0], 'output')
  }
  try {
    result = lits.analyze(code)
  }
  catch (error) {
    appendOutput(error, 'error')
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

  appendOutput(content, 'result')
}

export function parse() {
  const code = getLitsCode()
  let result
  const oldLog = console.log
  console.log = function (...args) {
    const logRow = args.map(arg => stringifyValue(arg)).join(' ')
    appendOutput(logRow, 'output')
  }
  const oldWarn = console.warn
  console.warn = function (...args) {
    oldWarn.apply(console, args)
    appendOutput(args[0], 'output')
  }
  try {
    const tokens = litsNoDebug.tokenize(code)
    result = litsNoDebug.parse(tokens)
  }
  catch (error) {
    appendOutput(error, 'error')
    return
  }
  finally {
    console.log = oldLog
    console.warn = oldWarn
  }
  const content = JSON.stringify(result, null, 2)

  appendOutput(content, 'result')
}

export function tokenize() {
  const code = getLitsCode()
  let result
  const oldLog = console.log
  console.log = function (...args: unknown[]) {
    const logRow = args.map(arg => stringifyValue(arg)).join(' ')
    appendOutput(logRow, 'output')
  }
  const oldWarn = console.warn
  console.warn = function (...args: unknown[]) {
    oldWarn.apply(console, args)
    appendOutput(args[0], 'output')
  }
  try {
    result = litsNoDebug.tokenize(code)
  }
  catch (error) {
    appendOutput(error, 'error')
    return
  }
  finally {
    console.log = oldLog
    console.warn = oldWarn
  }
  const content = JSON.stringify(result, null, 2)

  appendOutput(content, 'result')
}

export function showPage(id: string, historyEvent: 'replace' | 'push' | 'none' = 'push') {
  inactivateAll()

  Search.closeSearch()
  const page = document.getElementById(id)
  const link = document.getElementById(`${id}_link`)

  if (page) {
    page.classList.add('active-content')
    if (link) {
      link.classList.add('active-sidebar-entry')
      link.scrollIntoView({ block: 'nearest' })
    }
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

function stringifyValue(value: unknown) {
  if (isLitsFunction(value)) {
    if (isBuiltinFunction(value))
      return `<builtin ${value.n}>`
    else if (isNativeJsFunction(value))
      return '<js \u03BB>'
    else if (isUserDefinedFunction(value))
      return `<function ${value.n || '\u03BB'}>`
    else
      return `<function ${(value as unknown as UnknownRecord).n || '\u03BB'}>`
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

  return JSON.stringify(value, null, 2)
}

export function addToPlayground(comment: string, encodedExample: string) {
  const example = atob(encodedExample)
  appendLitsCode(`${comment}\n${example}`)

  run()
}

export function setPlayground(encodedExample: string) {
  const example = JSON.parse(atob(encodedExample)) as Example

  const params = example.params
    // eslint-disable-next-line ts/no-unsafe-return
    ? JSON.stringify(example.params, (_k, v) => (v === undefined ? null : v), 2)
    : ''

  setParams(params)

  const code = example.code ? example.code : ''
  setLitsCode(code)

  run()
}
