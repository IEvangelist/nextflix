import { 
  getTrendingMovies, 
  getPopularMovies, 
  getTopRatedMovies, 
  getNowPlayingMovies,
  getUpcomingMovies,
  getMovieVideos
} from '@/lib/tmdb'
import NetflixClient from '@/components/NetflixClient'

// This is a Server Component that fetches data
export default async function Home() {
  // Fetch all movie data in parallel
  const [
    trendingMovies,
    popularMovies,
    topRatedMovies,
    nowPlayingMovies,
    upcomingMovies,
  ] = await Promise.all([
    getTrendingMovies(),
    getPopularMovies(),
    getTopRatedMovies(),
    getNowPlayingMovies(),
    getUpcomingMovies(),
  ])

  // Get a random trending movie for the hero section
  const heroMovie = trendingMovies.length > 0 ? 
    trendingMovies[Math.floor(Math.random() * Math.min(trendingMovies.length, 5))] : 
    null

  // Get videos for the hero movie
  const heroVideos = heroMovie ? await getMovieVideos(heroMovie.id) : []

  return (
    <div className="min-h-screen bg-black">
      <NetflixClient
        trendingMovies={trendingMovies}
        popularMovies={popularMovies}
        topRatedMovies={topRatedMovies}
        nowPlayingMovies={nowPlayingMovies}
        upcomingMovies={upcomingMovies}
        heroMovie={heroMovie}
        heroVideos={heroVideos}
      />
    </div>
  )
}
