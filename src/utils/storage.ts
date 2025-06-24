// ===== src/utils/storage.ts =====
/**
 * Enhanced localStorage wrapper with error handling and JSON support
 */
export class Storage {
  /**
   * Get item from localStorage with JSON parsing
   */
  static get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key)
      if (item === null) return defaultValue || null
      return JSON.parse(item)
    } catch (error) {
      console.error(`Error reading from localStorage:`, error)
      return defaultValue || null
    }
  }

  /**
   * Set item in localStorage with JSON stringification
   */
  static set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error writing to localStorage:`, error)
      return false
    }
  }

  /**
   * Remove item from localStorage
   */
  static remove(key: string): boolean {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing from localStorage:`, error)
      return false
    }
  }

  /**
   * Clear all items from localStorage
   */
  static clear(): boolean {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error(`Error clearing localStorage:`, error)
      return false
    }
  }

  /**
   * Check if localStorage is available
   */
  static isAvailable(): boolean {
    try {
      const test = '__localStorage_test__'
      localStorage.setItem(test, 'test')
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  }

  /**
   * Get storage usage information
   */
  static getUsage(): { used: number; available: number } {
    if (!this.isAvailable()) {
      return { used: 0, available: 0 }
    }

    let used = 0
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length
      }
    }

    // Approximate available space (most browsers have ~5-10MB limit)
    const available = 5 * 1024 * 1024 - used // 5MB - used

    return { used, available }
  }
}