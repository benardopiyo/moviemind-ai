// ===== src/hooks/useApi.ts =====
import { useState, useEffect, useCallback } from 'react'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseApiOptions {
  immediate?: boolean
  deps?: any[]
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions = {}
): UseApiState<T> & { 
  refetch: () => Promise<void>
  reset: () => void
} {
  const { immediate = true, deps = [], onSuccess, onError } = options
  
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const result = await apiCall()
      setState({ data: result, loading: false, error: null })
      onSuccess?.(result)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setState({ data: null, loading: false, error: errorMessage })
      onError?.(errorMessage)
    }
  }, [apiCall, onSuccess, onError])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, deps)

  return {
    ...state,
    refetch: execute,
    reset,
  }
}