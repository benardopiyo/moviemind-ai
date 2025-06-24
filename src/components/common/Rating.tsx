// ===== src/components/common/Rating.tsx =====
import React from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/utils/helpers'

interface RatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  showNumber?: boolean
  interactive?: boolean
  onChange?: (rating: number) => void
  className?: string
}

export const Rating: React.FC<RatingProps> = ({
  rating,
  maxRating = 10,
  size = 'md',
  showNumber = true,
  interactive = false,
  onChange,
  className,
}) => {
  const [hoverRating, setHoverRating] = React.useState(0)
  
  const normalizedRating = (rating / maxRating) * 5 // Convert to 5-star scale
  const displayRating = hoverRating || normalizedRating

  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  const handleClick = (index: number) => {
    if (interactive && onChange) {
      const newRating = ((index + 1) / 5) * maxRating
      onChange(newRating)
    }
  }

  const handleMouseEnter = (index: number) => {
    if (interactive) {
      setHoverRating(((index + 1) / 5) * maxRating)
    }
  }

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0)
    }
  }

  return (
    <div className={cn('flex items-center space-x-1', className)}>
      <div className="flex space-x-0.5">
        {[...Array(5)].map((_, index) => {
          const isFilled = index < Math.floor(displayRating)
          const isHalfFilled = index === Math.floor(displayRating) && displayRating % 1 !== 0
          
          return (
            <button
              key={index}
              type="button"
              className={cn(
                'transition-colors duration-150',
                interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default',
                isFilled || isHalfFilled ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
              )}
              onClick={() => handleClick(index)}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              disabled={!interactive}
            >
              <Star
                className={cn(
                  sizes[size],
                  isFilled ? 'fill-current' : isHalfFilled ? 'fill-current opacity-50' : ''
                )}
              />
            </button>
          )
        })}
      </div>
      
      {showNumber && (
        <span className={cn('font-medium text-gray-700 dark:text-gray-300', textSizes[size])}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}