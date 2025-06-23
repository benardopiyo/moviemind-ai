// ===== src/services/cache.ts =====
import type { CacheEntry } from '@/types/api'

class CacheService {
  private cache = new Map<string, CacheEntry<any>>()
  private readonly defaultTTL = 5 * 60 * 1000 // 5 minutes
  private readonly maxSize = 100
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    this.startCleanupInterval()
  }

  /**
   * Set a value in cache with TTL
   */
  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + ttl,
    }

    this.cache.set(key, entry)
    
    // Cleanup if cache is too large
    if (this.cache.size > this.maxSize) {
      this.evictOldest()
    }
  }

  /**
   * Get a value from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }

    // Check if entry has expired
    if (Date.now() > entry.expiry) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  /**
   * Delete a specific key
   */
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Check if a key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key)
      return false
    }
    
    return true
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const now = Date.now()
    const entries = Array.from(this.cache.entries())
    const expired = entries.filter(([, entry]) => now > entry.expiry).length
    
    return {
      size: this.cache.size,
      expired,
      valid: this.cache.size - expired,
      keys: Array.from(this.cache.keys()),
    }
  }

  /**
   * Remove expired entries
   */
  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Evict oldest entries when cache is full
   */
  private evictOldest(): void {
    const entries = Array.from(this.cache.entries())
    entries.sort(([, a], [, b]) => a.timestamp - b.timestamp)
    
    // Remove oldest 10% of entries
    const toRemove = Math.floor(entries.length * 0.1) || 1
    for (let i = 0; i < toRemove; i++) {
      this.cache.delete(entries[i][0])
    }
  }

  /**
   * Start automatic cleanup interval
   */
  private startCleanupInterval(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 60 * 1000) // Clean up every minute
  }

  /**
   * Stop cleanup interval
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
    this.clear()
  }
}

export const cacheService = new CacheService()