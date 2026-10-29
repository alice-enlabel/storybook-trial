import { useEffect, useState } from 'react'

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Keeps an element mounted while it animates out. `state` is "open" while
 * shown, "closing" during the exit animation, and the element should unmount
 * when `mounted` is false.
 */
export function usePresence(open: boolean, exitMs: number) {
  const [mounted, setMounted] = useState(open)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
      setClosing(false)
      return
    }
    if (!mounted) return
    if (reducedMotion()) {
      setMounted(false)
      return
    }
    setClosing(true)
    const t = window.setTimeout(() => {
      setMounted(false)
      setClosing(false)
    }, exitMs)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, exitMs])

  return { mounted, state: closing ? ('closing' as const) : ('open' as const) }
}
