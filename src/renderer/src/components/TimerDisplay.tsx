import { useTimerStore } from '../store/useTimerStore'

export default function TimerDisplay() {
  const timeLeft = useTimerStore((s) => s.timeLeft)
  const mode = useTimerStore((s) => s.mode)
  const isRunning = useTimerStore((s) => s.isRunning)

  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, '0')
  const seconds = (timeLeft % 60).toString().padStart(2, '0')

  const glowColor =
    mode === 'work'
      ? 'rgba(200, 159, 156, 0.35)'
      : mode === 'shortBreak'
        ? 'rgba(159, 179, 160, 0.35)'
        : 'rgba(154, 170, 184, 0.35)'

  return (
    <div
      className="relative text-7xl font-mono font-bold tracking-wider my-6 px-4 py-2 rounded-2xl transition"
      style={{
        textShadow: isRunning
          ? `0 0 24px ${glowColor}, 0 0 48px ${glowColor}`
          : `0 0 12px ${glowColor}`,
      }}
    >
      {minutes}:{seconds}
    </div>
  )
}
