// ===== src/features/search/SearchResults.tsx =====
import React, { useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'
import { MovieCard } from '@/components/common/MovieCard'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import type { Movie } from '@/types/movie'

interface SearchResultsProps {
  movies: Movie[]
  loading: boolean
  hasMore: boolean
  onLoadMore: () => void
  query: string
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  movies,
  loading,
  hasMore,
  onLoadMore,
  query,
}) => {
  const loadMoreRef = useRef<HTMLDivElement>(null)
  
  const { lastElementRef } = useInfiniteScroll(
    async () => onLoadMore(),
    hasMore,
    { enabled: !loading }
  )

  // Scroll to top when new search starts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [query])

  if (movies.length === 0 && loading) {
    return (
      <div className="grid-responsive">
        {[...Array(20)].map((_, index) => (
          <LoadingSkeleton key={index} variant="card" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Results Grid */}
      <div className="grid-responsive">
        {movies.map((movie, index) => (
          <MovieCard
            key={`${movie.id}-${index}`}
            movie={movie}
            ref={index === movies.length - 1 ? lastElementRef : undefined}
            showOverview={false}
            className="animate-fade-in-up"
            style={{
              animationDelay: `${(index % 20) * 50}ms`,
            }}
          />
        ))}
      </div>

      {/* Load More Indicator */}
      {loading && movies.length > 0 && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading more movies...</span>
          </div>
        </div>
      )}

      {/* End of Results */}
      {!hasMore && movies.length > 0 && (
        <div className="text-center py-8">
          <div className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              You've reached the end of results
            </span>
          </div>
        </div>
      )}

      {/* Invisible trigger for infinite scroll */}
      <div ref={loadMoreRef} className="h-1" />
    </div>
  )
}