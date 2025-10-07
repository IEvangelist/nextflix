import { 
  getTrendingMovies, 
  getPopularMovies, 
  getTopRatedMovies, 
  getNowPlayingMovies,
  getUpcomingMovies,
  getActionMovies,
  getComedyMovies,
  getHorrorMovies,
  getRomanceMovies,
  getDocumentaryMovies,
  getAnimationMovies,
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
    actionMovies,
    comedyMovies,
    horrorMovies,
    romanceMovies,
    documentaryMovies,
    animationMovies,
  ] = await Promise.all([
    getTrendingMovies(),
    getPopularMovies(),
    getTopRatedMovies(),
    getNowPlayingMovies(),
    getUpcomingMovies(),
    getActionMovies(),
    getComedyMovies(),
    getHorrorMovies(),
    getRomanceMovies(),
    getDocumentaryMovies(),
    getAnimationMovies(),
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
        actionMovies={actionMovies}
        comedyMovies={comedyMovies}
        horrorMovies={horrorMovies}
        romanceMovies={romanceMovies}
        documentaryMovies={documentaryMovies}
        animationMovies={animationMovies}
        heroMovie={heroMovie}
        heroVideos={heroVideos}
      />
    </div>
  )
}
