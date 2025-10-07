'use client'

import { useState, useEffect } from 'react'
import { Search, Bell, User } from 'lucide-react'
import Link from 'next/link'

interface HeaderProps {
  onSearch?: (query: string) => void
}

export default function Header({ onSearch }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim())
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/95 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div 
        className="flex items-center justify-between py-6" 
        style={{ 
          paddingLeft: 'clamp(1.5rem, 4vw, 3rem)', 
          paddingRight: 'clamp(1.5rem, 4vw, 3rem)' 
        }}
      >
        {/* Logo */}
        <div className="flex items-center" style={{ gap: 'clamp(2rem, 5vw, 4rem)' }}>
          <h1 className="text-red-600 text-3xl font-bold tracking-tight">NEXTFLIX</h1>
          
          {/* Navigation Menu */}
          <nav className="hidden md:flex" style={{ gap: '2rem' }}>
            <Link href="/" className="cursor-pointer text-white hover:text-gray-300 transition-colors font-medium py-3 px-4 rounded-lg hover:bg-white/10">
              Home
            </Link>
            <Link href="/shows" className="cursor-pointer text-white hover:text-gray-300 transition-colors font-medium py-3 px-4 rounded-lg hover:bg-white/10">
              TV Shows
            </Link>
            <a href="#" className="cursor-pointer text-white hover:text-gray-300 transition-colors font-medium py-3 px-4 rounded-lg hover:bg-white/10">
              Movies
            </a>
            <a href="#" className="cursor-pointer text-white hover:text-gray-300 transition-colors font-medium py-3 px-4 rounded-lg hover:bg-white/10">
              New & Popular
            </a>
            <Link href="/my-list" className="cursor-pointer text-white hover:text-gray-300 transition-colors font-medium py-3 px-4 rounded-lg hover:bg-white/10">
              My List
            </Link>
          </nav>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center" style={{ gap: '2rem' }}>
          {/* Search */}
          <div className="relative">
            {isSearchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies..."
                  className="bg-black/70 border border-white/40 rounded-xl px-6 py-4 text-white placeholder-gray-400 w-80 text-lg focus:outline-none focus:border-white/70 focus:ring-2 focus:ring-red-500/40 backdrop-blur-md transition-all shadow-lg"
                  autoFocus
                  onBlur={() => {
                    if (!searchQuery.trim()) {
                      setIsSearchOpen(false)
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false)
                    setSearchQuery('')
                  }}
                  className="cursor-pointer ml-3 text-white hover:text-gray-300 p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="cursor-pointer text-white hover:text-gray-300 transition-colors p-3 hover:bg-white/10 rounded-lg"
                aria-label="Open search"
              >
                <Search className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Notifications */}
          <button 
            className="cursor-pointer text-white hover:text-gray-300 transition-colors p-3 hover:bg-white/10 rounded-lg relative"
            aria-label="Notifications"
          >
            <Bell className="w-6 h-6" />
            {/* Notification badge */}
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full"></span>
          </button>

          {/* User Profile */}
          <button 
            className="cursor-pointer text-white hover:text-gray-300 transition-colors p-3 hover:bg-white/10 rounded-lg"
            aria-label="User profile"
          >
            <User className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  )
}