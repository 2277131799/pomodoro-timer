import type { TimerMode } from './types'

export const modeLabels: Record<TimerMode, string> = {
  work: '专注',
  shortBreak: '短休息',
  longBreak: '长休息',
}

export const modeDurationKeys: Record<
  TimerMode,
  'workDuration' | 'shortBreakDuration' | 'longBreakDuration'
> = {
  work: 'workDuration',
  shortBreak: 'shortBreakDuration',
  longBreak: 'longBreakDuration',
}

export const modeGlowColors: Record<TimerMode, string> = {
  work: 'rgba(200, 159, 156, 0.35)',
  shortBreak: 'rgba(159, 179, 160, 0.35)',
  longBreak: 'rgba(154, 170, 184, 0.35)',
}
