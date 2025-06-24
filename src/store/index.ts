import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { UserSlice, WatchlistSlice, MovieSlice, UISlice } from './slices'
import type { Movie, WatchlistItem } from '@/types/movie'
import type { UserPreferences } from '@/types/user'

// Combined store type
export type AppStore = UserSlice & WatchlistSlice & MovieSlice & UISlice & {
    user: any
}

// Create the main store
export const useAppStore = create<AppStore>()(
    devtools(
        persist(
            immer((set, get) => ({
                // User slice
                user: null,
                preferences: {
                    theme: 'light' as const,
                    language: 'en',
                    country: 'US',
                    adult: false,
                    notifications: true,
                } as UserPreferences,
                setUser: (user: any) => set((state: any) => { state.user = user }),
                updatePreferences: (preferences: Partial<UserPreferences>) => set((state: any) => {
                    state.preferences = { ...state.preferences, ...preferences }
                }),
                logout: () => set((state: any) => { state.user = null }),

                // Watchlist slice
                items: [] as WatchlistItem[],
                categories: {
                    'to-watch': [] as WatchlistItem[],
                    'watching': [] as WatchlistItem[],
                    'watched': [] as WatchlistItem[],
                    'favorites': [] as WatchlistItem[],
                },

                addToWatchlist: (movie: Movie, category: string = 'to-watch') => set((state: any) => {
                    const existingItem = state.items.find((item: WatchlistItem) => item.id === movie.id)
                    if (!existingItem) {
                        const newItem: WatchlistItem = {
                            id: movie.id,
                            movie,
                            category: category as any,
                            addedAt: new Date().toISOString(),
                            watched: category === 'watched',
                            priority: 'medium' as const,
                        }
                        state.items.push(newItem)
                        if (state.categories[category as keyof typeof state.categories]) {
                            state.categories[category as keyof typeof state.categories].push(newItem)
                        }
                    }
                }),

                removeFromWatchlist: (movieId: number) => set((state: any) => {
                    state.items = state.items.filter((item: WatchlistItem) => item.id !== movieId)
                    Object.keys(state.categories).forEach(key => {
                        const categoryKey = key as keyof typeof state.categories
                        if (state.categories[categoryKey]) {
                            state.categories[categoryKey] = state.categories[categoryKey].filter((item: WatchlistItem) => item.id !== movieId)
                        }
                    })
                }),

                moveToCategory: (movieId: number, newCategory: string) => set((state: any) => {
                    const item = state.items.find((item: WatchlistItem) => item.id === movieId)
                    if (item) {
                        // Remove from old category
                        Object.keys(state.categories).forEach(key => {
                            const categoryKey = key as keyof typeof state.categories
                            if (state.categories[categoryKey]) {
                                state.categories[categoryKey] = state.categories[categoryKey].filter((item: WatchlistItem) => item.id !== movieId)
                            }
                        })

                        // Update item and add to new category
                        item.category = newCategory as any
                        if (newCategory === 'watched') {
                            item.watched = true
                            item.watchedAt = new Date().toISOString()
                        }
                        if (state.categories[newCategory as keyof typeof state.categories]) {
                            state.categories[newCategory as keyof typeof state.categories].push(item)
                        }
                    }
                }),

                updateWatchlistItem: (movieId: number, updates: Partial<WatchlistItem>) => set((state: any) => {
                    const item = state.items.find((item: WatchlistItem) => item.id === movieId)
                    if (item) {
                        Object.assign(item, updates)

                        // Update in category as well
                        Object.keys(state.categories).forEach(key => {
                            const categoryKey = key as keyof typeof state.categories
                            if (state.categories[categoryKey]) {
                                const categoryItem = state.categories[categoryKey].find((item: WatchlistItem) => item.id === movieId)
                                if (categoryItem) {
                                    Object.assign(categoryItem, updates)
                                }
                            }
                        })
                    }
                }),

                markAsWatched: (movieId: number) => set((state: any) => {
                    const item = state.items.find((item: WatchlistItem) => item.id === movieId)
                    if (item) {
                        item.watched = true
                        item.watchedAt = new Date().toISOString()

                        // Move to watched category if not already there
                        if (item.category !== 'watched') {
                            // Remove from current category
                            Object.keys(state.categories).forEach(key => {
                                const categoryKey = key as keyof typeof state.categories
                                if (state.categories[categoryKey]) {
                                    state.categories[categoryKey] = state.categories[categoryKey].filter((item: WatchlistItem) => item.id !== movieId)
                                }
                            })

                            // Add to watched
                            item.category = 'watched'
                            if (state.categories.watched) {
                                state.categories.watched.push(item)
                            }
                        }
                    }
                }),

                exportWatchlist: (): string => {
                    const currentState = get()
                    return JSON.stringify({
                        items: currentState.items,
                        categories: currentState.categories,
                        exportDate: new Date().toISOString(),
                        version: '1.0'
                    }, null, 2)
                },

                importWatchlist: (data: string) => set((state: any) => {
                    try {
                        const imported = JSON.parse(data)
                        if (imported.items && imported.categories) {
                            state.items = imported.items
                            state.categories = imported.categories
                        }
                    } catch (error) {
                        console.error('Failed to import watchlist:', error)
                    }
                }),

                // Movie slice
                searchResults: [] as Movie[],
                searchQuery: '',
                searchLoading: false,
                trendingMovies: [] as Movie[],
                popularMovies: [] as Movie[],
                movieDetails: {} as Record<number, any>,

                setSearchResults: (results: Movie[]) => set((state: any) => { state.searchResults = results }),
                setSearchQuery: (query: string) => set((state: any) => { state.searchQuery = query }),
                setSearchLoading: (loading: boolean) => set((state: any) => { state.searchLoading = loading }),
                setTrendingMovies: (movies: Movie[]) => set((state: any) => { state.trendingMovies = movies }),
                setPopularMovies: (movies: Movie[]) => set((state: any) => { state.popularMovies = movies }),
                setMovieDetails: (movieId: number, details: any) => set((state: any) => {
                    state.movieDetails[movieId] = details
                }),

                // UI slice
                theme: 'light' as const,
                sidebarOpen: false,
                loading: false,
                error: null as string | null,

                setTheme: (theme: 'light' | 'dark') => set((state: any) => { state.theme = theme }),
                setSidebarOpen: (open: boolean) => set((state: any) => { state.sidebarOpen = open }),
                setLoading: (loading: boolean) => set((state: any) => { state.loading = loading }),
                setError: (error: string | null) => set((state: any) => { state.error = error }),
                clearError: () => set((state: any) => { state.error = null }),

                // User slice methods
                toggleTheme: () => set((state: any) => ({
                    theme: state.theme === 'dark' ? 'light' : 'dark',
                })),
                setLanguage: (lang: string) => set((state: any) => ({
                    language: lang,
                    preferences: { ...state.preferences, language: lang },
                })),
                resetPreferences: () => set((_state: any) => ({
                    preferences: {
                        theme: 'light' as const,
                        adult: false,
                        language: 'en',
                        country: 'US',
                        region: 'US',
                        notifications: true,
                    } as UserPreferences,
                    theme: 'light' as const,
                    language: 'en',
                })),
                language: 'en',
            })),
            {
                name: 'moviemind-storage',
                partialize: (state) => ({
                    user: state.user,
                    preferences: state.preferences,
                    items: state.items,
                    categories: state.categories,
                    theme: state.theme,
                }),
            }
        ),
        { name: 'moviemind-store' }
    )
)

// Export individual store hooks with proper types
export const useUser = () => useAppStore((state: AppStore) => state.user)
export const usePreferences = () => useAppStore((state: AppStore) => state.preferences)
export const useWatchlistStore = () => useAppStore((state: AppStore) => ({
    items: state.items,
    categories: state.categories,
    addToWatchlist: state.addToWatchlist,
    removeFromWatchlist: state.removeFromWatchlist,
    moveToCategory: state.moveToCategory,
    updateWatchlistItem: state.updateWatchlistItem,
    markAsWatched: state.markAsWatched,
    exportWatchlist: state.exportWatchlist,
    importWatchlist: state.importWatchlist,
}))
export const useMovieStore = () => useAppStore((state: AppStore) => ({
    searchResults: state.searchResults,
    searchQuery: state.searchQuery,
    searchLoading: state.searchLoading,
    trendingMovies: state.trendingMovies,
    popularMovies: state.popularMovies,
    movieDetails: state.movieDetails,
    setSearchResults: state.setSearchResults,
    setSearchQuery: state.setSearchQuery,
    setSearchLoading: state.setSearchLoading,
    setTrendingMovies: state.setTrendingMovies,
    setPopularMovies: state.setPopularMovies,
    setMovieDetails: state.setMovieDetails,
}))
export const useUIStore = () => useAppStore((state: AppStore) => ({
    theme: state.theme,
    sidebarOpen: state.sidebarOpen,
    loading: state.loading,
    error: state.error,
    setTheme: state.setTheme,
    setSidebarOpen: state.setSidebarOpen,
    setLoading: state.setLoading,
    setError: state.setError,
    clearError: state.clearError,
}))
