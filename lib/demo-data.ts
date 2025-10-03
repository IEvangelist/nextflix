// Demo/fallback data for when TMDB API is not available
import { Movie, MovieVideo } from './tmdb'

export const demoMovies: Movie[] = [
  {
    id: 1,
    title: "The Matrix",
    overview: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    backdrop_path: "/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
    release_date: "1999-03-30",
    vote_average: 8.7,
    adult: false,
    genre_ids: [28, 878],
    original_language: "en",
    original_title: "The Matrix",
    popularity: 85.3,
    video: false,
    vote_count: 23845
  },
  {
    id: 2,
    title: "Inception",
    overview: "Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state.",
    poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    backdrop_path: "/xl5oCFLVMo4d75zYb0rdaOJ2l8B.jpg",
    release_date: "2010-07-16",
    vote_average: 8.4,
    adult: false,
    genre_ids: [28, 878, 53],
    original_language: "en",
    original_title: "Inception",
    popularity: 73.2,
    video: false,
    vote_count: 34287
  },
  {
    id: 3,
    title: "Interstellar",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel.",
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop_path: "/k2Lf36UO9TQkOGNmNeiIty7tqTb.jpg",
    release_date: "2014-11-07",
    vote_average: 8.4,
    adult: false,
    genre_ids: [12, 18, 878],
    original_language: "en",
    original_title: "Interstellar",
    popularity: 124.8,
    video: false,
    vote_count: 30459
  },
  {
    id: 4,
    title: "The Dark Knight",
    overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations.",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop_path: "/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg",
    release_date: "2008-07-18",
    vote_average: 9.0,
    adult: false,
    genre_ids: [28, 80, 18],
    original_language: "en",
    original_title: "The Dark Knight",
    popularity: 98.7,
    video: false,
    vote_count: 31254
  },
  {
    id: 5,
    title: "Avengers: Endgame",
    overview: "After the devastating events of Avengers: Infinity War, the universe is in ruins due to the efforts of the Mad Titan, Thanos.",
    poster_path: "/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    backdrop_path: "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
    release_date: "2019-04-26",
    vote_average: 8.3,
    adult: false,
    genre_ids: [12, 878, 28],
    original_language: "en",
    original_title: "Avengers: Endgame",
    popularity: 156.4,
    video: false,
    vote_count: 24738
  },
  {
    id: 6,
    title: "Spider-Man: No Way Home",
    overview: "Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero.",
    poster_path: "/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    backdrop_path: "/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg",
    release_date: "2021-12-17",
    vote_average: 8.1,
    adult: false,
    genre_ids: [28, 12, 878],
    original_language: "en",
    original_title: "Spider-Man: No Way Home",
    popularity: 214.5,
    video: false,
    vote_count: 18752
  }
]

export const demoVideos: MovieVideo[] = [
  {
    id: "1",
    key: "vKQi3bBA1y8",
    name: "The Matrix - Official Trailer",
    site: "YouTube",
    size: 1080,
    type: "Trailer",
    iso_639_1: "en",
    iso_3166_1: "US"
  }
]

// Generate more demo movies by duplicating with different IDs
export function generateDemoMovies(count: number): Movie[] {
  const movies = []
  for (let i = 0; i < count; i++) {
    const baseMovie = demoMovies[i % demoMovies.length]
    movies.push({
      ...baseMovie,
      id: 1000 + i,
      title: `${baseMovie.title} ${Math.floor(i / demoMovies.length) + 1}`,
    })
  }
  return movies
}

// Create different categories of demo movies
export const demoCategorizedMovies = {
  trending: demoMovies.slice(0, 6),
  popular: generateDemoMovies(12),
  topRated: demoMovies.slice(2, 8),
  nowPlaying: generateDemoMovies(10),
  upcoming: demoMovies.slice(1, 7)
}