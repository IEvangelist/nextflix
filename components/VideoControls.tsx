'use client'

import { RefObject, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react'
import { useMouseIdle } from '@/lib/hooks'

interface VideoControlsProps {
  iframeRef: RefObject<HTMLIFrameElement | null>
  containerRef?: RefObject<HTMLElement | null>
  isPlaying: boolean
  isMuted: boolean
  videoEnded?: boolean
  onPlayToggle: () => void
  onMuteToggle: () => void
  onRestart: () => void
  className?: string
  size?: 'small' | 'medium' | 'large'
  showLabels?: boolean
}

export default function VideoControls({
  iframeRef,
  containerRef,
  isPlaying,
  isMuted,
  videoEnded = false,
  onPlayToggle,
  onMuteToggle,
  onRestart,
  className = '',
  size = 'medium',
  showLabels = true,
}: VideoControlsProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // Mouse idle detection for fullscreen overlay
  const isMouseIdle = useMouseIdle(3000)
  
  // Monitor fullscreen changes
  useEffect(() => {
    setMounted(true)
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const handleFullscreenToggle = () => {
    const targetElement = containerRef?.current || iframeRef.current
    if (!targetElement) return

    if (!document.fullscreenElement) {
      // Enter fullscreen for the container or iframe
      targetElement.requestFullscreen().then(() => {
        setIsFullscreen(true)
      }).catch(err => {
        console.log('Failed to enter video fullscreen:', err)
        // Fallback to iframe if container fails
        if (containerRef?.current && iframeRef.current) {
          iframeRef.current.requestFullscreen().catch(fallbackErr => {
            console.log('Fallback fullscreen also failed:', fallbackErr)
          })
        }
      })
    } else {
      // Exit fullscreen
      document.exitFullscreen().then(() => {
        setIsFullscreen(false)
      }).catch(err => {
        console.log('Failed to exit video fullscreen:', err)
      })
    }
  }
  
  const sizeClasses = {
    small: 'w-10 h-10',
    medium: 'w-14 h-14', 
    large: 'w-16 h-16'
  }

  const iconSizes = {
    small: 'w-5 h-5',
    medium: 'w-7 h-7',
    large: 'w-8 h-8'
  }

  const buttonClass = `${sizeClasses[size]} bg-black/80 backdrop-blur-md border-2 border-white/30 rounded-full flex items-center justify-center text-white hover:bg-black hover:border-white/50 active:bg-black active:border-white/50 active:scale-95 transition-all duration-200 shadow-lg hover:scale-110 cursor-pointer touch-manipulation select-none`

  // Controls content
  const controlsContent = (
    <div className={`flex items-center gap-3 z-50 ${isFullscreen ? '' : className}`}>
      {/* Play/Pause/Restart Button - Smart functionality */}
      <button
        onClick={videoEnded ? onRestart : (isPlaying ? onPlayToggle : onPlayToggle)}
        onTouchEnd={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (videoEnded) {
            onRestart();
          } else {
            onPlayToggle();
          }
        }}
        className={buttonClass}
        title={videoEnded ? 'Restart Video' : (isPlaying ? 'Pause' : 'Play')}
        aria-label={videoEnded ? 'Restart video' : (isPlaying ? 'Pause video' : 'Play video')}
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        {videoEnded ? (
          <RotateCcw className={`${iconSizes[size]}`} />
        ) : isPlaying ? (
          <Pause className={`${iconSizes[size]}`} fill="white" />
        ) : (
          <Play className={`${iconSizes[size]}`} fill="white" />
        )}
      </button>

      {/* Mute/Unmute Button */}
      <button
        onClick={onMuteToggle}
        onTouchEnd={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onMuteToggle();
        }}
        className={buttonClass}
        title={isMuted ? 'Unmute' : 'Mute'}
        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        {isMuted ? (
          <VolumeX className={`${iconSizes[size]}`} />
        ) : (
          <Volume2 className={`${iconSizes[size]}`} />
        )}
      </button>

      {/* Fullscreen Toggle Button */}
      <button
        onClick={handleFullscreenToggle}
        onTouchEnd={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleFullscreenToggle();
        }}
        className={buttonClass}
        title={isFullscreen ? 'Exit Video Fullscreen' : 'Enter Video Fullscreen'}
        aria-label={isFullscreen ? 'Exit video fullscreen mode' : 'Enter video fullscreen mode'}
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        {isFullscreen ? (
          <Minimize className={`${iconSizes[size]}`} />
        ) : (
          <Maximize className={`${iconSizes[size]}`} />
        )}
      </button>
    </div>
  )

  // In fullscreen mode, render as overlay with portal
  if (isFullscreen && mounted && typeof window !== 'undefined') {
    const fullscreenElement = document.fullscreenElement
    const portalRoot = fullscreenElement || document.body
    
    return createPortal(
      <div 
        className={`fixed inset-0 pointer-events-none transition-opacity duration-500 ${
          isMouseIdle && isPlaying && !videoEnded ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ 
          zIndex: 2147483647, // Maximum z-index value
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%'
        }}
      >
        <div 
          className="absolute bottom-10 right-10 pointer-events-auto"
          style={{ 
            zIndex: 2147483647,
            position: 'absolute'
          }}
        >
          {controlsContent}
        </div>
      </div>,
      portalRoot
    )
  }

  // Normal mode - return regular controls
  return controlsContent
}