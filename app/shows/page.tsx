import { 
  getTrendingTVShows, 
  getPopularTVShows, 
  getTopRatedTVShows, 
  getOnTheAirTVShows,
  getAiringTodayTVShows,
  getActionTVShows,
  getComedyTVShows,
  getDramaTVShows,
  getCrimeTVShows,
  getDocumentaryTVShows,
  getAnimationTVShows
} from '@/lib/tmdb'
import TVShowsClient from '../../components/TVShowsClient'

// This is a Server Component that fetches TV show data
export default async function TVShows() {
  // Fetch all TV show data in parallel
  const [
    trendingTVShows,
    popularTVShows,
    topRatedTVShows,
    onTheAirTVShows,
    airingTodayTVShows,
    actionTVShows,
    comedyTVShows,
    dramaTVShows,
    crimeTVShows,
    documentaryTVShows,
    animationTVShows,
  ] = await Promise.all([
    getTrendingTVShows(),
    getPopularTVShows(),
    getTopRatedTVShows(),
    getOnTheAirTVShows(),
    getAiringTodayTVShows(),
    getActionTVShows(),
    getComedyTVShows(),
    getDramaTVShows(),
    getCrimeTVShows(),
    getDocumentaryTVShows(),
    getAnimationTVShows(),
  ])

  return (
    <div className="min-h-screen bg-black">
      <TVShowsClient
        trendingTVShows={trendingTVShows}
        popularTVShows={popularTVShows}
        topRatedTVShows={topRatedTVShows}
        onTheAirTVShows={onTheAirTVShows}
        airingTodayTVShows={airingTodayTVShows}
        actionTVShows={actionTVShows}
        comedyTVShows={comedyTVShows}
        dramaTVShows={dramaTVShows}
        crimeTVShows={crimeTVShows}
        documentaryTVShows={documentaryTVShows}
        animationTVShows={animationTVShows}
      />
    </div>
  )
}

export const metadata = {
  title: 'TV Shows - Nextflix',
  description: 'Discover and watch the best TV shows on Nextflix',
}