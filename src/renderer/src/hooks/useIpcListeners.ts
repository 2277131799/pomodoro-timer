import { useEffect, useRef } from 'react'
import { useTimerStore } from '../store/useTimerStore'

function playBeep(): void {
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioCtx) return

  const ctx = new AudioCtx()
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()

  oscillator.type = 'sine'
  oscillator.frequency.value = 880
  gain.gain.setValueAtTime(0.1, ctx.currentTime)

  oscillator.connect(gain)
  gain.connect(ctx.destination)

  oscillator.start()
  oscillator.stop(ctx.currentTime + 0.25)
}

function playTick(): void {
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioCtx) return

  const ctx = new AudioCtx()
  const t = ctx.currentTime
  const sampleRate = ctx.sampleRate
  const duration = 0.04
  const buffer = ctx.createBuffer(1, Math.ceil(sampleRate * duration), sampleRate)
  const data = buffer.getChannelData(0)

  for (let i = 0; i < data.length; i++) {
    data[i] = Math.random() * 2 - 1
  }

  const noise = ctx.createBufferSource()
  noise.buffer = buffer

  const filter = ctx.createBiquadFilter()
  filter.type = 'highpass'
  filter.frequency.value = 2500

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.04, t)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration)

  noise.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)

  noise.start(t)
  noise.stop(t + duration)
}

export function useIpcListeners(): void {
  const setTimerState = useTimerStore((s) => s.setTimerState)
  const setSettings = useTimerStore((s) => s.setSettings)
  const lastSecondRef = useRef(0)

  useEffect(() => {
    const api = window.electronAPI

    const unsubscribeUpdate = api.onTimerUpdate((state) => {
      setTimerState(state)

      const tickEnabled =
        useTimerStore.getState().settings?.tickSoundEnabled ?? true
      if (
        state.isRunning &&
        state.timeLeft > 0 &&
        state.timeLeft !== lastSecondRef.current &&
        tickEnabled
      ) {
        lastSecondRef.current = state.timeLeft
        playTick()
      }
    })

    const unsubscribeComplete = api.onTimerComplete(() => {
      const soundEnabled =
        useTimerStore.getState().settings?.soundEnabled ?? true
      if (soundEnabled) {
        playBeep()
      }
    })

    const unsubscribeSettings = api.onSettingsLoaded((settings) =>
      setSettings(settings),
    )

    return () => {
      unsubscribeUpdate()
      unsubscribeComplete()
      unsubscribeSettings()
    }
  }, [setTimerState, setSettings])
}
