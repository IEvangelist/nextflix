// Custom hooks for the Netflix clone application

import { useState, useEffect, useCallback } from 'react'

/**
 * Hook to detect mouse idle state
 * @param delay - Time in milliseconds before considering mouse as idle (default: 3000ms)
 * @returns {boolean} - True if mouse is idle, false otherwise
 */
export function useMouseIdle(delay: number = 3000): boolean {
  const [isIdle, setIsIdle] = useState(false)

  const resetIdleTimer = useCallback(() => {
    setIsIdle(false)
  }, [])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleMouseMove = () => {
      if (process.env.NODE_ENV === 'development') {
        console.debug('Mouse moved - resetting idle timer')
      }
      setIsIdle(false)
      clearTimeout(timeoutId)
      
      timeoutId = setTimeout(() => {
        if (process.env.NODE_ENV === 'development') {
          console.debug('Mouse idle detected')
        }
        setIsIdle(true)
      }, delay)
    }

    const handleMouseLeave = () => {
      if (process.env.NODE_ENV === 'development') {
        console.debug('Mouse left window - setting idle state')
      }
      clearTimeout(timeoutId)
      // Set to idle when mouse leaves the window
      setIsIdle(true)
    }

    const handleMouseEnter = () => {
      if (process.env.NODE_ENV === 'development') {
        console.debug('Mouse entered window - resetting idle state')
      }
      setIsIdle(false)
      clearTimeout(timeoutId)
      
      timeoutId = setTimeout(() => {
        if (process.env.NODE_ENV === 'development') {
          console.debug('Mouse idle detected after entering')
        }
        setIsIdle(true)
      }, delay)
    }

    // Start the idle timer immediately
    timeoutId = setTimeout(() => {
      if (process.env.NODE_ENV === 'development') {
        console.debug('Initial idle timer triggered')
      }
      setIsIdle(true)
    }, delay)

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)
    // Only reset on keyboard input, not clicks (to allow video control interaction)
    document.addEventListener('keydown', resetIdleTimer)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('keydown', resetIdleTimer)
    }
  }, [delay, resetIdleTimer])

  return isIdle
}

/**
 * Hook for fullscreen management
 * @returns Object with fullscreen state and toggle function
 */
export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error)
    }
  }

  return { isFullscreen, toggleFullscreen }
}

/**
 * Hook to debounce a value
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook for local storage management
 * @param key - The localStorage key
 * @param initialValue - The initial value if key doesn't exist
 * @returns Array with current value and setter function
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window?.localStorage?.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error('Error reading localStorage:', error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error('Error setting localStorage:', error)
    }
  }

  return [storedValue, setValue] as const
}

/**
 * Hook for handling media queries
 * @param query - The media query string
 * @returns Boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [query])

  return matches
}