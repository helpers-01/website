"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import HelperNav from "@/components/helper-nav"
import {
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Star,
  TrendingUp,
  Users,
  CheckCircle,
  X,
  MessageCircle,
  Phone,
} from "lucide-react"

export default function HelperDashboard() {
  const [activeTab, setActiveTab] = useState("requests")

  const helperStats = {
    todayEarnings: 245,
    weeklyEarnings: 1240,
    monthlyEarnings: 4850,
    completedJobs: 127,
    rating: 4.8,
    responseRate: 95,
  }

  const newRequests = [
    {
      id: 1,
      service: "Deep House Cleaning",
      customer: "Sarah M.",
      date: "Today",
      time: "2:00 PM - 4:00 PM",
      address: "123 Main St, Manhattan",
      price: 89,
      distance: "0.8 miles",
      customerRating: 4.9,
      urgency: "same-day",
    },
    {
      id: 2,
      service: "Bathroom Deep Clean",
      customer: "Mike R.",
      date: "Tomorrow",
      time: "10:00 AM - 12:00 PM",
      address: "456 Oak Ave, Brooklyn",
      price: 45,
      distance: "1.2 miles",
      customerRating: 4.7,
      urgency: "normal",
    },
    {
      id: 3,
      service: "Kitchen Deep Clean",
      customer: "Jennifer L.",
      date: "Jan 17",
      time: "3:00 PM - 5:00 PM",
      address: "789 Pine St, Queens",
      price: 65,
      distance: "2.1 miles",
      customerRating: 4.8,
      urgency: "normal",
    },
  ]

  const todaySchedule = [
    {
      id: 1,
      service: "Interior Painting",
      customer: "David K.",
      time: "9:00 AM - 1:00 PM",
      address: "321 Elm St, Manhattan",
      price: 120,
      status: "confirmed",
      phone: "+1 (555) 123-4567",
    },
    {
      id: 2,
      service: "AC Repair",
      customer: "Lisa P.",
      time: "3:00 PM - 5:00 PM",
      address: "654 Maple Dr, Bronx",
      price: 85,
      status: "in-progress",
      phone: "+1 (555) 987-6543",
    },
  ]

  const handleAcceptRequest = (requestId: number) => {
    console.log("Accepted request:", requestId)
    // Handle accept logic
  }

  const handleDeclineRequest = (requestId: number) => {
    console.log("Declined request:", requestId)
    // Handle decline logic
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <HelperNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, Alex!</h2>
          <p className="text-gray-600">Here are your latest job requests and schedule</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Today's Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">${helperStats.todayEarnings}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-gray-900">${helperStats.weeklyEarnings}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rating</p>
                  <div className="flex items-center gap-1">
                    <p className="text-2xl font-bold text-gray-900">{helperStats.rating}</p>
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  </div>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Jobs Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{helperStats.completedJobs}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="requests">New Requests ({newRequests.length})</TabsTrigger>
                <TabsTrigger value="schedule">Today's Schedule ({todaySchedule.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="requests" className="space-y-4">
                {newRequests.map((request) => (
                  <Card key={request.id} className="bg-white/80 backdrop-blur-sm border-purple-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{request.service}</h3>
                            {request.urgency === "same-day" && (
                              <Badge className="bg-red-100 text-red-700">Same Day</Badge>
                            )}
                          </div>
                          <p className="text-gray-600 mb-1">Customer: {request.customer}</p>
                          <div className="flex items-center gap-1 mb-2">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{request.customerRating}</span>
                            <span className="text-sm text-gray-600">customer rating</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">${request.price}</div>
                          <div className="text-sm text-gray-600">{request.distance} away</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{request.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{request.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{request.address}</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleAcceptRequest(request.id)}
                          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Accept Job
                        </Button>
                        <Button
                          onClick={() => handleDeclineRequest(request.id)}
                          variant="outline"
                          className="flex-1 border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Decline
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="schedule" className="space-y-4">
                {todaySchedule.map((job) => (
                  <Card key={job.id} className="bg-white/80 backdrop-blur-sm border-purple-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{job.service}</h3>
                          <p className="text-gray-600 mb-1">Customer: {job.customer}</p>
                          <Badge
                            className={
                              job.status === "confirmed"
                                ? "bg-green-100 text-green-700"
                                : job.status === "in-progress"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }
                          >
                            {job.status}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">${job.price}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{job.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{job.address}</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          className="border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message Customer
                        </Button>
                        <Button
                          variant="outline"
                          className="border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Call Customer
                        </Button>
                        {job.status === "confirmed" && (
                          <Button className="bg-purple-600 hover:bg-purple-700 text-white">Start Job</Button>
                        )}
                        {job.status === "in-progress" && (
                          <Button className="bg-green-600 hover:bg-green-700 text-white">Complete Job</Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Response Rate</span>
                  <span className="font-medium text-gray-900">{helperStats.responseRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-medium text-gray-900">${helperStats.monthlyEarnings}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Jobs This Week</span>
                  <span className="font-medium text-gray-900">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Avg. Job Value</span>
                  <span className="font-medium text-gray-900">$78</span>
                </div>
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
                  onClick={() => (window.location.href = "/helper/jobs")}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  View All Jobs
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent"
                  onClick={() => (window.location.href = "/helper/earnings")}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  View Earnings
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent"
                  onClick={() => (window.location.href = "/helper/profile")}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent"
                  onClick={() => (window.location.href = "/helper/reviews")}
                >
                  <Star className="w-4 h-4 mr-2" />
                  View Reviews
                </Button>
              </CardContent>
            </Card>

            {/* Availability Status */}
            <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Status</span>
                  <Badge className="bg-green-100 text-green-700">Available</Badge>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent"
                >
                  Update Availability
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
