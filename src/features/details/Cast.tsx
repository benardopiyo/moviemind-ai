import React, { useState } from 'react'
import { User, Users, ChevronDown, ChevronUp } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { useApi } from '@/hooks/useApi'
import { tmdbService } from '@/services/tmdb'
import type { MovieCredits, CastMember, CrewMember } from '@/types/movie'

interface CastProps {
  movieId: number
}

export const Cast: React.FC<CastProps> = ({ movieId }) => {
  const [showAllCast, setShowAllCast] = useState(false)
  const [showAllCrew, setShowAllCrew] = useState(false)

  const {
    data: credits,
    loading,
    error,
  } = useApi<MovieCredits>(
    () => tmdbService.getMovieCredits(movieId),
    {
      immediate: true,
      deps: [movieId],
    }
  )

  if (loading) {
    return (
      <div className="space-y-8">
        <LoadingSkeleton variant="rectangle" height="200px" />
        <LoadingSkeleton variant="rectangle" height="200px" />
      </div>
    )
  }

  if (error || !credits) {
    return (
      <EmptyState
        type="general"
        title="Cast information unavailable"
        description="We couldn't load the cast and crew information for this movie."
      />
    )
  }

  const displayedCast = showAllCast ? credits.cast : credits.cast.slice(0, 12)

  // Group crew by department
  const crewByDepartment = credits.crew.reduce((acc, member) => {
    if (!acc[member.department]) {
      acc[member.department] = []
    }
    acc[member.department]!.push(member)
    return acc
  }, {} as Record<string, CrewMember[]>)

  const keyDepartments = ['Directing', 'Writing', 'Production', 'Camera', 'Sound']

  return (
    <div className="space-y-8">
      {/* Main Cast */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-bold">Cast</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({credits.cast.length} actors)
            </span>
          </div>
        </div>

        {credits.cast.length === 0 ? (
          <EmptyState
            type="general"
            title="No cast information"
            description="Cast information is not available for this movie."
          />
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {displayedCast.map((actor) => (
                <CastCard key={actor.id} actor={actor} />
              ))}
            </div>

            {credits.cast.length > 12 && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={() => setShowAllCast(!showAllCast)}
                  rightIcon={showAllCast ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                >
                  {showAllCast ? 'Show Less' : `Show All ${credits.cast.length} Cast Members`}
                </Button>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Key Crew */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <User className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-bold">Key Crew</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({credits.crew.length} crew members)
            </span>
          </div>
        </div>

        {credits.crew.length === 0 ? (
          <EmptyState
            type="general"
            title="No crew information"
            description="Crew information is not available for this movie."
          />
        ) : (
          <>
            {/* Key Departments */}
            <div className="space-y-6">
              {keyDepartments.map((department) => {
                const departmentCrew = crewByDepartment[department]
                if (!departmentCrew || departmentCrew.length === 0) return null

                return (
                  <div key={department}>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                      {department}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {departmentCrew.slice(0, showAllCrew ? departmentCrew.length : 3).map((member) => (
                        <CrewCard key={`${member.id}-${member.job}`} member={member} />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            {credits.crew.length > 20 && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={() => setShowAllCrew(!showAllCrew)}
                  rightIcon={showAllCrew ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                >
                  {showAllCrew ? 'Show Less' : `Show All Departments`}
                </Button>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  )
}

const CastCard: React.FC<{ actor: CastMember }> = ({ actor }) => {
  const profileUrl = tmdbService.getImageURL(actor.profile_path, 'MEDIUM')

  return (
    <Card hover padding="none" className="overflow-hidden">
      <div className="aspect-[3/4] relative">
        {actor.profile_path ? (
          <img
            src={profileUrl}
            alt={actor.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <User className="w-12 h-12 text-gray-400" />
          </div>
        )}
      </div>
      
      <div className="p-3">
        <h4 className="font-semibold text-sm line-clamp-1 text-gray-900 dark:text-white">
          {actor.name}
        </h4>
        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
          {actor.character}
        </p>
      </div>
    </Card>
  )
}

const CrewCard: React.FC<{ member: CrewMember }> = ({ member }) => {
  return (
    <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
        <User className="w-6 h-6 text-gray-400" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-gray-900 dark:text-white">
          {member.name}
        </h4>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {member.job}
        </p>
      </div>
    </div>
  )
}
