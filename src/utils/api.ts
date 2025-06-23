// ===== src/utils/api.ts =====
import { ApiError } from '@/types/api'

/**
 * Create standardized API error
 */
export function createApiError(
  status: number,
  message: string,
  originalError?: Error
): ApiError {
  return {
    status_code: status,
    status_message: message,
    success: false,
  }
}

/**
 * Handle API errors with standardized format
 */
export function handleApiError(error: any): ApiError {
  // Network errors
  if (!error.response) {
    return createApiError(0, 'Network error. Please check your connection.')
  }

  const { status, data } = error.response

  // API-specific errors
  if (data?.status_message) {
    return createApiError(status, data.status_message)
  }

  // HTTP status errors
  switch (status) {
    case 401:
      return createApiError(status, 'Unauthorized. Please check your API key.')
    case 403:
      return createApiError(status, 'Access forbidden.')
    case 404:
      return createApiError(status, 'Resource not found.')
    case 429:
      return createApiError(status, 'Too many requests. Please wait.')
    case 500:
      return createApiError(status, 'Server error. Please try again later.')
    default:
      return createApiError(status, 'An unexpected error occurred.')
  }
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === retries - 1) throw error
      
      const delay = baseDelay * Math.pow(2, i)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  throw new Error('Max retries exceeded')
}