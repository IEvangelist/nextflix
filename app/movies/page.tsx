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
  getAnimationMovies
} from '@/lib/tmdb'
import MoviesClient from '@/components/MoviesClient'

// This is a Server Component that fetches movie data
export default async function Movies() {
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

  return (
    <div className="min-h-screen bg-black">
      <MoviesClient
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
      />
    </div>
  )
}

export const metadata = {
  title: 'Movies - Nextflix',
  description: 'Discover and watch the best movies on Nextflix',
}