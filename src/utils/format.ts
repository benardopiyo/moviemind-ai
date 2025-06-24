// ===== src/utils/format.ts =====

/**
 * Format runtime in minutes to readable format
 * @param minutes - Runtime in minutes
 * @returns Formatted string like "2h 30m"
 */
export const formatRuntime = (minutes: number): string => {
    if (!minutes || minutes <= 0) return 'Unknown'

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (hours === 0) {
        return `${remainingMinutes}m`
    }

    if (remainingMinutes === 0) {
        return `${hours}h`
    }

    return `${hours}h ${remainingMinutes}m`
}

/**
 * Format large currency values with appropriate suffixes
 * @param amount - Currency amount
 * @param currency - Currency code (default: 'USD')
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    if (!amount || amount <= 0) return 'Unknown'

    const formatNumber = (num: number, suffix: string = '') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            minimumFractionDigits: suffix ? 1 : 0,
            maximumFractionDigits: suffix ? 1 : 0,
        }).format(num) + suffix
    }

    if (amount >= 1_000_000_000) {
        return formatNumber(amount / 1_000_000_000, 'B')
    }

    if (amount >= 1_000_000) {
        return formatNumber(amount / 1_000_000, 'M')
    }

    if (amount >= 1_000) {
        return formatNumber(amount / 1_000, 'K')
    }

    return formatNumber(amount)
}

/**
 * Format movie release status
 * @param status - Movie status from TMDB
 * @returns User-friendly status string
 */
export const formatReleaseStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
        'Rumored': 'In Development',
        'Planned': 'Planned',
        'In Production': 'Filming',
        'Post Production': 'Post-Production',
        'Released': 'Released',
        'Canceled': 'Cancelled',
    }

    return statusMap[status] || status
}

/**
 * Calculate and format total watch time from watchlist
 * @param watchlist - Array of watchlist items with runtime
 * @returns Formatted watch time string
 */
export const formatWatchTime = (runtimes: number[]): string => {
    const totalMinutes = runtimes.reduce((sum, runtime) => sum + (runtime || 0), 0)

    if (totalMinutes === 0) return '0 minutes'

    const totalHours = Math.floor(totalMinutes / 60)
    const remainingMinutes = totalMinutes % 60

    if (totalHours === 0) {
        return `${remainingMinutes} ${remainingMinutes === 1 ? 'minute' : 'minutes'}`
    }

    if (totalHours < 24) {
        const hourText = `${totalHours} ${totalHours === 1 ? 'hour' : 'hours'}`
        if (remainingMinutes === 0) {
            return hourText
        }
        return `${hourText} ${remainingMinutes} ${remainingMinutes === 1 ? 'minute' : 'minutes'}`
    }

    const days = Math.floor(totalHours / 24)
    const remainingHours = totalHours % 24

    let result = `${days} ${days === 1 ? 'day' : 'days'}`
    if (remainingHours > 0) {
        result += ` ${remainingHours} ${remainingHours === 1 ? 'hour' : 'hours'}`
    }

    return result
}

/**
 * Calculate progress percentage for watching goals
 * @param current - Current progress value
 * @param target - Target value
 * @returns Progress percentage (0-100)
 */
export const calculateWatchProgress = (current: number, target: number): number => {
    if (!target || target <= 0) return 0
    return Math.min(Math.round((current / target) * 100), 100)
}

/**
 * Format genre array to readable string
 * @param genres - Array of genre objects or strings
 * @param maxGenres - Maximum number of genres to show
 * @returns Formatted genre string
 */
export const formatGenreList = (
    genres: Array<{ name: string } | string>,
    maxGenres: number = 3
): string => {
    if (!genres || genres.length === 0) return 'Unknown'

    const genreNames = genres.map(genre =>
        typeof genre === 'string' ? genre : genre.name
    )

    if (genreNames.length <= maxGenres) {
        return genreNames.join(', ')
    }

    const displayed = genreNames.slice(0, maxGenres)
    const remaining = genreNames.length - maxGenres

    return `${displayed.join(', ')} +${remaining} more`
}

/**
 * Format large numbers with appropriate suffixes
 * @param num - Number to format
 * @returns Formatted number string
 */
export const formatLargeNumber = (num: number): string => {
    if (num >= 1_000_000_000) {
        return (num / 1_000_000_000).toFixed(1) + 'B'
    }

    if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(1) + 'M'
    }

    if (num >= 1_000) {
        return (num / 1_000).toFixed(1) + 'K'
    }

    return num.toString()
}

/**
 * Format percentage with appropriate precision
 * @param value - Raw percentage value (0-100)
 * @param precision - Number of decimal places
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, precision: number = 1): string => {
    return `${value.toFixed(precision)}%`
}

/**
 * Format file size in bytes to human readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Format a duration in seconds to readable format
 * @param seconds - Duration in seconds
 * @returns Formatted duration string
 */
export const formatDuration = (seconds: number): string => {
    if (seconds < 60) {
        return `${Math.round(seconds)}s`
    }

    if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = Math.round(seconds % 60)
        return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`
    }

    const hours = Math.floor(seconds / 3600)
    const remainingMinutes = Math.floor((seconds % 3600) / 60)
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
}