'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import MovieCard from './MovieCard'
import { Movie } from '@/lib/tmdb'

interface MovieRowProps {
  title: string
  movies: Movie[]
  onMoviePlay?: (movie: Movie) => void
  onMovieClick?: (movie: Movie) => void
}

export default function MovieRow({ title, movies, onMoviePlay, onMovieClick }: MovieRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 256 // Approximate card width including gap
      const visibleCards = Math.floor(scrollContainerRef.current.clientWidth / cardWidth)
      const scrollDistance = cardWidth * Math.max(1, visibleCards - 1)
      
      scrollContainerRef.current.scrollBy({
        left: -scrollDistance,
        behavior: 'smooth'
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 256 // Approximate card width including gap
      const visibleCards = Math.floor(scrollContainerRef.current.clientWidth / cardWidth)
      const scrollDistance = cardWidth * Math.max(1, visibleCards - 1)
      
      scrollContainerRef.current.scrollBy({
        left: scrollDistance,
        behavior: 'smooth'
      })
    }
  }

  if (!movies.length) return null

  return (
    <div className="mb-12 group">
      {/* Row Title */}
      <h2 
        className="text-2xl md:text-3xl font-bold text-white mb-6 drop-shadow-sm"
        style={{ 
          paddingLeft: 'clamp(1.5rem, 4vw, 3rem)', 
          paddingRight: 'clamp(1.5rem, 4vw, 3rem)' 
        }}
      >
        {title}
      </h2>

      {/* Movies Container */}
      <div className="relative px-4 md:px-8">
        {/* Left Hover Zone */}
        <div className="absolute left-0 top-0 w-20 h-full z-20 pointer-events-none group-hover:pointer-events-auto" />
        
        {/* Right Hover Zone */}
        <div className="absolute right-0 top-0 w-20 h-full z-20 pointer-events-none group-hover:pointer-events-auto" />
        
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="cursor-pointer absolute left-2 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-16 md:h-16 bg-black/90 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:bg-black transition-all duration-200 shadow-2xl border border-white/30 pointer-events-auto"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-16 md:h-16 bg-black/90 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:bg-black transition-all duration-200 shadow-2xl border border-white/30 pointer-events-auto"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
        </button>

        {/* Scrollable Movies Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth snap-x snap-mandatory"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            paddingLeft: 'clamp(1.5rem, 4vw, 3rem)', 
            paddingRight: 'clamp(1.5rem, 4vw, 3rem)'
          }}
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="flex-shrink-0 w-48 md:w-56 lg:w-64 snap-start"
            >
              <MovieCard movie={movie} onPlay={onMoviePlay} onClick={onMovieClick} />
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