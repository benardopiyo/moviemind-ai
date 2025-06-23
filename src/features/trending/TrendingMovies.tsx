// ===== src/features/trending/TrendingMovies.tsx =====
import React, { useState } from 'react'
import { TrendingUp, Calendar, Filter, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { MovieCard } from '@/components/common/MovieCard'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { useApi } from '@/hooks/useApi'
import { tmdbService } from '@/services/tmdb'
import type { Movie } from '@/types/movie'
import type { PaginatedResponse } from '@/types/api'

interface TrendingMoviesProps {
  timeWindow?: 'day' | 'week'
  limit?: number
  showHeader?: boolean
  showViewAll?: boolean
  onViewAll?: () => void
  className?: string
}

export const TrendingMovies: React.FC<TrendingMoviesProps> = ({
  timeWindow = 'week',
  limit,
  showHeader = true,
  showViewAll = true,
  onViewAll,
  className,
}) => {
  const [selectedTimeWindow, setSelectedTimeWindow] = useState(timeWindow)

  const {
    data: trendingData,
    loading: trendingLoading,
    error: trendingError,
    refetch,
  } = useApi<PaginatedResponse<Movie>>(
    () => tmdbService.getTrendingMovies(selectedTimeWindow),
    {
      immediate: true,
      deps: [selectedTimeWindow],
    }
  )

  const movies = limit 
    ? trendingData?.results?.slice(0, limit) || []
    : trendingData?.results || []

  const handleTimeWindowChange = (newTimeWindow: 'day' | 'week') => {
    setSelectedTimeWindow(newTimeWindow)
  }

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll()
    } else {
      // Default navigation to trending page
      window.location.href = '/trending'
    }
  }

  if (trendingError) {
    return (
      <div className={className}>
        <EmptyState
          type="general"
          title="Unable to load trending movies"
          description={trendingError}
          actionLabel="Try again"
          onAction={refetch}
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
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Trending Movies
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Popular movies {selectedTimeWindow === 'day' ? 'today' : 'this week'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Time Window Selector */}
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <Button
                variant={selectedTimeWindow === 'day' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => handleTimeWindowChange('day')}
                className="h-8 px-3"
              >
                Today
              </Button>
              <Button
                variant={selectedTimeWindow === 'week' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => handleTimeWindowChange('week')}
                className="h-8 px-3"
              >
                This Week
              </Button>
            </div>

            {/* View All Button */}
            {showViewAll && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewAll}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                View All
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      {trendingData && showHeader && (
        <div className="flex items-center space-x-4 mb-6">
          <Badge variant="info" size="lg">
            {trendingData.total_results.toLocaleString()} trending movies
          </Badge>
          <Badge variant="default" size="sm">
            Updated every hour
          </Badge>
        </div>
      )}

      {/* Loading State */}
      {trendingLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(limit || 20)].map((_, index) => (
            <LoadingSkeleton key={index} variant="card" />
          ))}
        </div>
      )}

      {/* Movies Grid */}
      {!trendingLoading && movies.length > 0 && (
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
      {!trendingLoading && movies.length === 0 && (
        <EmptyState
          type="general"
          title="No trending movies found"
          description={`We couldn't find any trending movies for ${selectedTimeWindow === 'day' ? 'today' : 'this week'}.`}
          actionLabel="Refresh"
          onAction={refetch}
        />
      )}
    </div>
  )
}