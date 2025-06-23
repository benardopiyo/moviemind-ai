// ===== src/types/movie.ts =====
export interface Movie {
    id: number
    title: string
    original_title: string
    overview: string
    poster_path: string | null
    backdrop_path: string | null
    release_date: string
    genre_ids: number[]
    adult: boolean
    original_language: string
    popularity: number
    vote_count: number
    vote_average: number
    video: boolean
  }
  
  export interface MovieDetails extends Movie {
    genres: Genre[]
    runtime: number | null
    budget: number
    revenue: number
    homepage: string | null
    imdb_id: string | null
    production_companies: ProductionCompany[]
    production_countries: ProductionCountry[]
    spoken_languages: SpokenLanguage[]
    status: string
    tagline: string | null
    belongs_to_collection: Collection | null
    credits?: Credits
    videos?: VideoResponse
    similar?: MovieResponse
    recommendations?: MovieResponse
    reviews?: ReviewResponse
  }
  
  export interface Genre {
    id: number
    name: string
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
  
  export interface SpokenLanguage {
    english_name: string
    iso_639_1: string
    name: string
  }
  
  export interface Collection {
    id: number
    name: string
    poster_path: string | null
    backdrop_path: string | null
  }
  
  export interface Credits {
    cast: CastMember[]
    crew: CrewMember[]
  }
  
  export interface CastMember {
    id: number
    name: string
    character: string
    profile_path: string | null
    order: number
  }
  
  export interface CrewMember {
    id: number
    name: string
    job: string
    department: string
    profile_path: string | null
  }
  
  export interface Video {
    id: string
    key: string
    name: string
    site: string
    type: string
    official: boolean
    published_at: string
  }
  
  export interface VideoResponse {
    results: Video[]
  }
  
  export interface Review {
    id: string
    author: string
    author_details: {
      name: string
      username: string
      avatar_path: string | null
      rating: number | null
    }
    content: string
    created_at: string
    updated_at: string
    url: string
  }
  
  export interface ReviewResponse {
    page: number
    results: Review[]
    total_pages: number
    total_results: number
  }
  
  export interface MovieResponse {
    page: number
    results: Movie[]
    total_pages: number
    total_results: number
  }
// Search Filters Type
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

// Search Filters Type
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
