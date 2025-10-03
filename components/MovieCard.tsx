'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Movie, getImageUrl, getAgeRating, getYear } from '@/lib/tmdb'
import { Play } from 'lucide-react'

interface MovieCardProps {
  movie: Movie
  onPlay?: (movie: Movie) => void
}

export default function MovieCard({ movie, onPlay }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleClick = () => {
    console.log('Movie clicked:', movie.title) // Debug log
    if (onPlay) {
      onPlay(movie)
    } else {
      // Default behavior - show alert with movie details
      alert(`🎬 Playing: ${movie.title}\n\nRating: ${movie.vote_average.toFixed(1)}/10\nRelease: ${getYear(movie.release_date)}`)
    }
  }

  return (
    <div
      className="relative group cursor-pointer transition-all duration-300 hover:scale-105 hover:z-20 p-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-gray-800 shadow-lg hover:shadow-2xl transition-shadow duration-300">
        {/* Movie Poster */}
        <Image
          src={getImageUrl(movie.poster_path, 'w500')}
          alt={movie.title}
          fill
          className={`object-cover object-center transition-opacity duration-300 ${
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

        {/* Hover Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`flex items-center justify-center w-20 h-20 bg-white/40 backdrop-blur-md rounded-full border-2 border-white/70 transition-all duration-300 shadow-xl ${
                isHovered
                  ? 'scale-100 opacity-100 hover:bg-white/60 hover:scale-110 active:scale-95'
                  : 'scale-75 opacity-0'
              }`}
            >
              <Play className="w-10 h-10 text-white ml-1" fill="white" />
            </div>
          </div>

          {/* Movie Info Overlay */}
          <div
            className={`absolute bottom-0 left-0 right-0 p-5 transition-all duration-300 ${
              isHovered
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0'
            }`}
          >
            <h3 className="text-white font-bold text-lg mb-3 line-clamp-2 drop-shadow-md">
              {movie.title}
            </h3>
            
            <div className="flex items-center gap-3 text-sm text-white/90 mb-2">
              <span className="bg-red-600 px-3 py-1 rounded-md text-xs font-bold shadow-sm">
                {getAgeRating(movie.adult)}
              </span>
              <span className="font-medium">{getYear(movie.release_date)}</span>
              <div className="flex items-center gap-1">
                <span className="text-yellow-400 text-base">★</span>
                <span className="font-medium">{movie.vote_average.toFixed(1)}</span>
              </div>
            </div>
            
            {movie.overview && (
              <p className="text-white/80 text-sm mt-3 line-clamp-2 leading-relaxed">
                {movie.overview}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Extended hover card (Netflix-style) */}
      {isHovered && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute -top-2 -left-2 -right-2 -bottom-2 bg-zinc-900 rounded-lg shadow-2xl border border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-500 pointer-events-auto z-30">
            <div className="p-3">
              <div className="aspect-video relative mb-3 rounded overflow-hidden">
                <Image
                  src={getImageUrl(movie.backdrop_path || movie.poster_path, 'w780')}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  sizes="300px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <h4 className="text-white font-bold text-sm mb-1 line-clamp-1">
                    {movie.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-white/80">
                    <span className="bg-red-600 px-1.5 py-0.5 rounded">
                      {getAgeRating(movie.adult)}
                    </span>
                    <span>{getYear(movie.release_date)}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span>{movie.vote_average.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}