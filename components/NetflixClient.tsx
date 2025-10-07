'use client'

import { useState, useRef } from 'react'
import { Movie, MovieVideo, searchMovies } from '@/lib/tmdb'
import HeroSection from './HeroSection'
import MovieRow from './MovieRow'
import Header from './Header'
import MovieDetails from './MovieDetails'
import Footer from './Footer'

interface NetflixClientProps {
  trendingMovies: Movie[]
  popularMovies: Movie[]
  topRatedMovies: Movie[]
  nowPlayingMovies: Movie[]
  upcomingMovies: Movie[]
  actionMovies: Movie[]
  comedyMovies: Movie[]
  horrorMovies: Movie[]
  romanceMovies: Movie[]
  documentaryMovies: Movie[]
  animationMovies: Movie[]
  heroMovie: Movie | null
  heroVideos: MovieVideo[]
}

export default function NetflixClient({
  trendingMovies,
  popularMovies,
  topRatedMovies,
  nowPlayingMovies,
  upcomingMovies,
  actionMovies,
  comedyMovies,
  horrorMovies,
  romanceMovies,
  documentaryMovies,
  animationMovies,
  heroMovie,
  heroVideos
}: NetflixClientProps) {
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [showMovieDetails, setShowMovieDetails] = useState(false)
  const heroRef = useRef<{ pauseVideo: () => void; resumeVideo: () => void }>(null)

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowSearch(false)
      return
    }

    setIsSearching(true)
    setShowSearch(true)
    try {
      const results = await searchMovies(query)
      setSearchResults(results)
    } catch (error) {
      console.error('Search failed:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleMoviePlay = (movie: Movie) => {
    console.log('Playing movie:', movie.title)
    // Here you could implement:
    // - Open a modal with movie details
    // - Navigate to a movie detail page
    // - Start video playback
    // - Add to watchlist, etc.
  }

  const handleMovieClick = (movie: Movie) => {
    // Pause hero video when modal opens
    if (heroRef.current?.pauseVideo) {
      heroRef.current.pauseVideo()
    }
    setSelectedMovie(movie)
    setShowMovieDetails(true)
  }

  const closeMovieDetails = () => {
    // Resume hero video when modal closes
    if (heroRef.current?.resumeVideo) {
      heroRef.current.resumeVideo()
    }
    setShowMovieDetails(false)
    setSelectedMovie(null)
  }

  const clearSearch = () => {
    setSearchResults([])
    setShowSearch(false)
  }

  return (
    <>
      {/* Header */}
      <Header onSearch={handleSearch} />

      {/* Search Results Overlay */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/95 z-40 pt-20">
          <div className="container mx-auto px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">
                {isSearching ? 'Searching...' : `Search Results (${searchResults.length})`}
              </h2>
              <button
                onClick={clearSearch}
                className="text-white hover:text-gray-300 text-xl"
              >
                ✕
              </button>
            </div>
            
            {isSearching ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {searchResults.map((movie) => (
                  <div key={movie.id} className="w-full">
                    <MovieCard movie={movie} onPlay={handleMoviePlay} onClick={handleMovieClick} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-white/60 text-lg">No results found</p>
                <p className="text-white/40 text-sm mt-2">Try searching with different keywords</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={showSearch ? 'blur-sm pointer-events-none' : ''}>
        {/* Hero Section */}
        {heroMovie && !showSearch && (
          <HeroSection ref={heroRef} movie={heroMovie} videos={heroVideos} />
        )}

        {/* Movie Rows */}
        {!showSearch && (
          <div className="relative z-10 -mt-32 space-y-8 pb-16">
            {trendingMovies.length > 0 && (
              <MovieRow 
                title="Trending Now" 
                movies={trendingMovies}
                categorySlug="trending"
                onMoviePlay={handleMoviePlay}
                onMovieClick={handleMovieClick}
              />
            )}
            
            {popularMovies.length > 0 && (
              <MovieRow 
                title="Popular on Netflix" 
                movies={popularMovies}
                categorySlug="popular"
                onMoviePlay={handleMoviePlay}
                onMovieClick={handleMovieClick}
              />
            )}
            
            {actionMovies.length > 0 && (
              <MovieRow 
                title="Action Movies" 
                movies={actionMovies}
                categorySlug="action"
                onMoviePlay={handleMoviePlay}
                onMovieClick={handleMovieClick}
              />
            )}
            
            {comedyMovies.length > 0 && (
              <MovieRow 
                title="Comedy Movies" 
                movies={comedyMovies}
                categorySlug="comedy"
                onMoviePlay={handleMoviePlay}
                onMovieClick={handleMovieClick}
              />
            )}
            
            {horrorMovies.length > 0 && (
              <MovieRow 
                title="Horror Movies" 
                movies={horrorMovies}
                categorySlug="horror"
                onMoviePlay={handleMoviePlay}
                onMovieClick={handleMovieClick}
              />
            )}
            
            {topRatedMovies.length > 0 && (
              <MovieRow 
                title="Top Rated" 
                movies={topRatedMovies}
                categorySlug="top-rated"
                onMoviePlay={handleMoviePlay}
                onMovieClick={handleMovieClick}
              />
            )}
            
            {romanceMovies.length > 0 && (
              <MovieRow 
                title="Romance Movies" 
                movies={romanceMovies}
                categorySlug="romance"
                onMoviePlay={handleMoviePlay}
                onMovieClick={handleMovieClick}
              />
            )}
            
            {documentaryMovies.length > 0 && (
              <MovieRow 
                title="Documentary Movies" 
                movies={documentaryMovies}
                categorySlug="documentary"
                onMoviePlay={handleMoviePlay}
                onMovieClick={handleMovieClick}
              />
            )}
            
            {animationMovies.length > 0 && (
              <MovieRow 
                title="Animation Movies" 
                movies={animationMovies}
                categorySlug="animation"
                onMoviePlay={handleMoviePlay}
                onMovieClick={handleMovieClick}
              />
            )}
            
            {nowPlayingMovies.length > 0 && (
              <MovieRow 
                title="Now Playing" 
                movies={nowPlayingMovies}
                categorySlug="now-playing"
                onMoviePlay={handleMoviePlay}
                onMovieClick={handleMovieClick}
              />
            )}
            
            {upcomingMovies.length > 0 && (
              <MovieRow 
                title="Coming Soon" 
                movies={upcomingMovies}
                categorySlug="upcoming"
                onMoviePlay={handleMoviePlay}
                onMovieClick={handleMovieClick}
              />
            )}

            {/* No Data Fallback */}
            {trendingMovies.length === 0 && popularMovies.length === 0 && (
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Unable to load content
                  </h2>
                  <p className="text-white/60 mb-8">
                    Please check your internet connection and TMDB API configuration.
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Footer */}
        {!showSearch && <Footer />}
      </div>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          isOpen={showMovieDetails}
          onClose={closeMovieDetails}
        />
      )}
    </>
  )
}

// Import MovieCard locally to avoid circular imports
import MovieCard from './MovieCard'