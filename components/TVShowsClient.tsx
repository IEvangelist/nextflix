'use client'

import { useState } from 'react'
import Header from './Header'
import MovieRow from './MovieRow'
import MovieDetails from './MovieDetails'
import Loading from './Loading'
import { ErrorBoundary } from './ErrorBoundary'

interface TVShowsClientProps {
  trendingTVShows: any[]
  popularTVShows: any[]
  topRatedTVShows: any[]
  onTheAirTVShows: any[]
  airingTodayTVShows: any[]
  actionTVShows: any[]
  comedyTVShows: any[]
  dramaTVShows: any[]
  crimeTVShows: any[]
  documentaryTVShows: any[]
  animationTVShows: any[]
}

export default function TVShowsClient({
  trendingTVShows,
  popularTVShows,
  topRatedTVShows,
  onTheAirTVShows,
  airingTodayTVShows,
  actionTVShows,
  comedyTVShows,
  dramaTVShows,
  crimeTVShows,
  documentaryTVShows,
  animationTVShows,
}: TVShowsClientProps) {
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleMovieSelect = (movie: any) => {
    setSelectedMovie(movie)
  }

  const handleSearch = (query: string) => {
    // TODO: Implement search functionality for TV shows
    console.log('Searching TV shows:', query)
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
            TV Shows
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl leading-relaxed">
            <span className="text-red-400 font-semibold">Binge-worthy stories</span> await. 
            From mind-bending thrillers to laugh-out-loud comedies, 
            <span className="text-white font-medium"> epic dramas to animated masterpieces</span> — 
            dive into worlds that will keep you coming back for more.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && <Loading />}

        {/* TV Show Rows */}
        <div className="space-y-8 pb-20">
          {trendingTVShows.length > 0 && (
            <MovieRow
              title="Trending Now"
              movies={trendingTVShows}
              onMovieClick={handleMovieSelect}
            />
          )}

          {popularTVShows.length > 0 && (
            <MovieRow
              title="Popular TV Shows"
              movies={popularTVShows}
              onMovieClick={handleMovieSelect}
            />
          )}

          {topRatedTVShows.length > 0 && (
            <MovieRow
              title="Top Rated"
              movies={topRatedTVShows}
              onMovieClick={handleMovieSelect}
            />
          )}

          {onTheAirTVShows.length > 0 && (
            <MovieRow
              title="Currently Airing"
              movies={onTheAirTVShows}
              onMovieClick={handleMovieSelect}
            />
          )}

          {airingTodayTVShows.length > 0 && (
            <MovieRow
              title="Airing Today"
              movies={airingTodayTVShows}
              onMovieClick={handleMovieSelect}
            />
          )}

          {dramaTVShows.length > 0 && (
            <MovieRow
              title="Drama Series"
              movies={dramaTVShows}
              onMovieClick={handleMovieSelect}
            />
          )}

          {actionTVShows.length > 0 && (
            <MovieRow
              title="Action & Adventure"
              movies={actionTVShows}
              onMovieClick={handleMovieSelect}
            />
          )}

          {comedyTVShows.length > 0 && (
            <MovieRow
              title="Comedy Shows"
              movies={comedyTVShows}
              onMovieClick={handleMovieSelect}
            />
          )}

          {crimeTVShows.length > 0 && (
            <MovieRow
              title="Crime & Mystery"
              movies={crimeTVShows}
              onMovieClick={handleMovieSelect}
            />
          )}

          {documentaryTVShows.length > 0 && (
            <MovieRow
              title="Documentaries"
              movies={documentaryTVShows}
              onMovieClick={handleMovieSelect}
            />
          )}

          {animationTVShows.length > 0 && (
            <MovieRow
              title="Animated Series"
              movies={animationTVShows}
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
      </div>
    </ErrorBoundary>
  )
}