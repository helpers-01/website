"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Shield,
  CheckCircle,
  Heart,
  Share2,
  Calendar,
  Users,
  Award,
} from "lucide-react"
import Link from "next/link"

export default function ServiceDetail() {
  const [selectedPackage, setSelectedPackage] = useState("standard")

  const service = {
    id: 1,
    name: "Deep House Cleaning",
    provider: "CleanPro Services",
    rating: 4.8,
    reviews: 234,
    location: "Manhattan, NY",
    images: ["/house-cleaning-service.png", "/house-cleaning-service.png", "/house-cleaning-service.png"],
    badges: ["Top Rated", "Same Day", "Verified"],
    description:
      "Professional deep cleaning service that covers every corner of your home. Our experienced team uses eco-friendly products and advanced cleaning techniques to ensure your home is spotless and healthy.",
    features: [
      "All rooms cleaned thoroughly",
      "Kitchen deep clean including appliances",
      "Bathroom sanitization",
      "Dusting and vacuuming",
      "Window cleaning (interior)",
      "Eco-friendly products",
    ],
  }

  const packages = [
    {
      id: "basic",
      name: "Basic Clean",
      price: 59,
      duration: "2-3 hours",
      description: "Essential cleaning for small spaces",
      features: ["Living room & bedroom", "Basic kitchen clean", "1 bathroom", "Dusting & vacuuming"],
    },
    {
      id: "standard",
      name: "Standard Clean",
      price: 89,
      duration: "3-4 hours",
      description: "Complete cleaning for most homes",
      features: [
        "All rooms cleaned",
        "Kitchen deep clean",
        "2 bathrooms",
        "Dusting & vacuuming",
        "Window cleaning",
        "Eco-friendly products",
      ],
      popular: true,
    },
    {
      id: "premium",
      name: "Premium Clean",
      price: 129,
      duration: "4-6 hours",
      description: "Comprehensive deep cleaning service",
      features: [
        "All standard features",
        "Inside oven & fridge",
        "Cabinet interiors",
        "Baseboards & light fixtures",
        "Organizing service",
        "Post-clean inspection",
      ],
    },
  ]

  const reviews = [
    {
      id: 1,
      user: "Sarah M.",
      rating: 5,
      date: "2 days ago",
      comment: "Excellent service! The team was professional and thorough. My house has never been cleaner.",
      verified: true,
    },
    {
      id: 2,
      user: "Mike R.",
      rating: 5,
      date: "1 week ago",
      comment: "Very impressed with the attention to detail. They cleaned areas I didn't even think of.",
      verified: true,
    },
    {
      id: 3,
      user: "Jennifer L.",
      rating: 4,
      date: "2 weeks ago",
      comment: "Good service overall. Arrived on time and did a thorough job. Would book again.",
      verified: true,
    },
  ]

  const providerInfo = {
    name: "CleanPro Services",
    memberSince: "2019",
    completedJobs: 1247,
    responseTime: "< 1 hour",
    badges: ["Top Rated", "Verified", "Background Checked"],
  }

  return (
    <div className="min-h-screen bg-helpers-light">
      {/* Header */}
      <header className="bg-white border-b border-helpers-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/user/search" className="text-helpers-purple hover:text-helpers-dark">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-bold text-helpers-dark">Service Details</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-helpers-purple hover:text-helpers-dark">
                <Heart className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-helpers-purple hover:text-helpers-dark">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Images */}
            <Card className="bg-white border-helpers-muted">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <img
                    src={service.images[0] || "/placeholder.svg"}
                    alt={service.name}
                    className="w-full h-64 md:col-span-2 object-cover rounded-tl-lg rounded-tr-lg md:rounded-tr-none md:rounded-bl-lg"
                  />
                  <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                    <img
                      src={service.images[1] || "/placeholder.svg"}
                      alt={service.name}
                      className="w-full h-32 md:h-32 object-cover rounded-lg md:rounded-tr-lg md:rounded-bl-none"
                    />
                    <img
                      src={service.images[2] || "/placeholder.svg"}
                      alt={service.name}
                      className="w-full h-32 md:h-32 object-cover rounded-lg md:rounded-br-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Info */}
            <Card className="bg-white border-helpers-muted">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-helpers-dark mb-2">{service.name}</h1>
                    <p className="text-helpers-purple mb-2">{service.provider}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{service.rating}</span>
                        <span className="text-helpers-purple">({service.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1 text-helpers-purple">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{service.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {service.badges.map((badge) => (
                      <Badge key={badge} variant="secondary" className="bg-helpers-pale text-helpers-purple">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>

                <p className="text-helpers-purple mb-6">{service.description}</p>

                <div>
                  <h3 className="font-semibold text-helpers-dark mb-3">What's Included:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-helpers-purple">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="packages" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="packages">Packages</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="provider">Provider</TabsTrigger>
              </TabsList>

              <TabsContent value="packages" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {packages.map((pkg) => (
                    <Card
                      key={pkg.id}
                      className={`cursor-pointer transition-colors ${
                        selectedPackage === pkg.id
                          ? "border-helpers-accent bg-helpers-pale"
                          : "bg-white border-helpers-muted hover:border-helpers-accent"
                      }`}
                      onClick={() => setSelectedPackage(pkg.id)}
                    >
                      <CardContent className="p-6">
                        <div className="text-center mb-4">
                          {pkg.popular && <Badge className="mb-2 bg-helpers-accent text-white">Most Popular</Badge>}
                          <h3 className="text-lg font-semibold text-helpers-dark">{pkg.name}</h3>
                          <div className="text-2xl font-bold text-helpers-dark">${pkg.price}</div>
                          <p className="text-sm text-helpers-purple">{pkg.duration}</p>
                        </div>
                        <p className="text-sm text-helpers-purple mb-4 text-center">{pkg.description}</p>
                        <div className="space-y-2">
                          {pkg.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                              <span className="text-xs text-helpers-purple">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id} className="bg-white border-helpers-muted">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-helpers-accent rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">{review.user[0]}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-helpers-dark">{review.user}</span>
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
                                  className={`w-3 h-3 ${
                                    i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-helpers-purple">{review.date}</span>
                      </div>
                      <p className="text-helpers-purple">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="provider">
                <Card className="bg-white border-helpers-muted">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-helpers-accent rounded-full flex items-center justify-center">
                        <span className="text-white text-xl font-bold">{providerInfo.name[0]}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-helpers-dark mb-2">{providerInfo.name}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-helpers-purple">Member Since</div>
                            <div className="font-medium text-helpers-dark">{providerInfo.memberSince}</div>
                          </div>
                          <div>
                            <div className="text-sm text-helpers-purple">Jobs Completed</div>
                            <div className="font-medium text-helpers-dark">{providerInfo.completedJobs}</div>
                          </div>
                          <div>
                            <div className="text-sm text-helpers-purple">Response Time</div>
                            <div className="font-medium text-helpers-dark">{providerInfo.responseTime}</div>
                          </div>
                          <div>
                            <div className="text-sm text-helpers-purple">Rating</div>
                            <div className="font-medium text-helpers-dark">{service.rating}/5</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {providerInfo.badges.map((badge) => (
                            <Badge key={badge} variant="secondary" className="bg-helpers-pale text-helpers-purple">
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            <Card className="bg-white border-helpers-muted sticky top-8">
              <CardHeader>
                <CardTitle className="text-helpers-dark">Book This Service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-helpers-dark">
                    ${packages.find((p) => p.id === selectedPackage)?.price}
                  </div>
                  <div className="text-sm text-helpers-purple">
                    {packages.find((p) => p.id === selectedPackage)?.duration}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-helpers-purple">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Available today</span>
                  </div>
                  <div className="flex items-center gap-2 text-helpers-purple">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Next slot: 2:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2 text-helpers-purple">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">Insured & Bonded</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-helpers-accent hover:bg-helpers-accent-dark text-white"
                  onClick={() => (window.location.href = `/user/booking/${service.id}?package=${selectedPackage}`)}
                >
                  Book Now
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-helpers-muted text-helpers-purple hover:bg-helpers-pale bg-transparent"
                >
                  Message Provider
                </Button>
              </CardContent>
            </Card>

            {/* Trust & Safety */}
            <Card className="bg-white border-helpers-muted">
              <CardContent className="p-6">
                <h3 className="font-semibold text-helpers-dark mb-4">Trust & Safety</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-helpers-purple">Background checked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-helpers-purple">Licensed & insured</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-helpers-purple">1000+ satisfied customers</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
