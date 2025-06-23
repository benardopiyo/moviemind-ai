// ===== src/features/discovery/RecommendationEngine.tsx =====
import React, { useState, useEffect } from 'react'
import { Brain, Star, Lightbulb, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { MovieCard } from '@/components/common/MovieCard'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useApi } from '@/hooks/useApi'
import { tmdbService } from '@/services/tmdb'
import type { Movie, WatchlistItem } from '@/types/movie'
import type { PaginatedResponse } from '@/types/api'

interface RecommendationEngineProps {
  limit?: number
  showHeader?: boolean
  className?: string
}

export const RecommendationEngine: React.FC<RecommendationEngineProps> = ({
  limit = 10,
  showHeader = true,
  className,
}) => {
  const [watchlist] = useLocalStorage<WatchlistItem[]>('moviemind_watchlist', [])
  const [refreshKey, setRefreshKey] = useState(0)
  const [recommendationBasis, setRecommendationBasis] = useState<'popular' | 'genre' | 'similar'>('popular')

  // Get user's favorite genres from watchlist
  const getFavoriteGenres = () => {
    const genreCounts: Record<number, number> = {}
    
    watchlist.forEach(item => {
      item.movie.genre_ids.forEach(genreId => {
        genreCounts[genreId] = (genreCounts[genreId] || 0) + 1
      })
    })

    return Object.entries(genreCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([genreId]) => parseInt(genreId))
  }

  // Get a random movie from watchlist for similar recommendations
  const getRandomWatchlistMovie = () => {
    if (watchlist.length === 0) return null
    const randomIndex = Math.floor(Math.random() * watchlist.length)
    return watchlist[randomIndex].movie
  }

  const favoriteGenres = getFavoriteGenres()
  const randomMovie = getRandomWatchlistMovie()

  // Determine which API to call based on available data
  const getRecommendationCall = () => {
    if (watchlist.length === 0) {
      // No watchlist data, show popular movies
      setRecommendationBasis('popular')
      return () => tmdbService.getPopularMovies()
    } else if (randomMovie && Math.random() > 0.5) {
      // 50% chance to use similar movies if we have watchlist data
      setRecommendationBasis('similar')
      return () => tmdbService.getSimilarMovies(randomMovie.id)
    } else if (favoriteGenres.length > 0) {
      // Use genre-based discovery
      setRecommendationBasis('genre')
      const randomGenre = favoriteGenres[Math.floor(Math.random() * favoriteGenres.length)]
      return () => tmdbService.discoverMovies({ genre: randomGenre, sortBy: 'vote_average.desc' })
    } else {
      // Fallback to popular
      setRecommendationBasis('popular')
      return () => tmdbService.getPopularMovies()
    }
  }

  const {
    data: recommendationsData,
    loading: recommendationsLoading,
    error: recommendationsError,
    refetch: getRecommendations,
  } = useApi<PaginatedResponse<Movie>>(
    getRecommendationCall(),
    {
      immediate: true,
      deps: [refreshKey, watchlist.length],
    }
  )

  const refreshRecommendations = () => {
    setRefreshKey(prev => prev + 1)
  }

  const movies = recommendationsData?.results?.slice(0, limit) || []

  const getRecommendationTitle = () => {
    switch (recommendationBasis) {
      case 'similar':
        return `Because you liked ${randomMovie?.title}`
      case 'genre':
        return 'Based on your favorite genres'
      default:
        return 'Popular recommendations'
    }
  }

  const getRecommendationDescription = () => {
    switch (recommendationBasis) {
      case 'similar':
        return 'Movies similar to your watchlist favorites'
      case 'genre':
        return 'Curated picks from genres you love'
      default:
        return watchlist.length === 0 
          ? 'Start building your watchlist for personalized recommendations'
          : 'Trending movies everyone is talking about'
    }
  }

  if (recommendationsError) {
    return (
      <div className={className}>
        <EmptyState
          type="general"
          title="Unable to load recommendations"
          description={recommendationsError}
          actionLabel="Try again"
          onAction={getRecommendations}
        />
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {getRecommendationTitle()}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {getRecommendationDescription()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="info" size="sm" className="hidden sm:inline-flex">
              <Lightbulb className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshRecommendations}
              disabled={recommendationsLoading}
              leftIcon={<RefreshCw className={cn('w-4 h-4', recommendationsLoading && 'animate-spin')} />}
            >
              Refresh
            </Button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {recommendationsLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(limit)].map((_, index) => (
            <LoadingSkeleton key={index} variant="card" />
          ))}
        </div>
      )}

      {/* Movies Grid */}
      {!recommendationsLoading && movies.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {movies.map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              variant="default"
              className="animate-fade-in-up"
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!recommendationsLoading && movies.length === 0 && (
        <EmptyState
          type="general"
          title="No recommendations available"
          description="We couldn't generate recommendations at this time."
          actionLabel="Try again"
          onAction={refreshRecommendations}
        />
      )}

      {/* Recommendation Info */}
      {!recommendationsLoading && movies.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-blue-800 dark:text-blue-200 font-medium mb-1">
                How we picked these for you:
              </p>
              <p className="text-blue-700 dark:text-blue-300">
                {recommendationBasis === 'similar' && 'Based on movies similar to your watchlist favorites.'}
                {recommendationBasis === 'genre' && 'Selected from genres you watch most often.'}
                {recommendationBasis === 'popular' && 'Currently trending and highly rated movies.'}
                {' '}Add more movies to your watchlist for better personalization!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}