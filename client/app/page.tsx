"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/contexts/AuthContext"
import HomePage from "@/src/pages"

export default function RootPage() {
  const { user, role, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user && role) {
      // Redirect logged-in users to their dashboard
      if (role === 'admin') {
        router.push('/admin/dashboard')
      } else if (role === 'helper') {
        router.push('/helper/dashboard')
      } else if (role === 'user') {
        router.push('/user/dashboard')
      }
    }
  }, [user, role, loading, router])

  // Show landing page for non-logged-in users or while loading
  if (loading || !user) {
    return <HomePage />
  }

  // Show loading state while redirecting logged-in users
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-100 to-orange-200">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="text-primary font-medium">Redirecting...</span>
      </div>
    </div>
  )
}
