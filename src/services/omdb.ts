import axios, { AxiosInstance } from 'axios'
import { API_CONFIG } from '@/constants/api'
import { cacheService } from './cache'
import { handleApiError, retryWithBackoff } from '@/utils/api'

interface OMDBMovie {
  Title: string
  Year: string
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Poster: string
  Ratings: Array<{
    Source: string
    Value: string
  }>
  Metascore: string
  imdbRating: string
  imdbVotes: string
  imdbID: string
  Type: string
  DVD: string
  BoxOffice: string
  Production: string
  Website: string
  Response: string
}

class OMDBService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.OMDB.BASE_URL,
      timeout: API_CONFIG.OMDB.TIMEOUT,
      params: {
        apikey: API_CONFIG.OMDB.API_KEY,
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.api.interceptors.request.use(
      (config) => {
        console.log(`🎭 OMDB API Request: ${config.method?.toUpperCase()} ${config.url}`)
        return config
      },
      (error) => {
        console.error('🚨 OMDB Request Error:', error)
        return Promise.reject(handleApiError(error))
      }
    )

    this.api.interceptors.response.use(
      (response) => {
        console.log(`✅ OMDB API Response: ${response.status}`)
        return response
      },
      (error) => {
        console.error('🚨 OMDB API Error:', error)
        return Promise.reject(handleApiError(error))
      }
    )
  }

  async getMovieByImdbId(imdbId: string): Promise<OMDBMovie> {
    const cacheKey = `omdb_movie_${imdbId}`
    const cached = cacheService.get<OMDBMovie>(cacheKey)

    if (cached) {
      console.log('📦 Cache hit for OMDB movie:', imdbId)
      return cached
    }

    try {
      const response = await retryWithBackoff(async () => {
        return this.api.get<OMDBMovie>('/', {
          params: {
            i: imdbId,
            plot: 'full',
          }
        })
      })

      if (response.data.Response === 'False') {
        throw new Error('Movie not found in OMDB')
      }

      cacheService.set(cacheKey, response.data, 60 * 60 * 1000)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  async searchMovies(query: string, year?: number, page = 1): Promise<{
    Search: OMDBMovie[]
    totalResults: string
    Response: string
  }> {
    const cacheKey = `omdb_search_${query}_${year}_${page}`
    const cached = cacheService.get<{
      Search: OMDBMovie[]
      totalResults: string
      Response: string
    }>(cacheKey)

    if (cached) {
      return cached
    }

    try {
      const params: any = {
        s: query,
        type: 'movie',
        page,
      }

      if (year) params.y = year

      const response = await retryWithBackoff(async () => {
        return this.api.get('/', { params })
      })

      if (response.data.Response === 'False') {
        return {
          Search: [],
          totalResults: '0',
          Response: 'False'
        }
      }

      cacheService.set(cacheKey, response.data, 10 * 60 * 1000)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  getImdbRating(movie: OMDBMovie): number {
    const rating = parseFloat(movie.imdbRating)
    return isNaN(rating) ? 0 : rating
  }

  getRottenTomatoesRating(movie: OMDBMovie): number {
    const rtRating = movie.Ratings?.find(r => r.Source === 'Rotten Tomatoes')
    if (!rtRating) return 0

    const percentage = parseInt(rtRating.Value.replace('%', ''))
    return isNaN(percentage) ? 0 : percentage
  }

  getMetacriticRating(movie: OMDBMovie): number {
    const score = parseInt(movie.Metascore)
    return isNaN(score) ? 0 : score
  }
}

export const omdbService = new OMDBService()
