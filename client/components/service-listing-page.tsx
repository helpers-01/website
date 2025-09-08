"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Star, MapPin, Clock, Filter, SlidersHorizontal } from "lucide-react"
import Link from "next/link"

interface ServiceListingPageProps {
  categoryId: string
}

const mockServices = [
  {
    id: "1",
    name: "Premium Men's Haircut & Styling",
    provider: "StyleCraft Salon",
    price: 299,
    originalPrice: 399,
    duration: "45 min",
    rating: 4.8,
    reviewCount: 234,
    image: "/IMG-20250907-WA0044.jpg",
    verified: true,
    location: "Koramangala",
    availability: "Available today",
    tags: ["Popular", "Trending"],
  },
  {
    id: "2",
    name: "Complete Home Deep Cleaning",
    provider: "CleanPro Services",
    price: 1299,
    originalPrice: 1599,
    duration: "3-4 hours",
    rating: 4.7,
    reviewCount: 189,
    image: "/IMG-20250907-WA0045.jpg",
    verified: true,
    location: "Indiranagar",
    availability: "Available tomorrow",
    tags: ["Bestseller"],
  },
  {
    id: "3",
    name: "AC Service & Gas Refilling",
    provider: "CoolTech Repairs",
    price: 449,
    originalPrice: 599,
    duration: "1-2 hours",
    rating: 4.6,
    reviewCount: 156,
    image: "/IMG-20250907-WA0046.jpg",
    verified: true,
    location: "Whitefield",
    availability: "Available today",
    tags: ["Quick Service"],
  },
  {
    id: "4",
    name: "Interior Wall Painting",
    provider: "PaintMasters",
    price: 89,
    originalPrice: 120,
    duration: "Per sq ft",
    rating: 4.5,
    reviewCount: 98,
    image: "/IMG-20250907-WA0047.jpg",
    verified: true,
    location: "HSR Layout",
    availability: "Available in 2 days",
    tags: ["Affordable"],
  },
]

export function ServiceListingPage({ categoryId }: ServiceListingPageProps) {
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [sortBy, setSortBy] = useState("popularity")
  const [showFilters, setShowFilters] = useState(false)

  const categoryNames: Record<string, string> = {
    "salon-beauty": "Salon & Beauty",
    "home-cleaning": "Home Cleaning",
    "appliance-repair": "Appliance Repair",
    painting: "Painting",
    electrical: "Electrical",
    plumbing: "Plumbing",
    carpentry: "Carpentry",
    "pest-control": "Pest Control",
    "ac-service": "AC Service",
    gardening: "Gardening",
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <Link href="/services" className="hover:text-foreground">
            Services
          </Link>
          <span>/</span>
          <span className="text-foreground">{categoryNames[categoryId] || "Services"}</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{categoryNames[categoryId] || "Services"}</h1>
        <p className="text-muted-foreground">{mockServices.length} services available in your area</p>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <div className={`w-80 space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Price Range */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Price Range</Label>
                <Slider value={priceRange} onValueChange={setPriceRange} max={2000} step={50} className="w-full" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>

              <Separator />

              {/* Rating */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Rating</Label>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center space-x-2">
                      <Checkbox id={`rating-${rating}`} />
                      <Label htmlFor={`rating-${rating}`} className="flex items-center gap-1 text-sm cursor-pointer">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <span>{rating}+ stars</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Location */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Location</Label>
                <div className="space-y-2">
                  {["Koramangala", "Indiranagar", "Whitefield", "HSR Layout", "Marathahalli"].map((location) => (
                    <div key={location} className="flex items-center space-x-2">
                      <Checkbox id={`location-${location}`} />
                      <Label htmlFor={`location-${location}`} className="text-sm cursor-pointer">
                        {location}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Availability */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Availability</Label>
                <div className="space-y-2">
                  {["Available today", "Available tomorrow", "Available this week"].map((availability) => (
                    <div key={availability} className="flex items-center space-x-2">
                      <Checkbox id={`availability-${availability}`} />
                      <Label htmlFor={`availability-${availability}`} className="text-sm cursor-pointer">
                        {availability}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Sort & Filter Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <span className="text-sm text-muted-foreground">Showing {mockServices.length} results</span>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Most Popular</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Service Cards */}
          <div className="space-y-4">
            {mockServices.map((service) => (
              <Card key={service.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-48 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={service.image || "/placeholder.svg"}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-1">{service.name}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            {service.provider}
                            {service.verified && (
                              <Badge variant="secondary" className="text-xs ml-2">
                                Verified
                              </Badge>
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-foreground">₹{service.price}</span>
                            {service.originalPrice > service.price && (
                              <span className="text-sm text-muted-foreground line-through">
                                ₹{service.originalPrice}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{service.duration}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{service.rating}</span>
                          <span>({service.reviewCount} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{service.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{service.availability}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {service.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button asChild>
                          <Link href={`/services/${categoryId}/${service.id}`}>Book Now</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
