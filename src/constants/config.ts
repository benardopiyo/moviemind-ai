// ===== src/constants/config.ts =====
export const APP_CONFIG = {
    NAME: import.meta.env.VITE_APP_NAME || 'MovieMind AI',
    VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
    ENVIRONMENT: import.meta.env.VITE_APP_ENV || 'development',
    BASE_URL: import.meta.env.BASE_URL || '/',
}

export const UI_CONFIG = {
    SIDEBAR_WIDTH: '280px',
    HEADER_HEIGHT: '64px',
    FOOTER_HEIGHT: '80px',
    MOBILE_BREAKPOINT: '768px',
    TABLET_BREAKPOINT: '1024px',
    DESKTOP_BREAKPOINT: '1280px',
}

export const PAGINATION_CONFIG = {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
    INFINITE_SCROLL_THRESHOLD: 0.8, // Trigger when 80% scrolled
}

export const ANIMATION_CONFIG = {
    DURATION: {
        FAST: 150,
        NORMAL: 300,
        SLOW: 500,
    },
    EASING: {
        EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
        EASE_OUT: 'cubic-bezier(0, 0, 0.2, 1)',
        EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
}

export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    API_ERROR: 'Unable to fetch data. Please try again.',
    NOT_FOUND: 'The requested content was not found.',
    UNAUTHORIZED: 'Access denied. Please check your API key.',
    RATE_LIMITED: 'Too many requests. Please wait a moment.',
    GENERIC_ERROR: 'Something went wrong. Please try again.',
}

export const SUCCESS_MESSAGES = {
    ADDED_TO_WATCHLIST: 'Added to your watchlist!',
    REMOVED_FROM_WATCHLIST: 'Removed from your watchlist.',
    PREFERENCES_SAVED: 'Preferences saved successfully.',
    RATING_SAVED: 'Rating saved successfully.',
}

// Genre mappings from TMDB
export const GENRES = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Science Fiction',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western',
} as const

export const SORT_OPTIONS = [
    { value: 'popularity.desc', label: 'Most Popular' },
    { value: 'popularity.asc', label: 'Least Popular' },
    { value: 'release_date.desc', label: 'Newest First' },
    { value: 'release_date.asc', label: 'Oldest First' },
    { value: 'vote_average.desc', label: 'Highest Rated' },
    { value: 'vote_average.asc', label: 'Lowest Rated' },
    { value: 'vote_count.desc', label: 'Most Voted' },
    { value: 'revenue.desc', label: 'Highest Revenue' },
] as const