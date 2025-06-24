// ===== src/utils/validation.ts =====
/**
 * Validate movie search query
 */
export function validateSearchQuery(query: string): {
  isValid: boolean
  error?: string
} {
  if (!query || typeof query !== 'string') {
    return { isValid: false, error: 'Search query is required' }
  }

  const trimmedQuery = query.trim()

  if (trimmedQuery.length < 1) {
    return { isValid: false, error: 'Search query is too short' }
  }

  if (trimmedQuery.length > 100) {
    return { isValid: false, error: 'Search query is too long' }
  }

  return { isValid: true }
}

/**
 * Validate movie rating (0-10)
 */
export function validateRating(rating: number): {
  isValid: boolean
  error?: string
} {
  if (typeof rating !== 'number' || isNaN(rating)) {
    return { isValid: false, error: 'Rating must be a number' }
  }

  if (rating < 0 || rating > 10) {
    return { isValid: false, error: 'Rating must be between 0 and 10' }
  }

  return { isValid: true }
}

/**
 * Validate year range
 */
export function validateYear(year: number): {
  isValid: boolean
  error?: string
} {
  const currentYear = new Date().getFullYear()

  if (typeof year !== 'number' || isNaN(year)) {
    return { isValid: false, error: 'Year must be a number' }
  }

  if (year < 1888 || year > currentYear + 5) {
    return { isValid: false, error: `Year must be between 1888 and ${currentYear + 5}` }
  }

  return { isValid: true }
}

/**
 * Sanitize HTML to prevent XSS
 */
export function sanitizeHTML(html: string): string {
  const div = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}