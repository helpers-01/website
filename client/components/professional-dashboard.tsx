"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  DollarSign,
  Calendar,
  Star,
  MessageCircle,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Upload,
} from "lucide-react"

const mockEarnings = {
  today: 850,
  week: 4200,
  month: 18500,
  total: 125000,
}

const mockBookings = [
  {
    id: "BK001",
    customer: "Rahul Sharma",
    service: "Premium Men's Haircut",
    date: "2024-01-15",
    time: "10:00 AM",
    amount: 299,
    status: "pending",
    address: "Koramangala, Bangalore",
  },
  {
    id: "BK002",
    customer: "Amit Kumar",
    service: "Hair Styling",
    date: "2024-01-15",
    time: "2:00 PM",
    amount: 199,
    status: "confirmed",
    address: "Indiranagar, Bangalore",
  },
]

const mockReviews = [
  {
    id: 1,
    customer: "Priya Singh",
    rating: 5,
    comment: "Excellent service! Very professional and skilled.",
    date: "2024-01-10",
    service: "Women's Haircut",
  },
  {
    id: 2,
    customer: "Vikash Gupta",
    rating: 4,
    comment: "Good haircut, will book again.",
    date: "2024-01-08",
    service: "Men's Styling",
  },
]

export function ProfessionalDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Professional Dashboard</h1>
        <p className="text-muted-foreground">Manage your services, bookings, and earnings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="earnings" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Earnings
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Bookings
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Reviews
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Today's Earnings</p>
                    <p className="text-2xl font-bold text-green-600">₹{mockEarnings.today}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">This Week</p>
                    <p className="text-2xl font-bold text-blue-600">₹{mockEarnings.week}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Bookings</p>
                    <p className="text-2xl font-bold text-orange-600">3</p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <p className="text-2xl font-bold text-yellow-600">4.8</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest booking requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockBookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{booking.customer}</p>
                        <p className="text-sm text-muted-foreground">{booking.service}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(booking.date).toLocaleDateString()} at {booking.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={booking.status === "pending" ? "default" : "secondary"}>{booking.status}</Badge>
                        <p className="text-sm font-semibold">₹{booking.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Reviews</CardTitle>
                <CardDescription>Customer feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockReviews.slice(0, 2).map((review) => (
                    <div key={review.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{review.customer}</p>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Professional Profile</CardTitle>
              <CardDescription>Manage your professional information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>SP</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                  <p className="text-sm text-muted-foreground">Professional photo helps build trust with customers</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Business Name</label>
                  <input className="w-full p-2 border rounded-md" defaultValue="StyleCraft Salon" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Number</label>
                  <input className="w-full p-2 border rounded-md" defaultValue="+91 9876543210" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Experience</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>5+ years</option>
                    <option>3-5 years</option>
                    <option>1-3 years</option>
                    <option>Less than 1 year</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Service Area</label>
                  <input className="w-full p-2 border rounded-md" defaultValue="Koramangala, Indiranagar" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Bio</label>
                <textarea
                  className="w-full p-2 border rounded-md h-24"
                  defaultValue="Professional hair stylist with 5+ years of experience. Specialized in modern cuts and styling."
                />
              </div>

              <Button>Update Profile</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Portfolio</CardTitle>
              <CardDescription>Showcase your work to attract customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  </div>
                ))}
              </div>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Add Photos
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="earnings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <DollarSign className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Today</p>
                  <p className="text-2xl font-bold">₹{mockEarnings.today}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold">₹{mockEarnings.week}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Calendar className="w-12 h-12 text-purple-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">₹{mockEarnings.month}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Star className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Total Earned</p>
                  <p className="text-2xl font-bold">₹{mockEarnings.total.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Withdraw Earnings</CardTitle>
              <CardDescription>Transfer your earnings to your bank account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-800">Available Balance</p>
                <p className="text-2xl font-bold text-green-900">₹{mockEarnings.month}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bank Account</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>HDFC Bank - ****1234</option>
                    <option>Add New Account</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount</label>
                  <input className="w-full p-2 border rounded-md" placeholder="Enter amount to withdraw" />
                </div>
              </div>

              <Button>Withdraw Money</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Booking Requests</h2>
              <p className="text-muted-foreground">Manage your service bookings</p>
            </div>
          </div>

          <div className="space-y-4">
            {mockBookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>{booking.customer[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{booking.customer}</h3>
                          <p className="text-sm text-muted-foreground">{booking.service}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          {new Date(booking.date).toLocaleDateString()} at {booking.time}
                        </span>
                        <span>{booking.address}</span>
                        <span className="font-semibold text-foreground">₹{booking.amount}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {booking.status === "pending" ? (
                        <>
                          <Button size="sm" variant="outline">
                            <XCircle className="w-4 h-4 mr-2" />
                            Decline
                          </Button>
                          <Button size="sm">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Accept
                          </Button>
                        </>
                      ) : (
                        <Badge variant="secondary">{booking.status}</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                  <p className="text-2xl font-bold">4.8</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <MessageCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Total Reviews</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">5 Star Reviews</p>
                  <p className="text-2xl font-bold">89%</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">23</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {mockReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>{review.customer[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{review.customer}</h3>
                          <p className="text-sm text-muted-foreground">{review.service}</p>
                          <p className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm">{review.comment}</p>
                    <Button size="sm" variant="outline">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Reply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}
