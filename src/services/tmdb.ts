import axios, { AxiosInstance, AxiosResponse } from 'axios'
import type {
  Movie,
  MovieDetails,
  Genre,
  MovieCredits,
  MovieVideos,
  Review
} from '@/types/movie'
import type { PaginatedResponse } from '@/types/api'
import { API_CONFIG, API_ENDPOINTS, IMAGE_SIZES } from '@/constants/api'
import { cacheService } from './cache'
import { handleApiError, retryWithBackoff } from '@/utils/api'

class TMDBService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.TMDB.BASE_URL,
      timeout: API_CONFIG.TMDB.TIMEOUT,
      params: {
        api_key: API_CONFIG.TMDB.API_KEY,
      },
    })
    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.api.interceptors.request.use(
      (config) => {
        console.log(`🎬 TMDB API Request: ${config.method?.toUpperCase()} ${config.url}`)
        return config
      },
      (error) => Promise.reject(handleApiError(error))
    )

    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`✅ TMDB API Response: ${response.status} ${response.config.url}`)
        return response
      },
      (error) => Promise.reject(handleApiError(error))
    )
  }

  async searchMovies(query: string, page = 1): Promise<PaginatedResponse<Movie>> {
    const cacheKey = `search_movies_${query}_${page}`
    const cached = cacheService.get<PaginatedResponse<Movie>>(cacheKey)

    if (cached) return cached

    try {
      const response = await retryWithBackoff(async () => {
        return this.api.get<PaginatedResponse<Movie>>(API_ENDPOINTS.TMDB.SEARCH_MOVIES, {
          params: { query, page, include_adult: false, language: 'en-US' }
        })
      })
      cacheService.set(cacheKey, response.data, 5 * 60 * 1000)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  async getMovieDetails(id: number): Promise<MovieDetails> {
    const cacheKey = `movie_details_${id}`
    const cached = cacheService.get<MovieDetails>(cacheKey)

    if (cached) return cached

    try {
      const response = await retryWithBackoff(async () => {
        return this.api.get<MovieDetails>(`${API_ENDPOINTS.TMDB.MOVIE_DETAILS}/${id}`, {
          params: {
            append_to_response: 'credits,videos,similar,recommendations,reviews',
            language: 'en-US'
          }
        })
      })
      cacheService.set(cacheKey, response.data, 30 * 60 * 1000)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  async getTrendingMovies(timeWindow: 'day' | 'week' = 'week', page = 1): Promise<PaginatedResponse<Movie>> {
    const cacheKey = `trending_movies_${timeWindow}_${page}`
    const cached = cacheService.get<PaginatedResponse<Movie>>(cacheKey)

    if (cached) return cached

    try {
      const response = await retryWithBackoff(async () => {
        return this.api.get<PaginatedResponse<Movie>>(`${API_ENDPOINTS.TMDB.TRENDING_MOVIES}/${timeWindow}`, {
          params: { page, language: 'en-US' }
        })
      })
      cacheService.set(cacheKey, response.data, 15 * 60 * 1000)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  async getPopularMovies(page = 1): Promise<PaginatedResponse<Movie>> {
    const cacheKey = `popular_movies_${page}`
    const cached = cacheService.get<PaginatedResponse<Movie>>(cacheKey)

    if (cached) return cached

    try {
      const response = await retryWithBackoff(async () => {
        return this.api.get<PaginatedResponse<Movie>>(API_ENDPOINTS.TMDB.POPULAR, {
          params: { page, language: 'en-US' }
        })
      })
      cacheService.set(cacheKey, response.data, 15 * 60 * 1000)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  async getGenres(): Promise<{ genres: Genre[] }> {
    const cacheKey = 'movie_genres'
    const cached = cacheService.get<{ genres: Genre[] }>(cacheKey)

    if (cached) return cached

    try {
      const response = await retryWithBackoff(async () => {
        return this.api.get<{ genres: Genre[] }>(API_ENDPOINTS.TMDB.GENRES, {
          params: { language: 'en-US' }
        })
      })
      cacheService.set(cacheKey, response.data, 24 * 60 * 60 * 1000)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  async discoverMovies(filters: {
    genre?: number
    year?: number
    sortBy?: string
    page?: number
  } = {}): Promise<PaginatedResponse<Movie>> {
    const { genre, year, sortBy = 'popularity.desc', page = 1 } = filters
    const cacheKey = `discover_movies_${JSON.stringify(filters)}`
    const cached = cacheService.get<PaginatedResponse<Movie>>(cacheKey)

    if (cached) return cached

    try {
      const params: any = {
        page,
        sort_by: sortBy,
        language: 'en-US',
        include_adult: false,
      }

      if (genre) params.with_genres = genre
      if (year) params.year = year

      const response = await retryWithBackoff(async () => {
        return this.api.get<PaginatedResponse<Movie>>(API_ENDPOINTS.TMDB.DISCOVER, { params })
      })
      cacheService.set(cacheKey, response.data, 10 * 60 * 1000)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  async getSimilarMovies(id: number, page = 1): Promise<PaginatedResponse<Movie>> {
    const cacheKey = `similar_movies_${id}_${page}`
    const cached = cacheService.get<PaginatedResponse<Movie>>(cacheKey)

    if (cached) return cached

    try {
      const response = await retryWithBackoff(async () => {
        return this.api.get<PaginatedResponse<Movie>>(`${API_ENDPOINTS.TMDB.MOVIE_DETAILS}/${id}/similar`, {
          params: { page, language: 'en-US' }
        })
      })
      cacheService.set(cacheKey, response.data, 30 * 60 * 1000)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  async getMovieCredits(movieId: number): Promise<MovieCredits> {
    const cacheKey = `movie_credits_${movieId}`
    const cached = cacheService.get<MovieCredits>(cacheKey)

    if (cached) return cached

    try {
      const response = await retryWithBackoff(async () => {
        return this.api.get<MovieCredits>(`${API_ENDPOINTS.TMDB.MOVIE_DETAILS}/${movieId}/credits`)
      })
      cacheService.set(cacheKey, response.data, 30 * 60 * 1000)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  async getMovieReviews(movieId: number): Promise<PaginatedResponse<Review>> {
    const cacheKey = `movie_reviews_${movieId}`
    const cached = cacheService.get<PaginatedResponse<Review>>(cacheKey)

    if (cached) return cached

    try {
      const response = await retryWithBackoff(async () => {
        return this.api.get<PaginatedResponse<Review>>(`${API_ENDPOINTS.TMDB.MOVIE_DETAILS}/${movieId}/reviews`)
      })
      cacheService.set(cacheKey, response.data, 30 * 60 * 1000)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  async getMovieVideos(movieId: number): Promise<MovieVideos> {
    const cacheKey = `movie_videos_${movieId}`
    const cached = cacheService.get<MovieVideos>(cacheKey)

    if (cached) return cached

    try {
      const response = await retryWithBackoff(async () => {
        return this.api.get<MovieVideos>(`${API_ENDPOINTS.TMDB.MOVIE_DETAILS}/${movieId}/videos`)
      })
      cacheService.set(cacheKey, response.data, 30 * 60 * 1000)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  getImageURL(path: string | null, size: keyof typeof IMAGE_SIZES.POSTER = 'LARGE'): string {
    if (!path) return '/placeholder-movie.jpg'
    return `${API_CONFIG.TMDB.IMAGE_BASE_URL}/${IMAGE_SIZES.POSTER[size]}${path}`
  }

  getBackdropURL(path: string | null, size: keyof typeof IMAGE_SIZES.BACKDROP = 'LARGE'): string {
    if (!path) return '/placeholder-backdrop.jpg'
    return `${API_CONFIG.TMDB.IMAGE_BASE_URL}/${IMAGE_SIZES.BACKDROP[size]}${path}`
  }

  getProfileURL(path: string | null, size: keyof typeof IMAGE_SIZES.PROFILE = 'MEDIUM'): string {
    if (!path) return '/placeholder-profile.jpg'
    return `${API_CONFIG.TMDB.IMAGE_BASE_URL}/${IMAGE_SIZES.PROFILE[size]}${path}`
  }
}

export const tmdbService = new TMDBService()
