"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  CreditCard,
  MapPin,
  User,
  Wallet,
  MessageCircle,
  Star,
  Download,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
} from "lucide-react"

const mockBookings = [
  {
    id: "BK001",
    service: "Premium Men's Haircut & Styling",
    provider: "StyleCraft Salon",
    date: "2024-01-15",
    time: "10:00 AM",
    status: "upcoming",
    amount: 470,
    image: "/professional-haircut-salon.png",
  },
  {
    id: "BK002",
    service: "Complete Home Deep Cleaning",
    provider: "CleanPro Services",
    date: "2024-01-10",
    time: "2:00 PM",
    status: "completed",
    amount: 1299,
    rating: 5,
    image: "/home-cleaning-service.png",
  },
]

const mockTransactions = [
  {
    id: "TXN001",
    type: "payment",
    description: "Premium Men's Haircut & Styling",
    amount: -470,
    date: "2024-01-15",
    status: "completed",
  },
  {
    id: "TXN002",
    type: "cashback",
    description: "Cashback for Home Cleaning",
    amount: 65,
    date: "2024-01-10",
    status: "completed",
  },
]

const mockAddresses = [
  {
    id: "1",
    label: "Home",
    address: "123 MG Road, Koramangala, Bangalore - 560034",
    isDefault: true,
  },
  {
    id: "2",
    label: "Office",
    address: "456 Brigade Road, Commercial Street, Bangalore - 560025",
    isDefault: false,
  },
]

export function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("bookings")

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
        <p className="text-muted-foreground">Manage your bookings, payments, and profile</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Bookings
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="addresses" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Addresses
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="wallet" className="flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Wallet
          </TabsTrigger>
          <TabsTrigger value="support" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Support
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Bookings</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Upcoming</p>
                    <p className="text-2xl font-bold">1</p>
                  </div>
                  <Calendar className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">11</p>
                  </div>
                  <Calendar className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {mockBookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden">
                      <img
                        src={booking.image || "/placeholder.svg"}
                        alt={booking.service}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{booking.service}</h3>
                          <p className="text-sm text-muted-foreground">{booking.provider}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(booking.date).toLocaleDateString()} at {booking.time}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={booking.status === "upcoming" ? "default" : "secondary"}>
                            {booking.status}
                          </Badge>
                          <p className="text-sm font-semibold mt-1">₹{booking.amount}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {booking.status === "completed" && (
                          <>
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4 mr-2" />
                              Invoice
                            </Button>
                            <Button size="sm" variant="outline">
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Re-book
                            </Button>
                            {booking.rating && (
                              <div className="flex items-center gap-1 ml-auto">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm">{booking.rating}</span>
                              </div>
                            )}
                          </>
                        )}
                        {booking.status === "upcoming" && (
                          <Button size="sm" variant="outline">
                            Reschedule
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="text-2xl font-bold">₹8,450</p>
                  </div>
                  <CreditCard className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Cashback Earned</p>
                    <p className="text-2xl font-bold">₹425</p>
                  </div>
                  <Wallet className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Refunds</p>
                    <p className="text-2xl font-bold">₹0</p>
                  </div>
                  <RefreshCw className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Your recent payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === "payment" ? "bg-red-100" : "bg-green-100"
                        }`}
                      >
                        {transaction.type === "payment" ? (
                          <CreditCard className="w-5 h-5 text-red-600" />
                        ) : (
                          <Wallet className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                        {transaction.amount > 0 ? "+" : ""}₹{Math.abs(transaction.amount)}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="addresses" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Saved Addresses</h2>
              <p className="text-muted-foreground">Manage your service addresses</p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Address
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockAddresses.map((address) => (
              <Card key={address.id}>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold flex items-center gap-2">
                        {address.label}
                        {address.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </h3>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{address.address}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Button variant="outline">Change Photo</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <input className="w-full p-2 border rounded-md" defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input className="w-full p-2 border rounded-md" defaultValue="john.doe@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <input className="w-full p-2 border rounded-md" defaultValue="+91 9876543210" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date of Birth</label>
                  <input type="date" className="w-full p-2 border rounded-md" />
                </div>
              </div>

              <Button>Update Profile</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wallet" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Wallet className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Wallet Balance</p>
                  <p className="text-3xl font-bold">₹250</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Star className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Cashback Earned</p>
                  <p className="text-3xl font-bold">₹425</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <RefreshCw className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Referral Rewards</p>
                  <p className="text-3xl font-bold">₹150</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Money</CardTitle>
                <CardDescription>Top up your wallet balance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {[100, 200, 500].map((amount) => (
                    <Button key={amount} variant="outline" size="sm">
                      ₹{amount}
                    </Button>
                  ))}
                </div>
                <input className="w-full p-2 border rounded-md" placeholder="Enter amount" />
                <Button className="w-full">Add Money</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Refer & Earn</CardTitle>
                <CardDescription>Invite friends and earn rewards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium">Your Referral Code</p>
                  <p className="text-lg font-bold">JOHN2024</p>
                </div>
                <Button className="w-full">Share Code</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="support" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Get Help</CardTitle>
                <CardDescription>We're here to assist you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Live Chat Support
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Browse FAQ
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Submit Ticket
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common support requests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-sm">
                  Cancel a booking
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  Request refund
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  Report an issue
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  Update payment method
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}
