import { useTimerStore } from '../store/useTimerStore'

export default function SessionCounter() {
  const sessionsCompleted = useTimerStore((s) => s.sessionsCompleted)

  return (
    <div className="text-sm text-md-muted mb-6">
      已完成番茄数：{sessionsCompleted}
    </div>
  )
}
