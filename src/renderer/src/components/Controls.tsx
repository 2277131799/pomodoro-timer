import { useTimerStore } from '../store/useTimerStore'

export default function Controls() {
  const isRunning = useTimerStore((s) => s.isRunning)

  return (
    <div className="flex gap-3 mb-4">
      <button
        onClick={() =>
          window.electronAPI.sendTimerCommand(isRunning ? 'pause' : 'start')
        }
        className="px-6 py-2 rounded-xl bg-md-work hover:bg-md-work-dark text-white font-semibold transition shadow-lg shadow-md-work/20"
      >
        {isRunning ? '暂停' : '开始'}
      </button>
      <button
        onClick={() => window.electronAPI.sendTimerCommand('reset')}
        className="px-6 py-2 rounded-xl bg-md-surface hover:bg-md-card text-md-text font-semibold transition"
      >
        重置
      </button>
      <button
        onClick={() => window.electronAPI.sendTimerCommand('skip')}
        className="px-6 py-2 rounded-xl bg-md-surface hover:bg-md-card text-md-text font-semibold transition"
      >
        跳过
      </button>
    </div>
  )
}
