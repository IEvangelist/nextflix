'use client'

import { useState, useEffect } from 'react'
import { Movie } from '@/lib/tmdb'
import MovieCard from '@/components/MovieCard'
import Header from '@/components/Header'
import { ArrowLeft, Heart } from 'lucide-react'
import Link from 'next/link'

export default function MyListPage() {
  const [myList, setMyList] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

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

  const removeFromList = (movieId: number) => {
    const updatedList = myList.filter(movie => movie.id !== movieId)
    setMyList(updatedList)
    localStorage.setItem('myList', JSON.stringify(updatedList))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Header onSearch={() => {}} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
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
          
          <div className="flex items-center gap-4 mb-4">
            <Heart className="w-8 h-8 text-red-600 fill-current" />
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              My List
            </h1>
          </div>
          
          <p className="text-white/70 text-lg max-w-2xl">
            {myList.length > 0 
              ? `You have ${myList.length} movie${myList.length === 1 ? '' : 's'} in your list`
              : 'Your personal collection of favorite movies'
            }
          </p>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="px-4 md:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {myList.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {myList.map((movie) => (
                <div key={movie.id} className="w-full relative group">
                  <MovieCard 
                    movie={movie} 
                    onPlay={() => {
                      console.log('Playing movie:', movie.title)
                    }}
                    onClick={() => {
                      console.log('Clicked movie:', movie.title)
                    }}
                  />
                  {/* Remove from list button */}
                  <button
                    onClick={() => removeFromList(movie.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600/80"
                    title="Remove from My List"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Heart className="w-16 h-16 text-white/20 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">
                Your list is empty
              </h2>
              <p className="text-white/60 mb-8 max-w-md mx-auto">
                Start building your personal collection by adding movies you love. 
                Look for the heart icon on any movie card to add it to your list.
              </p>
              <Link
                href="/"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Browse Movies
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}