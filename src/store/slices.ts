// ===== src/store/slices.ts =====
import { StateCreator } from 'zustand'
import type { WatchlistItem, UserPreferences } from '@/types/user'

// User Preferences Slice
export interface UserSlice {
    preferences: UserPreferences
    theme: 'light' | 'dark' | 'system'
    language: string
    updatePreferences: (updates: Partial<UserPreferences>) => void
    toggleTheme: () => void
    setLanguage: (lang: string) => void
    resetPreferences: () => void
}

export const createUserSlice: StateCreator<UserSlice> = (set) => ({
    preferences: {
        adult: false,
        theme: "light" as const,
        language: 'en',
        country: 'US',
        region: 'US',
        autoPlay: false,
        notifications: true,
        dataUsage: 'normal',
        favoriteGenres: [],
        preferredLanguage: 'en',
        darkMode: false,
        autoplay: false,
        highQualityImages: true,
    },
    theme: 'system',
    language: 'en',

    updatePreferences: (updates) =>
        set((state) => ({
            preferences: { ...state.preferences, ...updates },
        })),

    toggleTheme: () =>
        set((state) => ({
            theme: state.theme === 'dark' ? 'light' : 'dark',
        })),

    setLanguage: (lang) =>
        set((state) => ({
            language: lang,
            preferences: { ...state.preferences, language: lang },
        })),

    resetPreferences: () =>
        set({
            preferences: {
                adult: false,
                theme: "light" as const,
                language: 'en',
                country: 'US',
                region: 'US',
                autoPlay: false,
                notifications: true,
                dataUsage: 'normal',
                favoriteGenres: [],
                preferredLanguage: 'en',
                darkMode: false,
                autoplay: false,
                highQualityImages: true,
            },
            theme: 'system',
            language: 'en',
        }),
})

// Watchlist Analytics Slice
export interface AnalyticsSlice {
    calculateStats: (items: WatchlistItem[]) => {
        totalMovies: number
        totalWatchTime: number
        averageRating: number
        favoriteGenres: Array<{ genre: string; count: number }>
        watchingStreak: number
        monthlyStats: Array<{ month: string; watched: number }>
    }
    getGenreDistribution: (items: WatchlistItem[]) => Record<string, number>
    getWatchingTrends: (items: WatchlistItem[]) => Array<{ date: string; count: number }>
    getTopActors: (items: WatchlistItem[]) => Array<{ actor: string; count: number }>
    getRatingDistribution: (items: WatchlistItem[]) => Record<number, number>
}

export const createAnalyticsSlice: StateCreator<AnalyticsSlice> = () => ({
    calculateStats: (items) => {
        const watchedItems = items.filter(item => item.watched)

        // Total movies
        const totalMovies = items.length

        // Total watch time (assuming 120 minutes average for movies without runtime)
        const totalWatchTime = watchedItems.reduce((total, _item) => {
            // You might want to store runtime in the movie object
            return total + (120 * 60) // 120 minutes in seconds
        }, 0)

        // Average rating
        const ratedItems = watchedItems.filter(item => item.personalRating)
        const averageRating = ratedItems.length > 0
            ? ratedItems.reduce((sum, item) => sum + (item.personalRating || 0), 0) / ratedItems.length
            : 0

        // Favorite genres
        const genreCounts: Record<string, number> = {}
        watchedItems.forEach(item => {
            item.movie.genre_ids.forEach(genreId => {
                const genreName = `Genre ${genreId}` // You might want to map this to actual genre names
                genreCounts[genreName] = (genreCounts[genreName] || 0) + 1
            })
        })

        const favoriteGenres = Object.entries(genreCounts)
            .map(([genre, count]) => ({ genre, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)

        // Watching streak (consecutive days with watched movies)
        const watchingStreak = calculateWatchingStreak(watchedItems)

        // Monthly stats
        const monthlyStats = calculateMonthlyStats(watchedItems)

        return {
            totalMovies,
            totalWatchTime,
            averageRating,
            favoriteGenres,
            watchingStreak,
            monthlyStats,
        }
    },

    getGenreDistribution: (items) => {
        const distribution: Record<string, number> = {}
        items.forEach(item => {
            item.movie.genre_ids.forEach(genreId => {
                const genre = `Genre ${genreId}`
                distribution[genre] = (distribution[genre] || 0) + 1
            })
        })
        return distribution
    },

    getWatchingTrends: (items) => {
        const trends: Record<string, number> = {}
        items.filter(item => item.watchedAt).forEach(item => {
            const date = new Date(item.watchedAt!).toISOString().split('T')[0]
            trends[date!] = (trends[date!] || 0) + 1
        })

        return Object.entries(trends)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date))
    },

    getTopActors: (_items) => {
        // This would need cast information to be stored in the watchlist items
        // For now, return empty array
        return []
    },

    getRatingDistribution: (items) => {
        const distribution: Record<number, number> = {}
        items.filter(item => item.personalRating).forEach(item => {
            const rating = Math.floor(item.personalRating!)
            distribution[rating] = (distribution[rating] || 0) + 1
        })
        return distribution
    },
})

// Filter and Sort Slice
export interface FilterSlice {
    filters: {
        genre?: string
        year?: number
        rating?: number
        status?: 'all' | 'watched' | 'unwatched'
        priority?: 'all' | 'high' | 'medium' | 'low'
    }
    sortBy: 'title' | 'rating' | 'date-added' | 'release-date' | 'priority'
    sortOrder: 'asc' | 'desc'
    searchQuery: string

    setFilters: (filters: Partial<FilterSlice['filters']>) => void
    setSortBy: (sortBy: FilterSlice['sortBy']) => void
    setSortOrder: (order: FilterSlice['sortOrder']) => void
    setSearchQuery: (query: string) => void
    clearFilters: () => void

    getFilteredItems: (items: WatchlistItem[]) => WatchlistItem[]
}

export const createFilterSlice: StateCreator<FilterSlice> = (set, get) => ({
    filters: {},
    sortBy: 'date-added',
    sortOrder: 'desc',
    searchQuery: '',

    setFilters: (newFilters) =>
        set((state) => ({
            filters: { ...state.filters, ...newFilters },
        })),

    setSortBy: (sortBy) => set({ sortBy }),
    setSortOrder: (sortOrder) => set({ sortOrder }),
    setSearchQuery: (searchQuery) => set({ searchQuery }),

    clearFilters: () =>
        set({
            filters: {},
            searchQuery: '',
        }),

    getFilteredItems: (items) => {
        const { filters, sortBy, sortOrder, searchQuery } = get()

        let filtered = [...items]

        // Apply search
        if (searchQuery) {
            filtered = filtered.filter(item =>
                item.movie.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // Apply filters
        if (filters.status && filters.status !== 'all') {
            filtered = filtered.filter(item =>
                filters.status === 'watched' ? item.watched : !item.watched
            )
        }

        if (filters.priority && filters.priority !== 'all') {
            filtered = filtered.filter(item => item.priority === filters.priority)
        }

        if (filters.rating) {
            filtered = filtered.filter(item =>
                item.personalRating && item.personalRating >= filters.rating!
            )
        }

        if (filters.year) {
            filtered = filtered.filter(item => {
                const year = new Date(item.movie.release_date).getFullYear()
                return year === filters.year
            })
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let comparison = 0

            switch (sortBy) {
                case 'title':
                    comparison = a.movie.title.localeCompare(b.movie.title)
                    break
                case 'rating':
                    comparison = (a.movie.vote_average || 0) - (b.movie.vote_average || 0)
                    break
                case 'date-added':
                    comparison = new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()
                    break
                case 'release-date':
                    comparison = new Date(a.movie.release_date).getTime() - new Date(b.movie.release_date).getTime()
                    break
                case 'priority':
                    const priorityOrder = { high: 3, medium: 2, low: 1 }
                    comparison = priorityOrder[a.priority || 'medium'] - priorityOrder[b.priority || 'medium']
                    break
            }

            return sortOrder === 'asc' ? comparison : -comparison
        })

        return filtered
    },
})

// Watchlist Slice Interface
export interface WatchlistSlice {
    items: any[]
    categories: Record<string, any[]>
    addToWatchlist: (movie: any, category?: string) => void
    removeFromWatchlist: (movieId: number) => void
    moveToCategory: (movieId: number, category: string) => void
    updateWatchlistItem: (movieId: number, updates: any) => void
    markAsWatched: (movieId: number) => void
    exportWatchlist: () => string
    importWatchlist: (data: string) => void
}

// Movie Slice Interface  
export interface MovieSlice {
    searchResults: any[]
    searchQuery: string
    searchLoading: boolean
    trendingMovies: any[]
    popularMovies: any[]
    movieDetails: Record<number, any>
    setSearchResults: (results: any[]) => void
    setSearchQuery: (query: string) => void
    setSearchLoading: (loading: boolean) => void
    setTrendingMovies: (movies: any[]) => void
    setPopularMovies: (movies: any[]) => void
    setMovieDetails: (movieId: number, details: any) => void
}

// UI Slice Interface
export interface UISlice {
    theme: 'light' | 'dark'
    sidebarOpen: boolean
    loading: boolean
    error: string | null
    setTheme: (theme: 'light' | 'dark') => void
    setSidebarOpen: (open: boolean) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    clearError: () => void
}

// Helper functions
const calculateWatchingStreak = (watchedItems: WatchlistItem[]): number => {
    if (watchedItems.length === 0) return 0

    const dates = watchedItems
        .filter(item => item.watchedAt)
        .map(item => new Date(item.watchedAt!).toDateString())
        .sort()

    if (dates.length === 0) return 0

    let streak = 1
    let currentStreak = 1

    for (let i = 1; i < dates.length; i++) {
        const currentDate = new Date(dates[i]!)
        const previousDate = new Date(dates[i - 1]!)
        const diffTime = currentDate.getTime() - previousDate.getTime()
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 1) {
            currentStreak++
            streak = Math.max(streak, currentStreak)
        } else {
            currentStreak = 1
        }
    }

    return streak
}

const calculateMonthlyStats = (watchedItems: WatchlistItem[]) => {
    const monthCounts: Record<string, number> = {}

    watchedItems.forEach(item => {
        if (item.watchedAt) {
            const date = new Date(item.watchedAt)
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
            monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1
        }
    })

    return Object.entries(monthCounts)
        .map(([month, watched]) => ({ month, watched }))
        .sort((a, b) => a.month.localeCompare(b.month))
        .slice(-12) // Last 12 months
}
