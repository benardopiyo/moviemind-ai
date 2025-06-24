import type { Movie } from "./movie"
import type { UserPreferences, UserStats, WatchlistItem } from "./user"

export interface AppState {
  user: any | null
  preferences: UserPreferences
  watchlist: WatchlistItem[]
  searchResults: Movie[]
  loading: boolean
  error: string | null
}

export interface AppConfig {
  apiKeys: {
    tmdb: string
    omdb: string
  }
  baseUrls: {
    tmdb: string
    omdb: string
  }
  imageBaseUrl: string
  cacheTimeout: number
}

export interface NavigationItem {
  label: string
  path: string
  icon: string
  exact?: boolean
}

export { Movie, UserPreferences, UserStats, WatchlistItem }
