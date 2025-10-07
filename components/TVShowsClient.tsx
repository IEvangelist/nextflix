'use client'

import { useState } from 'react'
import Header from './Header'
import MovieRow from './MovieRow'
import MovieDetails from './MovieDetails'
import Footer from './Footer'
import { ErrorBoundary } from './ErrorBoundary'

interface TVShowsClientProps {
  trendingTVShows: Array<Record<string, unknown>>
  popularTVShows: Array<Record<string, unknown>>
  topRatedTVShows: Array<Record<string, unknown>>
  onTheAirTVShows: Array<Record<string, unknown>>
  airingTodayTVShows: Array<Record<string, unknown>>
  actionTVShows: Array<Record<string, unknown>>
  comedyTVShows: Array<Record<string, unknown>>
  dramaTVShows: Array<Record<string, unknown>>
  crimeTVShows: Array<Record<string, unknown>>
  documentaryTVShows: Array<Record<string, unknown>>
  animationTVShows: Array<Record<string, unknown>>
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
  const [selectedMovie, setSelectedMovie] = useState<null>(null)

  const handleMovieSelect = () => {
    // Movie selection disabled for now
  }

  return (
    <ErrorBoundary>
      <div className="relative">
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
            TV Shows
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl leading-relaxed">
            <span className="text-red-400 font-semibold">Binge-worthy stories</span> await. 
            From mind-bending thrillers to laugh-out-loud comedies, 
            <span className="text-white font-medium"> epic dramas to animated masterpieces</span> — 
            dive into worlds that will keep you coming back for more.
          </p>
        </div>

        {/* TV Show Rows */}
        <div className="space-y-8 pb-20">
          {trendingTVShows.length > 0 && (
            <MovieRow
              title="Trending Now"
              movies={trendingTVShows as never[]}
              onMovieClick={handleMovieSelect as never}
            />
          )}

          {popularTVShows.length > 0 && (
            <MovieRow
              title="Popular TV Shows"
              movies={popularTVShows as never[]}
              onMovieClick={handleMovieSelect as never}
            />
          )}

          {topRatedTVShows.length > 0 && (
            <MovieRow
              title="Top Rated"
              movies={topRatedTVShows as never[]}
              onMovieClick={handleMovieSelect as never}
            />
          )}

          {onTheAirTVShows.length > 0 && (
            <MovieRow
              title="Currently Airing"
              movies={onTheAirTVShows as never[]}
              onMovieClick={handleMovieSelect as never}
            />
          )}

          {airingTodayTVShows.length > 0 && (
            <MovieRow
              title="Airing Today"
              movies={airingTodayTVShows as never[]}
              onMovieClick={handleMovieSelect as never}
            />
          )}

          {dramaTVShows.length > 0 && (
            <MovieRow
              title="Drama Series"
              movies={dramaTVShows as never[]}
              onMovieClick={handleMovieSelect as never}
            />
          )}

          {actionTVShows.length > 0 && (
            <MovieRow
              title="Action & Adventure"
              movies={actionTVShows as never[]}
              onMovieClick={handleMovieSelect as never}
            />
          )}

          {comedyTVShows.length > 0 && (
            <MovieRow
              title="Comedy Shows"
              movies={comedyTVShows as never[]}
              onMovieClick={handleMovieSelect as never}
            />
          )}

          {crimeTVShows.length > 0 && (
            <MovieRow
              title="Crime & Mystery"
              movies={crimeTVShows as never[]}
              onMovieClick={handleMovieSelect as never}
            />
          )}

          {documentaryTVShows.length > 0 && (
            <MovieRow
              title="Documentaries"
              movies={documentaryTVShows as never[]}
              onMovieClick={handleMovieSelect as never}
            />
          )}

          {animationTVShows.length > 0 && (
            <MovieRow
              title="Animated Series"
              movies={animationTVShows as never[]}
              onMovieClick={handleMovieSelect as never}
            />
          )}
        </div>

        {/* Movie Details Modal - Temporarily disabled */}
        {false && selectedMovie && (
          <MovieDetails
            movie={selectedMovie as never}
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