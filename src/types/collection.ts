// ===== src/types/collection.ts =====

/**
 * Movie Collection Types
 * Represents movie collections/series from TMDB API
 */

export interface Collection {
    id: number
    name: string
    overview: string
    poster_path: string | null
    backdrop_path: string | null
    parts: CollectionPart[]
}

export interface CollectionPart {
    id: number
    title: string
    original_title: string
    overview: string
    release_date: string
    poster_path: string | null
    backdrop_path: string | null
    vote_average: number
    vote_count: number
    adult: boolean
    genre_ids: number[]
    original_language: string
    popularity: number
    video: boolean
}

export interface CollectionDetails extends Collection {
    homepage?: string
    images?: {
        backdrops: ImageData[]
        posters: ImageData[]
    }
}

export interface ImageData {
    aspect_ratio: number
    file_path: string
    height: number
    width: number
    iso_639_1: string | null
    vote_average: number
    vote_count: number
}

/**
 * Series Information for TV Shows
 * (Future expansion for TV show support)
 */
export interface SeriesInformation {
    id: number
    name: string
    original_name: string
    overview: string
    first_air_date: string
    last_air_date: string
    number_of_episodes: number
    number_of_seasons: number
    status: 'Returning Series' | 'Planned' | 'In Production' | 'Ended' | 'Cancelled' | 'Pilot'
    type: string
    poster_path: string | null
    backdrop_path: string | null
    vote_average: number
    vote_count: number
    popularity: number
    adult: boolean
    created_by: Creator[]
    episode_run_time: number[]
    genres: Genre[]
    homepage: string
    in_production: boolean
    languages: string[]
    last_episode_to_air: Episode | null
    next_episode_to_air: Episode | null
    networks: Network[]
    origin_country: string[]
    original_language: string
    production_companies: ProductionCompany[]
    production_countries: ProductionCountry[]
    seasons: Season[]
    spoken_languages: SpokenLanguage[]
    tagline: string
}

export interface Creator {
    id: number
    credit_id: string
    name: string
    gender: number
    profile_path: string | null
}

export interface Genre {
    id: number
    name: string
}

export interface Episode {
    id: number
    name: string
    overview: string
    vote_average: number
    vote_count: number
    air_date: string
    episode_number: number
    production_code: string
    runtime: number
    season_number: number
    show_id: number
    still_path: string | null
}

export interface Network {
    id: number
    name: string
    logo_path: string | null
    origin_country: string
}

export interface ProductionCompany {
    id: number
    logo_path: string | null
    name: string
    origin_country: string
}

export interface ProductionCountry {
    iso_3166_1: string
    name: string
}

export interface Season {
    air_date: string
    episode_count: number
    id: number
    name: string
    overview: string
    poster_path: string | null
    season_number: number
}

export interface SpokenLanguage {
    english_name: string
    iso_639_1: string
    name: string
}

/**
 * Collection Search and Discovery
 */
export interface CollectionSearchResult {
    page: number
    results: Collection[]
    total_pages: number
    total_results: number
}

export interface CollectionFilters {
    query?: string
    language?: string
    page?: number
}

/**
 * User Collection Management
 * For custom user-created collections
 */
export interface UserCollection {
    id: string
    name: string
    description: string
    movies: number[] // Array of movie IDs
    createdAt: string
    updatedAt: string
    isPublic: boolean
    tags: string[]
    coverImage?: string // Custom cover image URL
}

export interface UserCollectionCreate {
    name: string
    description?: string
    movies?: number[]
    isPublic?: boolean
    tags?: string[]
    coverImage?: string
}

export interface UserCollectionUpdate {
    name?: string
    description?: string
    movies?: number[]
    isPublic?: boolean
    tags?: string[]
    coverImage?: string
}

/**
 * Collection Statistics
 */
export interface CollectionStats {
    totalMovies: number
    totalRuntime: number
    averageRating: number
    genreDistribution: Record<string, number>
    yearRange: {
        earliest: number
        latest: number
    }
    ratingRange: {
        lowest: number
        highest: number
    }
}

/**
 * Franchise/Series Management
 */
export interface Franchise {
    id: string
    name: string
    movies: FranchiseMovie[]
    chronologicalOrder: number[]
    releaseOrder: number[]
    totalBoxOffice?: number
    averageRating: number
}

export interface FranchiseMovie {
    id: number
    title: string
    releaseDate: string
    chronologicalOrder: number
    releaseOrder: number
    boxOffice?: number
    rating: number
    isWatched: boolean
}

/**
 * Collection Recommendations
 */
export interface CollectionRecommendation {
    collection: Collection
    reason: string
    confidence: number
    basedOn: 'genre' | 'actor' | 'director' | 'similar_movies' | 'popularity'
}

/**
 * Collection Export/Import
 */
export interface CollectionExport {
    collections: UserCollection[]
    exportedAt: string
    version: string
    userPreferences?: {
        includeWatchStatus: boolean
        includeRatings: boolean
        includeNotes: boolean
    }
}

export interface CollectionImport {
    collections: UserCollection[]
    importedAt: string
    conflicts?: {
        duplicateNames: string[]
        invalidMovieIds: number[]
    }
}