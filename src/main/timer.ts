import { modeDurationKeys } from '../shared/modes'
import type { TimerMode, TimerState } from '../shared/types'
import store from './store'

let state: TimerState = createInitialState()
let interval: NodeJS.Timeout | null = null
let onUpdate: ((state: TimerState) => void) | null = null
let onComplete: ((mode: TimerMode) => void) | null = null

function createInitialState(): TimerState {
  return {
    mode: 'work',
    timeLeft: store.get('workDuration') * 60,
    isRunning: false,
    sessionsCompleted: 0,
  }
}

function durationFor(mode: TimerMode): number {
  return store.get(modeDurationKeys[mode]) * 60
}

function emit(): void {
  onUpdate?.({ ...state })
}

function resetCurrentMode(): void {
  state.timeLeft = durationFor(state.mode)
}

function startInterval(): void {
  interval = setInterval(tick, 1000)
}

function transitionToNextMode(autoStart: boolean): void {
  let next: TimerMode

  if (state.mode === 'work') {
    state.sessionsCompleted += 1
    next = state.sessionsCompleted % 4 === 0 ? 'longBreak' : 'shortBreak'
  } else {
    next = 'work'
  }

  state.mode = next
  state.timeLeft = durationFor(next)

  if (autoStart && state.mode !== 'work') {
    state.isRunning = true
    startInterval()
  } else {
    state.isRunning = false
  }
}

function tick(): void {
  if (state.timeLeft > 0) {
    state.timeLeft -= 1
    emit()
  } else {
    handleComplete()
  }
}

function handleComplete(): void {
  const completedMode = state.mode
  stopInterval()
  onComplete?.(completedMode)

  const autoStart = store.get('autoStartBreaks')
  transitionToNextMode(autoStart)
  emit()
}

function stopInterval(): void {
  if (interval) {
    clearInterval(interval)
    interval = null
  }
  state.isRunning = false
}

export function setCallbacks(
  update: (state: TimerState) => void,
  complete: (mode: TimerMode) => void,
): void {
  onUpdate = update
  onComplete = complete
}

export function getState(): TimerState {
  return { ...state }
}

export function start(): void {
  if (state.isRunning) return
  if (state.timeLeft <= 0) {
    resetCurrentMode()
  }
  state.isRunning = true
  emit()
  startInterval()
}

export function pause(): void {
  if (!state.isRunning) return
  stopInterval()
  emit()
}

export function reset(): void {
  stopInterval()
  resetCurrentMode()
  emit()
}

export function skip(): void {
  stopInterval()
  transitionToNextMode(false)
  emit()
}
