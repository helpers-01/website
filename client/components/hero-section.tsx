"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const banners = [
  {
    title: "Professional Salon Services at Home",
    subtitle: "Book expert beauticians and stylists for home visits",
    image: "/professional-salon-services-at-home-with-beauticia.jpg",
  },
  {
    title: "Expert Home Cleaning Services",
    subtitle: "Reliable and thorough cleaning for your home",
    image: "/professional-home-cleaning-service-with-cleaner-in.jpg",
  },
  {
    title: "Trusted Electrician Services",
    subtitle: "Licensed electricians for all your electrical needs",
    image: "/electrician-modern-home.png",
  },
]

export function HeroSection() {
  const [currentBanner, setCurrentBanner] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length)
  }

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)
  }

  return (
    <section className="relative h-[600px] overflow-hidden">
      {banners.map((banner, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentBanner ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${banner.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">{banner.title}</h1>
              <p className="text-xl md:text-2xl mb-8 text-pretty">{banner.subtitle}</p>
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Find Your Service
              </Button>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prevBanner}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextBanner}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBanner(index)}
            className={`w-3 h-3 rounded-full transition-colors ${index === currentBanner ? "bg-white" : "bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  )
}
