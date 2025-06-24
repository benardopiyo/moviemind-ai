import type { Movie } from "./movie"

export interface User {
    id: string
    email: string
    name: string
    avatar?: string
    createdAt: string
    updatedAt: string
}

export interface UserPreferences {
    theme: 'light' | 'dark'
    language: string
    country: string
    region?: string
    adult: boolean
    notifications: boolean
    autoPlay?: boolean
    dataUsage?: string
    favoriteGenres?: string[]
    preferredLanguage?: string
    darkMode?: boolean
    autoplay?: boolean
    highQualityImages?: boolean
}

export interface UserStats {
    moviesWatched: number
    totalWatchTime: number
    averageRating: number
    favoriteGenres: string[]
    watchingStreak: number
}

export interface WatchlistItem {
    id: number
    movie: Movie
    addedAt: string
    watched: boolean
    watchedAt?: string
    personalRating?: number
    personalNotes?: string
    priority?: 'high' | 'medium' | 'low'
    tags?: string[]
    category: 'to-watch' | 'watching' | 'watched' | 'favorites'
}
