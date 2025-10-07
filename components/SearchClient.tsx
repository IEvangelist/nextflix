'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, X, Star } from 'lucide-react'
import Image from 'next/image'
import { searchMulti, getImageUrl } from '../lib/tmdb'
import { SearchResult } from '../types'
import Header from './Header'
import Footer from './Footer'

interface FilterState {
  movie: boolean
  tv: boolean
  person: boolean
}

export default function SearchClient() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterState>({
    movie: true,
    tv: true,
    person: true
  })
  const [initialContent, setInitialContent] = useState<SearchResult[]>([])
  const [initialLoading, setInitialLoading] = useState(true)

  // Debounced search function
  const debouncedSearch = useCallback((searchQuery: string) => {
    const timeoutId = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setResults([])
        setFilteredResults([])
        return
      }

      setLoading(true)
      setError(null)

      try {
        const searchResults = await searchMulti(searchQuery.trim())
        setResults(searchResults)
        // Don't apply filters here - let the useEffect handle it
      } catch (err) {
        console.error('Search error:', err)
        setError('Failed to search. Please try again.')
        setResults([])
        setFilteredResults([])
      } finally {
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [])

  // Apply filters to search results
  const applyFiltersToResults = useCallback((searchResults: SearchResult[], currentFilters: FilterState) => {
    // Debug: show what media types we have
    const mediaTypes = searchResults.reduce((acc, result) => {
      acc[result.media_type] = (acc[result.media_type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    console.log('Media types in results:', mediaTypes)
    console.log('Current filters:', currentFilters)
    
    const filtered = searchResults.filter(result => {
      const shouldInclude = (
        (result.media_type === 'movie' && currentFilters.movie) ||
        (result.media_type === 'tv' && currentFilters.tv) ||
        (result.media_type === 'person' && currentFilters.person)
      )
      
      if (!shouldInclude) {
        console.log(`Filtering out ${result.media_type}: ${result.title || result.name}`)
      }
      
      return shouldInclude
    })
    
    console.log(`Filtered ${searchResults.length} results down to ${filtered.length}`)
    setFilteredResults(filtered)
  }, [])

  // Handle query change
  useEffect(() => {
    const cleanup = debouncedSearch(query)
    return cleanup
  }, [query, debouncedSearch])

  // Handle filter changes - apply to current results
  useEffect(() => {
    console.log('Filter useEffect triggered. Results length:', results.length, 'Filters:', filters)
    if (results.length > 0) {
      applyFiltersToResults(results, filters)
    } else {
      console.log('No results to filter')
    }
  }, [filters, results, applyFiltersToResults])

  // Load initial trending content
  useEffect(() => {
    const loadInitialContent = async () => {
      setInitialLoading(true)
      try {
        // Load some popular movies and TV shows to show initially
        const trendingResults = await searchMulti('marvel') // Using a popular search term
        setInitialContent(trendingResults.slice(0, 18)) // Show first 18 results
      } catch (err) {
        console.error('Failed to load initial content:', err)
      } finally {
        setInitialLoading(false)
      }
    }

    loadInitialContent()
  }, [])

  const handleFilterChange = (filterType: keyof FilterState) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [filterType]: !prev[filterType]
      }
      console.log('Filter changed:', filterType, 'Old:', prev[filterType], 'New:', newFilters[filterType])
      console.log('All filters now:', newFilters)
      
      // Prevent all filters from being off
      const hasActiveFilter = Object.values(newFilters).some(value => value)
      if (!hasActiveFilter) {
        console.log('All filters would be off, keeping at least one active')
        return prev // Don't allow all filters to be turned off
      }
      
      return newFilters
    })
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setFilteredResults([])
  }

  const getResultTitle = (result: SearchResult) => {
    return result.title || result.name || 'Unknown'
  }

  const getResultImage = (result: SearchResult) => {
    if (result.media_type === 'person') {
      return getImageUrl(result.profile_path || null, 'w185')
    }
    return getImageUrl(result.poster_path || null, 'w185')
  }

  const getResultSubtitle = (result: SearchResult) => {
    if (result.media_type === 'person') {
      return result.known_for_department || 'Actor/Actress'
    }
    if (result.media_type === 'movie') {
      return result.release_date ? new Date(result.release_date).getFullYear().toString() : 'Movie'
    }
    if (result.media_type === 'tv') {
      return result.first_air_date ? new Date(result.first_air_date).getFullYear().toString() : 'TV Show'
    }
    return ''
  }

  const getMediaTypeBadge = (mediaType: string) => {
    const badgeClasses = "px-2 py-1 text-xs font-medium rounded"
    switch (mediaType) {
      case 'movie':
        return <span className={`${badgeClasses} bg-blue-600/40 text-blue-200 backdrop-blur-sm`}>MOVIE</span>
      case 'tv':
        return <span className={`${badgeClasses} bg-green-600/40 text-green-200 backdrop-blur-sm`}>TV SHOW</span>
      case 'person':
        return <span className={`${badgeClasses} bg-purple-600/40 text-purple-200 backdrop-blur-sm`}>PERSON</span>
      default:
        return null
    }
  }



  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with Netflix logo */}
      <Header />
      
      {/* Search Content */}
      <div className="pt-24 pb-8" style={{ 
        paddingLeft: 'clamp(1.5rem, 4vw, 3rem)', 
        paddingRight: 'clamp(1.5rem, 4vw, 3rem)' 
      }}>
        {/* Search Input and Filters - Inline */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
            {/* Search Input */}
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for movies, TV shows, or actors..."
                className="w-full bg-gray-800/90 border border-gray-600 rounded-md pl-12 pr-12 py-3 text-white placeholder-gray-400 text-base focus:outline-none focus:border-white focus:bg-gray-800 transition-all"
                autoFocus
              />
              {query && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Pills - Inline */}
            <div className="flex items-center gap-2 lg:gap-3">
              <span className="text-gray-400 text-sm hidden lg:inline">Filter:</span>
              <button
                onClick={() => handleFilterChange('movie')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  filters.movie
                    ? 'bg-blue-600/30 text-blue-200 border border-blue-600/40'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                }`}
              >
                Movies
              </button>
              <button
                onClick={() => handleFilterChange('tv')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  filters.tv
                    ? 'bg-green-600/30 text-green-200 border border-green-600/40'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                }`}
              >
                TV Shows
              </button>
              <button
                onClick={() => handleFilterChange('person')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  filters.person
                    ? 'bg-purple-600/30 text-purple-200 border border-purple-600/40'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                }`}
              >
                People
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Container - Netflix Style */}
      <div style={{ 
        paddingLeft: 'clamp(1.5rem, 4vw, 3rem)', 
        paddingRight: 'clamp(1.5rem, 4vw, 3rem)' 
      }}>
        {/* Loading State */}
        {(loading || initialLoading) && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">{error}</p>
          </div>
        )}

        {/* No Results with Filters */}
        {!loading && !error && query && filteredResults.length === 0 && results.length > 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No results match your current filters.</p>
            <button
              onClick={() => setFilters({ movie: true, tv: true, person: true })}
              className="text-white hover:underline mt-2"
            >
              Reset filters
            </button>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && query && results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Your search for &ldquo;{query}&rdquo; did not have any matches.</p>
            <p className="text-gray-500 text-sm mt-2">Suggestions: Try different keywords</p>
          </div>
        )}

        {/* Results or Initial Content */}
        {filteredResults.length > 0 ? (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-medium text-white">
                Search Results ({filteredResults.length})
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2">
              {filteredResults.map((result) => {
                const itemKey = `${result.media_type}-${result.id}`
                return (
                  <div
                    key={itemKey}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden rounded bg-gray-800 transition-all duration-200 group-hover:scale-105">
                      <Image
                        src={getResultImage(result)}
                        alt={getResultTitle(result)}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 14vw"
                      />
                      
                      {/* Media Type Badge */}
                      <div className="absolute top-2 left-2">
                        {getMediaTypeBadge(result.media_type)}
                      </div>

                      {/* Rating Badge */}
                      {result.vote_average && result.vote_average > 0 && (
                        <div className="absolute top-2 right-2 bg-black/75 px-1.5 py-0.5 rounded text-xs flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-white font-medium">
                            {result.vote_average.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-2">
                      <h3 className="text-white text-sm font-medium line-clamp-1">
                        {getResultTitle(result)}
                      </h3>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {getResultSubtitle(result)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        ) : !query && !initialLoading && initialContent.length > 0 ? (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-medium text-white">
                Popular on Netflix
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2">
              {initialContent.map((result) => {
                const itemKey = `initial-${result.media_type}-${result.id}`
                return (
                  <div
                    key={itemKey}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden rounded bg-gray-800 transition-all duration-200 group-hover:scale-105">
                      <Image
                        src={getResultImage(result)}
                        alt={getResultTitle(result)}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 14vw"
                      />
                      
                      {/* Media Type Badge */}
                      <div className="absolute top-2 left-2">
                        {getMediaTypeBadge(result.media_type)}
                      </div>

                      {/* Rating Badge */}
                      {result.vote_average && result.vote_average > 0 && (
                        <div className="absolute top-2 right-2 bg-black/75 px-1.5 py-0.5 rounded text-xs flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-white font-medium">
                            {result.vote_average.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-2">
                      <h3 className="text-white text-sm font-medium line-clamp-1">
                        {getResultTitle(result)}
                      </h3>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {getResultSubtitle(result)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        ) : null}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

