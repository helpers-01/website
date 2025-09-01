"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search } from "lucide-react"
import { useAuth } from "@/lib/contexts/AuthContext"

export default function LoginSignIn() {
  const { user, role, loading } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/user/search?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push('/user/search')
    }
  }

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

  const services = [
    {
      title: "Housekeeping",
      desc: "Keep your home sparkling clean with our trusted housekeepers.",
      img: "/images/housekeeping.jpg",
    },
    {
      title: "Plumbing",
      desc: "Fix leaks, install fixtures, and ensure your plumbing is in top shape.",
      img: "/images/plumbing.jpg",
    },
    {
      title: "Electrical",
      desc: "Get help with wiring, lighting, and other electrical tasks.",
      img: "/images/electrical.jpg",
    },
    {
      title: "Handyman",
      desc: "Tackle those odd jobs around the house with our skilled handymen.",
      img: "/images/handyman.jpg",
    },
    {
      title: "Gardening",
      desc: "Maintain a beautiful yard with our experienced gardening professionals.",
      img: "/images/gardening.jpg",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="w-full border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-textPrimary">HelperConnect</Link>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-textSecondary">
            <Link href="/user/search" className="hover:text-primary transition-colors">Find Helpers</Link>
            <Link href="/login/helper" className="hover:text-primary transition-colors">Become a Helper</Link>
            <Link href="/user/support" className="hover:text-primary transition-colors">Safety</Link>
            <Link href="/user/support" className="hover:text-primary transition-colors">Support</Link>
          </nav>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/login/user')}>Log in</Button>
            <Button onClick={() => router.push('/login/user')}>Sign up</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center bg-gradient-to-r from-orange-100 to-orange-200 px-6 py-20 text-center">
        <h2 className="text-4xl font-bold mb-4 text-textPrimary">Find local helpers for any task</h2>
        <p className="mb-6 text-lg text-textSecondary">
          Connect with skilled professionals in your area for home repairs, cleaning, and more.
        </p>
        <div className="flex w-full max-w-md items-center rounded-2xl bg-background shadow p-2">
          <Input
            type="text"
            placeholder="Search for services"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-none focus:ring-0"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch()
              }
            }}
          />
          <Button
            className="flex items-center gap-2"
            onClick={handleSearch}
          >
            <Search className="w-4 h-4" /> Search
          </Button>
        </div>
      </section>

      {/* Popular Services */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h3 className="text-2xl font-bold mb-8 text-textPrimary">Popular Services</h3>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {services.map((s, i) => (
            <Link key={i} href={`/user/search?q=${encodeURIComponent(s.title.toLowerCase())}`}>
              <Card className="overflow-hidden shadow hover:shadow-lg transition cursor-pointer">
                <img src={s.img} alt={s.title} className="h-40 w-full object-cover" />
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2 text-textPrimary">{s.title}</h4>
                  <p className="text-sm text-textSecondary">{s.desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}
