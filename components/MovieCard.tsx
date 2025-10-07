'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Movie, getImageUrl, getAgeRating, getYear } from '@/lib/tmdb'
import { Play, Plus, Heart } from 'lucide-react'

interface MovieCardProps {
  movie: Movie
  onPlay?: (movie: Movie) => void
  onClick?: (movie: Movie) => void
}

export default function MovieCard({ movie, onPlay, onClick }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isInMyList, setIsInMyList] = useState(false)

  // Check if movie is in My List on mount
  useEffect(() => {
    try {
      const savedMovies = localStorage.getItem('myList')
      if (savedMovies) {
        const myList = JSON.parse(savedMovies)
        setIsInMyList(myList.some((m: Movie) => m.id === movie.id))
      }
    } catch (error) {
      console.error('Error checking My List status:', error)
    }
  }, [movie.id])

  const toggleMyList = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the main click handler
    
    try {
      const savedMovies = localStorage.getItem('myList')
      let myList: Movie[] = savedMovies ? JSON.parse(savedMovies) : []
      
      if (isInMyList) {
        // Remove from list
        myList = myList.filter(m => m.id !== movie.id)
      } else {
        // Add to list
        myList.unshift(movie) // Add to beginning
      }
      
      localStorage.setItem('myList', JSON.stringify(myList))
      setIsInMyList(!isInMyList)
    } catch (error) {
      console.error('Error updating My List:', error)
    }
  }

  const handleClick = () => {
    console.log('Movie clicked:', movie.title) // Debug log
    if (onClick) {
      onClick(movie)
    } else if (onPlay) {
      onPlay(movie)
    } else {
      // Default behavior - show alert with movie details
      alert(`🎬 Playing: ${movie.title}\n\nRating: ${movie.vote_average.toFixed(1)}/10\nRelease: ${getYear(movie.release_date)}`)
    }
  }

  return (
    <div
      className="relative cursor-pointer transition-all duration-300 hover:scale-105 hover:z-10 p-2 md:p-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Movie Card Container - Background image remains static, only overlay changes */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-gray-800 shadow-lg hover:shadow-2xl transition-shadow duration-300">
        {/* Movie Poster - Static Image */}
        <Image
          src={getImageUrl(movie.poster_path, 'w500')}
          alt={movie.title}
          fill
          className={`object-cover object-center transition-opacity duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={false}
        />

        {/* Loading placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Hover Overlay - Shows info without changing background image */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent transition-all duration-300 ease-in-out ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* My List Button - Top Right */}
          <div
            className={`absolute top-3 right-3 transition-all duration-300 ease-out ${
              isHovered ? 'scale-100 opacity-100' : 'scale-80 opacity-0'
            }`}
          >
            <button
              onClick={toggleMyList}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 shadow-lg ${
                isInMyList
                  ? 'bg-red-600 border-red-600 text-white hover:bg-red-700'
                  : 'bg-black/50 border-white/70 text-white hover:bg-white/20'
              }`}
              title={isInMyList ? 'Remove from My List' : 'Add to My List'}
            >
              {isInMyList ? (
                <Heart className="w-4 h-4 fill-current" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Play Button - Centered overlay element */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`flex items-center justify-center w-20 h-20 bg-white/40 backdrop-blur-md rounded-full border-2 border-white/70 transition-all duration-300 ease-out shadow-xl ${
                isHovered
                  ? 'scale-100 opacity-100 hover:bg-white/60 hover:scale-110 active:scale-95'
                  : 'scale-80 opacity-0'
              }`}
            >
              <Play className="w-10 h-10 text-white ml-1" fill="white" />
            </div>
          </div>

          {/* Movie Info Overlay - Safe area calculation for rounded corners */}
          <div
            className={`absolute left-0 right-0 transition-all duration-300 ease-out ${
              isHovered
                ? 'translate-y-0 opacity-100'
                : 'translate-y-2 opacity-0'
            }`}
            style={{
              bottom: '12px', // Safe distance from bottom rounded corner
              paddingLeft: '16px', // Safe distance from left rounded corner  
              paddingRight: '16px', // Safe distance from right rounded corner
            }}
          >
            <h3 className="text-white font-bold text-sm mb-2 line-clamp-1 drop-shadow-lg">
              {movie.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-white/90 flex-wrap">
              <span className="bg-red-600 px-2 py-0.5 rounded text-xs font-bold shadow-sm">
                {getAgeRating(movie.adult)}
              </span>
              <span className="font-medium">{getYear(movie.release_date)}</span>
              <div className="flex items-center gap-1">
                <span className="text-yellow-400 text-xs">★</span>
                <span className="font-medium">{movie.vote_average.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}