import type { UnknownRecord } from '../../src/interface'
import type { HistoryStatus } from './StateHistory'
import { StateHistory } from './StateHistory'

export const defaultState = {
  'playground-height': 350 as number,
  'resize-divider-1-percent': 20 as number,
  'resize-divider-2-percent': 60 as number,
  'context': '' as string,
  'context-scroll-top': 0 as number,
  'context-selection-start': 0 as number,
  'context-selection-end': 0 as number,
  'lits-code': '' as string,
  'lits-code-scroll-top': 0 as number,
  'lits-code-selection-start': 0 as number,
  'lits-code-selection-end': 0 as number,
  'output': '' as string,
  'output-scroll-top': 0 as number,
  'new-context-name': '' as string,
  'new-context-value': '' as string,
  'debug': false as boolean,
  'focused-panel': null as 'lits-code' | 'context' | null,
} as const

type State = {
  -readonly [K in keyof typeof defaultState]: typeof defaultState[K]
}

type Key = keyof typeof defaultState
type StorageKey = `playground-${Key}`

const keys = Object.keys(defaultState) as Key[]

let historyListener: undefined | ((status: HistoryStatus) => void)

const state: State = {
  ...defaultState,
}

keys.forEach((key: Key) => {
  const value = localStorage.getItem(getStorageKey(key))

  ;(state as UnknownRecord)[key] = typeof value === 'string' ? JSON.parse(value) : defaultState[key]
})

const stateHistory = new StateHistory(JSON.stringify(state), (status) => {
  historyListener?.(status)
})

function getHistoryState() {
  return {
    'lits-code': state['lits-code'],
    'lits-code-selection-start': state['lits-code-selection-start'],
    'lits-code-selection-end': state['lits-code-selection-end'],
    'context': state.context,
    'context-selection-start': state['context-selection-start'],
    'context-selection-end': state['context-selection-end'],
    'focused-panel': state['focused-panel'],
  } satisfies Partial<State>
}

function historyCodeChanged() {
  const current = JSON.parse(stateHistory.peek()) as Partial<State>
  return current['lits-code'] !== state['lits-code'] || current.context !== state.context
}

function pushHistory() {
  const historyStateString = JSON.stringify(getHistoryState())

  if (historyCodeChanged())
    stateHistory.push(historyStateString)
  else
    stateHistory.replace(historyStateString)
}

export function setHistoryListener(listener: (status: HistoryStatus) => void) {
  historyListener = listener
}

export function saveState(newState: Partial<State>, pushToHistory = true) {
  Object.entries(newState).forEach((entry) => {
    const key = entry[0] as keyof State
    const value = entry[1]
    setState(key, value)
    localStorage.setItem(getStorageKey(key), JSON.stringify(value))
  })
  if (pushToHistory) {
    pushHistory()
  }
}

function setState<T extends keyof State>(key: T, value: State[T]) {
  state[key] = value
}

export function clearAllStates() {
  localStorage.clear()
  Object.assign(state, defaultState)
  stateHistory.reset(JSON.stringify(state))
}

export function clearState(key: Key) {
  localStorage.removeItem(getStorageKey(key))
  ;(state as UnknownRecord)[key] = defaultState[key]
  pushHistory()
}

export function getState<T extends keyof State>(key: T): State[T] {
  return state[key]
}

export function encodeState() {
  const sharedState: Partial<State> = {
    'lits-code': state['lits-code'],
    'context': state.context,
  }
  return btoa(JSON.stringify(sharedState))
}

export function applyEncodedState(encodedState: string): boolean {
  try {
    return applyStateString(atob(encodedState), true)
  }
  catch (error) {
    return false
  }
}

function applyStateString(stateString: string, pushToHistory: boolean): boolean {
  try {
    const decodedState = JSON.parse(stateString) as Partial<State>
    saveState(decodedState, false)
    if (pushToHistory) {
      pushHistory()
    }
    return true
  }
  catch (error) {
    return false
  }
}

export function undoState() {
  try {
    const stateString = stateHistory.undo()
    applyStateString(stateString, false)
    return true
  }
  catch {
    return false
  }
}

export function redoState() {
  try {
    const stateString = stateHistory.redo()
    applyStateString(stateString, false)
    return true
  }
  catch {
    return false
  }
}

function getStorageKey(key: Key): StorageKey {
  return `playground-${key}`
}
