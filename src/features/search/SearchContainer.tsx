// ===== src/features/search/SearchContainer.tsx =====
import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Search, Filter, X, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { SearchResults } from './SearchResults'
import { SearchFilters } from './SearchFilters'
import { EmptyState } from '@/components/common/EmptyState'
import { useDebounce } from '@/hooks/useDebounce'
import { useApi } from '@/hooks/useApi'
import { tmdbService } from '@/services/tmdb'
import type { Movie, SearchFilters as SearchFiltersType } from '@/types/movie'
import type { PaginatedResponse } from '@/types/api'
import { validateSearchQuery } from '@/utils/validation'

export const SearchContainer: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  
  // Search state
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [allResults, setAllResults] = useState<Movie[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [filters, setFilters] = useState<SearchFiltersType>({})

  // Debounced search query
  const debouncedQuery = useDebounce(query, 300)

  // Search API call
  const {
    data: searchData,
    loading: searchLoading,
    error: searchError,
    refetch: searchMovies,
  } = useApi<PaginatedResponse<Movie>>(
    () => tmdbService.searchMovies(debouncedQuery, currentPage),
    {
      immediate: false,
      deps: [debouncedQuery, currentPage],
    }
  )

  // Update URL when query changes
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams)
    if (debouncedQuery.trim()) {
      newParams.set('q', debouncedQuery.trim())
    } else {
      newParams.delete('q')
    }
    setSearchParams(newParams)
  }, [debouncedQuery, setSearchParams, searchParams])

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      const validation = validateSearchQuery(debouncedQuery)
      if (validation.isValid) {
        setCurrentPage(1)
        setAllResults([])
        searchMovies()
      }
    } else {
      setAllResults([])
      setHasMore(true)
    }
  }, [debouncedQuery, searchMovies])

  // Handle search results
  useEffect(() => {
    if (searchData) {
      if (currentPage === 1) {
        setAllResults(searchData.results)
      } else {
        setAllResults(prev => [...prev, ...searchData.results])
      }
      setHasMore(currentPage < searchData.total_pages)
    }
  }, [searchData, currentPage])

  // Load more results
  const loadMore = () => {
    if (!searchLoading && hasMore) {
      setCurrentPage(prev => prev + 1)
    }
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      const validation = validateSearchQuery(query)
      if (validation.isValid) {
        setCurrentPage(1)
        setAllResults([])
        searchMovies()
      }
    }
  }

  // Clear search
  const clearSearch = () => {
    setQuery('')
    setAllResults([])
    setCurrentPage(1)
    setHasMore(true)
    navigate('/search')
  }

  // Apply filters
  const handleFiltersApply = (newFilters: SearchFiltersType) => {
    setFilters(newFilters)
    // Implement filtered search logic here
    console.log('Applying filters:', newFilters)
  }

  // Clear filters
  const clearFilters = () => {
    setFilters({})
    setShowFilters(false)
  }

  const hasActiveFilters = Object.keys(filters).length > 0
  const showResults = debouncedQuery.trim() && allResults.length > 0
  const showEmptyState = debouncedQuery.trim() && !searchLoading && allResults.length === 0

  return (
    <div className="container-custom py-6">
      {/* Search Header */}
      <div className="mb-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Discover Amazing Movies
          </h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Input
              type="search"
              placeholder="Search for movies, actors, directors..."
              value={query}
              onChange={handleInputChange}
              leftIcon={<Search className="w-5 h-5" />}
              rightIcon={
                query && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )
              }
              className="text-lg py-4 pr-20"
              autoFocus
            />
            
            {/* Search Button */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={!query.trim() || searchLoading}
                loading={searchLoading}
              >
                Search
              </Button>
            </div>
          </form>

          {/* Search Stats & Filters */}
          {(showResults || hasActiveFilters) && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {searchData && (
                  <span>
                    Found {searchData.total_results.toLocaleString()} movies
                    {debouncedQuery && ` for "${debouncedQuery}"`}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    leftIcon={<X className="w-4 h-4" />}
                  >
                    Clear Filters
                  </Button>
                )}
                
                <Button
                  variant={showFilters ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  leftIcon={<Filter className="w-4 h-4" />}
                >
                  Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-8">
          <SearchFilters
            filters={filters}
            onFiltersChange={handleFiltersApply}
            onClose={() => setShowFilters(false)}
          />
        </div>
      )}

      {/* Search Results */}
      {showResults && (
        <SearchResults
          movies={allResults}
          loading={searchLoading}
          hasMore={hasMore}
          onLoadMore={loadMore}
          query={debouncedQuery}
        />
      )}

      {/* Loading State for Initial Search */}
      {searchLoading && currentPage === 1 && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Searching for movies...
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {showEmptyState && (
        <EmptyState
          type="search"
          title="No movies found"
          description={`We couldn't find any movies matching "${debouncedQuery}". Try different keywords or check your spelling.`}
          actionLabel="Clear search"
          onAction={clearSearch}
        />
      )}

      {/* Error State */}
      {searchError && (
        <div className="text-center py-12">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">
              Search Error
            </h3>
            <p className="text-red-600 dark:text-red-300 mb-4">
              {searchError}
            </p>
            <Button
              variant="primary"
              onClick={() => searchMovies()}
              disabled={searchLoading}
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* No Query State */}
      {!debouncedQuery.trim() && !searchLoading && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Start your movie discovery
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Search for your favorite movies, discover new releases, or explore trending content.
            </p>
            
            {/* Quick Suggestions */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Popular searches:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Avatar', 'Marvel', 'Batman', 'Star Wars', 'Disney'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setQuery(suggestion)}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}