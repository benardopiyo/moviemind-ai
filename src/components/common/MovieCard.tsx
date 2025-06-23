// ===== src/components/common/MovieCard.tsx =====
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, Calendar, Clock, Plus, Check, Heart, Play } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { Movie } from '@/types/movie'
import { tmdbService } from '@/services/tmdb'
import { formatDate, formatRating, truncateText, getYear } from '@/utils/helpers'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { cn } from '@/utils/helpers'

interface MovieCardProps {
  movie: Movie
  variant?: 'default' | 'compact' | 'featured'
  showYear?: boolean
  showOverview?: boolean
  showActions?: boolean
  className?: string
  onImageLoad?: () => void
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  variant = 'default',
  showYear = true,
  showOverview = true,
  showActions = true,
  className,
  onImageLoad,
}) => {
  const navigate = useNavigate()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [watchlist, setWatchlist] = useLocalStorage<any[]>('moviemind_watchlist', [])
  const [isHovered, setIsHovered] = useState(false)

  const isInWatchlist = watchlist.some(item => item.id === movie.id)
  const year = getYear(movie.release_date)
  const posterUrl = tmdbService.getImageURL(movie.poster_path, 'LARGE')

  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`)
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
    onImageLoad?.()
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(true)
  }

  const toggleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (isInWatchlist) {
      setWatchlist(watchlist.filter(item => item.id !== movie.id))
    } else {
      setWatchlist([...watchlist, {
        id: movie.id,
        movie,
        addedAt: new Date().toISOString(),
        watched: false,
      }])
    }
  }

  const handleAddToFavorites = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Implement favorites functionality
    console.log('Add to favorites:', movie.title)
  }

  const handlePlayTrailer = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Implement trailer functionality
    console.log('Play trailer for:', movie.title)
  }

  if (variant === 'compact') {
    return (
      <Card
        hover
        padding="none"
        className={cn('overflow-hidden cursor-pointer group h-80', className)}
        onClick={handleCardClick}
      >
        <div className="relative h-full">
          {/* Image */}
          <div className="relative h-full overflow-hidden">
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
            )}
            
            {!imageError ? (
              <img
                src={posterUrl}
                alt={movie.title}
                className={cn(
                  'w-full h-full object-cover transition-all duration-500',
                  imageLoaded ? 'opacity-100' : 'opacity-0',
                  'group-hover:scale-110'
                )}
                loading="lazy"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm">No Image</p>
                </div>
              </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Rating */}
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-white text-xs font-medium">
                {formatRating(movie.vote_average)}
              </span>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
              <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                {movie.title}
              </h3>
              {showYear && year > 0 && (
                <p className="text-xs opacity-75">{year}</p>
              )}
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card
      hover
      padding="none"
      className={cn('overflow-hidden cursor-pointer group', className)}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Image Container */}
        <div className="relative aspect-[2/3] overflow-hidden">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
          )}
          
          {!imageError ? (
            <img
              src={posterUrl}
              alt={movie.title}
              className={cn(
                'w-full h-full object-cover transition-all duration-500',
                imageLoaded ? 'opacity-100' : 'opacity-0',
                variant === 'featured' ? 'group-hover:scale-105' : 'group-hover:scale-110'
              )}
              loading="lazy"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <p className="text-sm">No Image Available</p>
              </div>
            </div>
          )}

          {/* Hover Overlay */}
          <div className={cn(
            'absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300',
            isHovered ? 'opacity-100' : 'opacity-0'
          )} />
          
          {/* Rating Badge */}
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-white text-xs font-medium">
              {formatRating(movie.vote_average)}
            </span>
          </div>

          {/* Action Buttons - Visible on Hover */}
          {showActions && (
            <div className={cn(
              'absolute top-2 left-2 flex flex-col space-y-2 transition-all duration-300',
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
            )}>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleWatchlist}
                className="bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white border-0 p-2"
                title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
              >
                {isInWatchlist ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddToFavorites}
                className="bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white border-0 p-2"
                title="Add to favorites"
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Play Button - Center */}
          <div className={cn(
            'absolute inset-0 flex items-center justify-center transition-all duration-300',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}>
            <Button
              variant="primary"
              size="lg"
              onClick={handlePlayTrailer}
              className="rounded-full p-4 shadow-lg"
              title="Watch trailer"
            >
              <Play className="w-6 h-6" />
            </Button>
          </div>

          {/* Hover Info */}
          {showOverview && (
            <div className={cn(
              'absolute bottom-0 left-0 right-0 p-4 text-white transition-transform duration-300',
              isHovered ? 'translate-y-0' : 'translate-y-full'
            )}>
              <p className="text-sm opacity-90 line-clamp-3">
                {truncateText(movie.overview, 120)}
              </p>
              
              {movie.genre_ids && movie.genre_ids.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {movie.genre_ids.slice(0, 2).map((genreId) => (
                    <Badge
                      key={genreId}
                      variant="default"
                      size="sm"
                      className="bg-white/20 text-white border-0"
                    >
                      Genre {genreId}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1 mb-2">
            {movie.title}
          </h3>
          
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            {showYear && year > 0 && (
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{year}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                <span>{formatRating(movie.vote_average)}</span>
              </div>
              
              {movie.vote_count > 0 && (
                <div className="text-xs opacity-75">
                  ({movie.vote_count} votes)
                </div>
              )}
            </div>
          </div>

          {/* Overview for default variant */}
          {variant === 'default' && showOverview && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
              {truncateText(movie.overview, 80)}
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}