'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Header from './Header'
import MovieRow from './MovieRow'
import MovieDetails from './MovieDetails'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'
import { ErrorBoundary } from './ErrorBoundary'
import { ArrowLeft } from 'lucide-react'
import { Movie, getPopularMovies, getTopRatedMovies, getTrendingMovies, getNowPlayingMovies, getUpcomingMovies, getActionMovies, getComedyMovies, getHorrorMovies, getRomanceMovies, getDocumentaryMovies, getAnimationMovies } from '@/lib/tmdb'

interface CategoryClientProps {
  category: string
  title: string
}

// Category descriptions for better UX
const categoryDescriptions: Record<string, { description: string; subtitle: string }> = {
  'trending': {
    subtitle: 'What\'s Hot Right Now',
    description: 'The most watched and talked about movies this week. Stay in the loop with what everyone\'s streaming.'
  },
  'popular': {
    subtitle: 'Crowd Favorites',
    description: 'Movies that have captured millions of hearts worldwide. These are the titles that keep audiences coming back.'
  },
  'top-rated': {
    subtitle: 'Critically Acclaimed',
    description: 'The highest rated movies from critics and audiences alike. Quality storytelling at its finest.'
  },
  'now-playing': {
    subtitle: 'In Theaters Now',
    description: 'The latest releases currently showing in cinemas. Fresh stories hitting the big screen.'
  },
  'upcoming': {
    subtitle: 'Coming Soon',
    description: 'Get a sneak peek at the most anticipated movies releasing soon. Mark your calendars!'
  },
  'action': {
    subtitle: 'Heart-Pounding Thrills',
    description: 'High-octane adventures, explosive sequences, and adrenaline-fueled entertainment that keeps you on the edge.'
  },
  'comedy': {
    subtitle: 'Laugh Out Loud',
    description: 'From clever wit to slapstick humor, these movies guarantee smiles and unforgettable moments of joy.'
  },
  'horror': {
    subtitle: 'Spine-Chilling Scares',
    description: 'Prepare for sleepless nights with these terrifying tales that will haunt your dreams.'
  },
  'romance': {
    subtitle: 'Love Stories',
    description: 'Heartwarming tales of love, passion, and connection that make you believe in happily ever after.'
  },
  'documentary': {
    subtitle: 'Real Stories',
    description: 'Fascinating real-world stories, groundbreaking discoveries, and eye-opening perspectives on life.'
  },
  'animation': {
    subtitle: 'Animated Wonders',
    description: 'From family favorites to adult animation, discover worlds where imagination knows no bounds.'
  }
}

export default function CategoryClient({ category, title }: CategoryClientProps) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const router = useRouter()

  const categoryInfo = categoryDescriptions[category] || {
    subtitle: 'Discover More',
    description: `Explore our collection of ${title.toLowerCase()} and find your next favorite movie.`
  }

  const getMoviesForCategory = async (categoryName: string): Promise<Movie[]> => {
    switch (categoryName) {
      case 'trending':
        return getTrendingMovies()
      case 'popular':
        return getPopularMovies(1)
      case 'top-rated':
        return getTopRatedMovies(1)
      case 'now-playing':
        return getNowPlayingMovies(1)
      case 'upcoming':
        return getUpcomingMovies(1)
      case 'action':
        return getActionMovies(1)
      case 'comedy':
        return getComedyMovies(1)
      case 'horror':
        return getHorrorMovies(1)
      case 'romance':
        return getRomanceMovies(1)
      case 'documentary':
        return getDocumentaryMovies(1)
      case 'animation':
        return getAnimationMovies(1)
      default:
        return []
    }
  }

  const loadMovies = useCallback(async () => {
    setLoading(true)
    try {
      const categoryMovies = await getMoviesForCategory(category)
      setMovies(categoryMovies)
    } catch (error) {
      console.error('Error loading movies:', error)
      setMovies([])
    } finally {
      setLoading(false)
    }
  }, [category])

  useEffect(() => {
    loadMovies()
  }, [loadMovies])

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie)
  }

  const handleBackToHome = () => {
    router.back()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white text-lg">Loading {title}...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen bg-black">
        <Header />
        
        {/* Page Header */}
        <div 
          className="pt-32 pb-8"
          style={{ 
            paddingLeft: 'clamp(1.5rem, 4vw, 3rem)', 
            paddingRight: 'clamp(1.5rem, 4vw, 3rem)' 
          }}
        >
          {/* Back Button */}
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6 group cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>

          {/* Title Section */}
          <div className="mb-6">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {title}
            </h1>
            <p className="text-red-400 text-xl md:text-2xl font-semibold mb-4">
              {categoryInfo.subtitle}
            </p>
            <p className="text-gray-300 text-lg md:text-xl max-w-4xl leading-relaxed">
              {categoryInfo.description}
            </p>
          </div>
        </div>

        {/* Movies Section */}
        <div className="space-y-8 pb-20">
          {movies.length > 0 ? (
            <MovieRow
              title={`All ${title}`}
              movies={movies}
              onMovieClick={handleMovieSelect}
              onMoviePlay={(movie) => {
                console.log('Playing movie:', movie.title)
                handleMovieSelect(movie)
              }}
            />
          ) : (
            <div 
              className="text-center py-20"
              style={{ 
                paddingLeft: 'clamp(1.5rem, 4vw, 3rem)', 
                paddingRight: 'clamp(1.5rem, 4vw, 3rem)' 
              }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">
                No movies found
              </h2>
              <p className="text-white/60 mb-8">
                We couldn&apos;t find any movies in this category right now.
              </p>
              <button
                onClick={handleBackToHome}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Go Back
              </button>
            </div>
          )}
        </div>

        {/* Movie Details Modal */}
        {selectedMovie && (
          <MovieDetails
            movie={selectedMovie}
            isOpen={true}
            onClose={() => setSelectedMovie(null)}
          />
        )}

        {/* Footer */}
        <Footer />
        <ScrollToTop />
      </div>
    </ErrorBoundary>
  )
}