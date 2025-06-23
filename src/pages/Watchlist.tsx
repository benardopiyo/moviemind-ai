// ===== src/pages/Watchlist.tsx =====
import React from 'react'
import { Bookmark, Calendar, Trash2, Play, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/common/EmptyState'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useNavigate } from 'react-router-dom'
import { formatDate } from '@/utils/helpers'
import { tmdbService } from '@/services/tmdb'
import type { WatchlistItem } from '@/types/user'

export const Watchlist: React.FC = () => {
  const navigate = useNavigate()
  const [watchlist, setWatchlist] = useLocalStorage<WatchlistItem[]>('moviemind_watchlist', [])

  const removeFromWatchlist = (movieId: number) => {
    setWatchlist(watchlist.filter(item => item.id !== movieId))
  }

  const toggleWatched = (movieId: number) => {
    setWatchlist(watchlist.map(item => 
      item.id === movieId 
        ? { ...item, watched: !item.watched }
        : item
    ))
  }

  const clearWatchlist = () => {
    setWatchlist([])
  }

  const watchedMovies = watchlist.filter(item => item.watched)
  const unwatchedMovies = watchlist.filter(item => !item.watched)

  if (watchlist.length === 0) {
    return (
      <div className="container-custom py-12">
        <EmptyState
          type="watchlist"
          title="Your watchlist is empty"
          description="Start building your watchlist by adding movies you want to watch"
          actionLabel="Discover Movies"
          onAction={() => navigate('/search')}
        />
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Bookmark className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Watchlist
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {watchlist.length} movies • {watchedMovies.length} watched • {unwatchedMovies.length} to watch
              </p>
            </div>
          </div>

          {watchlist.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearWatchlist}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {watchlist.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Movies</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {watchedMovies.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Watched</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {unwatchedMovies.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">To Watch</div>
        </Card>
      </div>

      {/* Movies to Watch */}
      {unwatchedMovies.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Movies to Watch ({unwatchedMovies.length})
          </h2>
          <div className="space-y-4">
            {unwatchedMovies.map((item) => (
              <WatchlistMovieCard
                key={item.id}
                item={item}
                onRemove={removeFromWatchlist}
                onToggleWatched={toggleWatched}
                onViewDetails={() => navigate(`/movie/${item.movie.id}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Watched Movies */}
      {watchedMovies.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Watched Movies ({watchedMovies.length})
          </h2>
          <div className="space-y-4">
            {watchedMovies.map((item) => (
              <WatchlistMovieCard
                key={item.id}
                item={item}
                onRemove={removeFromWatchlist}
                onToggleWatched={toggleWatched}
                onViewDetails={() => navigate(`/movie/${item.movie.id}`)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// Watchlist Movie Card Component
interface WatchlistMovieCardProps {
  item: WatchlistItem
  onRemove: (movieId: number) => void
  onToggleWatched: (movieId: number) => void
  onViewDetails: () => void
}

const WatchlistMovieCard: React.FC<WatchlistMovieCardProps> = ({
  item,
  onRemove,
  onToggleWatched,
  onViewDetails,
}) => {
  const posterUrl = tmdbService.getImageURL(item.movie.poster_path, 'MEDIUM')

  return (
    <Card hover className="p-4">
      <div className="flex space-x-4">
        {/* Poster */}
        <div className="flex-shrink-0">
          <img
            src={posterUrl}
            alt={item.movie.title}
            className="w-16 h-24 object-cover rounded-lg cursor-pointer"
            onClick={onViewDetails}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 
                className="font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                onClick={onViewDetails}
              >
                {item.movie.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {new Date(item.movie.release_date).getFullYear()}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.movie.vote_average.toFixed(1)}
                  </span>
                </div>
                <Badge variant={item.watched ? 'success' : 'warning'} size="sm">
                  {item.watched ? 'Watched' : 'To Watch'}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Added {formatDate(item.addedAt)}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleWatched(item.id)}
                title={item.watched ? 'Mark as unwatched' : 'Mark as watched'}
              >
                {item.watched ? <Calendar className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(item.id)}
                title="Remove from watchlist"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}