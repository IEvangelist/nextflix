'use client'

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import Image from 'next/image'
import { Play, Plus, Check } from 'lucide-react'
import { Movie, MovieVideo, getImageUrl, getAgeRating, getYear, getTrailerUrl } from '@/lib/tmdb'
import { useMouseIdle } from '@/lib/hooks'
import VideoControls from './VideoControls'

interface HeroSectionProps {
  movie: Movie
  videos: MovieVideo[]
}

const HeroSection = forwardRef<
  { pauseVideo: () => void; resumeVideo: () => void },
  HeroSectionProps
>(({ movie, videos }, ref) => {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [showImage, setShowImage] = useState(true)
  const [videoEnded, setVideoEnded] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)

  // Mouse idle detection - only when trailer is playing
  const trailerUrl = getTrailerUrl(videos)
  const isMouseIdle = useMouseIdle(3000) // 3 seconds idle time
  const shouldFadeOverlay = trailerUrl && isPlaying && isMouseIdle && !showImage

  // Expose pause/resume methods to parent
  useImperativeHandle(ref, () => ({
    pauseVideo: () => {
      if (iframeRef.current && trailerUrl) {
        try {
          iframeRef.current.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*')
          setIsPlaying(false)
        } catch (error) {
          console.log('Failed to pause hero video:', error)
        }
      }
    },
    resumeVideo: () => {
      if (iframeRef.current && trailerUrl && !isPlaying) {
        try {
          iframeRef.current.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*')
          setIsPlaying(true)
        } catch (error) {
          console.log('Failed to resume hero video:', error)
        }
      }
    }
  }), [trailerUrl, isPlaying])

  // Listen for YouTube Player API messages
  useEffect(() => {
    if (!trailerUrl) return

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
  }, [trailerUrl])

  const handlePlay = () => {
    if (iframeRef.current && trailerUrl) {
      const iframe = iframeRef.current
      try {
        // Use postMessage API to control YouTube player
        const command = isPlaying ? 'pauseVideo' : 'playVideo'
        iframe.contentWindow?.postMessage(`{"event":"command","func":"${command}","args":""}`, '*')
        setIsPlaying(!isPlaying)
      } catch (error) {
        console.log('Player control failed, using fallback:', error)
        // Fallback: Toggle URL parameters for basic control
        if (isPlaying) {
          const currentSrc = iframe.src
          iframe.src = currentSrc.replace('autoplay=1', 'autoplay=0')
        } else {
          const currentSrc = iframe.src
          iframe.src = currentSrc.replace('autoplay=0', 'autoplay=1')
        }
        setIsPlaying(!isPlaying)
      }
    }
  }

  const handleMute = () => {
    if (iframeRef.current && trailerUrl) {
      const iframe = iframeRef.current
      try {
        // Use postMessage API to control YouTube player volume
        const command = isMuted ? 'unMute' : 'mute'
        iframe.contentWindow?.postMessage(`{"event":"command","func":"${command}","args":""}`, '*')
        setIsMuted(!isMuted)
      } catch (error) {
        console.log('Mute control failed, using fallback:', error)
        // Fallback: Toggle mute parameter
        const currentSrc = iframe.src
        if (isMuted) {
          iframe.src = currentSrc.replace('mute=1', 'mute=0')
        } else {
          iframe.src = currentSrc.replace('mute=0', 'mute=1')
        }
        setIsMuted(!isMuted)
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
          setVideoEnded(false)
        }
      }, 100)
    }
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Video or Image */}
      <div ref={videoContainerRef} className="absolute inset-0 w-full h-full">
        {trailerUrl ? (
          /* Video Background */
          <iframe
            ref={iframeRef}
            src={`${trailerUrl}&enablejsapi=1&playlist=${videos.find(v => v.type === 'Trailer' && v.site === 'YouTube')?.key}`}
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
      <div 
        className={`relative z-10 flex items-center h-full transition-opacity duration-1000 ${
          shouldFadeOverlay ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ 
          paddingLeft: 'clamp(2rem, 8vw, 4rem)', 
          paddingRight: 'clamp(2rem, 5vw, 4rem)' 
        }}
      >
        <div className="w-full max-w-7xl">
          <div className="max-w-2xl">
            {/* Movie Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-lg pb-4">
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
              <AddToMyListButton movie={movie} />
            </div>

            {/* Movie Overview */}
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-xl pb-4">
              {movie.overview}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Main Play Button */}
              <button className="cursor-pointer flex items-center justify-center gap-4 bg-white/80 text-black px-12 py-5 rounded-lg font-bold text-xl hover:bg-white transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 min-w-[180px]">
                <Play className="w-8 h-8 fill-current" />
                Play
              </button>

              {/* More Info Button */}
              <button className="cursor-pointer flex items-center justify-center gap-4 bg-gray-500/60 backdrop-blur-sm text-white px-12 py-5 rounded-lg font-bold text-xl hover:bg-gray-500/80 transition-all duration-200 shadow-xl hover:shadow-2xl min-w-[200px]">
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
          <VideoControls
            iframeRef={iframeRef}
            containerRef={videoContainerRef}
            isPlaying={isPlaying}
            isMuted={isMuted}
            videoEnded={videoEnded}
            onPlayToggle={handlePlay}
            onMuteToggle={handleMute}
            onRestart={handleReset}
            size="large"
            className={`absolute bottom-10 right-10 transition-opacity duration-1000 ${
              shouldFadeOverlay ? 'opacity-0' : 'opacity-100'
            }`}
          />
        )}
      </div>
    </div>
  )
})

HeroSection.displayName = 'HeroSection'

// AddToMyListButton component
function AddToMyListButton({ movie }: { movie: Movie }) {
  const [isInList, setIsInList] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('myList');
      if (saved) {
        const list = JSON.parse(saved);
        setIsInList(list.some((m: Movie) => m.id === movie.id));
      }
    }
  }, [movie.id]);

  const handleToggle = () => {
    if (typeof window === 'undefined') return;
    setAnimating(true);
    setTimeout(() => {
      setAnimating(false);
    }, 250); // Faster animation duration
    const saved = localStorage.getItem('myList');
    let list: Movie[] = saved ? JSON.parse(saved) : [];
    if (isInList) {
      list = list.filter((m: Movie) => m.id !== movie.id);
    } else {
      list.push(movie);
    }
    localStorage.setItem('myList', JSON.stringify(list));
    setIsInList(!isInList);
  };

  if (!mounted) return null;

  return (
    <button
      className={`ml-4 flex items-center justify-center w-8 h-8 rounded-full border-2 border-white transition-all duration-150 shadow-lg z-20 relative ${
        animating ? 'animate-spin-fast' : ''
  } ${isInList ? 'bg-white' : 'bg-black/60'}`}
      title={isInList ? 'Remove from My List' : 'Add to My List'}
      onClick={handleToggle}
      style={{ outline: 'none' }}
    >
      {isInList ? (
        <Check className="w-5 h-5 text-black" />
      ) : (
        <Plus className="w-5 h-5 text-white" />
      )}
    </button>
  );
// Add fast spin animation to global styles if not present
}

export default HeroSection