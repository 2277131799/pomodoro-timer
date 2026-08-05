import { create } from 'zustand'
import type { Settings, TimerState } from '../../../preload/api'

interface TimerStore extends TimerState {
  settings: Settings | null
  setTimerState: (state: TimerState) => void
  setSettings: (settings: Settings) => void
}

export const useTimerStore = create<TimerStore>((set) => ({
  mode: 'work',
  timeLeft: 25 * 60,
  isRunning: false,
  sessionsCompleted: 0,
  settings: null,
  setTimerState: (state) => set(state),
  setSettings: (settings) => set({ settings }),
}))
