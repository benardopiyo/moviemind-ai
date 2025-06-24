// ===== src/features/details/Reviews.tsx =====
import React, { useState } from 'react'
import { MessageSquare, Star, ThumbsUp, ThumbsDown, User, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { useApi } from '@/hooks/useApi'
import { tmdbService } from '@/services/tmdb'
import { formatDate, truncateText } from '@/utils/helpers'
import { cn } from '@/utils/helpers'
import type { MovieReviews, Review } from '@/types/movie'

interface ReviewsProps {
  movieId: number
}

export const Reviews: React.FC<ReviewsProps> = ({ movieId }) => {
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating'>('newest')

  const {
    data: reviewsData,
    loading,
    error,
  } = useApi<MovieReviews>(
    () => tmdbService.getMovieReviews(movieId),
    {
      immediate: true,
      deps: [movieId],
    }
  )

  const toggleReviewExpansion = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews)
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId)
    } else {
      newExpanded.add(reviewId)
    }
    setExpandedReviews(newExpanded)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, index) => (
          <LoadingSkeleton key={index} variant="rectangle" height="200px" />
        ))}
      </div>
    )
  }

  if (error || !reviewsData) {
    return (
      <EmptyState
        type="general"
        title="Reviews unavailable"
        description="We couldn't load the reviews for this movie."
      />
    )
  }

  const reviews = reviewsData.results || []

  // Sort reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      case 'rating':
        const ratingA = a.author_details?.rating || 0
        const ratingB = b.author_details?.rating || 0
        return ratingB - ratingA
      default:
        return 0
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <MessageSquare className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold">Reviews</h2>
          <Badge variant="default">
            {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
          </Badge>
        </div>

        {reviews.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-800"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        )}
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <EmptyState
          type="general"
          title="No reviews yet"
          description="Be the first to share your thoughts about this movie!"
        />
      ) : (
        <div className="space-y-6">
          {sortedReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              isExpanded={expandedReviews.has(review.id)}
              onToggleExpand={() => toggleReviewExpansion(review.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const ReviewCard: React.FC<{
  review: Review
  isExpanded: boolean
  onToggleExpand: () => void
}> = ({ review, isExpanded, onToggleExpand }) => {
  const hasRating = review.author_details?.rating
  const avatarUrl = review.author_details?.avatar_path
  const shouldTruncate = review.content.length > 500

  return (
    <Card className="space-y-4">
      {/* Review Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
            {avatarUrl ? (
              <img
                src={`https://image.tmdb.org/t/p/w185${avatarUrl}`}
                alt={review.author}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-gray-400" />
            )}
          </div>

          {/* Author Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {review.author}
              </h4>
              {hasRating && (
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">
                    {review.author_details.rating}/10
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(review.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Review Actions */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <ThumbsUp className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <ThumbsDown className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Review Content */}
      <div className="space-y-3">
        <div className={cn(
          'text-gray-700 dark:text-gray-300 leading-relaxed',
          !isExpanded && shouldTruncate && 'line-clamp-4'
        )}>
          {isExpanded || !shouldTruncate 
            ? review.content 
            : truncateText(review.content, 500)
          }
        </div>

        {shouldTruncate && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpand}
            className="text-primary-600 hover:text-primary-700 p-0 h-auto font-medium"
          >
            {isExpanded ? 'Show Less' : 'Read More'}
          </Button>
        )}
      </div>

      {/* Review Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <Badge variant="default" size="sm">
            Review
          </Badge>
          {review.author_details?.username && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              @{review.author_details.username}
            </span>
          )}
        </div>

        <Button variant="ghost" size="sm" className="text-xs">
          Report
        </Button>
      </div>
    </Card>
  )
}