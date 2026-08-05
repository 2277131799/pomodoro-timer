import { useState } from 'react'
import type { Settings } from '../../../preload/api'

interface SettingsPanelProps {
  settings: Settings
}

export default function SettingsPanel({
  settings,
}: SettingsPanelProps) {
  const [form, setForm] = useState(settings)

  const update = <K extends keyof Settings>(key: K, value: Settings[K]): void => {
    const next = { ...form, [key]: value }
    setForm(next)
    window.electronAPI.setSetting(key, value)
  }

  return (
    <div className="w-full max-w-xs bg-md-card/80 backdrop-blur-sm rounded-2xl p-5 space-y-4 border border-white/5 shadow-xl">
      <h2 className="text-sm font-semibold text-md-accent uppercase tracking-wide">
        设置
      </h2>

      <label className="flex items-center justify-between text-sm text-md-text">
        专注时长（分钟）
        <input
          type="number"
          min={1}
          max={60}
          value={form.workDuration}
          onChange={(e) => update('workDuration', Number(e.target.value))}
          className="w-16 bg-md-surface rounded-lg px-2 py-1 text-right text-md-text focus:outline-none focus:ring-2 focus:ring-md-work/50"
        />
      </label>

      <label className="flex items-center justify-between text-sm text-md-text">
        短休息时长（分钟）
        <input
          type="number"
          min={1}
          max={60}
          value={form.shortBreakDuration}
          onChange={(e) => update('shortBreakDuration', Number(e.target.value))}
          className="w-16 bg-md-surface rounded-lg px-2 py-1 text-right text-md-text focus:outline-none focus:ring-2 focus:ring-md-short/50"
        />
      </label>

      <label className="flex items-center justify-between text-sm text-md-text">
        长休息时长（分钟）
        <input
          type="number"
          min={1}
          max={60}
          value={form.longBreakDuration}
          onChange={(e) => update('longBreakDuration', Number(e.target.value))}
          className="w-16 bg-md-surface rounded-lg px-2 py-1 text-right text-md-text focus:outline-none focus:ring-2 focus:ring-md-long/50"
        />
      </label>

      <hr className="border-white/10" />

      <label className="flex items-center justify-between text-sm text-md-text">
        结束提示音
        <input
          type="checkbox"
          checked={form.soundEnabled}
          onChange={(e) => update('soundEnabled', e.target.checked)}
          className="w-4 h-4 accent-md-work"
        />
      </label>

      <label className="flex items-center justify-between text-sm text-md-text">
        机械滴答声
        <input
          type="checkbox"
          checked={form.tickSoundEnabled}
          onChange={(e) => update('tickSoundEnabled', e.target.checked)}
          className="w-4 h-4 accent-md-accent"
        />
      </label>

      <label className="flex items-center justify-between text-sm text-md-text">
        窗口置顶
        <input
          type="checkbox"
          checked={form.alwaysOnTop}
          onChange={(e) => update('alwaysOnTop', e.target.checked)}
          className="w-4 h-4 accent-md-long"
        />
      </label>

      <label className="flex items-center justify-between text-sm text-md-text">
        自动开始休息
        <input
          type="checkbox"
          checked={form.autoStartBreaks}
          onChange={(e) => update('autoStartBreaks', e.target.checked)}
          className="w-4 h-4 accent-md-short"
        />
      </label>
    </div>
  )
}
