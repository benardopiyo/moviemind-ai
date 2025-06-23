// ===== src/pages/Search.tsx =====
import React from 'react'
import { SearchContainer } from '@/features/search/SearchContainer'

export const Search: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SearchContainer />
    </div>
  )
}