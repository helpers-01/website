"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, Eye, AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react"
import AdminNav from "@/components/admin-nav"

export default function BookingManagement() {
  const bookings = [
    {
      id: "BK001",
      service: "House Cleaning",
      customer: "Priya Sharma",
      helper: "Sunita Devi",
      date: "2024-03-25",
      time: "10:00 AM",
      amount: 1200,
      status: "Completed",
      address: "Bandra West, Mumbai",
      customerAvatar: "/placeholder.svg?height=32&width=32",
      helperAvatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "BK002",
      service: "Plumbing",
      customer: "Rahul Kumar",
      helper: "Rajesh Kumar",
      date: "2024-03-25",
      time: "2:00 PM",
      amount: 800,
      status: "In Progress",
      address: "Connaught Place, Delhi",
      customerAvatar: "/placeholder.svg?height=32&width=32",
      helperAvatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "BK003",
      service: "AC Repair",
      customer: "Anjali Patel",
      helper: "Amit Sharma",
      date: "2024-03-26",
      time: "11:00 AM",
      amount: 1500,
      status: "Scheduled",
      address: "Satellite, Ahmedabad",
      customerAvatar: "/placeholder.svg?height=32&width=32",
      helperAvatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "BK004",
      service: "Beauty & Spa",
      customer: "Meera Singh",
      helper: "Kavita Devi",
      date: "2024-03-24",
      time: "4:00 PM",
      amount: 2000,
      status: "Disputed",
      address: "Koramangala, Bangalore",
      customerAvatar: "/placeholder.svg?height=32&width=32",
      helperAvatar: "/placeholder.svg?height=32&width=32",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-success" />
      case "In Progress":
        return <Clock className="h-4 w-4 text-info" />
      case "Scheduled":
        return <Clock className="h-4 w-4 text-warning" />
      case "Disputed":
        return <AlertTriangle className="h-4 w-4 text-error" />
      case "Cancelled":
        return <XCircle className="h-4 w-4 text-textSecondary" />
      default:
        return <Clock className="h-4 w-4 text-textSecondary" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-success/20 text-success hover:bg-success/30"
      case "In Progress":
        return "bg-info/20 text-info hover:bg-info/30"
      case "Scheduled":
        return "bg-warning/20 text-warning hover:bg-warning/30"
      case "Disputed":
        return "bg-error/20 text-error hover:bg-error/30"
      case "Cancelled":
        return "bg-textSecondary/20 text-textSecondary hover:bg-textSecondary/30"
      default:
        return "bg-textSecondary/20 text-textSecondary hover:bg-textSecondary/30"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-100 to-orange-200">
      <AdminNav />

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-textPrimary hover:scale-105 transition-transform duration-300">Booking Management</h1>
          <p className="text-textSecondary">Monitor and manage all platform bookings</p>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Search Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by booking ID, customer, or service..."
                  className="pl-10 border-purple-200 focus:border-purple-400"
                />
              </div>
              <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Booking Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-gray-900">45,892</div>
              <p className="text-sm text-gray-600">Total Bookings</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">38,234</div>
              <p className="text-sm text-gray-600">Completed</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600">3,456</div>
              <p className="text-sm text-gray-600">In Progress</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-yellow-600">2,847</div>
              <p className="text-sm text-gray-600">Scheduled</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-red-600">1,355</div>
              <p className="text-sm text-gray-600">Disputed</p>
            </CardContent>
          </Card>
        </div>

        {/* Bookings List */}
        <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
          <CardHeader>
            <CardTitle className="text-gray-900">All Bookings</CardTitle>
            <CardDescription>Complete list of platform bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">{booking.id}</p>
                      <p className="text-xs text-gray-500">{booking.date}</p>
                      <p className="text-xs text-gray-500">{booking.time}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{booking.service}</h3>
                      <p className="text-sm text-gray-600">{booking.address}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={booking.customerAvatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs bg-purple-200 text-purple-700">
                              {booking.customer
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-gray-600">{booking.customer}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={booking.helperAvatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs bg-purple-200 text-purple-700">
                              {booking.helper
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-gray-600">{booking.helper}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-600">₹{booking.amount}</div>
                    <p className="text-xs text-gray-500">Total Amount</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(booking.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(booking.status)}
                        {booking.status}
                      </div>
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {booking.status === "Disputed" && (
                      <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
