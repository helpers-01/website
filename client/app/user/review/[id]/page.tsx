"use client"

// Force dynamic rendering for this page since it depends on database data
export const dynamic = 'force-dynamic'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Star } from "lucide-react"
import Link from "next/link"

export default function ReviewPage() {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [review, setReview] = useState("")

  const booking = {
    service: "Interior Wall Painting",
    provider: "ColorCraft Painters",
    date: "2025-01-10",
    image: "/interior-painting.png",
  }

  const handleSubmitReview = () => {
    // Submit review logic here
    window.location.href = "/user/bookings"
  }

  return (
    <div className="min-h-screen bg-helpers-light">
      {/* Header */}
      <header className="bg-white border-b border-helpers-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/user/bookings" className="text-helpers-purple hover:text-helpers-dark">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-bold text-helpers-dark">Leave Review</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-white border-helpers-muted">
          <CardHeader>
            <CardTitle className="text-helpers-dark">How was your service?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Service Info */}
            <div className="flex gap-4 p-4 bg-helpers-pale rounded-lg">
              <img
                src={booking.image || "/placeholder.svg"}
                alt={booking.service}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-semibold text-helpers-dark">{booking.service}</h3>
                <p className="text-helpers-purple">{booking.provider}</p>
                <p className="text-sm text-helpers-purple">{booking.date}</p>
              </div>
            </div>

            {/* Rating */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-helpers-dark mb-4">Rate your experience</h3>
              <div className="flex justify-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-colors"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-helpers-purple">
                {rating === 0
                  ? "Click to rate"
                  : rating === 1
                    ? "Poor"
                    : rating === 2
                      ? "Fair"
                      : rating === 3
                        ? "Good"
                        : rating === 4
                          ? "Very Good"
                          : "Excellent"}
              </p>
            </div>

            {/* Review Text */}
            <div>
              <label htmlFor="review" className="block text-sm font-medium text-helpers-dark mb-2">
                Tell us about your experience (optional)
              </label>
              <Textarea
                id="review"
                placeholder="Share details about your service experience..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="border-helpers-muted focus:border-helpers-accent min-h-[120px]"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button
                onClick={handleSubmitReview}
                disabled={rating === 0}
                className="flex-1 bg-helpers-accent hover:bg-helpers-accent-dark text-white"
              >
                Submit Review
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/user/bookings")}
                className="border-helpers-muted text-helpers-purple hover:bg-helpers-pale bg-transparent"
              >
                Skip
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
