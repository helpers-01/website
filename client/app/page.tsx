"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Users, Shield } from "lucide-react"
import { useAuth } from "@/lib/contexts/AuthContext"
import Footer from "@/components/footer"

export default function LoginDashboard() {
  const { user, role, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user && role) {
      // Redirect logged-in users to their dashboard
      if (role === 'admin') {
        router.push('/dashboard/admin')
      } else if (role === 'helper') {
        router.push('/dashboard/provider')
      } else if (role === 'user') {
        router.push('/dashboard/customer')
      }
    }
  }, [user, role, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect
  }
  const loginOptions = [
    {
      id: "user",
      title: "User Login",
      description:
        "Login with your User ID and Password to access your personal account and services. Keep track of your progress and stay updated.",
      icon: User,
      href: "/login/user",
    },
    {
      id: "helper",
      title: "Helper Login",
      description:
        "Login to your Helper account using your Employee ID and Password. Access helper tools and manage your assigned tasks.",
      icon: Users,
      href: "/login/helper",
    },
    {
      id: "admin",
      title: "Admin Login",
      description:
        "For Admin Staff only. Use your Admin credentials to access administrative services and system management tools.",
      icon: Shield,
      href: "/login/admin",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex justify-center py-8">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Helpers</h1>
            <p className="text-primary text-sm">Management System</p>
          </div>
        </div>
      </div>

      {/* Login Cards Grid */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loginOptions.map((option) => {
            const IconComponent = option.icon
            return (
              <div
                key={option.id}
                className="card-style hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-start space-y-4">
                    {/* Icon */}
                    <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-semibold text-foreground">{option.title}</h2>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed">{option.description}</p>

                    {/* Login Button */}
                    <Button
                      className="btn-primary w-full"
                      onClick={() => (window.location.href = option.href)}
                    >
                      Login Now
                    </Button>
                  </div>
                </CardContent>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
