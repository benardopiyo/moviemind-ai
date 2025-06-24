// === src/components/common/MovieCard.tsx ===
import React, { forwardRef } from 'react'
import { Star, Calendar, Clock, Plus, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Rating } from './Rating'
import { tmdbService } from '@/services/tmdb'
import { useWatchlistStore } from '@/store'
import { formatRating, truncateText, getYear } from '@/utils/helpers'
import { cn } from '@/utils/helpers'
import type { Movie } from '@/types/movie'

export interface MovieCardProps {
  movie: Movie
  variant?: 'default' | 'compact' | 'detailed'
  showOverview?: boolean
  showWatchlistButton?: boolean
  className?: string
  style?: React.CSSProperties
}

export const MovieCard = forwardRef<HTMLDivElement, MovieCardProps>(({
  movie,
  variant = 'default',
  showOverview = true,
  showWatchlistButton = true,
  className,
  style,
}, ref) => {
  const navigate = useNavigate()
  const { items, addToWatchlist, removeFromWatchlist } = useWatchlistStore()

  const isInWatchlist = items.some((item: any) => item.id === movie.id)
  const posterUrl = tmdbService.getImageURL(movie.poster_path, 'MEDIUM')
  const backdropUrl = tmdbService.getImageURL(movie.backdrop_path, 'LARGE')
  const releaseYear = getYear(movie.release_date)

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isInWatchlist) {
      removeFromWatchlist(movie.id)
    } else {
      addToWatchlist(movie)
    }
  }

  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`)
  }

  if (variant === 'compact') {
    return (
      <Card
        ref={ref}
        hover
        padding="sm"
        className={cn('cursor-pointer', className)}
        onClick={handleCardClick}
        style={style}
      >
        <div className="flex space-x-3">
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-16 h-24 object-cover rounded flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm line-clamp-2 text-gray-900 dark:text-white mb-1">
              {movie.title}
            </h3>
            <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400 mb-2">
              <span>{releaseYear}</span>
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span>{formatRating(movie.vote_average)}</span>
              </div>
            </div>
            {showWatchlistButton && (
              <Button
                variant={isInWatchlist ? 'success' : 'primary'}
                size="sm"
                onClick={handleWatchlistToggle}
                leftIcon={isInWatchlist ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                className="w-full text-xs"
              >
                {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              </Button>
            )}
          </div>
        </div>
      </Card>
    )
  }

  if (variant === 'detailed') {
    return (
      <Card
        ref={ref}
        hover
        padding="none"
        className={cn('overflow-hidden cursor-pointer group', className)}
        onClick={handleCardClick}
        style={style}
      >
        <div className="relative">
          <div className="aspect-video relative">
            <img
              src={backdropUrl || posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="text-lg font-bold mb-2">{movie.title}</h3>
            <div className="flex items-center space-x-4 text-sm mb-2">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{releaseYear}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{formatRating(movie.vote_average)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{movie.runtime || 'N/A'} min</span>
              </div>
            </div>

            {showOverview && movie.overview && (
              <p className="text-sm opacity-90 line-clamp-2 mb-3">
                {truncateText(movie.overview, 120)}
              </p>
            )}

            {showWatchlistButton && (
              <Button
                variant={isInWatchlist ? 'success' : 'primary'}
                size="sm"
                onClick={handleWatchlistToggle}
                leftIcon={isInWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              >
                {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              </Button>
            )}
          </div>
        </div>
      </Card>
    )
  }

  // Default variant
  return (
    <Card
      ref={ref}
      hover
      padding="none"
      className={cn('overflow-hidden cursor-pointer group', className)}
      onClick={handleCardClick}
      style={style}
    >
      <div className="relative">
        <div className="aspect-[2/3] relative">
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          {/* Rating Badge */}
          <div className="absolute top-2 right-2">
            <Badge variant="default" className="bg-black/70 text-white border-0">
              <Star className="w-3 h-3 mr-1 text-yellow-400 fill-current" />
              {formatRating(movie.vote_average)}
            </Badge>
          </div>

          {/* Watchlist Badge */}
          {isInWatchlist && (
            <div className="absolute top-2 left-2">
              <Badge variant="success" className="bg-green-600 text-white border-0">
                <Check className="w-3 h-3 mr-1" />
                Added
              </Badge>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            {showWatchlistButton && (
              <Button
                variant={isInWatchlist ? 'success' : 'primary'}
                size="sm"
                onClick={handleWatchlistToggle}
                leftIcon={isInWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              >
                {isInWatchlist ? 'Remove' : 'Add to Watchlist'}
              </Button>
            )}
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
            {movie.title}
          </h3>

          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>{releaseYear}</span>
            <Rating rating={movie.vote_average} maxRating={10} size="sm" showNumber={false} />
          </div>

          {showOverview && movie.overview && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
              {truncateText(movie.overview, 100)}
            </p>
          )}
        </div>
      </div>
    </Card>
  )
})

MovieCard.displayName = 'MovieCard'
