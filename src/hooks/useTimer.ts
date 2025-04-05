import { create } from 'zustand'

type Timer = {
  duration: number
  start: () => void
  reset: () => void
  stop: () => void
  formatTimer: () => string
}

export const useTimer = create<Timer>((set, get) => {
  let intervalId: ReturnType<typeof setInterval> | null = null
  let startTime = 0

  const start = () => {
    if (intervalId) return;

    startTime = Date.now()
    intervalId = setInterval(() => {
      set({ duration: Date.now() - startTime })
    }, 1000)
  }

  const reset = () => {
    if (intervalId) clearInterval(intervalId)
    intervalId = null
    set({ duration: 0 })
    start()
  }

  const stop = () => {
    if (intervalId) clearInterval(intervalId)
    intervalId = null
  }

  const formatTimer = () => {
    const duration = get().duration
    const pad = (n: number) => String(n).padStart(2, '0')
    
    const hours = pad(Math.floor(duration / 3600000))
    const minutes = pad(Math.floor((duration % 3600000) / 60000))
    const seconds = pad(Math.floor((duration % 60000) / 1000))
    return `${hours}:${minutes}:${seconds}`
  }

  return {
    duration: 0,
    start,
    reset,
    stop,
    formatTimer
  }
})