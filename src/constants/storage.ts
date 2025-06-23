// ===== src/constants/storage.ts =====
export const STORAGE_KEYS = {
    WATCHLIST: 'moviemind_watchlist',
    USER_PREFERENCES: 'moviemind_preferences',
    THEME: 'moviemind_theme',
    SEARCH_HISTORY: 'moviemind_search_history',
    USER_STATS: 'moviemind_user_stats',
    CACHE_PREFIX: 'moviemind_cache_',
    LAST_VISITED: 'moviemind_last_visited',
  } as const
  
  export const DEFAULT_PREFERENCES = {
    favoriteGenres: [],
    preferredLanguage: 'en-US',
    darkMode: false,
    autoplay: true,
    highQualityImages: true,
  }
  
  export const DEFAULT_STATS = {
    totalMoviesWatched: 0,
    totalMoviesInWatchlist: 0,
    favoriteGenre: '',
    averageRating: 0,
    watchTime: 0,
  }