import { Loader2 } from 'lucide-react'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  fullScreen?: boolean
}

export default function Loading({ size = 'md', text, fullScreen = false }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  const LoadingSpinner = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        {/* Netflix-style loading animation */}
        <div className={`${sizeClasses[size]} border-2 border-red-600 border-t-transparent rounded-full animate-spin`} />
        <Loader2 className={`${sizeClasses[size]} text-red-600 animate-spin absolute inset-0`} />
      </div>
      {text && (
        <p className={`text-white/80 ${textSizeClasses[size]} font-medium`}>
          {text}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        {LoadingSpinner}
      </div>
    )
  }

  return LoadingSpinner
}

// Skeleton loading components for different content types
export function MovieCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-48 md:w-56 lg:w-64">
      <div className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse" />
    </div>
  )
}

export function MovieRowSkeleton() {
  return (
    <div className="mb-8">
      {/* Title skeleton */}
      <div className="h-8 bg-gray-800 rounded w-48 mb-4 mx-6 lg:mx-8 animate-pulse" />
      
      {/* Cards skeleton */}
      <div className="flex gap-4 px-6 lg:px-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="h-screen w-full bg-gray-900 animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div className="relative z-10 flex items-center h-full">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-2xl space-y-4">
            {/* Title skeleton */}
            <div className="h-16 bg-gray-800 rounded w-96" />
            
            {/* Meta info skeleton */}
            <div className="flex gap-4">
              <div className="h-8 bg-gray-800 rounded w-16" />
              <div className="h-8 bg-gray-800 rounded w-20" />
              <div className="h-8 bg-gray-800 rounded w-24" />
            </div>
            
            {/* Overview skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-800 rounded w-full" />
              <div className="h-4 bg-gray-800 rounded w-3/4" />
              <div className="h-4 bg-gray-800 rounded w-1/2" />
            </div>
            
            {/* Buttons skeleton */}
            <div className="flex gap-4 pt-4">
              <div className="h-12 bg-gray-800 rounded w-32" />
              <div className="h-12 bg-gray-800 rounded w-36" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Page loading component
export function PageLoading() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95">
        <div className="flex items-center justify-between px-6 lg:px-8 py-4">
          <div className="h-8 bg-gray-800 rounded w-32 animate-pulse" />
          <div className="flex gap-4">
            <div className="h-8 bg-gray-800 rounded w-8 animate-pulse" />
            <div className="h-8 bg-gray-800 rounded w-8 animate-pulse" />
            <div className="h-8 bg-gray-800 rounded w-8 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Hero skeleton */}
      <HeroSkeleton />

      {/* Movie rows skeleton */}
      <div className="relative z-10 -mt-32 space-y-8 pb-16">
        {Array.from({ length: 5 }).map((_, i) => (
          <MovieRowSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}