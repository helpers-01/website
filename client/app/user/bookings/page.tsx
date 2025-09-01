"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Clock, MapPin, Star, MessageCircle, RotateCcw, X } from "lucide-react"
import Link from "next/link"

export default function MyBookings() {
  const [activeTab, setActiveTab] = useState("upcoming")

  const bookings = {
    upcoming: [
      {
        id: 1,
        service: "Deep House Cleaning",
        provider: "CleanPro Services",
        providerRating: 4.8,
        date: "2025-01-15",
        time: "14:00",
        duration: "3-4 hours",
        address: "123 Main St, New York, NY 10001",
        price: 89,
        status: "confirmed",
        image: "/house-cleaning-service.png",
      },
      {
        id: 2,
        service: "AC Repair & Maintenance",
        provider: "CoolAir Experts",
        providerRating: 4.9,
        date: "2025-01-16",
        time: "10:00",
        duration: "1-2 hours",
        address: "456 Oak Ave, Brooklyn, NY 11201",
        price: 65,
        status: "pending",
        image: "/air-conditioning-repair.png",
      },
    ],
    completed: [
      {
        id: 3,
        service: "Interior Wall Painting",
        provider: "ColorCraft Painters",
        providerRating: 4.7,
        date: "2025-01-10",
        time: "09:00",
        duration: "4-6 hours",
        address: "789 Pine St, Queens, NY 11375",
        price: 120,
        status: "completed",
        image: "/interior-painting.png",
        canReview: true,
      },
      {
        id: 4,
        service: "Bathroom Deep Clean",
        provider: "Sparkle Clean Co",
        providerRating: 4.6,
        date: "2025-01-05",
        time: "13:00",
        duration: "1-2 hours",
        address: "321 Elm St, Manhattan, NY 10002",
        price: 45,
        status: "completed",
        image: "/house-cleaning-service.png",
        reviewed: true,
        myRating: 5,
      },
    ],
    cancelled: [
      {
        id: 5,
        service: "Kitchen Appliance Repair",
        provider: "FixIt Fast",
        providerRating: 4.8,
        date: "2025-01-08",
        time: "15:00",
        duration: "2-3 hours",
        address: "654 Maple Dr, Bronx, NY 10451",
        price: 85,
        status: "cancelled",
        image: "/air-conditioning-repair.png",
        cancelledBy: "customer",
        refundAmount: 85,
      },
    ],
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "completed":
        return "bg-blue-100 text-blue-700"
      case "cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface to-primary/5">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/user/dashboard" className="text-textSecondary hover:text-textPrimary">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-bold text-textPrimary">My Bookings</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="upcoming">Upcoming ({bookings.upcoming.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({bookings.completed.length})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled ({bookings.cancelled.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            {bookings.upcoming.map((booking) => (
              <Card key={booking.id} className="bg-white/80 backdrop-blur-sm border-border">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <img
                      src={booking.image || "/placeholder.svg"}
                      alt={booking.service}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-textPrimary">{booking.service}</h3>
                          <p className="text-textSecondary">{booking.provider}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{booking.providerRating}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                          <div className="text-lg font-bold text-textPrimary mt-1">${booking.price}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-textSecondary">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(booking.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>
                            {booking.time} ({booking.duration})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{booking.address}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message Provider
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Reschedule
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-error text-error hover:bg-error/10"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            {bookings.completed.map((booking) => (
              <Card key={booking.id} className="bg-white/80 backdrop-blur-sm border-border">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <img
                      src={booking.image || "/placeholder.svg"}
                      alt={booking.service}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-textPrimary">{booking.service}</h3>
                          <p className="text-textSecondary">{booking.provider}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{booking.providerRating}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                          <div className="text-lg font-bold text-textPrimary mt-1">${booking.price}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-textSecondary">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(booking.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>
                            {booking.time} ({booking.duration})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{booking.address}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {booking.reviewed ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Your rating:</span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < (booking.myRating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        ) : booking.canReview ? (
                          <Link href={`/user/review/${booking.id}`}>
                            <Button
                              size="sm"
                              className="bg-primary hover:bg-primaryLight text-white"
                            >
                              <Star className="w-4 h-4 mr-2" />
                              Leave Review
                            </Button>
                          </Link>
                        ) : null}
                        <Button
                          size="sm"
                          variant="outline"
                        >
                          Book Again
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-6">
            {bookings.cancelled.map((booking) => (
              <Card key={booking.id} className="bg-white/80 backdrop-blur-sm border-border">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <img
                      src={booking.image || "/placeholder.svg"}
                      alt={booking.service}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-textPrimary">{booking.service}</h3>
                          <p className="text-textSecondary">{booking.provider}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{booking.providerRating}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                          <div className="text-sm text-textSecondary mt-1">Refunded: ${booking.refundAmount}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-textSecondary">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(booking.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>
                            {booking.time} ({booking.duration})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{booking.address}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="bg-primary hover:bg-primaryLight text-white">
                          Book Again
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
