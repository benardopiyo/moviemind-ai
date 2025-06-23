// ===== src/pages/Details.tsx =====
import React from 'react'
import { useParams } from 'react-router-dom'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'

export const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  // This will be implemented when we work on the details feature
  return (
    <div className="container-custom py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Movie Details
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Movie ID: {id}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
          This page will be implemented in the next feature branch.
        </p>
      </div>
    </div>
  )
}