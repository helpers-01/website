"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/contexts/AuthContext"

export default function RootPage() {
  const { user, role, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user && role) {
        // Redirect logged-in users to their dashboard
        if (role === 'admin') {
          router.push('/dashboard/admin')
        } else if (role === 'helper') {
          router.push('/dashboard/provider')
        } else if (role === 'user') {
          router.push('/dashboard/customer')
        }
      } else {
        // Redirect non-logged-in users to login page
        router.push('/login')
      }
    }
  }, [user, role, loading, router])

  // Show loading state while determining redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-100 to-orange-200">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="text-primary font-medium">Redirecting...</span>
      </div>
    </div>
  )
}
