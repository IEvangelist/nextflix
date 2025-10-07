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
        trendingTVShows={trendingTVShows as never[]}
        popularTVShows={popularTVShows as never[]}
        topRatedTVShows={topRatedTVShows as never[]}
        onTheAirTVShows={onTheAirTVShows as never[]}
        airingTodayTVShows={airingTodayTVShows as never[]}
        actionTVShows={actionTVShows as never[]}
        comedyTVShows={comedyTVShows as never[]}
        dramaTVShows={dramaTVShows as never[]}
        crimeTVShows={crimeTVShows as never[]}
        documentaryTVShows={documentaryTVShows as never[]}
        animationTVShows={animationTVShows as never[]}
      />
    </div>
  )
}

export const metadata = {
  title: 'TV Shows - Nextflix',
  description: 'Discover and watch the best TV shows on Nextflix',
}