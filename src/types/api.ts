// ===== src/types/api.ts =====
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  errors?: string[]
}

export interface PaginatedResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export interface ApiError {
  status_code: number
  status_message: string
  success: boolean
}

export interface CacheEntry<T> {
  data: T
  timestamp: number
  expiry: number
}

export interface RequestConfig {
  timeout?: number
  retries?: number
  cache?: boolean
  cacheTTL?: number
}