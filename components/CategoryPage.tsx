'use client'

import { useState, useEffect, useCallback } from 'react'
import { Movie, getPopularMovies, getTopRatedMovies, getTrendingMovies, getNowPlayingMovies, getUpcomingMovies, getActionMovies, getComedyMovies, getHorrorMovies, getRomanceMovies, getDocumentaryMovies, getAnimationMovies } from '@/lib/tmdb'
import MovieCard from '@/components/MovieCard'
import Header from '@/components/Header'
import Loading from '@/components/Loading'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface CategoryPageProps {
  category: string
  title: string
}

export default function CategoryPage({ category, title }: CategoryPageProps) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const getMoviesForCategory = async (categoryName: string, pageNum: number): Promise<Movie[]> => {
    switch (categoryName) {
      case 'trending':
        return getTrendingMovies()
      case 'popular':
        return getPopularMovies(pageNum)
      case 'top-rated':
        return getTopRatedMovies(pageNum)
      case 'now-playing':
        return getNowPlayingMovies(pageNum)
      case 'upcoming':
        return getUpcomingMovies(pageNum)
      case 'action':
        return getActionMovies(pageNum)
      case 'comedy':
        return getComedyMovies(pageNum)
      case 'horror':
        return getHorrorMovies(pageNum)
      case 'romance':
        return getRomanceMovies(pageNum)
      case 'documentary':
        return getDocumentaryMovies(pageNum)
      case 'animation':
        return getAnimationMovies(pageNum)
      default:
        return []
    }
  }

  const loadInitialMovies = useCallback(async () => {
    setLoading(true)
    try {
      const initialMovies = await getMoviesForCategory(category, 1)
      setMovies(initialMovies)
      setPage(1)
      setHasMore(initialMovies.length === 20) // TMDB typically returns 20 results per page
    } catch (error) {
      console.error('Error loading movies:', error)
      setMovies([])
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [category])

    const loadMoreMovies = useCallback(async () => {
    if (loadingMore || !hasMore) return

    setLoadingMore(true)
    try {
      const nextPage = page + 1
      const moreMovies = await getMoviesForCategory(category, nextPage)
      setMovies(prevMovies => [...prevMovies, ...moreMovies])
      setPage(nextPage)
      setHasMore(moreMovies.length === 20)
    } catch (error) {
      console.error('Error loading more movies:', error)
    } finally {
      setLoadingMore(false)
    }
  }, [category, loadingMore, hasMore, page])

  useEffect(() => {
    loadInitialMovies()
  }, [category, loadInitialMovies])

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000
      ) {
        loadMoreMovies()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [movies, page, hasMore, loadingMore, loadMoreMovies])

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Header onSearch={() => {}} />
        <Loading />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Header onSearch={() => {}} />
      
      {/* Page Header */}
      <div className="pt-24 pb-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href="/"
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {title}
          </h1>
          
          <p className="text-white/70 text-lg max-w-2xl">
            Discover {title.toLowerCase()} movies from our extensive collection. 
            Scroll down to see more as you explore.
          </p>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="px-4 md:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {movies.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {movies.map((movie) => (
                  <div key={`${movie.id}-${movie.title}`} className="w-full">
                    <MovieCard 
                      movie={movie} 
                      onPlay={() => {
                        // Handle play action
                        console.log('Playing movie:', movie.title)
                      }}
                      onClick={() => {
                        // Handle click action
                        console.log('Clicked movie:', movie.title)
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Load More Indicator */}
              {loadingMore && (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                  <span className="ml-3 text-white/70">Loading more movies...</span>
                </div>
              )}

              {/* End of Results */}
              {!hasMore && !loadingMore && (
                <div className="text-center py-12">
                  <p className="text-white/60 text-lg">You&apos;ve reached the end!</p>
                  <p className="text-white/40 text-sm mt-2">
                    That&apos;s all the {title.toLowerCase()} movies we have for now.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-white mb-4">
                No movies found
              </h2>
              <p className="text-white/60 mb-8">
                We couldn&apos;t find any movies in this category.
              </p>
              <Link
                href="/"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Back to Home
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}