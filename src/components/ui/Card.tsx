import React, { forwardRef } from 'react'
import { cn } from '@/utils/helpers'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outlined' | 'elevated'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({
  children,
  className,
  hover = false,
  padding = 'md',
  variant = 'default',
  ...props
}, ref) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  }

  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    outlined: 'bg-transparent border-2 border-gray-200 dark:border-gray-700',
    elevated: 'bg-white dark:bg-gray-800 shadow-lg border-0',
  }

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-lg transition-all duration-200',
        variantClasses[variant],
        paddingClasses[padding],
        hover && 'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'
