// ===== src/hooks/useOnScreen.ts =====
import { useState, useEffect, useRef } from 'react'

/**
 * Hook to detect if an element is visible on screen
 */
export function useOnScreen(
  options: IntersectionObserverInit = {}
): [React.RefObject<HTMLElement>, boolean] {
  const elementRef = useRef<HTMLElement>(null)
  const [isOnScreen, setIsOnScreen] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsOnScreen(entry?.isIntersecting || false)
    }, options)

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [options])

  return [elementRef, isOnScreen]
}