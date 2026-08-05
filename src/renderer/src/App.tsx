import { useEffect } from 'react'
import { useTimerStore } from './store/useTimerStore'
import { useIpcListeners } from './hooks/useIpcListeners'
import ModeBadge from './components/ModeBadge'
import TimerDisplay from './components/TimerDisplay'
import Controls from './components/Controls'
import SessionCounter from './components/SessionCounter'
import SettingsPanel from './components/SettingsPanel'

export default function App() {
  useIpcListeners()
  const settings = useTimerStore((s) => s.settings)

  useEffect(() => {
    window.electronAPI.getSettings().then((loaded) => {
      useTimerStore.getState().setSettings(loaded)
    })
  }, [])

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 bg-md-bg text-md-text select-none overflow-hidden">
      {/* Flowing light background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 w-[150vw] h-[150vw] rounded-full opacity-40 animate-flow"
          style={{
            background: `conic-gradient(
              from 0deg,
              transparent 0deg,
              rgba(200, 159, 156, 0.08) 60deg,
              transparent 120deg,
              rgba(159, 179, 160, 0.06) 180deg,
              transparent 240deg,
              rgba(154, 170, 184, 0.08) 300deg,
              transparent 360deg
            )`,
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute inset-0 animate-shimmer opacity-30"
          style={{
            background: `linear-gradient(
              120deg,
              transparent 0%,
              rgba(200, 159, 156, 0.05) 25%,
              rgba(196, 181, 165, 0.08) 50%,
              rgba(159, 179, 160, 0.05) 75%,
              transparent 100%
            )`,
          }}
        />
      </div>

      <button
        onClick={() => window.electronAPI.minimizeToTray()}
        className="absolute top-3 right-3 text-md-muted hover:text-md-text text-xs z-10 transition"
        title="最小化到托盘"
      >
        ✕
      </button>

      <div className="relative z-10 flex flex-col items-center">
        <ModeBadge />
        <TimerDisplay />
        <Controls />
        <SessionCounter />
        {settings && <SettingsPanel settings={settings} />}
      </div>
    </div>
  )
}
