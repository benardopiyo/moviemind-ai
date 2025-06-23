import type { Movie } from "./movie"
// ===== src/types/user.ts =====
export interface WatchlistItem {
    id: number
    movie: Movie
    addedAt: string
    watched: boolean
    rating?: number
    notes?: string
}

export interface UserPreferences {
    favoriteGenres: number[]
    preferredLanguage: string
    darkMode: boolean
    autoplay: boolean
    highQualityImages: boolean
}

export interface UserStats {
    totalMoviesWatched: number
    totalMoviesInWatchlist: number
    favoriteGenre: string
    averageRating: number
    watchTime: number // in minutes
}