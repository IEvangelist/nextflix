'use client'

import { useState } from 'react'
import { Movie, searchMovies } from '@/lib/tmdb'
import MovieRow from './MovieRow'
import Header from './Header'

interface ClientWrapperProps {
  children: React.ReactNode
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const results = await searchMovies(query)
      setSearchResults(results)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleMoviePlay = (movie: Movie) => {
    // Handle movie play - could open a modal, navigate to a detail page, etc.
    console.log('Playing movie:', movie.title)
    // For now, we'll just log it. In a real app, you might:
    // - Open a modal with the movie trailer
    // - Navigate to a movie detail page
    // - Start playback in a video player
  }

  return (
    <>
      {/* Header with search functionality */}
      <Header onSearch={handleSearch} />

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="relative z-10 mt-20 pt-8">
          <MovieRow 
            title={`Search Results (${searchResults.length})`}
            movies={searchResults} 
            onMoviePlay={handleMoviePlay}
          />
        </div>
      )}

      {/* Loading indicator for search */}
      {isSearching && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg text-white">
          Searching...
        </div>
      )}

      {/* Main content */}
      <div className={searchResults.length > 0 ? 'opacity-50' : 'opacity-100'}>
        {children}
      </div>
    </>
  )
}