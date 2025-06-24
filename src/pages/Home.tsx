// ===== src/pages/Home.tsx =====
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, TrendingUp, Star, Film, Play, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { MovieCard } from '@/components/common/MovieCard'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { useApi } from '@/hooks/useApi'
import { tmdbService } from '@/services/tmdb'
import type { Movie } from '@/types/movie'
import type { PaginatedResponse } from '@/types/api'
import { ROUTES } from '@/constants/routes'

export const Home: React.FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = React.useState('')

  // Fetch trending movies
  const {
    data: trendingData,
    loading: trendingLoading,
  } = useApi<PaginatedResponse<Movie>>(
    () => tmdbService.getTrendingMovies('week'),
    { immediate: true }
  )

  // Fetch popular movies
  const {
    data: popularData,
    loading: popularLoading,
  } = useApi<PaginatedResponse<Movie>>(
    () => tmdbService.getPopularMovies(),
    { immediate: true }
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleQuickSearch = (query: string) => {
    navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(query)}`)
  }

  const trendingMovies = trendingData?.results?.slice(0, 10) || []
  const popularMovies = popularData?.results?.slice(0, 10) || []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container-custom py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <Badge variant="info" size="lg" className="mb-6 bg-white/10 text-white border-white/20">
                🎬 Powered by AI
              </Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Discover Your Next
                <span className="block text-gradient bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Favorite Movie
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Explore millions of movies with intelligent recommendations, detailed information,
                and personalized watchlists powered by AI.
              </p>
            </div>

            {/* Hero Search */}
            <div className="max-w-2xl mx-auto mb-12">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="search"
                  placeholder="Search for any movie, actor, or director..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="w-6 h-6" />}
                  className="text-lg py-4 pr-32 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/60"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-primary-600 hover:bg-gray-100"
                >
                  Search
                </Button>
              </form>

              {/* Quick Search Suggestions */}
              <div className="flex flex-wrap gap-2 justify-center mt-6">
                <span className="text-sm text-blue-200 mr-2">Popular:</span>
                {['Marvel', 'Avatar', 'Batman', 'Star Wars', 'Disney'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleQuickSearch(suggestion)}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-sm text-white transition-colors border border-white/20"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                {
                  icon: Search,
                  title: 'Smart Search',
                  description: 'Find movies by title, actor, director, or even plot description',
                },
                {
                  icon: Star,
                  title: 'AI Recommendations',
                  description: 'Get personalized suggestions based on your viewing history',
                },
                {
                  icon: Film,
                  title: 'Personal Watchlist',
                  description: 'Save movies to watch later and track your viewing progress',
                },
              ].map((feature, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-center p-6">
                  <feature.icon className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-blue-100 text-sm">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400/20 rounded-full animate-bounce-gentle" />
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-purple-400/20 rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-pink-400/20 rounded-full animate-bounce-gentle" style={{ animationDelay: '1s' }} />
      </section>

      {/* Trending Movies Section */}
      <section className="container-custom py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Trending This Week
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Discover what everyone's talking about
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate(ROUTES.TRENDING)}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            View All
          </Button>
        </div>

        {trendingLoading ? (
          <div className="grid-responsive">
            {[...Array(10)].map((_, index) => (
              <LoadingSkeleton key={index} variant="card" />
            ))}
          </div>
        ) : (
          <div className="grid-responsive">
            {trendingMovies.map((movie, index) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                variant="compact"
                className="animate-fade-in-up"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* Popular Movies Section */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Popular Movies
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                All-time favorites that never get old
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/discover?sort=popularity.desc')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Explore More
            </Button>
          </div>

          {popularLoading ? (
            <div className="grid-responsive">
              {[...Array(10)].map((_, index) => (
                <LoadingSkeleton key={index} variant="card" />
              ))}
            </div>
          ) : (
            <div className="grid-responsive">
              {popularMovies.map((movie, index) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  className="animate-fade-in-up"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="container-custom py-16">
        <Card className="text-center p-12 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border-primary-200 dark:border-primary-800">
          <div className="max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Play className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Start Your Movie Journey?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Join thousands of movie enthusiasts who've discovered their next favorite film with MovieMind AI.
              Create your personalized watchlist and never miss a great movie again.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate(ROUTES.SEARCH)}
                leftIcon={<Search className="w-5 h-5" />}
              >
                Start Exploring
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate(ROUTES.TRENDING)}
                leftIcon={<TrendingUp className="w-5 h-5" />}
              >
                See What's Trending
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}