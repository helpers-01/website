"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Search, ArrowLeft, Star, MapPin, Clock, SlidersHorizontal } from "lucide-react"
import Link from "next/link"

export default function SearchResults() {
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 200])
  const [showFilters, setShowFilters] = useState(true)

  const filters = {
    categories: [
      { id: "cleaning", label: "Home Cleaning", count: 45 },
      { id: "repairs", label: "Repairs", count: 32 },
      { id: "painting", label: "Painting", count: 18 },
      { id: "electrical", label: "Electrical", count: 28 },
    ],
    ratings: [
      { id: "5", label: "5 Stars", count: 89 },
      { id: "4", label: "4+ Stars", count: 156 },
      { id: "3", label: "3+ Stars", count: 203 },
    ],
    availability: [
      { id: "today", label: "Available Today", count: 23 },
      { id: "tomorrow", label: "Available Tomorrow", count: 67 },
      { id: "weekend", label: "Weekend Available", count: 45 },
    ],
  }

  const searchResults = [
    {
      id: 1,
      name: "Deep House Cleaning",
      provider: "CleanPro Services",
      rating: 4.8,
      reviews: 234,
      price: 89,
      duration: "3-4 hours",
      location: "Manhattan, NY",
      image: "/house-cleaning-service.png",
      badges: ["Top Rated", "Same Day"],
      description: "Complete deep cleaning service for your home including all rooms, kitchen, and bathrooms.",
    },
    {
      id: 2,
      name: "AC Repair & Maintenance",
      provider: "CoolAir Experts",
      rating: 4.9,
      reviews: 156,
      price: 65,
      duration: "1-2 hours",
      location: "Brooklyn, NY",
      image: "/air-conditioning-repair.png",
      badges: ["Verified", "Quick Service"],
      description: "Professional AC repair and maintenance services with same-day availability.",
    },
    {
      id: 3,
      name: "Interior Wall Painting",
      provider: "ColorCraft Painters",
      rating: 4.7,
      reviews: 89,
      price: 120,
      duration: "4-6 hours",
      location: "Queens, NY",
      image: "/interior-painting.png",
      badges: ["Premium"],
      description: "High-quality interior painting services with premium paints and professional finish.",
    },
    {
      id: 4,
      name: "Bathroom Deep Clean",
      provider: "Sparkle Clean Co",
      rating: 4.6,
      reviews: 78,
      price: 45,
      duration: "1-2 hours",
      location: "Manhattan, NY",
      image: "/house-cleaning-service.png",
      badges: ["Eco-Friendly"],
      description: "Specialized bathroom cleaning service using eco-friendly products.",
    },
    {
      id: 5,
      name: "Kitchen Appliance Repair",
      provider: "FixIt Fast",
      rating: 4.8,
      reviews: 123,
      price: 85,
      duration: "2-3 hours",
      location: "Bronx, NY",
      image: "/air-conditioning-repair.png",
      badges: ["Same Day", "Warranty"],
      description: "Expert repair services for all kitchen appliances with warranty included.",
    },
    {
      id: 6,
      name: "Exterior House Painting",
      provider: "ProPaint Solutions",
      rating: 4.9,
      reviews: 167,
      price: 250,
      duration: "Full Day",
      location: "Staten Island, NY",
      image: "/interior-painting.png",
      badges: ["Top Rated", "Weather Resistant"],
      description: "Complete exterior painting service with weather-resistant premium paints.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-200">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/user/dashboard" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Search Results</h1>
            </div>
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <Input
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-purple-200 focus:border-purple-600"
                />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-purple-200 text-gray-600 hover:bg-purple-50 bg-transparent"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 space-y-6">
              {/* Price Range */}
              <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
                  <div className="space-y-4">
                    <Slider value={priceRange} onValueChange={setPriceRange} max={500} step={10} className="w-full" />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                  <div className="space-y-3">
                    {filters.categories.map((category) => (
                      <div key={category.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox id={category.id} />
                          <label htmlFor={category.id} className="text-sm text-gray-900">
                            {category.label}
                          </label>
                        </div>
                        <span className="text-xs text-gray-600">({category.count})</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Ratings */}
              <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Rating</h3>
                  <div className="space-y-3">
                    {filters.ratings.map((rating) => (
                      <div key={rating.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox id={rating.id} />
                          <label htmlFor={rating.id} className="text-sm text-gray-900">
                            {rating.label}
                          </label>
                        </div>
                        <span className="text-xs text-gray-600">({rating.count})</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Availability */}
              <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Availability</h3>
                  <div className="space-y-3">
                    {filters.availability.map((avail) => (
                      <div key={avail.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox id={avail.id} />
                          <label htmlFor={avail.id} className="text-sm text-gray-900">
                            {avail.label}
                          </label>
                        </div>
                        <span className="text-xs text-gray-600">({avail.count})</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{searchResults.length} services found</h2>
                <p className="text-gray-600">Showing results for "cleaning services"</p>
              </div>
              <select className="border border-purple-200 rounded-lg px-3 py-2 text-sm text-gray-900">
                <option>Sort by: Relevance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating: High to Low</option>
                <option>Distance</option>
              </select>
            </div>

            {/* Results Grid */}
            <div className="space-y-6">
              {searchResults.map((service) => (
                <Card
                  key={service.id}
                  className="bg-white/80 backdrop-blur-sm border-purple-200 hover:border-helpers-accent transition-colors"
                >
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Service Image */}
                      <img
                        src={service.image || "/placeholder.svg"}
                        alt={service.name}
                        className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                      />

                      {/* Service Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{service.name}</h3>
                            <p className="text-gray-600">{service.provider}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">${service.price}</div>
                            <div className="text-sm text-gray-600">{service.duration}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{service.rating}</span>
                            <span className="text-gray-600">({service.reviews} reviews)</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{service.location}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">{service.duration}</span>
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-4">{service.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            {service.badges.map((badge) => (
                              <Badge key={badge} variant="secondary" className="bg-purple-50 text-gray-600">
                                {badge}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="border-purple-200 text-gray-600 hover:bg-purple-50 bg-transparent"
                            >
                              View Details
                            </Button>
                            <Button
                              className="bg-purple-600 hover:bg-purple-600-dark text-white"
                              onClick={() => (window.location.href = `/user/service/${service.id}`)}
                            >
                              Book Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-purple-200 text-gray-600 hover:bg-purple-50 bg-transparent"
                >
                  Previous
                </Button>
                <Button className="bg-purple-600 text-white">1</Button>
                <Button
                  variant="outline"
                  className="border-purple-200 text-gray-600 hover:bg-purple-50 bg-transparent"
                >
                  2
                </Button>
                <Button
                  variant="outline"
                  className="border-purple-200 text-gray-600 hover:bg-purple-50 bg-transparent"
                >
                  3
                </Button>
                <Button
                  variant="outline"
                  className="border-purple-200 text-gray-600 hover:bg-purple-50 bg-transparent"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
