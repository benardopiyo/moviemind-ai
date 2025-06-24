// ===== src/features/watchlist/WatchlistStats.tsx =====
import React, { useMemo } from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Area,
    AreaChart
} from 'recharts'
import {
    Clock,
    Star,
    Calendar,
    TrendingUp,
    Award,
    Film,
    Target,
    Users,
    Zap
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useWatchlistStore } from '@/store'
import { formatWatchTime, formatPercentage } from '@/utils/format'
import { cn } from '@/utils/helpers'

export const WatchlistStats: React.FC = () => {
    const { items, categories } = useWatchlistStore()

    // Calculate comprehensive statistics
    const stats = useMemo(() => {
        const watchedItems = items.filter((item: any) => item.watched)
        const toWatchItems = categories['to-watch'] || []
        const watchingItems = categories['watching'] || []
        const favoriteItems = categories['favorites'] || []

        // Basic counts
        const totalMovies = items.length
        const watchedCount = watchedItems.length
        const completionRate = totalMovies > 0 ? (watchedCount / totalMovies) * 100 : 0

        // Time calculations (assuming 120 minutes average)
        const totalWatchTime = watchedCount * 120 // minutes
        const estimatedRemainingTime = (totalMovies - watchedCount) * 120

        // Rating analysis
        const ratedItems = watchedItems.filter((item: any) => item.personalRating)
        const averageRating = ratedItems.length > 0
            ? ratedItems.reduce((sum: number, item: any) => sum + (item.personalRating || 0), 0) / ratedItems.length
            : 0

        // Genre analysis
        const genreCounts: Record<string, number> = {}
        items.forEach((item: any) => {
            item.movie.genre_ids.forEach((genreId: number) => {
                const genreName = getGenreName(genreId)
                genreCounts[genreName] = (genreCounts[genreName] || 0) + 1
            })
        })

        const topGenres = Object.entries(genreCounts)
            .map(([genre, count]) => ({ genre, count, percentage: (count / totalMovies) * 100 }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)

        // Monthly watching trends
        const monthlyData = getMonthlyWatchingData(watchedItems)

        // Rating distribution
        const ratingDistribution = getRatingDistribution(ratedItems)

        // Priority distribution
        const priorityDistribution = getPriorityDistribution(items)

        // Year analysis
        const yearDistribution = getYearDistribution(items)

        // Watching streak
        const currentStreak = calculateWatchingStreak(watchedItems)

        return {
            totalMovies,
            watchedCount,
            toWatchCount: toWatchItems.length,
            watchingCount: watchingItems.length,
            favoritesCount: favoriteItems.length,
            completionRate,
            totalWatchTime,
            estimatedRemainingTime,
            averageRating,
            topGenres,
            monthlyData,
            ratingDistribution,
            priorityDistribution,
            yearDistribution,
            currentStreak,
            ratedMoviesCount: ratedItems.length,
        }
    }, [items, categories])

    const COLORS = [
        '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
        '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280'
    ]

    return (
        <div className="space-y-8">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Movies"
                    value={stats.totalMovies}
                    icon={Film}
                    color="blue"
                />

                <StatCard
                    title="Watched"
                    value={stats.watchedCount}
                    subtitle={`${formatPercentage(stats.completionRate)} complete`}
                    icon={Star}
                    color="green"
                />

                <StatCard
                    title="Watch Time"
                    value={formatWatchTime([stats.totalWatchTime])}
                    subtitle="Total watched"
                    icon={Clock}
                    color="purple"
                />

                <StatCard
                    title="Avg Rating"
                    value={stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A'}
                    subtitle={`${stats.ratedMoviesCount} rated`}
                    icon={Award}
                    color="yellow"
                />
            </div>

            {/* Progress Overview */}
            <Card>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Watchlist Progress
                </h3>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Completion Progress</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {stats.watchedCount} of {stats.totalMovies} movies
                        </span>
                    </div>

                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                            className="bg-green-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(stats.completionRate, 100)}%` }}
                        />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{stats.toWatchCount}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">To Watch</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{stats.watchingCount}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Watching</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">{stats.watchedCount}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Watched</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{stats.favoritesCount}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Favorites</div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Genre Distribution */}
                <Card>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Users className="w-5 h-5 mr-2" />
                        Top Genres
                    </h3>

                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.topGenres}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ genre, percentage }) => `${genre} (${percentage.toFixed(1)}%)`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="count"
                                >
                                    {stats.topGenres.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Monthly Watching Trends */}
                <Card>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2" />
                        Monthly Activity
                    </h3>

                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#3B82F6"
                                    fill="#3B82F6"
                                    fillOpacity={0.3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Rating and Priority Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Rating Distribution */}
                <Card>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Star className="w-5 h-5 mr-2" />
                        Personal Ratings
                    </h3>

                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.ratingDistribution}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="rating" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#F59E0B" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Priority Distribution */}
                <Card>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Zap className="w-5 h-5 mr-2" />
                        Priority Levels
                    </h3>

                    <div className="space-y-4">
                        {stats.priorityDistribution.map((priority, index) => (
                            <div key={priority.level} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div
                                        className="w-4 h-4 rounded"
                                        style={{ backgroundColor: COLORS[index] }}
                                    />
                                    <span className="font-medium capitalize">{priority.level} Priority</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-600 dark:text-gray-400">{priority.count}</span>
                                    <Badge variant="default" size="sm">
                                        {priority.percentage.toFixed(1)}%
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Additional Insights */}
            <Card>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Insights & Achievements
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <InsightCard
                        title="Watching Streak"
                        value={`${stats.currentStreak} days`}
                        description="Current consecutive watching streak"
                        color="green"
                    />

                    <InsightCard
                        title="Most Active Month"
                        value={getMostActiveMonth(stats.monthlyData)}
                        description="Month with most movies watched"
                        color="blue"
                    />

                    <InsightCard
                        title="Favorite Decade"
                        value={getFavoriteDecade(stats.yearDistribution)}
                        description="Most movies from this decade"
                        color="purple"
                    />
                </div>
            </Card>
        </div>
    )
}

// Helper Components
const StatCard: React.FC<{
    title: string
    value: string | number
    subtitle?: string
    icon: any
    color: 'blue' | 'green' | 'purple' | 'yellow' | 'red'
}> = ({ title, value, subtitle, icon: Icon, color }) => {
    const colorClasses = {
        blue: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
        green: 'text-green-600 bg-green-100 dark:bg-green-900/20',
        purple: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20',
        yellow: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20',
        red: 'text-red-600 bg-red-100 dark:bg-red-900/20',
    }

    return (
        <Card>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                    {subtitle && (
                        <p className="text-sm text-gray-500 dark:text-gray-500">{subtitle}</p>
                    )}
                </div>
                <div className={cn('p-3 rounded-full', colorClasses[color])}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </Card>
    )
}

const InsightCard: React.FC<{
    title: string
    value: string
    description: string
    color: 'blue' | 'green' | 'purple'
}> = ({ title, value, description, color }) => {
    const colorClasses = {
        blue: 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/10',
        green: 'border-l-green-500 bg-green-50 dark:bg-green-900/10',
        purple: 'border-l-purple-500 bg-purple-50 dark:bg-purple-900/10',
    }

    return (
        <div className={cn('p-4 border-l-4 rounded-r-lg', colorClasses[color])}>
            <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-1">{value}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
        </div>
    )
}

// Helper Functions
const getGenreName = (genreId: number): string => {
    const genreMap: Record<number, string> = {
        28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
        99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy',
        36: 'History', 27: 'Horror', 10402: 'Music', 9648: 'Mystery',
        10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie', 53: 'Thriller',
        10752: 'War', 37: 'Western'
    }
    return genreMap[genreId] || `Genre ${genreId}`
}

const getMonthlyWatchingData = (watchedItems: any[]) => {
    const monthCounts: Record<string, number> = {}

    // Get last 12 months
    for (let i = 11; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const monthKey = date.toISOString().slice(0, 7) // YYYY-MM
        monthCounts[monthKey] = 0
    }

    // Count watched movies by month
    watchedItems.forEach(item => {
        if (item.watchedAt) {
            const monthKey = item.watchedAt.slice(0, 7)
            if (monthCounts.hasOwnProperty(monthKey)) {
                monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1
            }
        }
    })

    return Object.entries(monthCounts).map(([month, count]) => ({
        month: month.slice(5), // MM
        count
    }))
}

const getRatingDistribution = (ratedItems: any[]) => {
    const distribution: Record<number, number> = {}
    for (let i = 1; i <= 10; i++) {
        distribution[i] = 0
    }

    ratedItems.forEach(item => {
        const rating = Math.floor(item.personalRating || 0)
        if (rating >= 1 && rating <= 10) {
            distribution[rating] = (distribution[rating] || 0) + 1
        }
    })

    return Object.entries(distribution).map(([rating, count]) => ({
        rating: `${rating}⭐`,
        count
    }))
}

const getPriorityDistribution = (items: any[]) => {
    const priorities = ['high', 'medium', 'low']
    const distribution = priorities.map(priority => {
        const count = items.filter(item => (item.priority || 'medium') === priority).length
        return {
            level: priority,
            count,
            percentage: items.length > 0 ? (count / items.length) * 100 : 0
        }
    })

    return distribution
}

const getYearDistribution = (items: any[]) => {
    const yearCounts: Record<string, number> = {}

    items.forEach((item: any) => {
        const year = new Date(item.movie.release_date).getFullYear()
        const decade = `${Math.floor(year / 10) * 10}s`
        yearCounts[decade] = (yearCounts[decade] || 0) + 1
    })

    return yearCounts
}

const calculateWatchingStreak = (watchedItems: any[]): number => {
    if (watchedItems.length === 0) return 0

    const dates = watchedItems
        .filter(item => item.watchedAt)
        .map(item => new Date(item.watchedAt).toDateString())
        .sort()

    if (dates.length === 0) return 0

    let maxStreak = 1
    let currentStreak = 1

    for (let i = 1; i < dates.length; i++) {
        const currentDate = new Date(dates[i]!)
        const previousDate = new Date(dates[i - 1]!)
        const diffTime = currentDate.getTime() - previousDate.getTime()
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 1) {
            currentStreak++
            maxStreak = Math.max(maxStreak, currentStreak)
        } else if (diffDays > 1) {
            currentStreak = 1
        }
    }

    return maxStreak
}

const getMostActiveMonth = (monthlyData: any[]): string => {
    const maxMonth = monthlyData.reduce((max, current) =>
        current.count > max.count ? current : max
        , { month: 'N/A', count: 0 })

    return maxMonth.month !== 'N/A' ? `Month ${maxMonth.month}` : 'N/A'
}

const getFavoriteDecade = (yearDistribution: Record<string, number>): string => {
    const maxDecade = Object.entries(yearDistribution).reduce((max, [decade, count]) =>
        count > max[1] ? [decade, count] : max
        , ['N/A', 0])

    return maxDecade[0]
}