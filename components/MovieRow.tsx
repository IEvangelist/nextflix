'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import MovieCard from './MovieCard'
import { Movie } from '@/lib/tmdb'

interface MovieRowProps {
  title: string
  movies: Movie[]
  onMoviePlay?: (movie: Movie) => void
}

export default function MovieRow({ title, movies, onMoviePlay }: MovieRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -800,
        behavior: 'smooth'
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 800,
        behavior: 'smooth'
      })
    }
  }

  if (!movies.length) return null

  return (
    <div className="mb-8 group">
      {/* Row Title */}
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 px-6 lg:px-8 drop-shadow-sm">
        {title}
      </h2>

      {/* Movies Container */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-black/70 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:bg-black/90 hover:scale-110 transition-all duration-300 shadow-lg"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-black/70 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:bg-black/90 hover:scale-110 transition-all duration-300 shadow-lg"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-7 h-7" />
        </button>

        {/* Scrollable Movies Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-6 lg:px-8 pb-4 scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="flex-shrink-0 w-48 md:w-56 lg:w-64"
            >
              <MovieCard movie={movie} onPlay={onMoviePlay} />
            </div>
          ))}
        </div>
      </div>

      {/* Custom CSS for hiding scrollbar */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}