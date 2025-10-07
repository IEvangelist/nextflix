'use client'

import { useState, useEffect } from 'react'
import { Movie } from '@/lib/tmdb'
import Header from '@/components/Header'
import MovieRow from '@/components/MovieRow'
import MovieDetails from '@/components/MovieDetails'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function MyListPage() {
  const [myList, setMyList] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)

  useEffect(() => {
    // Load movies from localStorage
    try {
      const savedMovies = localStorage.getItem('myList')
      if (savedMovies) {
        setMyList(JSON.parse(savedMovies))
      }
    } catch (error) {
      console.error('Error loading my list:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Listen for storage changes to update the list
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const savedMovies = localStorage.getItem('myList')
        if (savedMovies) {
          setMyList(JSON.parse(savedMovies))
        } else {
          setMyList([])
        }
      } catch (error) {
        console.error('Error loading my list:', error)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative bg-black min-h-screen">
      <Header />
      
      {/* Page Title */}
      <div 
        className="pt-32 pb-8"
        style={{ 
          paddingLeft: 'clamp(1.5rem, 4vw, 3rem)', 
          paddingRight: 'clamp(1.5rem, 4vw, 3rem)' 
        }}
      >
        <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">
          My List
        </h1>
        <p className="text-gray-300 text-lg md:text-xl max-w-3xl leading-relaxed">
          {myList.length > 0 ? (
            <>
              <span className="text-red-400 font-semibold">Your personal collection</span> of favorite movies and shows. 
              You have <span className="text-white font-medium">{myList.length} {myList.length === 1 ? 'title' : 'titles'}</span> saved.
            </>
          ) : (
            <>
              <span className="text-red-400 font-semibold">Your personal collection</span> awaits. 
              Start building your list by adding <span className="text-white font-medium">movies and shows you love</span>.
            </>
          )}
        </p>
      </div>

      {/* Movies */}
      <div className="space-y-8 pb-20">
        {myList.length > 0 ? (
          <MovieRow
            title=""
            movies={myList}
            onMovieClick={handleMovieSelect}
          />
        ) : (
          <div 
            className="text-center py-20"
            style={{ 
              paddingLeft: 'clamp(1.5rem, 4vw, 3rem)', 
              paddingRight: 'clamp(1.5rem, 4vw, 3rem)' 
            }}
          >
            <div className="max-w-md mx-auto">
              <svg 
                className="w-20 h-20 mx-auto mb-6 text-white/20"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                />
              </svg>
              <h2 className="text-2xl font-bold text-white mb-4">
                Your list is empty
              </h2>
              <p className="text-white/60 mb-8">
                Start building your personal collection by adding movies and shows you love. 
                Look for the heart icon on any title to add it to your list.
              </p>
              <Link
                href="/"
                className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Browse Titles
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          isOpen={!!selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      <Footer />
    </div>
  )
}