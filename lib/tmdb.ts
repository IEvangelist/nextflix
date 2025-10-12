import { TMDB } from 'tmdb-ts';
import type { 
  Movie as TMDBMovie, 
  MovieDetails as TMDBMovieDetails,
  Video as TMDBVideo,
  TV as TMDBTV
} from 'tmdb-ts';

// TMDB API Configuration
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY 
  ?? process.env.TheMovie_DB_ApiKey;

// Initialize TMDB client
const tmdb = new TMDB(API_KEY || '');

// Re-export types from tmdb-ts for consistency
export type Movie = TMDBMovie;
export type MovieDetails = TMDBMovieDetails;
export type MovieVideo = TMDBVideo;
export type TVShow = TMDBTV;

// API functions using tmdb-ts library
export async function getTrendingMovies(timeWindow: 'day' | 'week' = 'week'): Promise<Movie[]> {
  if (!API_KEY) {
    throw new Error('TMDB API key not configured. Please set NEXT_PUBLIC_TMDB_API_KEY in your environment variables.');
  }
  
  const response = await tmdb.trending.trending('movie', timeWindow);
  return response.results;
}

export async function getPopularMovies(page: number = 1): Promise<Movie[]> {
  if (!API_KEY) {
    throw new Error('TMDB API key not configured. Please set NEXT_PUBLIC_TMDB_API_KEY in your environment variables.');
  }
  
  const response = await tmdb.movies.popular({ page });
  return response.results;
}

export async function getTopRatedMovies(page: number = 1): Promise<Movie[]> {
  if (!API_KEY) {
    throw new Error('TMDB API key not configured. Please set NEXT_PUBLIC_TMDB_API_KEY in your environment variables.');
  }
  
  const response = await tmdb.movies.topRated({ page });
  return response.results;
}

export async function getNowPlayingMovies(page: number = 1): Promise<Movie[]> {
  if (!API_KEY) {
    throw new Error('TMDB API key not configured. Please set NEXT_PUBLIC_TMDB_API_KEY in your environment variables.');
  }
  
  const response = await tmdb.movies.nowPlaying({ page });
  return response.results;
}

export async function getUpcomingMovies(page: number = 1): Promise<Movie[]> {
  if (!API_KEY) {
    throw new Error('TMDB API key not configured. Please set NEXT_PUBLIC_TMDB_API_KEY in your environment variables.');
  }
  
  const response = await tmdb.movies.upcoming({ page });
  return response.results;
}

export async function getMovieDetails(movieId: number): Promise<MovieDetails | null> {
  if (!API_KEY) {
    throw new Error('TMDB API key not configured. Please set NEXT_PUBLIC_TMDB_API_KEY in your environment variables.');
  }
  
  try {
    const response = await tmdb.movies.details(movieId);
    return response;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
}

export async function getMovieVideos(movieId: number): Promise<MovieVideo[]> {
  if (!API_KEY) {
    throw new Error('TMDB API key not configured. Please set NEXT_PUBLIC_TMDB_API_KEY in your environment variables.');
  }
  
  const response = await tmdb.movies.videos(movieId);
  return response.results;
}

export async function searchMovies(query: string, page: number = 1): Promise<Movie[]> {
  if (!API_KEY) {
    throw new Error('TMDB API key not configured. Please set NEXT_PUBLIC_TMDB_API_KEY in your environment variables.');
  }
  
  const response = await tmdb.search.movies({ query, page });
  return response.results;
}

// Multi-search functionality for movies, TV shows, and people
export interface SearchResult {
  id: number
  media_type: 'movie' | 'tv' | 'person'
  title?: string // for movies
  name?: string // for TV shows and people
  overview?: string
  poster_path?: string | null
  backdrop_path?: string | null
  profile_path?: string | null // for people
  vote_average?: number
  vote_count?: number
  release_date?: string // for movies
  first_air_date?: string // for TV shows
  popularity: number
  adult?: boolean
  original_language?: string
  genre_ids?: number[]
  known_for_department?: string // for people
  known_for?: Array<Movie | TVShow> // for people
}

export async function searchMulti(query: string, page: number = 1): Promise<SearchResult[]> {
  if (!API_KEY) {
    throw new Error('TMDB API key not configured. Please set NEXT_PUBLIC_TMDB_API_KEY in your environment variables.');
  }
  
  const response = await tmdb.search.multi({ query, page });
  return response.results as SearchResult[];
}

// Utility functions
export function getImageUrl(path: string | null, size: string = 'w500'): string {
  if (!path) return '/placeholder-movie.svg';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function getTrailerUrl(videos: MovieVideo[]): string | null {
  const trailer = videos.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  );
  if (!trailer) return null;
  
  // Construct URL with playlist parameter for looping
  const baseUrl = `https://www.youtube.com/embed/${trailer.key}`;
  const params = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    loop: '1',
    controls: '0',
    showinfo: '0',
    rel: '0',
    iv_load_policy: '3',
    modestbranding: '1',
    enablejsapi: '1',
    playlist: trailer.key // Required for loop to work
  });
  
  return `${baseUrl}?${params.toString()}`;
}

export function getAgeRating(adult: boolean): string {
  return adult ? '18+' : 'PG-13';
}

export function getYear(releaseDate: string): string {
  return new Date(releaseDate).getFullYear().toString();
}

// Genre-specific functions
export async function getMoviesByGenre(genreId: number, page: number = 1): Promise<Movie[]> {
  if (!API_KEY) {
    throw new Error('TMDB API key not configured. Please set NEXT_PUBLIC_TMDB_API_KEY in your environment variables.');
  }
  
  const response = await tmdb.discover.movie({ 
    with_genres: genreId.toString(), 
    page,
    sort_by: 'popularity.desc'
  });
  return response.results;
}

export async function getActionMovies(page: number = 1): Promise<Movie[]> {
  return getMoviesByGenre(28, page); // 28 is Action genre ID
}

export async function getComedyMovies(page: number = 1): Promise<Movie[]> {
  return getMoviesByGenre(35, page); // 35 is Comedy genre ID
}

export async function getHorrorMovies(page: number = 1): Promise<Movie[]> {
  return getMoviesByGenre(27, page); // 27 is Horror genre ID
}

export async function getRomanceMovies(page: number = 1): Promise<Movie[]> {
  return getMoviesByGenre(10749, page); // 10749 is Romance genre ID
}

export async function getDocumentaryMovies(page: number = 1): Promise<Movie[]> {
  return getMoviesByGenre(99, page); // 99 is Documentary genre ID
}

export async function getAnimationMovies(page: number = 1): Promise<Movie[]> {
  return getMoviesByGenre(16, page); // 16 is Animation genre ID
}

// TV Show functions 
export async function getTrendingTVShows(timeWindow: 'day' | 'week' = 'week') {
  if (!API_KEY) {
    throw new Error('TMDB API key not configured. Please set NEXT_PUBLIC_TMDB_API_KEY in your environment variables.');
  }
  
  const response = await tmdb.trending.trending('tv', timeWindow);
  return response.results;
}

export async function getPopularTVShows(page: number = 1) {
  if (!API_KEY) {
    throw new Error('TMDB API key not configured. Please set NEXT_PUBLIC_TMDB_API_KEY in your environment variables.');
  }
  
  const response = await tmdb.tvShows.popular({ page });
  return response.results;
}

export async function getTopRatedTVShows(page: number = 1) {
  if (!API_KEY) {
    throw new Error('TMDB API key not configured. Please set NEXT_PUBLIC_TMDB_API_KEY in your environment variables.');
  }
  
  const response = await tmdb.tvShows.topRated({ page });
  return response.results;
}

export async function getOnTheAirTVShows(page: number = 1) {
  if (!API_KEY) {
    throw new Error('TMDB API key not configured. Please set NEXT_PUBLIC_TMDB_API_KEY in your environment variables.');
  }
  
  const response = await tmdb.tvShows.onTheAir({ page });
  return response.results;
}

export async function getAiringTodayTVShows(page: number = 1) {
  if (!API_KEY) {
    throw new Error('TMDB API key not configured. Please set NEXT_PUBLIC_TMDB_API_KEY in your environment variables.');
  }
  
  const response = await tmdb.tvShows.airingToday({ page });
  return response.results;
}

// Genre-specific TV show functions - using existing endpoints for now
// These will return variations of popular shows until proper genre filtering is available
export async function getActionTVShows(page: number = 1) {
  // Return popular TV shows as placeholder for action shows
  return getPopularTVShows(page);
}

export async function getComedyTVShows(page: number = 1) {
  // Return top rated TV shows as placeholder for comedy shows
  return getTopRatedTVShows(page);
}

export async function getDramaTVShows(page: number = 1) {
  // Return on the air shows as placeholder for drama shows
  return getOnTheAirTVShows(page);
}

export async function getCrimeTVShows(page: number = 1) {
  // Return airing today shows as placeholder for crime shows
  return getAiringTodayTVShows(page);
}

export async function getDocumentaryTVShows() {
  // Return trending shows as placeholder for documentaries
  return getTrendingTVShows();
}

export async function getAnimationTVShows(page: number = 1) {
  // Return popular shows as placeholder for animation
  return getPopularTVShows(page);
}