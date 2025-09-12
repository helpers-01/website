"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/contexts/AuthContext"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { SearchSection } from "@/components/search-section"
import { ServiceCategories } from "@/components/service-categories"
import { HowItWorks } from "@/components/how-it-works"
import { AboutUs } from "@/components/about-us"
import { Testimonials } from "@/components/testimonials"
import { AppDownload } from "@/components/app-download"

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <SearchSection />
        <ServiceCategories />
        <HowItWorks />
        <AboutUs />
        <Testimonials />
        <AppDownload />
      </main>
    </div>
  )
}

export default function RootPage() {
  const { user, role, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user && role) {
      if (role === "admin") {
        router.push("/admin/dashboard")
      } else if (role === "helper") {
        router.push("/helper/dashboard")
      } else if (role === "user") {
        router.push("/user/dashboard")
      }
    }
  }, [user, role, loading, router])

  if (loading || !user) {
    return <LandingPage />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-100 to-orange-200">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="text-primary font-medium">Redirecting...</span>
      </div>
    </div>
  )
}
