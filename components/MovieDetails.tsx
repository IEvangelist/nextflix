'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { X, Play, Pause, Plus, ThumbsUp, ThumbsDown, Volume2, VolumeX, RotateCcw } from 'lucide-react'
import { Movie, MovieVideo, getImageUrl, getAgeRating, getYear, getMovieDetails, getMovieVideos } from '@/lib/tmdb'
import type { MovieDetails as TMDBMovieDetails } from '@/lib/tmdb'
import VideoControls from './VideoControls'

interface MovieDetailsProps {
  movie: Movie
  isOpen: boolean
  onClose: () => void
}

export default function MovieDetails({ movie, isOpen, onClose }: MovieDetailsProps) {
  const [movieDetails, setMovieDetails] = useState<TMDBMovieDetails | null>(null)
  const [videos, setVideos] = useState<MovieVideo[]>([])
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [videoEnded, setVideoEnded] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)

  // Like/dislike/list state
  const [inList, setInList] = useState(false)
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)

  useEffect(() => {
    if (isOpen && movie.id) {
      Promise.all([
        getMovieDetails(movie.id),
        getMovieVideos(movie.id)
      ]).then(([details, videoResults]) => {
        if (details) setMovieDetails(details)
        setVideos(videoResults)
      }).catch(() => {
        // Handle error silently
      })
    }
  }, [isOpen, movie.id])

  // Load preferences from localStorage on open
  useEffect(() => {
    if (!isOpen) return
    const prefs = localStorage.getItem(`movie-prefs-${movie.id}`)
    if (prefs) {
      const { inList, liked, disliked } = JSON.parse(prefs)
      setInList(!!inList)
      setLiked(!!liked)
      setDisliked(!!disliked)
    } else {
      setInList(false)
      setLiked(false)
      setDisliked(false)
    }
  }, [isOpen, movie.id])

  // Persist preferences to localStorage
  // useEffect(() => {
  //   if (!isOpen) return
  //   localStorage.setItem(
  //     `movie-prefs-${movie.id}`,
  //     JSON.stringify({ inList, liked, disliked })
  //   )
  // }, [inList, liked, disliked, isOpen, movie.id])

  const trailer = videos.find(video => video.type === 'Trailer' && video.site === 'YouTube')
  
  // Create stable trailer URL (always starts muted to prevent hydration mismatch)
  const baseTrailerUrl = trailer 
    ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1`
    : null

  // YouTube Player API integration for player state detection
  useEffect(() => {
    if (!trailer || typeof window === 'undefined') return

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.youtube.com') return
      
      try {
        const data = JSON.parse(event.data)
        // Handle YouTube player state changes
        if (data.event === 'video-progress' || data.info) {
          // Video ended (state 0)
          if (data.info === 0) {
            setVideoEnded(true)
            setIsPlaying(false)
          }
          // Video playing (state 1)
          else if (data.info === 1) {
            setVideoEnded(false)
            setIsPlaying(true)
          }
          // Video paused (state 2)
          else if (data.info === 2) {
            setIsPlaying(false)
          }
        }
      } catch {
        // Ignore parsing errors
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [trailer])

  const handlePlay = () => {
    if (iframeRef.current && baseTrailerUrl) {
      try {
        // Use postMessage API to control YouTube player
        const command = isPlaying ? 'pauseVideo' : 'playVideo'
        iframeRef.current.contentWindow?.postMessage(`{"event":"command","func":"${command}","args":""}`, '*')
        setIsPlaying(!isPlaying)
      } catch (error) {
        console.log('Player control failed, using fallback:', error)
        // Fallback: Toggle autoplay parameter
        const currentSrc = iframeRef.current.src
        if (isPlaying) {
          iframeRef.current.src = currentSrc.replace('autoplay=1', 'autoplay=0')
        } else {
          iframeRef.current.src = currentSrc.replace('autoplay=0', 'autoplay=1')
        }
        setIsPlaying(!isPlaying)
      }
    }
  }

  const handleMute = () => {
    if (iframeRef.current && baseTrailerUrl) {
      try {
        // Use postMessage API to control YouTube player volume
        const command = isMuted ? 'unMute' : 'mute'
        iframeRef.current.contentWindow?.postMessage(`{"event":"command","func":"${command}","args":""}`, '*')
        setIsMuted(!isMuted)
      } catch (error) {
        console.log('Mute control failed, using fallback:', error)
        // Fallback: Toggle mute parameter by reloading iframe
        const currentSrc = iframeRef.current.src
        if (isMuted) {
          iframeRef.current.src = currentSrc.replace('mute=1', 'mute=0')
        } else {
          iframeRef.current.src = currentSrc.replace('mute=0', 'mute=1')
        }
        setIsMuted(!isMuted)
      }
    }
  }

  const handleReset = () => {
    if (iframeRef.current && baseTrailerUrl) {
      const currentSrc = iframeRef.current.src
      iframeRef.current.src = ''
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = currentSrc
          setIsPlaying(true)
          setVideoEnded(false)
        }
      }, 100)
    }
  }

  // Button handlers
  const handleListToggle = () => {
    setInList((prev) => {
      const next = !prev
      localStorage.setItem(
        `movie-prefs-${movie.id}`,
        JSON.stringify({ inList: next, liked, disliked })
      )
      return next
    })
  }
  const handleLike = () => {
    setLiked((prev) => {
      const next = !prev
      localStorage.setItem(
        `movie-prefs-${movie.id}`,
        JSON.stringify({ inList, liked: next, disliked: next ? false : disliked })
      )
      return next
    })
    setDisliked(false)
  }
  const handleDislike = () => {
    setDisliked((prev) => {
      const next = !prev
      localStorage.setItem(
        `movie-prefs-${movie.id}`,
        JSON.stringify({ inList, liked: next ? false : liked, disliked: next })
      )
      return next
    })
    setLiked(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4">
      <div className="bg-zinc-900 rounded-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto relative mx-4 md:mx-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-6 right-6 z-30 w-12 h-12 bg-black/80 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black border-2 border-white/30 hover:border-white/50 transition-all duration-200 shadow-lg"
        >
          <X className="w-7 h-7" />
        </button>

        {/* Video/Image Section */}
        <div ref={videoContainerRef} className="relative aspect-video bg-black rounded-t-xl overflow-hidden">
          {baseTrailerUrl ? (
            <>
              <iframe
                ref={iframeRef}
                src={baseTrailerUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen={false}
                title={`${movie.title || (movie as any).name || 'Video'} Trailer`}
              />
              
              {/* Video Controls */}
              {!document.fullscreenElement && (
                <VideoControls
                  iframeRef={iframeRef}
                  containerRef={videoContainerRef}
                  isPlaying={isPlaying}
                  isMuted={isMuted}
                  videoEnded={videoEnded}
                  onPlayToggle={handlePlay}
                  onMuteToggle={handleMute}
                  onRestart={handleReset}
                  size="medium"
                  className="absolute bottom-6 right-6"
                />
              )}
            </>
          ) : (
            <Image
              src={getImageUrl(movie.backdrop_path || movie.poster_path, 'original')}
              alt={movie.title || (movie as any).name || 'Movie poster'}
              fill
              className="object-cover"
            />
          )}

          {/* Gradient Overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />
        </div>

        {/* Content Section */}
          <div 
            className="p-4 md:p-8" 
            style={{ 
              padding: 'clamp(1rem, 3vw, 2rem)', 
              paddingTop: '0',
              paddingBottom: 'clamp(1rem, 2vw, 1.5rem)'
            }}
          >
          {/* Title and Meta */}
            <div className="mb-6" style={{ marginBottom: 'clamp(1rem, 2vw, 1.25rem)' }}>
            <h1 
                className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight"
                style={{ marginBottom: 'clamp(0.75rem, 2vw, 1rem)' }}
            >
              {movie.title || (movie as any).name || 'Unknown Title'}
            </h1>
            
            <div 
                className="flex pb-4 items-center gap-2 md:gap-4 text-sm md:text-base text-white mb-4 flex-wrap"
                style={{ marginBottom: 'clamp(0.75rem, 2vw, 1rem)', gap: 'clamp(0.5rem, 1vw, 1rem)' }}
            >
              <span className="bg-red-600 px-3 md:px-4 py-1 md:py-2 rounded font-bold text-sm">
                {getAgeRating(movie.adult)}
              </span>
              {(movie.release_date || (movie as any).first_air_date) && (
                <span className="text-white">
                  {getYear(movie.release_date || (movie as any).first_air_date)}
                </span>
              )}
              {movieDetails?.runtime && (
                <span className="text-white">{Math.floor(movieDetails.runtime / 60)}h {movieDetails.runtime % 60}m</span>
              )}
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">★</span>
                <span className="text-white">{movie.vote_average.toFixed(1)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div 
                className="flex items-center gap-3 md:gap-4 mb-6"
                style={{ marginBottom: 'clamp(1rem, 2vw, 1.25rem)', gap: 'clamp(0.75rem, 2vw, 1rem)' }}
            >
              <button
                className={`cursor-pointer w-12 h-12 md:w-14 md:h-14 border-2 rounded-full flex items-center justify-center transition-all duration-500 ${
                  inList
                    ? 'bg-white text-zinc-900 border-white animate-spin-once'
                    : 'text-white border-white/30 hover:border-white/60 hover:bg-white/10'
                }`}
                onClick={handleListToggle}
                title={inList ? 'Added to My List' : 'Add to My List'}
              >
                {inList ? (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <Plus className="w-6 h-6 md:w-7 md:h-7" />
                )}
              </button>
              <button
                className={`cursor-pointer w-12 h-12 md:w-14 md:h-14 border-2 rounded-full flex items-center justify-center transition-all duration-200 ${
                  liked
                    ? 'bg-white text-zinc-900 border-white shadow-lg'
                    : 'text-white border-white/30 hover:border-white/60 hover:bg-white/10'
                }`}
                onClick={handleLike}
                title={liked ? 'Liked' : 'Like'}
                disabled={disliked}
              >
                <ThumbsUp className={`w-6 h-6 md:w-7 md:h-7 ${liked ? 'text-zinc-900' : ''}`} />
              </button>
              <button
                className={`cursor-pointer w-12 h-12 md:w-14 md:h-14 border-2 rounded-full flex items-center justify-center transition-all duration-200 ${
                  disliked
                    ? 'bg-white text-zinc-900 border-white shadow-lg'
                    : 'text-white border-white/30 hover:border-white/60 hover:bg-white/10'
                }`}
                onClick={handleDislike}
                title={disliked ? 'Disliked' : 'Dislike'}
                disabled={liked}
              >
                <ThumbsDown className={`w-6 h-6 md:w-7 md:h-7 ${disliked ? 'text-zinc-900' : ''}`} />
              </button>
            </div>
          </div>

          {/* Description */}
          <div 
              className="grid md:grid-cols-3 gap-6 md:gap-8"
              style={{ gap: 'clamp(1rem, 3vw, 2rem)' }}
          >
            <div className="md:col-span-2">
              <p className="text-white/90 text-lg md:text-xl leading-relaxed mb-8">
                {movie.overview}
              </p>
            </div>

            {/* Details */}
            <div className="space-y-4 md:space-y-5 text-base">
              {movieDetails?.genres && (
                <div>
                  <span className="text-white/60">Genres: </span>
                  <span className="text-white">
                    {movieDetails.genres.map(genre => genre.name).join(', ')}
                  </span>
                </div>
              )}
              
              {(movie.release_date || (movie as any).first_air_date) && (
                <div>
                  <span className="text-white/60">{movie.release_date ? 'Release Date:' : 'First Air Date:'} </span>
                  <span className="text-white">
                    {new Date(movie.release_date || (movie as any).first_air_date).toLocaleDateString()}
                  </span>
                </div>
              )}

              {movieDetails?.production_companies && movieDetails.production_companies.length > 0 && (
                <div>
                  <span className="text-white/60">Production: </span>
                  <span className="text-white">
                    {movieDetails.production_companies.slice(0, 3).map(company => company.name).join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* Add this to your CSS or global styles for the spin animation: */
/*
@keyframes spin-once {
  0% { transform: rotate(0deg); }
  70% { transform: rotate(360deg); }
  100% { transform: rotate(360deg); }
}
.animate-spin-once {
  animation: spin-once 0.7s cubic-bezier(.68,-0.55,.27,1.55) 1;
}
*/