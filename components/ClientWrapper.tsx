'use client'

import Header from './Header'

interface ClientWrapperProps {
  children: React.ReactNode
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <>
      {/* Header without search functionality - search is now on dedicated page */}
      <Header />

      {/* Main content */}
      {children}
    </>
  )
}