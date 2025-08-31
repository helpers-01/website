"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import UserNav from "@/components/user-nav"
import { useRealtimeBookings, useRealtimeServices } from "@/hooks/use-realtime"
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Star,
  Settings,
  Home,
  Wrench,
  Paintbrush,
  Car,
  Zap,
  Droplets,
} from "lucide-react"

export default function UserDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Real-time subscriptions for user dashboard
  useRealtimeBookings(() => {
    console.log('Booking status updated, refreshing user dashboard...')
    setRefreshTrigger(prev => prev + 1)
  })

  useRealtimeServices(() => {
    console.log('Services updated, refreshing user dashboard...')
    setRefreshTrigger(prev => prev + 1)
  })

  const upcomingBookings = [
    {
      id: 1,
      service: "House Cleaning",
      provider: "Sarah Johnson",
      date: "Today",
      time: "2:00 PM - 4:00 PM",
      status: "confirmed",
      rating: 4.8,
    },
    {
      id: 2,
      service: "AC Repair",
      provider: "Mike Chen",
      date: "Tomorrow",
      time: "10:00 AM - 12:00 PM",
      status: "pending",
      rating: 4.9,
    },
  ]

  const serviceCategories = [
    { name: "Home Cleaning", icon: Home, color: "bg-blue-100 text-blue-600" },
    { name: "Repairs", icon: Wrench, color: "bg-green-100 text-green-600" },
    { name: "Painting", icon: Paintbrush, color: "bg-purple-100 text-purple-600" },
    { name: "Car Service", icon: Car, color: "bg-orange-100 text-orange-600" },
    { name: "Electrical", icon: Zap, color: "bg-yellow-100 text-yellow-600" },
    { name: "Plumbing", icon: Droplets, color: "bg-cyan-100 text-cyan-600" },
  ]

  const recommendedServices = [
    {
      id: 1,
      name: "Deep House Cleaning",
      provider: "CleanPro Services",
      rating: 4.8,
      reviews: 234,
      price: "$89",
      image: "/house-cleaning-service.png",
    },
    {
      id: 2,
      name: "AC Maintenance",
      provider: "CoolAir Experts",
      rating: 4.9,
      reviews: 156,
      price: "$65",
      image: "/air-conditioning-repair.png",
    },
    {
      id: 3,
      name: "Interior Painting",
      provider: "ColorCraft Painters",
      rating: 4.7,
      reviews: 89,
      price: "$120",
      image: "/interior-painting.png",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <UserNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-gray-900">Welcome back, John!</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 font-medium">Live Updates</span>
            </div>
          </div>
          <p className="text-gray-600">What service do you need today?</p>
        </div>

        {/* Search Bar */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-purple-200">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search for services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-purple-200 focus:border-purple-400"
                />
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">New York, NY</span>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">Search</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service Categories */}
            <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Popular Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {serviceCategories.map((category) => {
                    const IconComponent = category.icon
                    return (
                      <button
                        key={category.name}
                        className="flex flex-col items-center gap-3 p-4 rounded-lg border border-purple-200 hover:border-purple-400 transition-colors bg-white/50"
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${category.color}`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{category.name}</span>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Services */}
            <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Recommended for You</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommendedServices.map((service) => (
                    <div key={service.id} className="border border-purple-200 rounded-lg overflow-hidden bg-white/50">
                      <img
                        src={service.image || "/placeholder.svg"}
                        alt={service.name}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{service.provider}</p>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{service.rating}</span>
                          </div>
                          <span className="text-sm text-gray-600">({service.reviews} reviews)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-900">{service.price}</span>
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Bookings */}
            <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Upcoming Bookings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="border border-purple-200 rounded-lg p-4 bg-white/50">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{booking.service}</h4>
                      <Badge
                        variant={booking.status === "confirmed" ? "default" : "secondary"}
                        className={
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{booking.provider}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{booking.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{booking.rating}</span>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent"
                >
                  View All Bookings
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  My Bookings
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Leave Review
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
