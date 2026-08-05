import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron'
import type { ElectronAPI, Settings, TimerMode, TimerState } from './api'

function invokeChannel<T>(channel: string, ...args: unknown[]): Promise<T> {
  return ipcRenderer.invoke(channel, ...args) as Promise<T>
}

function onChannel<T>(
  channel: string,
  callback: (payload: T) => void,
): () => void {
  const handler = (_event: IpcRendererEvent, payload: T) => callback(payload)
  ipcRenderer.on(channel, handler)
  return () => ipcRenderer.removeListener(channel, handler)
}

const api: ElectronAPI = {
  getSettings: () => invokeChannel<Settings>('settings:getAll'),

  setSetting: (key, value) => invokeChannel<void>('settings:set', key, value),

  resetSettings: () => invokeChannel<void>('settings:reset'),

  sendTimerCommand: (command) => ipcRenderer.send('timer:command', command),

  setAlwaysOnTop: (value) => ipcRenderer.send('window:alwaysOnTop', value),

  minimizeToTray: () => ipcRenderer.send('window:minimizeToTray'),

  quitApp: () => ipcRenderer.send('app:quit'),

  onTimerUpdate: (callback) => onChannel<TimerState>('timer:update', callback),

  onTimerComplete: (callback) => onChannel<TimerMode>('timer:complete', callback),

  onSettingsLoaded: (callback) => onChannel<Settings>('settings:loaded', callback),
}

contextBridge.exposeInMainWorld('electronAPI', api)
