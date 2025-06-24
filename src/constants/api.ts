// ===== src/constants/api.ts =====
export const API_CONFIG = {
  TMDB: {
    BASE_URL: import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3',
    API_KEY: import.meta.env.VITE_TMDB_API_KEY,
    IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
    TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  },
  OMDB: {
    BASE_URL: import.meta.env.VITE_OMDB_BASE_URL || 'https://www.omdbapi.com',
    API_KEY: import.meta.env.VITE_OMDB_API_KEY,
    TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  },
  CACHE: {
    TTL: Number(import.meta.env.VITE_CACHE_TTL) || 5 * 60 * 1000, // 5 minutes
    MAX_SIZE: 100,
    CLEANUP_INTERVAL: 60 * 1000, // 1 minute
  },
  DEBOUNCE_DELAY: Number(import.meta.env.VITE_DEBOUNCE_DELAY) || 300,
}

export const API_ENDPOINTS = {
  TMDB: {
    SEARCH_MOVIES: '/search/movie',
    MOVIE_DETAILS: '/movie',
    TRENDING_MOVIES: '/trending/movie',
    GENRES: '/genre/movie/list',
    DISCOVER: '/discover/movie',
    POPULAR: '/movie/popular',
    TOP_RATED: '/movie/top_rated',
    NOW_PLAYING: '/movie/now_playing',
    UPCOMING: '/movie/upcoming',
  },
  OMDB: {
    SEARCH: '/',
    DETAILS: '/',
  },
}

export const IMAGE_SIZES = {
  POSTER: {
    SMALL: 'w200',
    MEDIUM: 'w300',
    LARGE: 'w500',
    XLARGE: 'w780',
    ORIGINAL: 'original',
  },
  BACKDROP: {
    SMALL: 'w300',
    MEDIUM: 'w780',
    LARGE: 'w1280',
    ORIGINAL: 'original',
  },
  PROFILE: {
    SMALL: 'w45',
    MEDIUM: 'w185',
    LARGE: 'h632',
    ORIGINAL: 'original',
  },
}