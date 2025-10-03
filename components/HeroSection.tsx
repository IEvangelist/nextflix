'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react'
import { Movie, MovieVideo, getImageUrl, getAgeRating, getYear, getTrailerUrl } from '@/lib/tmdb'

interface HeroSectionProps {
  movie: Movie
  videos: MovieVideo[]
}

export default function HeroSection({ movie, videos }: HeroSectionProps) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [showImage, setShowImage] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const trailerUrl = getTrailerUrl(videos)

  // Auto-hide image overlay after a delay when trailer starts
  useEffect(() => {
    if (trailerUrl && isPlaying) {
      const timer = setTimeout(() => {
        setShowImage(false)
      }, 3000)
      return () => clearTimeout(timer)
    } else {
      setShowImage(true)
    }
  }, [trailerUrl, isPlaying])

  const handlePlay = () => {
    if (iframeRef.current && trailerUrl) {
      const iframe = iframeRef.current
      if (isPlaying) {
        // Pause video by sending pause command
        iframe.src = iframe.src.replace('autoplay=1', 'autoplay=0')
        setIsPlaying(false)
      } else {
        // Resume video by sending play command
        iframe.src = iframe.src.replace('autoplay=0', 'autoplay=1')
        setIsPlaying(true)
      }
    }
  }

  const handleMute = () => {
    if (iframeRef.current && trailerUrl) {
      const iframe = iframeRef.current
      if (isMuted) {
        iframe.src = iframe.src.replace('mute=1', 'mute=0')
        setIsMuted(false)
      } else {
        iframe.src = iframe.src.replace('mute=0', 'mute=1')
        setIsMuted(true)
      }
    }
  }

  const handleReset = () => {
    if (iframeRef.current && trailerUrl) {
      const currentSrc = iframeRef.current.src
      iframeRef.current.src = ''
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = currentSrc
          setIsPlaying(true)
          setShowImage(false)
        }
      }, 100)
    }
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Video or Image */}
      <div className="absolute inset-0 w-full h-full">
        {trailerUrl ? (
          <>
            {/* Video Background */}
            <iframe
              ref={iframeRef}
              src={`${trailerUrl}&playlist=${videos.find(v => v.type === 'Trailer' && v.site === 'YouTube')?.key}`}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              style={{
                transform: 'scale(1.2)',
                width: '120%',
                height: '120%',
                left: '-10%',
                top: '-10%',
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen={false}
              title={`${movie.title} Trailer`}
            />
            
            {/* Image overlay for smooth loading */}
            <div
              className={`absolute inset-0 transition-opacity duration-1000 ${
                showImage ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={getImageUrl(movie.backdrop_path, 'original')}
                alt={movie.title}
                fill
                className="object-cover"
                priority
                quality={100}
              />
            </div>
          </>
        ) : (
          /* Fallback to backdrop image if no trailer */
          <Image
            src={getImageUrl(movie.backdrop_path, 'original')}
            alt={movie.title}
            fill
            className="object-cover"
            priority
            quality={100}
          />
        )}
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

      {/* Content */}
      <div className="relative z-10 flex items-center h-full">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            {/* Movie Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-lg">
              {movie.title}
            </h1>

            {/* Movie Meta Info */}
            <div className="flex items-center gap-4 mb-6 text-white/90">
              <span className="bg-red-600 px-3 py-1 rounded font-semibold">
                {getAgeRating(movie.adult)}
              </span>
              <span className="text-lg font-medium">{getYear(movie.release_date)}</span>
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-xl">★</span>
                <span className="text-lg font-medium">{movie.vote_average.toFixed(1)}</span>
              </div>
            </div>

            {/* Movie Overview */}
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-xl">
              {movie.overview}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Main Play Button */}
              <button className="flex items-center justify-center gap-4 bg-white text-black px-12 py-5 rounded-lg font-bold text-xl hover:bg-white/90 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 min-w-[180px]">
                <Play className="w-8 h-8 fill-current" />
                Play
              </button>

              {/* More Info Button */}
              <button className="flex items-center justify-center gap-4 bg-gray-500/80 backdrop-blur-sm text-white px-12 py-5 rounded-lg font-bold text-xl hover:bg-gray-500 transition-all duration-200 shadow-xl hover:shadow-2xl min-w-[200px]">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                More Info
              </button>
            </div>
          </div>
        </div>

        {/* Video Controls */}
        {trailerUrl && (
          <div className="absolute bottom-10 right-10 flex items-center gap-5">
            {/* Play/Pause Button */}
            <button
              onClick={handlePlay}
              className="flex items-center justify-center w-16 h-16 bg-black/70 backdrop-blur-md border-2 border-white/50 rounded-full text-white hover:bg-black/90 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-110"
              title={isPlaying ? 'Pause' : 'Play'}
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" fill="white" />
              ) : (
                <Play className="w-8 h-8" fill="white" />
              )}
            </button>

            {/* Mute/Unmute Button */}
            <button
              onClick={handleMute}
              className="flex items-center justify-center w-16 h-16 bg-black/70 backdrop-blur-md border-2 border-white/50 rounded-full text-white hover:bg-black/90 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-110"
              title={isMuted ? 'Unmute' : 'Mute'}
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            >
              {isMuted ? (
                <VolumeX className="w-8 h-8" />
              ) : (
                <Volume2 className="w-8 h-8" />
              )}
            </button>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="flex items-center justify-center w-16 h-16 bg-black/70 backdrop-blur-md border-2 border-white/50 rounded-full text-white hover:bg-black/90 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-110"
              title="Restart"
              aria-label="Restart video"
            >
              <RotateCcw className="w-8 h-8" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}