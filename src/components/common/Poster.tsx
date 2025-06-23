// ===== src/components/common/Poster.tsx =====
import React, { useState } from 'react'
import { Image as ImageIcon } from 'lucide-react'
import { cn } from '@/utils/helpers'

interface PosterProps {
  src: string | null
  alt: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  onLoad?: () => void
  onError?: () => void
  showPlaceholder?: boolean
}

export const Poster: React.FC<PosterProps> = ({
  src,
  alt,
  size = 'md',
  className,
  onLoad,
  onError,
  showPlaceholder = true,
}) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  const sizes = {
    sm: 'w-16 h-24',
    md: 'w-24 h-36',
    lg: 'w-32 h-48',
    xl: 'w-40 h-60',
  }

  const handleLoad = () => {
    setLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setError(true)
    setLoaded(true)
    onError?.()
  }

  if (!src || error) {
    if (!showPlaceholder) return null
    
    return (
      <div className={cn(
        'bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center',
        sizes[size],
        className
      )}>
        <div className="text-center text-gray-400 dark:text-gray-600">
          <ImageIcon className="w-6 h-6 mx-auto mb-1" />
          <p className="text-xs">No Image</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden rounded-lg', sizes[size], className)}>
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0'
        )}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  )
}