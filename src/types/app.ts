import type { Movie, UserPreferences, UserStats, WatchlistItem } from "./user"
// ===== src/types/app.ts =====
export interface AppState {
    user: {
      preferences: UserPreferences
      watchlist: WatchlistItem[]
      stats: UserStats
    }
    ui: {
      darkMode: boolean
      sidebarOpen: boolean
      loading: boolean
      error: string | null
    }
    search: {
      query: string
      results: Movie[]
      loading: boolean
      hasMore: boolean
      page: number
    }
    trending: {
      movies: Movie[]
      loading: boolean
      timeWindow: 'day' | 'week'
    }
  }
  
  export interface SearchFilters {
    genre?: number
    year?: number
    sortBy?: 'popularity' | 'release_date' | 'vote_average' | 'vote_count'
    sortOrder?: 'asc' | 'desc'
    rating?: {
      min: number
      max: number
    }
    runtime?: {
      min: number
      max: number
    }
  }
  
  export interface LoadingState {
    search: boolean
    details: boolean
    trending: boolean
    watchlist: boolean
  }
  
  export interface ErrorState {
    search: string | null
    details: string | null
    trending: string | null
    watchlist: string | null
    network: string | null
  }