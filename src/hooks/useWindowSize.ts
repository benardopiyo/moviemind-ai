// ===== src/hooks/useWindowSize.ts =====
import { useState, useEffect } from 'react'

interface WindowSize {
  width: number
  height: number
}

/**
 * Hook to get current window size
 */
export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    handleResize() // Call handler right away so state gets updated with initial window size

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}