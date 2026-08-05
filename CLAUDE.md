# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

This is a desktop Pomodoro timer built with **Electron**, **React**, **electron-vite**, **Tailwind CSS**, **Zustand**, and **electron-store**. It uses `pnpm` as the package manager.

Product name: **远少的番茄钟**.

- `src/main/` — Electron main process, timer engine, tray, notifications, and settings persistence.
- `src/preload/` — typed `contextBridge` exposing a small API to the renderer.
- `src/renderer/` — React UI (timer display, controls, settings panel).

State and persistence are split:

- The **main process** owns the timer state machine (`src/main/timer.ts`) and durable settings (`src/main/store.ts` via `electron-store`).
- The **renderer** mirrors timer state through IPC and uses **Zustand** for UI state.
- All Electron/Node APIs stay out of the renderer; use `window.electronAPI`.

## Common commands

```bash
# Install dependencies (Electron binary postinstall is enabled in .npmrc)
pnpm install

# Run the app in development mode
pnpm dev

# Build main, preload, and renderer for production
pnpm build

# Run the production build locally
pnpm preview

# Type-check the whole project
pnpm exec tsc --noEmit

# Build a portable Windows executable
pnpm dist
```

Notes:

- `package.json` `"main"` points to `out/main/index.cjs`, the CJS output produced by `electron-vite`.
- The project uses **electron-builder** to package a Windows portable executable.
- `.npmrc` includes `electron` in `onlyBuiltDependencies` and sets an Electron mirror for regions where the official download is slow/blocked.

## Key files

- `electron.vite.config.ts` — three-way Vite config for main, preload, and renderer.
- `electron-builder.yml` — electron-builder packaging configuration.
- `scripts/make-icon.js` — converts the source image into `build/icon.ico`, `build/icon.png`, and `build/tray-icon.png`.
- `src/main/index.ts` — app bootstrap, window/tray setup, and IPC handlers.
- `src/main/timer.ts` — main-process timer engine (work / short break / long break cycles).
- `src/main/store.ts` — `electron-store` wrapper with defaults.
- `src/preload/api.ts` — shared API types used by preload and renderer.
- `src/preload/index.ts` — context-bridge implementation.
- `src/renderer/src/store/useTimerStore.ts` — Zustand store for renderer UI state.
- `src/renderer/src/hooks/useIpcListeners.ts` — subscribes to main -> renderer IPC events.

## Things to keep in mind

- Keep timer logic in the main process so it keeps running when the window is hidden.
- Settings changes are persisted immediately via `window.electronAPI.setSetting`.
- The tray and window icons are loaded from `build/tray-icon.png` and `build/icon.png`.
- If you add new IPC channels, update both `src/preload/api.ts` and `src/preload/index.ts`.
- To change the app icon, replace the source image path in `scripts/make-icon.js` and re-run `node scripts/make-icon.js`.
