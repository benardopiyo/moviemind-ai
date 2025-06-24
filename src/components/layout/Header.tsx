// ===== src/components/layout/Header.tsx =====
import React, { useState } from 'react'
import { useNavigate} from 'react-router-dom'
import { Search, Menu, Film, Settings, Moon, Sun, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useDebounce } from '@/hooks/useDebounce'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { ROUTES } from '@/constants/routes'

interface HeaderProps {
  onMenuToggle?: () => void
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const navigate = useNavigate()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false)
  const debouncedSearch = useDebounce(searchQuery, 300)

  // Apply dark mode to document
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Handle search navigation
  React.useEffect(() => {
    if (debouncedSearch && debouncedSearch.trim()) {
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(debouncedSearch.trim())}`)
    }
  }, [debouncedSearch, navigate])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={onMenuToggle}
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate(ROUTES.HOME)}
            >
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Film className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient hidden sm:block">
                MovieMind AI
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <Input
                type="search"
                placeholder="Search movies and TV shows..."
                value={searchQuery}
                onChange={handleSearchChange}
                leftIcon={<Search className="w-4 h-4" />}
                variant="search"
                className="w-full"
              />
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Mobile Search */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => navigate(ROUTES.SEARCH)}
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            {/* Settings */}
            <Button variant="ghost" size="sm">
              <Settings className="w-5 h-5" />
            </Button>

            {/* Profile */}
            <Button variant="ghost" size="sm">
              <User className="w-5 h-5" />
            </Button>

            {/* Watchlist CTA */}
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => navigate(ROUTES.WATCHLIST)}
              className="hidden sm:inline-flex"
            >
              My Watchlist
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}