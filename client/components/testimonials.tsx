"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    service: "Home Cleaning",
    rating: 5,
    comment:
      "Absolutely fantastic service! The cleaning team was professional, thorough, and left my home spotless. I'll definitely book again.",
    avatar: "/images/testimonials/professional-woman-smiling-headshot.png",
  },
  {
    name: "Mike Chen",
    service: "Electrical Work",
    rating: 5,
    comment:
      "The electrician arrived on time, diagnosed the issue quickly, and fixed everything perfectly. Great communication throughout the process.",
    avatar: "/images/testimonials/professional-man-smiling-headshot.png",
  },
  {
    name: "Emily Rodriguez",
    service: "Salon at Home",
    rating: 5,
    comment:
      "Amazing experience! The stylist was skilled and friendly. Getting a professional haircut at home was so convenient.",
    avatar: "/images/testimonials/smiling-professional-woman.png",
  },
]

export function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-balance">What Our Customers Say</h2>
          <p className="text-muted-foreground text-lg text-pretty">Real reviews from satisfied customers</p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <Card className="overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center justify-center mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>

              <blockquote className="text-lg text-center mb-6 text-pretty">
                "{testimonials[currentTestimonial].comment}"
              </blockquote>

              <div className="flex items-center justify-center gap-4">
                <img
                  src={testimonials[currentTestimonial].avatar || "/placeholder.svg"}
                  alt={testimonials[currentTestimonial].name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="text-center">
                  <div className="font-semibold">{testimonials[currentTestimonial].name}</div>
                  <div className="text-sm text-muted-foreground">{testimonials[currentTestimonial].service}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-card hover:bg-muted border border-border p-2 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-card hover:bg-muted border border-border p-2 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
