'use client'

import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ChevronRight as ArrowRight } from 'lucide-react'
import MovieCard from './MovieCard'
import { Movie } from '@/lib/tmdb'
import Link from 'next/link'

interface MovieRowProps {
  title: string
  movies: Movie[]
  categorySlug?: string
  onMoviePlay?: (movie: Movie) => void
  onMovieClick?: (movie: Movie) => void
}

export default function MovieRow({ title, movies, categorySlug, onMoviePlay, onMovieClick }: MovieRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [displayMovies, setDisplayMovies] = useState<Movie[]>(movies)

  // Handle My List special case
  useEffect(() => {
    if (categorySlug === 'my-list') {
      try {
        const savedMovies = localStorage.getItem('myList')
        if (savedMovies) {
          const myListMovies = JSON.parse(savedMovies)
          setDisplayMovies(myListMovies.slice(0, 10)) // Show only first 10 for the row
        } else {
          setDisplayMovies([])
        }
      } catch (error) {
        console.error('Error loading My List:', error)
        setDisplayMovies([])
      }
    } else {
      setDisplayMovies(movies)
    }
  }, [movies, categorySlug])

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

  // Special handling for My List - show even if empty to indicate the feature exists
  if (!displayMovies.length && categorySlug !== 'my-list') return null

  return (
    <div className="mb-12 group">
      {/* Row Title */}
      <div 
        className="flex items-center justify-between mb-6"
        style={{ 
          paddingLeft: 'clamp(1.5rem, 4vw, 3rem)', 
          paddingRight: 'clamp(1.5rem, 4vw, 3rem)' 
        }}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-sm">
          {title}
        </h2>
{categorySlug && (
          <Link
            href={categorySlug === 'my-list' ? '/my-list' : `/category/${categorySlug}`}
            className="flex items-center gap-1 text-white/70 hover:text-white transition-colors group text-sm md:text-base"
          >
            <span>See all</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>

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
{displayMovies.length > 0 ? displayMovies.map((movie) => (
            <div
              key={movie.id}
              className="flex-shrink-0 w-48 md:w-56 lg:w-64 snap-start"
            >
              <MovieCard movie={movie} onPlay={onMoviePlay} onClick={onMovieClick} />
            </div>
          )) : categorySlug === 'my-list' && (
            <div className="flex-shrink-0 w-48 md:w-56 lg:w-64 snap-start">
              <div className="bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-lg h-72 flex flex-col items-center justify-center text-center p-4">
                <svg className="w-12 h-12 text-gray-500 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                </svg>
                <p className="text-white/60 text-sm">Your list is empty</p>
                <p className="text-white/40 text-xs mt-2">Add movies you love!</p>
              </div>
            </div>
          )}
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