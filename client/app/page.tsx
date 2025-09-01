"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, UserCheck, Calendar, Search, Shield } from "lucide-react"
import { useAuth } from "@/lib/contexts/AuthContext"

export default function Dashboard() {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-100 to-orange-200">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <span className="text-primary font-medium">Loading dashboard...</span>
        </div>
      </div>
    )
  }

  // This should not render as users will be redirected
  // But keeping a fallback for edge cases
  const loginOptions = [
    {
      id: "user",
      title: "User Login",
      description: "Login to access your personal account and services.",
      icon: Users,
      href: "/login/user",
    },
    {
      id: "helper",
      title: "Helper Login",
      description: "Login to your Helper account to manage your tasks.",
      icon: UserCheck,
      href: "/login/helper",
    },
    {
      id: "admin",
      title: "Admin Login",
      description: "For Admin Staff to access system management tools.",
      icon: Shield,
      href: "/login/admin",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-orange-100 to-orange-200">
      {/* Navbar */}
      <header className="w-full border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-textPrimary">HelperConnect</Link>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-textSecondary">
            <Link href="/user/search" className="hover:text-primary transition-colors">Find Helpers</Link>
            <Link href="/login/helper" className="hover:text-primary transition-colors">Become a Helper</Link>
            <Link href="/user/support" className="hover:text-primary transition-colors">Support</Link>
          </nav>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/login')}>Log in</Button>
            <Button onClick={() => router.push('/login')}>Sign up</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4 text-textPrimary">Welcome to HelperConnect</h1>
          <p className="text-lg text-textSecondary mb-8">
            Your trusted platform for connecting with skilled professionals
          </p>

          {/* Quick Access Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            {loginOptions.map((option) => {
              const IconComponent = option.icon
              return (
                <Card key={option.id} className="card-style hover:scale-105 transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-textPrimary">{option.title}</h3>
                      <p className="text-sm text-textSecondary">{option.description}</p>
                      <Button
                        className="w-full hover:scale-105 transition-transform"
                        onClick={() => router.push(option.href)}
                      >
                        Get Started
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Browse Services */}
          <Card className="card-style hover:scale-105 transition-all duration-300 cursor-pointer">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Search className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-textPrimary">Browse Services</h3>
                <p className="text-sm text-textSecondary">Explore available services and find the perfect helper</p>
                <Button
                  variant="outline"
                  className="hover:scale-105 transition-transform"
                  onClick={() => router.push('/user/search')}
                >
                  Browse Services
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

    </div>
  )
}
