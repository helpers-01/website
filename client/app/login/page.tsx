"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { User, Shield, Wrench, Search } from "lucide-react"
import { useAuth } from "@/lib/contexts/AuthContext"

export default function LoginSelection() {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-100 to-orange-200">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect
  }

  const logins = [
    {
      title: "User Login",
      desc: "Login to access your personal account and services.",
      icon: User,
      href: "/login/user",
      color: "text-primary"
    },
    {
      title: "Helper Login",
      desc: "Login to your Helper account to manage tasks.",
      icon: Wrench,
      href: "/login/helper",
      color: "text-success"
    },
    {
      title: "Admin Login",
      desc: "For Admin Staff to access management tools.",
      icon: Shield,
      href: "/login/admin",
      color: "text-warning"
    },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-orange-100 to-orange-200 px-6 py-16">
      <h1 className="text-4xl font-bold mb-4 text-textPrimary hover:scale-105 transition-transform duration-300">Welcome to HelperConnect</h1>
      <p className="text-textSecondary mb-12 text-center max-w-2xl leading-relaxed">
        Your trusted platform for connecting with skilled professionals. Find helpers for any task or become a helper yourself.
      </p>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mb-12">
        {logins.map((item, i) => (
          <Link key={i} href={item.href}>
            <Card className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 hover:border-primary/30 group">
              <CardContent className="flex flex-col items-center p-8 text-center">
                <item.icon className={`w-12 h-12 mb-4 ${item.color} group-hover:scale-110 transition-transform duration-300`} />
                <h2 className="font-bold text-xl text-textPrimary mb-3 group-hover:text-primary transition-colors">{item.title}</h2>
                <p className="text-sm text-textSecondary leading-relaxed group-hover:text-textPrimary transition-colors">{item.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Link href="/user/search">
        <Card className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 hover:border-success/30 group">
          <CardContent className="flex flex-col items-center p-8 text-center">
            <Search className="w-12 h-12 mb-4 text-success group-hover:scale-110 transition-transform duration-300" />
            <h2 className="font-bold text-xl text-textPrimary mb-3 group-hover:text-success transition-colors">Browse Services</h2>
            <p className="text-sm text-textSecondary leading-relaxed group-hover:text-textPrimary transition-colors">
              Explore services and find the perfect helper for your needs
            </p>
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}
