'use client'

import { useState } from 'react'
import Header from './Header'
import MovieRow from './MovieRow'
import MovieDetails from './MovieDetails'
import Loading from './Loading'
import Footer from './Footer'
import { ErrorBoundary } from './ErrorBoundary'
import { Movie } from '@/lib/tmdb'

interface MoviesClientProps {
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
}

export default function MoviesClient({
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
}: MoviesClientProps) {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [_isLoading] = useState(false)

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie)
  }

  const handleSearch = (query: string) => {
    // TODO: Implement search functionality for movies
    console.log('Searching movies:', query)
  }

  return (
    <ErrorBoundary>
      <div className="relative">
        <Header onSearch={handleSearch} />
        
        {/* Page Title */}
        <div 
          className="pt-32 pb-8"
          style={{ 
            paddingLeft: 'clamp(1.5rem, 4vw, 3rem)', 
            paddingRight: 'clamp(1.5rem, 4vw, 3rem)' 
          }}
        >
          <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">
            Movies
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl leading-relaxed">
            <span className="text-red-400 font-semibold">Cinematic adventures</span> await your discovery. 
            From heart-pounding action to tear-jerking dramas, 
            <span className="text-white font-medium"> side-splitting comedies to spine-chilling horrors</span> — 
            immerse yourself in stories that define the magic of cinema.
          </p>
        </div>

        {/* Loading State */}
        {_isLoading && <Loading />}

        {/* Movie Rows */}
        <div className="space-y-8 pb-20">
          {trendingMovies.length > 0 && (
            <MovieRow
              title="Trending Now"
              movies={trendingMovies}
              onMovieClick={handleMovieSelect}
            />
          )}

          {popularMovies.length > 0 && (
            <MovieRow
              title="Popular Movies"
              movies={popularMovies}
              onMovieClick={handleMovieSelect}
            />
          )}

          {nowPlayingMovies.length > 0 && (
            <MovieRow
              title="Now Playing"
              movies={nowPlayingMovies}
              onMovieClick={handleMovieSelect}
            />
          )}

          {upcomingMovies.length > 0 && (
            <MovieRow
              title="Coming Soon"
              movies={upcomingMovies}
              onMovieClick={handleMovieSelect}
            />
          )}

          {topRatedMovies.length > 0 && (
            <MovieRow
              title="Top Rated"
              movies={topRatedMovies}
              onMovieClick={handleMovieSelect}
            />
          )}

          {actionMovies.length > 0 && (
            <MovieRow
              title="Action & Adventure"
              movies={actionMovies}
              onMovieClick={handleMovieSelect}
            />
          )}

          {comedyMovies.length > 0 && (
            <MovieRow
              title="Comedy"
              movies={comedyMovies}
              onMovieClick={handleMovieSelect}
            />
          )}

          {horrorMovies.length > 0 && (
            <MovieRow
              title="Horror & Thriller"
              movies={horrorMovies}
              onMovieClick={handleMovieSelect}
            />
          )}

          {romanceMovies.length > 0 && (
            <MovieRow
              title="Romance"
              movies={romanceMovies}
              onMovieClick={handleMovieSelect}
            />
          )}

          {documentaryMovies.length > 0 && (
            <MovieRow
              title="Documentaries"
              movies={documentaryMovies}
              onMovieClick={handleMovieSelect}
            />
          )}

          {animationMovies.length > 0 && (
            <MovieRow
              title="Animation & Family"
              movies={animationMovies}
              onMovieClick={handleMovieSelect}
            />
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
      </div>
    </ErrorBoundary>
  )
}