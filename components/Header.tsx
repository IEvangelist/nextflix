'use client'

import { useState, useEffect } from 'react'
import { Bell, User } from 'lucide-react'
import Link from 'next/link'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
          <Link href="/" className="text-red-600 text-3xl font-bold tracking-tight hover:text-red-500 transition-colors">
            NEXTFLIX
          </Link>
          
          {/* Navigation Menu */}
          <nav className="hidden md:flex" style={{ gap: '2rem' }}>
            <Link href="/shows" className="cursor-pointer text-white hover:text-gray-300 transition-colors font-medium py-3 px-4 rounded-lg hover:bg-white/10">
              TV Shows
            </Link>
            <Link href="/movies" className="cursor-pointer text-white hover:text-gray-300 transition-colors font-medium py-3 px-4 rounded-lg hover:bg-white/10">
              Movies
            </Link>
            <Link href="/search" className="cursor-pointer text-white hover:text-gray-300 transition-colors font-medium py-3 px-4 rounded-lg hover:bg-white/10">
              Search
            </Link>
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