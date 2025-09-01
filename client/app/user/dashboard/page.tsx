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
    { name: "Home Cleaning", icon: Home, color: "bg-primary text-white" },
    { name: "Repairs", icon: Wrench, color: "bg-success text-white" },
    { name: "Painting", icon: Paintbrush, color: "bg-primary text-white" },
    { name: "Car Service", icon: Car, color: "bg-warning text-textPrimary" },
    { name: "Electrical", icon: Zap, color: "bg-warning text-textPrimary" },
    { name: "Plumbing", icon: Droplets, color: "bg-info text-white" },
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
    <div className="min-h-screen bg-background">
      <UserNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-textPrimary">Welcome back, John!</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm text-success font-medium">Live Updates</span>
            </div>
          </div>
          <p className="text-textSecondary">What service do you need today?</p>
        </div>

        {/* Search Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" />
                <Input
                  placeholder="Search for services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 text-textSecondary">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">New York, NY</span>
              </div>
              <Button>Search</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-textPrimary">Popular Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {serviceCategories.map((category) => {
                    const IconComponent = category.icon
                    return (
                      <button
                        key={category.name}
                        className="flex flex-col items-center gap-3 p-4 rounded-lg border border-border hover:border-primary transition-colors bg-surface"
                      >
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary text-white">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-medium text-textPrimary">{category.name}</span>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Services */}
            <Card>
              <CardHeader>
                <CardTitle className="text-textPrimary">Recommended for You</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommendedServices.map((service) => (
                    <div key={service.id} className="border border-border rounded-lg overflow-hidden bg-surface">
                      <img
                        src={service.image || "/placeholder.svg"}
                        alt={service.name}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-textPrimary mb-1">{service.name}</h3>
                        <p className="text-sm text-textSecondary mb-2">{service.provider}</p>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{service.rating}</span>
                          </div>
                          <span className="text-sm text-textSecondary">({service.reviews} reviews)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-textPrimary">{service.price}</span>
                          <Button size="sm">
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
            <Card>
              <CardHeader>
                <CardTitle className="text-textPrimary">Upcoming Bookings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="border border-border rounded-lg p-4 bg-surface">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-textPrimary">{booking.service}</h4>
                      <Badge
                        variant={booking.status === "confirmed" ? "default" : "secondary"}
                        className={
                          booking.status === "confirmed"
                            ? "bg-success text-white"
                            : "bg-warning text-textPrimary"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-textSecondary mb-2">{booking.provider}</p>
                    <div className="flex items-center gap-4 text-sm text-textSecondary">
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
                <Button variant="outline" className="w-full">
                  View All Bookings
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-textPrimary">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  My Bookings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Star className="w-4 h-4 mr-2" />
                  Leave Review
                </Button>
                <Button variant="outline" className="w-full justify-start">
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
