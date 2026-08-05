import { useTimerStore } from '../store/useTimerStore'
import type { TimerMode } from '../../../preload/api'

const labels: Record<TimerMode, string> = {
  work: '专注',
  shortBreak: '短休息',
  longBreak: '长休息',
}

const colors: Record<TimerMode, string> = {
  work: 'text-md-work',
  shortBreak: 'text-md-short',
  longBreak: 'text-md-long',
}

export default function ModeBadge() {
  const mode = useTimerStore((s) => s.mode)

  return <div className={`text-lg font-semibold ${colors[mode]}`}>{labels[mode]}</div>
}
