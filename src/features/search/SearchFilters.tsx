// ===== src/features/search/SearchFilters.tsx =====
import React, { useState } from 'react'
import { Filter, X, Calendar, Star, Clock, Tag } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
// import { Badge } from '@/components/ui/Badge'
// import { Input } from '@/components/ui/Input'
import type { SearchFilters as SearchFiltersType } from '@/types/movie'
import { GENRES, SORT_OPTIONS } from '@/constants/config'

interface SearchFiltersProps {
  filters: SearchFiltersType
  onFiltersChange: (filters: SearchFiltersType) => void
  onClose: () => void
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFiltersChange,
  onClose,
}) => {
  const [localFilters, setLocalFilters] = useState<SearchFiltersType>(filters)

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i)

  const handleFilterChange = (key: keyof SearchFiltersType, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const applyFilters = () => {
    onFiltersChange(localFilters)
    onClose()
  }

  const clearFilters = () => {
    setLocalFilters({})
    onFiltersChange({})
  }

  const hasActiveFilters = Object.keys(localFilters).length > 0

  return (
    <Card className="relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Filter Movies
          </h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Filters Content */}
      <div className="p-6 space-y-6">
        {/* Genres */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            <Tag className="w-4 h-4" />
            <span>Genres</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {Object.entries(GENRES).map(([id, name]) => {
              const isSelected = localFilters.genre === parseInt(id)
              return (
                <button
                  key={id}
                  onClick={() => handleFilterChange('genre', isSelected ? undefined : parseInt(id))}
                  className={`p-2 text-sm rounded-lg border transition-colors ${
                    isSelected
                      ? 'bg-primary-100 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Year Range */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            <Calendar className="w-4 h-4" />
            <span>Release Year</span>
          </label>
          <select
            value={localFilters.year || ''}
            onChange={(e) => handleFilterChange('year', e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">Any year</option>
            {years.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Rating Range */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            <Star className="w-4 h-4" />
            <span>Minimum Rating</span>
          </label>
          <div className="grid grid-cols-5 gap-2">
            {[0, 5, 6, 7, 8, 9].map(rating => {
              const isSelected = localFilters.rating?.min === rating
              return (
                <button
                  key={rating}
                  onClick={() => handleFilterChange('rating', 
                    isSelected ? undefined : { min: rating, max: 10 }
                  )}
                  className={`p-2 text-sm rounded-lg border transition-colors ${
                    isSelected
                      ? 'bg-primary-100 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {rating === 0 ? 'Any' : `${rating}+`}
                </button>
              )
            })}
          </div>
        </div>

        {/* Sort By */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            <Clock className="w-4 h-4" />
            <span>Sort By</span>
          </label>
          <select
            value={localFilters.sortBy || 'popularity.desc'}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={applyFilters}>
            Apply Filters
          </Button>
        </div>
      </div>
    </Card>
  )
}