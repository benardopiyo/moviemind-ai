// ===== src/features/details/MovieDetails.tsx =====
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Star, Calendar, Clock, Plus, Check, Heart, Play, Info } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { Cast } from './Cast'
import { Reviews } from './Reviews'
import { Trailers } from './Trailers'
import { useApi } from '@/hooks/useApi'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { tmdbService } from '@/services/tmdb'
import { formatDate, formatRating, formatRuntime, formatCurrency } from '@/utils/helpers'
import { cn } from '@/utils/helpers'
import type { MovieDetails as MovieDetailsType, WatchlistItem } from '@/types/movie'

export const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState<'overview' | 'cast' | 'reviews' | 'trailers'>('overview')
  const [watchlist, setWatchlist] = useLocalStorage<WatchlistItem[]>('moviemind_watchlist', [])

  const {
    data: movie,
    loading,
    error,
    
  } = useApi<MovieDetailsType>(
    () => tmdbService.getMovieDetails(parseInt(id!)),
    {
      immediate: true,
      deps: [id],
    }
  )

  const isInWatchlist = watchlist.some(item => item.id === parseInt(id!))

  const toggleWatchlist = () => {
    if (!movie) return
    
    if (isInWatchlist) {
      setWatchlist(watchlist.filter(item => item.id !== movie.id))
    } else {
      setWatchlist([...watchlist, {
        id: movie.id,
        movie: {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          overview: movie.overview,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          vote_count: movie.vote_count,
          genre_ids: movie.genre_ids,
          adult: movie.adult,
          original_language: movie.original_language,
          original_title: movie.original_title,
          popularity: movie.popularity,
          video: false,
          runtime: movie.runtime
        },
        addedAt: new Date().toISOString(),
        watched: false,
        category: 'to-watch' as const,
      }])
    }
  }

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="space-y-8">
          <LoadingSkeleton variant="rectangle" height="400px" />
          <LoadingSkeleton variant="text" count={5} />
        </div>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="container-custom py-8">
        <EmptyState
          type="general"
          title="Movie not found"
          description={error || "We couldn't find the movie you're looking for."}
          actionLabel="Go back"
          onAction={() => window.history.back()}
        />
      </div>
    )
  }

  const backdropUrl = tmdbService.getImageURL(movie.backdrop_path, 'ORIGINAL')
  const posterUrl = tmdbService.getImageURL(movie.poster_path, 'LARGE')

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        {/* Backdrop Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
        
        {/* Content */}
        <div className="relative h-full flex items-end">
          <div className="container-custom pb-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Poster */}
              <div className="flex-shrink-0">
                <img
                  src={posterUrl}
                  alt={movie.title}
                  className="w-48 h-72 object-cover rounded-xl shadow-2xl"
                />
              </div>

              {/* Movie Info */}
              <div className="flex-1 text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>
                
                {movie.tagline && (
                  <p className="text-xl italic opacity-90 mb-6">{movie.tagline}</p>
                )}

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-lg font-semibold">
                      {formatRating(movie.vote_average)}
                    </span>
                    <span className="text-sm opacity-75">
                      ({movie.vote_count.toLocaleString()} votes)
                    </span>
                  </div>

                  {movie.release_date && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(movie.release_date)}</span>
                    </div>
                  )}

                  {movie.runtime && (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatRuntime(movie.runtime)}</span>
                    </div>
                  )}
                </div>

                {/* Genres */}
                {movie.genres && movie.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {movie.genres.map((genre) => (
                      <Badge
                        key={genre.id}
                        variant="default"
                        className="bg-white/20 text-white border-0"
                      >
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center space-x-4">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={toggleWatchlist}
                    leftIcon={isInWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  >
                    {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    leftIcon={<Heart className="w-5 h-5" />}
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  >
                    Favorite
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    leftIcon={<Play className="w-5 h-5" />}
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                    onClick={() => setActiveTab('trailers')}
                  >
                    Watch Trailer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="container-custom py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview', icon: Info },
            { id: 'cast', label: 'Cast & Crew', icon: Star },
            { id: 'reviews', label: 'Reviews', icon: Star },
            { id: 'trailers', label: 'Trailers', icon: Play },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors flex-1 justify-center',
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Overview */}
              <div className="lg:col-span-2 space-y-8">
                <Card>
                  <h2 className="text-2xl font-bold mb-4">Plot Summary</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {movie.overview}
                  </p>
                </Card>
              </div>

              {/* Details */}
              <div className="space-y-6">
                <Card>
                  <h3 className="text-lg font-semibold mb-4">Movie Details</h3>
                  <div className="space-y-3">
                    {movie.budget > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Budget</span>
                        <span className="font-medium">{formatCurrency(movie.budget)}</span>
                      </div>
                    )}
                    
                    {movie.revenue > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Revenue</span>
                        <span className="font-medium">{formatCurrency(movie.revenue)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Status</span>
                      <span className="font-medium">{movie.status}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Language</span>
                      <span className="font-medium">{movie.original_language?.toUpperCase()}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'cast' && <Cast movieId={movie.id} />}
          {activeTab === 'reviews' && <Reviews movieId={movie.id} />}
          {activeTab === 'trailers' && <Trailers movieId={movie.id} />}
        </div>
      </div>
    </div>
  )
}