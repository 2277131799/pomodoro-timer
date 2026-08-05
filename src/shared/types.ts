export type TimerMode = 'work' | 'shortBreak' | 'longBreak'

export interface TimerState {
  mode: TimerMode
  timeLeft: number
  isRunning: boolean
  sessionsCompleted: number
}

export interface Settings {
  workDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  soundEnabled: boolean
  tickSoundEnabled: boolean
  alwaysOnTop: boolean
  autoStartBreaks: boolean
}

export const defaults: Settings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  soundEnabled: true,
  tickSoundEnabled: true,
  alwaysOnTop: false,
  autoStartBreaks: false,
}
