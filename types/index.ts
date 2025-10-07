// Type definitions for the Netflix clone application
import type { Movie, MovieVideo, MovieDetails } from '../lib/tmdb'

// Re-export main types from tmdb.ts for convenience
export type { Movie, MovieVideo, MovieDetails } from '../lib/tmdb'

// Content type that can handle both movies and TV shows
export interface MediaContent {
  id: number
  title?: string // for movies
  name?: string // for TV shows
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  vote_count: number
  release_date?: string // for movies
  first_air_date?: string // for TV shows
  genre_ids: number[]
  adult?: boolean
  original_language: string
  original_title?: string // for movies
  original_name?: string // for TV shows
  popularity: number
}

// Additional UI-specific types
export interface MovieCardProps {
  movie: Movie
  onPlay?: (movie: Movie) => void
  onAddToList?: (movie: Movie) => void
  onRemoveFromList?: (movie: Movie) => void
  isInList?: boolean
  size?: 'small' | 'medium' | 'large'
  showOverlay?: boolean
}

export interface MovieRowProps {
  title: string
  movies: Movie[]
  onMoviePlay?: (movie: Movie) => void
  onMovieSelect?: (movie: Movie) => void
  loading?: boolean
  error?: string
}

export interface HeroSectionProps {
  movie: Movie
  videos: MovieVideo[]
  onPlay?: () => void
  onMoreInfo?: () => void
}

export interface HeaderProps {
  onSearch?: (query: string) => void
  onMenuClick?: () => void
  showMenu?: boolean
}

// Search and filter types
export interface SearchResult {
  query: string
  results: Movie[]
  totalResults: number
  totalPages: number
  currentPage: number
}

export interface FilterOptions {
  genre?: number[]
  year?: number
  rating?: [number, number]
  sortBy?: 'popularity' | 'rating' | 'release_date' | 'title'
  sortOrder?: 'asc' | 'desc'
}

// User preferences and state
export interface UserPreferences {
  autoplay: boolean
  volume: number
  quality: 'auto' | 'low' | 'medium' | 'high'
  subtitles: boolean
  theme: 'dark' | 'light'
}

export interface AppState {
  currentUser: User | null
  watchlist: Movie[]
  favorites: Movie[]
  searchHistory: string[]
  preferences: UserPreferences
  isLoading: boolean
  error: string | null
}

// User and authentication types
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  plan: 'basic' | 'standard' | 'premium'
  createdAt: Date
  updatedAt: Date
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Modal and overlay types
export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'small' | 'medium' | 'large' | 'full'
}

export interface ToastProps {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

// Video player types
export interface VideoPlayerProps {
  src: string
  poster?: string
  autoplay?: boolean
  muted?: boolean
  controls?: boolean
  loop?: boolean
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  onError?: (error: Error) => void
}

export interface VideoPlayerState {
  isPlaying: boolean
  isMuted: boolean
  volume: number
  currentTime: number
  duration: number
  isFullscreen: boolean
  quality: string
  playbackRate: number
}

// API response types
export interface TMDBApiResponse<T = any> {
  page?: number
  results: T[]
  total_pages?: number
  total_results?: number
}

export interface TMDBError {
  success: false
  status_code: number
  status_message: string
}

// Genre type
export interface Genre {
  id: number
  name: string
}

// Production company type
export interface ProductionCompany {
  id: number
  name: string
  logo_path: string | null
  origin_country: string
}

// Collection type
export interface Collection {
  id: number
  name: string
  poster_path: string | null
  backdrop_path: string | null
}

// Language type
export interface Language {
  iso_639_1: string
  name: string
}

// Country type
export interface Country {
  iso_3166_1: string
  name: string
}

// For now, we'll use MovieDetails directly from tmdb-ts
// If we need extended properties, we can create a separate interface
export type ExtendedMovieDetails = MovieDetails & {
  // Add any additional properties if needed
  customRating?: number
  userNotes?: string
}

// Cast and crew types
export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface CrewMember {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export interface Credits {
  cast: CastMember[]
  crew: CrewMember[]
}

// Review types
export interface Review {
  id: string
  author: string
  content: string
  created_at: string
  updated_at: string
  url: string
  author_details: {
    name: string
    username: string
    avatar_path: string | null
    rating: number | null
  }
}

// Utility types
export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type ThemeMode = 'light' | 'dark' | 'system'
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

// Form types
export interface SearchFormData {
  query: string
  filters?: FilterOptions
}

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

// Event handler types
export type MovieEventHandler = (movie: Movie) => void
export type SearchEventHandler = (query: string) => void
export type FilterEventHandler = (filters: FilterOptions) => void

// Component variant types
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
export type InputVariant = 'default' | 'error' | 'success'
export type CardVariant = 'default' | 'elevated' | 'outlined'

// Animation types
export type AnimationDirection = 'up' | 'down' | 'left' | 'right'
export type AnimationTiming = 'fast' | 'normal' | 'slow'

// Responsive image sizes
export interface ResponsiveImageSizes {
  mobile: string
  tablet: string
  desktop: string
  wide: string
}

// Error boundary types
export interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

// Local storage keys (for type safety)
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'netflix_user_preferences',
  WATCHLIST: 'netflix_watchlist',
  FAVORITES: 'netflix_favorites',
  SEARCH_HISTORY: 'netflix_search_history',
  AUTH_TOKEN: 'netflix_auth_token',
} as const

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS]