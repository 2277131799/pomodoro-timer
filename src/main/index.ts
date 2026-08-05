import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItemConstructorOptions,
  nativeImage,
  Notification,
  Tray,
} from 'electron'
import path from 'node:path'
import store from './store'
import * as timer from './timer'
import { createWindow, loadRenderer } from './window'

app.setAppUserModelId('远少的番茄钟')

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null

function send(channel: string, ...args: unknown[]): void {
  mainWindow?.webContents.send(channel, ...args)
}

function createTrayIcon(): Electron.NativeImage {
  return nativeImage.createFromPath(path.join(__dirname, '../../build/tray-icon.png'))
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function updateTray(state: timer.TimerState): void {
  if (!tray) return
  const modeLabels: Record<timer.TimerMode, string> = {
    work: '专注',
    shortBreak: '短休息',
    longBreak: '长休息',
  }
  const label = modeLabels[state.mode]
  tray.setToolTip(
    `${label} ${formatTime(state.timeLeft)}${state.isRunning ? '' : '（已暂停）'}`,
  )
}

function createTray(): void {
  tray = new Tray(createTrayIcon())
  tray.setToolTip('远少的番茄钟')
  tray.on('click', toggleWindow)

  const template: MenuItemConstructorOptions[] = [
    { label: '显示 / 隐藏', click: toggleWindow },
    { label: '重置', click: () => timer.reset() },
    { type: 'separator' },
    { label: '退出', click: () => app.quit() },
  ]
  tray.setContextMenu(Menu.buildFromTemplate(template))
}

function toggleWindow(): void {
  if (!mainWindow) return
  if (mainWindow.isVisible()) {
    mainWindow.hide()
  } else {
    mainWindow.show()
    mainWindow.focus()
  }
}

function createMainWindow(): void {
  const preloadPath = path.join(__dirname, '../preload/index.cjs')
  mainWindow = createWindow(preloadPath)
  loadRenderer(mainWindow)

  mainWindow.setAlwaysOnTop(store.get('alwaysOnTop'))

  mainWindow.on('close', (event) => {
    event.preventDefault()
    mainWindow?.hide()
  })
}

app.whenReady().then(() => {
  createMainWindow()
  createTray()

  timer.setCallbacks(
    (state) => {
      send('timer:update', state)
      updateTray(state)
    },
    (mode) => {
      send('timer:complete', mode)
      new Notification({
        title: '番茄钟',
        body: `${mode === 'work' ? '专注' : mode === 'shortBreak' ? '短休息' : '长休息'} 结束！`,
      }).show()
    },
  )

  send('timer:update', timer.getState())
  send('settings:loaded', store.store)
})

app.on('window-all-closed', () => {
  // keep running in the system tray on Windows
})

app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow()
  } else {
    mainWindow?.show()
    mainWindow?.focus()
  }
})

app.on('before-quit', () => {
  mainWindow?.destroy()
})

ipcMain.handle('settings:getAll', () => store.store)

ipcMain.handle('settings:set', (_, key: string, value: unknown) => {
  store.set(key as keyof typeof store.store, value as never)
})

ipcMain.handle('settings:reset', () => {
  store.clear()
})

ipcMain.on(
  'timer:command',
  (_, command: 'start' | 'pause' | 'reset' | 'skip') => {
    if (command === 'start') timer.start()
    else if (command === 'pause') timer.pause()
    else if (command === 'reset') timer.reset()
    else if (command === 'skip') timer.skip()
  },
)

ipcMain.on('window:alwaysOnTop', (_, value: boolean) => {
  store.set('alwaysOnTop', value)
  mainWindow?.setAlwaysOnTop(value)
})

ipcMain.on('window:minimizeToTray', () => {
  mainWindow?.hide()
})

ipcMain.on('app:quit', () => app.quit())
