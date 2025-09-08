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
      image: "/IMG-20250907-WA0045.jpg",
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
      image: "/IMG-20250907-WA0046.jpg",
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
      image: "/IMG-20250907-WA0047.jpg",
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
      image: "/IMG-20250907-WA0045.jpg",
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
      image: "/IMG-20250907-WA0046.jpg",
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
      image: "/IMG-20250907-WA0047.jpg",
      badges: ["Top Rated", "Weather Resistant"],
      description: "Complete exterior painting service with weather-resistant premium paints.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/user/dashboard" className="text-textSecondary hover:text-textPrimary">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-bold text-textPrimary">Search Results</h1>
            </div>
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" />
                <Input
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
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
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-textPrimary mb-4">Price Range</h3>
                  <div className="space-y-4">
                    <Slider value={priceRange} onValueChange={setPriceRange} max={500} step={10} className="w-full" />
                    <div className="flex justify-between text-sm text-textSecondary">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-textPrimary mb-4">Categories</h3>
                  <div className="space-y-3">
                    {filters.categories.map((category) => (
                      <div key={category.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox id={category.id} />
                          <label htmlFor={category.id} className="text-sm text-textPrimary">
                            {category.label}
                          </label>
                        </div>
                        <span className="text-xs text-textSecondary">({category.count})</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Ratings */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-textPrimary mb-4">Rating</h3>
                  <div className="space-y-3">
                    {filters.ratings.map((rating) => (
                      <div key={rating.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox id={rating.id} />
                          <label htmlFor={rating.id} className="text-sm text-textPrimary">
                            {rating.label}
                          </label>
                        </div>
                        <span className="text-xs text-textSecondary">({rating.count})</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Availability */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-textPrimary mb-4">Availability</h3>
                  <div className="space-y-3">
                    {filters.availability.map((avail) => (
                      <div key={avail.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox id={avail.id} />
                          <label htmlFor={avail.id} className="text-sm text-textPrimary">
                            {avail.label}
                          </label>
                        </div>
                        <span className="text-xs text-textSecondary">({avail.count})</span>
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
                <h2 className="text-xl font-bold text-textPrimary">{searchResults.length} services found</h2>
                <p className="text-textSecondary">Showing results for "cleaning services"</p>
              </div>
              <select className="border border-border rounded-lg px-3 py-2 text-sm text-textPrimary">
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
                  className="hover:shadow-md transition-shadow"
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
                            <h3 className="text-lg font-semibold text-textPrimary mb-1">{service.name}</h3>
                            <p className="text-textSecondary">{service.provider}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-textPrimary">${service.price}</div>
                            <div className="text-sm text-textSecondary">{service.duration}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{service.rating}</span>
                            <span className="text-textSecondary">({service.reviews} reviews)</span>
                          </div>
                          <div className="flex items-center gap-1 text-textSecondary">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{service.location}</span>
                          </div>
                          <div className="flex items-center gap-1 text-textSecondary">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">{service.duration}</span>
                          </div>
                        </div>

                        <p className="text-textSecondary text-sm mb-4">{service.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            {service.badges.map((badge) => (
                              <Badge key={badge} variant="secondary" className="bg-surface text-textSecondary">
                                {badge}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline">
                              View Details
                            </Button>
                            <Link href={`/user/service/${service.id}`}>
                              <Button>
                                Book Now
                              </Button>
                            </Link>
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
                <Button variant="outline">
                  Previous
                </Button>
                <Button>1</Button>
                <Button variant="outline">
                  2
                </Button>
                <Button variant="outline">
                  3
                </Button>
                <Button variant="outline">
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
