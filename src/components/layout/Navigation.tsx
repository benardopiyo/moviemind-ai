// ===== src/components/layout/Navigation.tsx =====
import React from 'react'
import { useLocation } from 'react-router-dom'
import { Home, Search, TrendingUp, Bookmark, Compass } from 'lucide-react'
import { cn } from '@/utils/helpers'

interface NavigationProps {
  variant?: 'sidebar' | 'bottom'
  onItemClick?: (path: string) => void
}

export const Navigation: React.FC<NavigationProps> = ({
  variant = 'sidebar',
  onItemClick,
}) => {
  const location = useLocation()

  const navigationItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Search', path: '/search', icon: Search },
    { name: 'Trending', path: '/trending', icon: TrendingUp },
    { name: 'Watchlist', path: '/watchlist', icon: Bookmark },
    { name: 'Discover', path: '/discover', icon: Compass },
  ]

  const handleItemClick = (path: string) => {
    onItemClick?.(path)
  }

  if (variant === 'bottom') {
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 md:hidden">
        <div className="grid grid-cols-5 h-16">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            
            return (
              <button
                key={item.name}
                onClick={() => handleItemClick(item.path)}
                className={cn(
                  'flex flex-col items-center justify-center space-y-1 transition-colors',
                  isActive
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.name}</span>
              </button>
            )
          })}
        </div>
      </nav>
    )
  }

  return (
    <nav className="space-y-1">
      {navigationItems.map((item) => {
        const isActive = location.pathname === item.path
        const Icon = item.icon
        
        return (
          <button
            key={item.name}
            onClick={() => handleItemClick(item.path)}
            className={cn(
              'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200',
              isActive
                ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            )}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">{item.name}</span>
          </button>
        )
      })}
    </nav>
  )
}