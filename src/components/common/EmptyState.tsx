// ===== src/components/common/EmptyState.tsx =====
import { cn } from "@/utils/helpers"
import React from 'react'
import { Search, Film, Frown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface EmptyStateProps {
  type?: 'search' | 'watchlist' | 'general'
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'general',
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  const configs = {
    search: {
      icon: Search,
      title: title || 'No movies found',
      description: description || 'Try adjusting your search terms or filters',
      actionLabel: actionLabel || 'Clear filters',
    },
    watchlist: {
      icon: Film,
      title: title || 'Your watchlist is empty',
      description: description || 'Start building your watchlist by adding movies you want to watch',
      actionLabel: actionLabel || 'Discover movies',
    },
    general: {
      icon: Frown,
      title: title || 'Nothing to see here',
      description: description || 'It looks like there\'s nothing here yet',
      actionLabel: actionLabel || 'Go back',
    },
  }

  const config = configs[type]
  const Icon = config.icon

  return (
    <Card className={cn('text-center py-12', className)}>
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <Icon className="w-8 h-8 text-gray-400 dark:text-gray-600" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {config.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            {config.description}
          </p>
        </div>

        {onAction && (
          <Button onClick={onAction} variant="primary">
            {config.actionLabel}
          </Button>
        )}
      </div>
    </Card>
  )
}