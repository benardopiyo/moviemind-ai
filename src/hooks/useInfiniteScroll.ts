// ===== src/hooks/useInfiniteScroll.ts =====
import { useState, useEffect, useCallback, useRef } from 'react'

interface UseInfiniteScrollOptions {
  threshold?: number // Percentage of page scrolled before loading more (0-1)
  rootMargin?: string
  enabled?: boolean
}

interface UseInfiniteScrollReturn {
  isFetching: boolean
  setIsFetching: (fetching: boolean) => void
  lastElementRef: (node: HTMLElement | null) => void
}

/**
 * Hook for implementing infinite scroll functionality
 */
export function useInfiniteScroll(
  fetchMore: () => Promise<void>,
  hasMore: boolean,
  options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollReturn {
  const { threshold = 0.1, rootMargin = '0px', enabled = true } = options
  const [isFetching, setIsFetching] = useState(false)
  const observer = useRef<IntersectionObserver | null>(null)

  const lastElementRef = useCallback((node: HTMLElement | null) => {
    if (isFetching || !enabled || !hasMore) return

    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver(
      entries => {
        if (entries && entries[0]?.isIntersecting && hasMore && !isFetching) {
          setIsFetching(true)
          fetchMore().finally(() => setIsFetching(false))
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    if (node) observer.current.observe(node)
  }, [isFetching, hasMore, enabled, threshold, rootMargin, fetchMore])

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [])

  return { isFetching, setIsFetching, lastElementRef }
}