import { TMDB } from 'tmdb-ts';
import type { 
  Movie as TMDBMovie, 
  MovieDetails as TMDBMovieDetails,
  Video as TMDBVideo 
} from 'tmdb-ts';

// TMDB API Configuration
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

// Initialize TMDB client
const tmdb = new TMDB(API_KEY || '');

// Re-export types from tmdb-ts for consistency
export type Movie = TMDBMovie;
export type MovieDetails = TMDBMovieDetails;
export type MovieVideo = TMDBVideo;

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

// Utility functions
export function getImageUrl(path: string | null, size: string = 'w500'): string {
  if (!path) return '/placeholder-movie.svg';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function getTrailerUrl(videos: MovieVideo[]): string | null {
  const trailer = videos.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  );
  return trailer ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1` : null;
}

export function getAgeRating(adult: boolean): string {
  return adult ? '18+' : 'PG-13';
}

export function getYear(releaseDate: string): string {
  return new Date(releaseDate).getFullYear().toString();
}