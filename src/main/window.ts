import { BrowserWindow, nativeImage } from 'electron'
import path from 'node:path'

const iconPath = path.join(__dirname, '../../build/icon.png')

export function createWindow(preloadPath: string): BrowserWindow {
  return new BrowserWindow({
    width: 360,
    height: 520,
    resizable: false,
    maximizable: false,
    minimizable: true,
    show: false,
    title: '远少的番茄钟',
    titleBarStyle: 'hidden',
    icon: nativeImage.createFromPath(iconPath),
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
    },
  })
}

export function loadRenderer(window: BrowserWindow): void {
  if (process.env.NODE_ENV_ELECTRON_VITE === 'development') {
    window.loadURL(process.env.ELECTRON_RENDERER_URL!)
  } else {
    window.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}
