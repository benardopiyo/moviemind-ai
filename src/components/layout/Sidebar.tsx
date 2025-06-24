// ===== src/components/layout/Sidebar.tsx =====
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  Home, 
  Search, 
  TrendingUp, 
  Bookmark, 
  Compass,
  Star,
  Clock,
  Heart,
  X 
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { NAVIGATION_ITEMS } from '@/constants/routes'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { cn } from '@/utils/helpers'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  isMobile: boolean
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isMobile }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [watchlistCount] = useLocalStorage('moviemind_watchlist', [])

  const iconMap = {
    Home,
    Search,
    TrendingUp,
    Bookmark,
    Compass,
  }

  const handleNavigation = (path: string) => {
    navigate(path)
    if (isMobile) {
      onClose()
    }
  }

  const quickActions = [
    {
      name: 'Top Rated',
      icon: Star,
      path: '/discover?sort=vote_average.desc',
      color: 'text-yellow-500',
    },
    {
      name: 'Recent Releases',
      icon: Clock,
      path: '/discover?sort=release_date.desc',
      color: 'text-blue-500',
    },
    {
      name: 'Favorites',
      icon: Heart,
      path: '/favorites',
      color: 'text-red-500',
    },
  ]

  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 w-64 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out',
          isMobile
            ? isOpen
              ? 'translate-x-0'
              : '-translate-x-full'
            : 'translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <span className="font-bold text-gradient">MovieMind</span>
            </div>
            
            {isMobile && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {NAVIGATION_ITEMS.map((item) => {
                const Icon = iconMap[item.icon as keyof typeof iconMap]
                const isActive = location.pathname === item.path
                
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.path)}
                    className={cn(
                      'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200',
                      isActive
                        ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{item.name}</span>
                    {item.name === 'Watchlist' && watchlistCount.length > 0 && (
                      <Badge variant="primary" size="sm">
                        {watchlistCount.length}
                      </Badge>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                {quickActions.map((action) => (
                  <button
                    key={action.name}
                    onClick={() => handleNavigation(action.path)}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <action.icon className={cn('w-4 h-4 flex-shrink-0', action.color)} />
                    <span className="text-sm">{action.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              <p>MovieMind AI v1.0.0</p>
              <p className="mt-1">Discover amazing movies</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}