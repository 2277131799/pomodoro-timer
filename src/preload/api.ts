import type { Settings, TimerMode, TimerState } from '../shared/types'

export type { Settings, TimerMode, TimerState }

export interface ElectronAPI {
  getSettings(): Promise<Settings>
  setSetting(key: keyof Settings, value: unknown): Promise<void>
  resetSettings(): Promise<void>
  sendTimerCommand(command: 'start' | 'pause' | 'reset' | 'skip'): void
  setAlwaysOnTop(value: boolean): void
  minimizeToTray(): void
  quitApp(): void
  onTimerUpdate(callback: (state: TimerState) => void): () => void
  onTimerComplete(callback: (mode: TimerMode) => void): () => void
  onSettingsLoaded(callback: (settings: Settings) => void): () => void
}
