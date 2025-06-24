// ===== src/features/discovery/GenreCards.tsx =====
import React from 'react'
import { Tag, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { GENRES } from '@/constants/config'
import { cn } from '@/utils/helpers'

interface GenreCardsProps {
  onGenreClick?: (genreId: number, genreName: string) => void
  limit?: number
  showHeader?: boolean
  className?: string
}

export const GenreCards: React.FC<GenreCardsProps> = ({
  onGenreClick,
  limit,
  showHeader = true,
  className,
}) => {
  const genreEntries = Object.entries(GENRES)
  const displayGenres = limit ? genreEntries.slice(0, limit) : genreEntries

  const handleGenreClick = (genreId: number, genreName: string) => {
    if (onGenreClick) {
      onGenreClick(genreId, genreName)
    } else {
      // Default navigation
      window.location.href = `/discover?genre=${genreId}`
    }
  }

  const genreColors = [
    'from-red-500 to-pink-500',
    'from-blue-500 to-purple-500',
    'from-green-500 to-teal-500',
    'from-yellow-500 to-orange-500',
    'from-purple-500 to-indigo-500',
    'from-pink-500 to-rose-500',
    'from-indigo-500 to-blue-500',
    'from-teal-500 to-green-500',
    'from-orange-500 to-red-500',
    'from-gray-500 to-gray-600',
  ]

  return (
    <div className={className}>
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Tag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Browse by Genre
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Discover movies in your favorite categories
              </p>
            </div>
          </div>

          {limit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/discover'}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              View All Genres
            </Button>
          )}
        </div>
      )}

      {/* Genre Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {displayGenres.map(([genreId, genreName], index) => {
          const colorClass = genreColors[index % genreColors.length]

          return (
            <Card
              key={genreId}
              hover
              padding="none"
              className="overflow-hidden cursor-pointer group h-24"
              onClick={() => handleGenreClick(parseInt(genreId), genreName)}
            >
              <div className={cn(
                'w-full h-full bg-gradient-to-br flex items-center justify-center text-white font-semibold text-center p-4 transition-transform duration-200 group-hover:scale-105',
                colorClass
              )}>
                <span className="text-sm leading-tight">{genreName}</span>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}