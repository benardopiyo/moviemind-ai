// ===== src/components/common/LoadingSkeleton.tsx =====
import React from 'react'
import { cn } from '@/utils/helpers'

interface LoadingSkeletonProps {
  variant?: 'card' | 'text' | 'circle' | 'rectangle'
  width?: string
  height?: string
  className?: string
  count?: number
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'rectangle',
  width,
  height,
  className,
  count = 1,
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700'

  const variants = {
    card: 'rounded-xl aspect-[2/3]',
    text: 'rounded h-4',
    circle: 'rounded-full',
    rectangle: 'rounded-lg',
  }

  const skeletonStyle = {
    width: width || (variant === 'circle' ? '40px' : '100%'),
    height: height || (variant === 'circle' ? '40px' : variant === 'card' ? 'auto' : '20px'),
  }

  if (variant === 'card') {
    return (
      <div className={cn('space-y-4', className)}>
        {[...Array(count)].map((_, index) => (
          <div key={index} className="space-y-3">
            <div className={cn(baseClasses, variants[variant])} style={skeletonStyle} />
            <div className="space-y-2">
              <div className={cn(baseClasses, 'h-4 rounded')} />
              <div className={cn(baseClasses, 'h-3 rounded w-3/4')} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className={cn(baseClasses, variants[variant], className)}
          style={skeletonStyle}
        />
      ))}
    </>
  )
}