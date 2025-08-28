"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, TrendingUp, MessageCircle, Calendar } from "lucide-react"
import Link from "next/link"

export default function HelperReviews() {
  const [filter, setFilter] = useState("all")

  const reviewStats = {
    averageRating: 4.8,
    totalReviews: 89,
    fiveStars: 67,
    fourStars: 18,
    threeStars: 3,
    twoStars: 1,
    oneStar: 0,
  }

  const reviews = [
    {
      id: 1,
      customer: "Sarah M.",
      service: "Deep House Cleaning",
      rating: 5,
      date: "2025-01-10",
      comment:
        "Excellent service! Alex was professional, thorough, and arrived exactly on time. My house has never been cleaner. Will definitely book again!",
      verified: true,
      helpful: 12,
    },
    {
      id: 2,
      customer: "Mike R.",
      service: "Bathroom Deep Clean",
      rating: 5,
      date: "2025-01-08",
      comment:
        "Outstanding work! Very impressed with the attention to detail. Alex cleaned areas I didn't even think of. Highly recommend!",
      verified: true,
      helpful: 8,
    },
    {
      id: 3,
      customer: "Jennifer L.",
      service: "Kitchen Deep Clean",
      rating: 4,
      date: "2025-01-05",
      comment:
        "Good service overall. Arrived on time and did a thorough job. Kitchen looks great. Only minor issue was some cleaning supplies left behind.",
      verified: true,
      helpful: 5,
    },
    {
      id: 4,
      customer: "David K.",
      service: "Interior Painting",
      rating: 5,
      date: "2025-01-03",
      comment:
        "Amazing work! Alex is skilled, professional, and takes pride in the work. The painting job exceeded my expectations. Perfect finish!",
      verified: true,
      helpful: 15,
    },
    {
      id: 5,
      customer: "Lisa P.",
      service: "Deep House Cleaning",
      rating: 4,
      date: "2024-12-28",
      comment:
        "Very good cleaning service. Alex was friendly and professional. House was clean and tidy when finished. Would use again.",
      verified: true,
      helpful: 6,
    },
    {
      id: 6,
      customer: "Robert T.",
      service: "AC Repair",
      rating: 3,
      date: "2024-12-25",
      comment:
        "Service was okay. Fixed the AC issue but took longer than expected. Communication could have been better about the delay.",
      verified: true,
      helpful: 2,
    },
  ]

  const filteredReviews = reviews.filter((review) => {
    if (filter === "all") return true
    if (filter === "5") return review.rating === 5
    if (filter === "4") return review.rating === 4
    if (filter === "3") return review.rating === 3
    if (filter === "2") return review.rating === 2
    if (filter === "1") return review.rating === 1
    return true
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getPercentage = (count: number) => {
    return Math.round((count / reviewStats.totalReviews) * 100)
  }

  return (
    <div className="min-h-screen bg-helpers-light">
      {/* Header */}
      <header className="bg-white border-b border-helpers-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/helper/dashboard" className="text-helpers-purple hover:text-helpers-dark">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-bold text-helpers-dark">Customer Reviews</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setFilter("all")}
                variant={filter === "all" ? "default" : "outline"}
                className={
                  filter === "all"
                    ? "bg-helpers-accent text-white"
                    : "border-helpers-muted text-helpers-purple hover:bg-helpers-pale bg-transparent"
                }
              >
                All Reviews ({reviewStats.totalReviews})
              </Button>
              <Button
                onClick={() => setFilter("5")}
                variant={filter === "5" ? "default" : "outline"}
                className={
                  filter === "5"
                    ? "bg-helpers-accent text-white"
                    : "border-helpers-muted text-helpers-purple hover:bg-helpers-pale bg-transparent"
                }
              >
                5 Stars ({reviewStats.fiveStars})
              </Button>
              <Button
                onClick={() => setFilter("4")}
                variant={filter === "4" ? "default" : "outline"}
                className={
                  filter === "4"
                    ? "bg-helpers-accent text-white"
                    : "border-helpers-muted text-helpers-purple hover:bg-helpers-pale bg-transparent"
                }
              >
                4 Stars ({reviewStats.fourStars})
              </Button>
              <Button
                onClick={() => setFilter("3")}
                variant={filter === "3" ? "default" : "outline"}
                className={
                  filter === "3"
                    ? "bg-helpers-accent text-white"
                    : "border-helpers-muted text-helpers-purple hover:bg-helpers-pale bg-transparent"
                }
              >
                3 Stars ({reviewStats.threeStars})
              </Button>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <Card key={review.id} className="bg-white border-helpers-muted">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-helpers-accent rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">{review.customer[0]}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-helpers-dark">{review.customer}</span>
                            {review.verified && (
                              <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-helpers-purple">{formatDate(review.date)}</div>
                        <div className="text-sm text-helpers-purple">{review.service}</div>
                      </div>
                    </div>

                    <p className="text-helpers-purple mb-4">{review.comment}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-helpers-purple">
                        <span>{review.helpful} people found this helpful</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-helpers-muted text-helpers-purple hover:bg-helpers-pale bg-transparent"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Respond
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rating Overview */}
            <Card className="bg-white border-helpers-muted">
              <CardHeader>
                <CardTitle className="text-helpers-dark">Rating Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-helpers-dark">{reviewStats.averageRating}</div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(reviewStats.averageRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-helpers-purple">{reviewStats.totalReviews} total reviews</div>
                </div>

                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = reviewStats[
                      `${stars === 1 ? "one" : stars === 2 ? "two" : stars === 3 ? "three" : stars === 4 ? "four" : "five"}Stars` as keyof typeof reviewStats
                    ] as number
                    const percentage = getPercentage(count)
                    return (
                      <div key={stars} className="flex items-center gap-2">
                        <span className="text-sm text-helpers-purple w-8">{stars}★</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                        <span className="text-sm text-helpers-purple w-12">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Performance Insights */}
            <Card className="bg-white border-helpers-muted">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-helpers-dark">
                  <TrendingUp className="w-5 h-5" />
                  Performance Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-helpers-purple">This Month</span>
                  <span className="font-medium text-helpers-dark">+12 reviews</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-helpers-purple">Avg. Rating Trend</span>
                  <span className="font-medium text-green-600">↑ 0.2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-helpers-purple">Response Rate</span>
                  <span className="font-medium text-helpers-dark">85%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-helpers-purple">Most Praised</span>
                  <span className="font-medium text-helpers-dark">Punctuality</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white border-helpers-muted">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-helpers-dark">
                  <Calendar className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="font-medium text-helpers-dark">New 5-star review</div>
                  <div className="text-helpers-purple">Sarah M. • 2 days ago</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-helpers-dark">New 5-star review</div>
                  <div className="text-helpers-purple">Mike R. • 4 days ago</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-helpers-dark">New 4-star review</div>
                  <div className="text-helpers-purple">Jennifer L. • 1 week ago</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
