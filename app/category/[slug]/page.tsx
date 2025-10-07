import CategoryClient from '@/components/CategoryClient'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

const categoryMap: Record<string, string> = {
  'trending': 'Trending Now',
  'popular': 'Popular Movies',
  'top-rated': 'Top Rated Movies',
  'now-playing': 'Now Playing',
  'upcoming': 'Coming Soon',
  'action': 'Action Movies',
  'comedy': 'Comedy Movies',
  'horror': 'Horror Movies',
  'romance': 'Romance Movies',
  'documentary': 'Documentary Movies',
  'animation': 'Animation Movies'
}

export default async function CategoryPageRoute({ params }: PageProps) {
  const { slug } = await params
  const title = categoryMap[slug]
  
  if (!title) {
    notFound()
  }

  return <CategoryClient category={slug} title={title} />
}

export function generateStaticParams() {
  return Object.keys(categoryMap).map((slug) => ({
    slug,
  }))
}