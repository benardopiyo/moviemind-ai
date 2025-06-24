import React, { useState } from 'react'
import { Play, Video, ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { useApi } from '@/hooks/useApi'
import { tmdbService } from '@/services/tmdb'
import type { MovieVideos, Video as VideoType } from '@/types/movie'

interface TrailersProps {
  movieId: number
}

export const Trailers: React.FC<TrailersProps> = ({ movieId }) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null)
  const [filterType, setFilterType] = useState<'all' | 'trailer' | 'teaser' | 'clip'>('all')

  const {
    data: videosData,
    loading,
    error,
  } = useApi<MovieVideos>(
    () => tmdbService.getMovieVideos(movieId),
    {
      immediate: true,
      deps: [movieId],
    }
  )

  const videos = videosData?.results || []

  // Filter videos by type
  const filteredVideos = videos.filter(video => 
    filterType === 'all' || video.type.toLowerCase() === filterType
  )

  // Sort videos - trailers first, then by published date
  const sortedVideos = [...filteredVideos].sort((a, b) => {
    if (a.type === 'Trailer' && b.type !== 'Trailer') return -1
    if (a.type !== 'Trailer' && b.type === 'Trailer') return 1
    return new Date(b.published_at || '').getTime() - new Date(a.published_at || '').getTime()
  })

  const getYouTubeUrl = (key: string) => `https://www.youtube.com/watch?v=${key}`
  const getYouTubeEmbedUrl = (key: string) => `https://www.youtube.com/embed/${key}?autoplay=1&rel=0`

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <LoadingSkeleton key={index} variant="rectangle" height="200px" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !videosData) {
    return (
      <EmptyState
        type="general"
        title="Videos unavailable"
        description="We couldn't load the videos for this movie."
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Video className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold">Videos & Trailers</h2>
          <Badge variant="default">
            {videos.length} {videos.length === 1 ? 'Video' : 'Videos'}
          </Badge>
        </div>

        {videos.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Filter:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-800"
            >
              <option value="all">All Videos</option>
              <option value="trailer">Trailers</option>
              <option value="teaser">Teasers</option>
              <option value="clip">Clips</option>
            </select>
          </div>
        )}
      </div>

      {/* Videos Grid */}
      {videos.length === 0 ? (
        <EmptyState
          type="general"
          title="No videos available"
          description="No trailers or videos are available for this movie yet."
        />
      ) : sortedVideos.length === 0 ? (
        <EmptyState
          type="general"
          title="No videos found"
          description={`No ${filterType} videos found for this movie.`}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onPlay={() => setSelectedVideo(video)}
              />
            ))}
          </div>

          {/* Video Modal */}
          <Modal
            isOpen={!!selectedVideo}
            onClose={() => setSelectedVideo(null)}
            size="xl"
            title={selectedVideo?.name || 'Video Player'}
          >
            {selectedVideo && (
              <div className="space-y-4">
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    src={getYouTubeEmbedUrl(selectedVideo.key)}
                    title={selectedVideo.name}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedVideo.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="primary" size="sm">
                        {selectedVideo.type}
                      </Badge>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {(selectedVideo as any).size || '720'}p
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(getYouTubeUrl(selectedVideo.key), '_blank')}
                    leftIcon={<ExternalLink className="w-4 h-4" />}
                  >
                    Watch on YouTube
                  </Button>
                </div>
              </div>
            )}
          </Modal>
        </>
      )}
    </div>
  )
}

const VideoCard: React.FC<{
  video: VideoType
  onPlay: () => void
}> = ({ video, onPlay }) => {
  const thumbnailUrl = video.site === 'YouTube' 
    ? `https://img.youtube.com/vi/${video.key}/maxresdefault.jpg`
    : '/placeholder-video.jpg'

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'trailer':
        return 'primary'
      case 'teaser':
        return 'warning'
      case 'clip':
        return 'info'
      case 'featurette':
        return 'success'
      default:
        return 'default'
    }
  }

  return (
    <Card hover padding="none" className="overflow-hidden group cursor-pointer" onClick={onPlay}>
      <div className="relative aspect-video bg-gray-200 dark:bg-gray-700">
        {/* Thumbnail */}
        <img
          src={thumbnailUrl}
          alt={video.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-video.jpg'
          }}
        />

        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
            <Play className="w-8 h-8 text-gray-900 ml-1" />
          </div>
        </div>

        {/* Video Type Badge */}
        <div className="absolute top-2 left-2">
          <Badge variant={getTypeColor(video.type)} size="sm">
            {video.type}
          </Badge>
        </div>

        {/* Quality Badge */}
        {video.size && (
          <div className="absolute top-2 right-2">
            <Badge variant="default" size="sm" className="bg-black/70 text-white border-0">
              {video.size}p
            </Badge>
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
          {video.name}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span className="capitalize">{video.site}</span>
          {video.published_at && (
            <span>{new Date(video.published_at).getFullYear()}</span>
          )}
        </div>

        <div className="flex items-center justify-between mt-3">
          <Button
            variant="primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onPlay()
            }}
            leftIcon={<Play className="w-4 h-4" />}
          >
            Play
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              window.open(`https://www.youtube.com/watch?v=${video.key}`, '_blank')
            }}
            className="p-2"
            title="Open in YouTube"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
