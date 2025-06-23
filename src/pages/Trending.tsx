// ===== src/pages/Trending.tsx =====
import React, { useState } from 'react'
import { TrendingUp, Calendar, Star, Filter } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { MovieCard } from '@/components/common/MovieCard'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { useApi } from '@/hooks/useApi'
import { tmdbService } from '@/services/tmdb'
import type { Movie } from '@/types/movie'
import type { PaginatedResponse } from '@/types/api'

export const Trending: React.FC = () => {
  const [timeWindow, setTimeWindow] = useState<'day' | 'week'>('week')
  const [currentPage, setCurrentPage] = useState(1)

  const {
    data: trendingData,
    loading: trendingLoading,
    error: trendingError,
    refetch,
  } = useApi<PaginatedResponse<Movie>>(
    () => tmdbService.getTrendingMovies(timeWindow, currentPage),
    {
      immediate: true,
      deps: [timeWindow, currentPage],
    }
  )

  const handleTimeWindowChange = (newTimeWindow: 'day' | 'week') => {
    setTimeWindow(newTimeWindow)
    setCurrentPage(1)
  }

  const loadMore = () => {
    if (trendingData && currentPage < trendingData.total_pages) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const movies = trendingData?.results || []
  const hasMore = trendingData ? currentPage < trendingData.total_pages : false

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Trending Movies
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Discover what's popular right now
            </p>
          </div>
        </div>

        {/* Time Window Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant={timeWindow === 'day' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleTimeWindowChange('day')}
              leftIcon={<Calendar className="w-4 h-4" />}
            >
              Today
            </Button>
            <Button
              variant={timeWindow === 'week' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleTimeWindowChange('week')}
              leftIcon={<Calendar className="w-4 h-4" />}
            >
              This Week
            </Button>
          </div>

          {trendingData && (
            <Badge variant="info" size="lg">
              {trendingData.total_results.toLocaleString()} movies
            </Badge>
          )}
        </div>
      </div>

      {/* Loading State */}
      {trendingLoading && currentPage === 1 && (
        <div className="grid-responsive">
          {[...Array(20)].map((_, index) => (
            <LoadingSkeleton key={index} variant="card" />
          ))}
        </div>
      )}

      {/* Error State */}
      {trendingError && (
        <EmptyState
          type="general"
          title="Unable to load trending movies"
          description={trendingError}
          actionLabel="Try again"
          onAction={refetch}
        />
      )}

      {/* Movies Grid */}
      {!trendingLoading && !trendingError && movies.length > 0 && (
        <>
          <div className="grid-responsive mb-8">
            {movies.map((movie, index) => (
              <MovieCard
                key={`${movie.id}-${index}`}
                movie={movie}
                className="animate-fade-in-up"
                style={{
                  animationDelay: `${(index % 20) * 50}ms`,
                }}
              />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="text-center">
              <Button
                variant="outline"
                size="lg"
                onClick={loadMore}
                loading={trendingLoading}
                disabled={trendingLoading}
              >
                Load More Movies
              </Button>
            </div>
          )}

          {/* End of Results */}
          {!hasMore && (
            <div className="text-center py-8">
              <div className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  You've seen all trending movies for this period
                </span>
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!trendingLoading && !trendingError && movies.length === 0 && (
        <EmptyState
          type="general"
          title="No trending movies found"
          description="We couldn't find any trending movies for this time period."
          actionLabel="Refresh"
          onAction={refetch}
        />
      )}
    </div>
  )
}