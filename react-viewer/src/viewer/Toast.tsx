import { useCallback, useRef, useState } from 'react'

/** The toast for a successful Copy Code tap or click. */
export const copiedMessage = (code: string) => `Copied ${code} to your clipboard`

/**
 * Figma "Status Toast" (224:3793): confirms an action in a polite
 * role="status" live region.
 */
export function useToast(duration = 2400) {
  const [message, setMessage] = useState('')
  const timer = useRef<number | undefined>(undefined)

  const toast = useCallback(
    (text: string) => {
      window.clearTimeout(timer.current)
      setMessage(text)
      timer.current = window.setTimeout(() => setMessage(''), duration)
    },
    [duration],
  )

  const toastRegion = (
    <div role="status" aria-live="polite" className="toast-region">
      {message && <div className="toast">{message}</div>}
    </div>
  )

  return { toast, toastRegion }
}
