"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, Check, X, Eye, Star } from "lucide-react"
import AdminNav from "@/components/admin-nav"

export default function HelperManagement() {
  const helpers = [
    {
      id: 1,
      name: "Rajesh Kumar",
      email: "rajesh.kumar@email.com",
      phone: "+91 98765 43210",
      services: ["Plumbing", "Electrical"],
      location: "Mumbai, Maharashtra",
      experience: "5 years",
      rating: 4.8,
      totalJobs: 156,
      status: "Approved",
      joinDate: "2024-01-10",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Sunita Devi",
      email: "sunita.devi@email.com",
      phone: "+91 87654 32109",
      services: ["House Cleaning", "Cooking"],
      location: "Delhi, NCR",
      experience: "3 years",
      rating: 4.9,
      totalJobs: 89,
      status: "Approved",
      joinDate: "2024-02-15",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Amit Sharma",
      email: "amit.sharma@email.com",
      phone: "+91 76543 21098",
      services: ["AC Repair", "Appliance Repair"],
      location: "Pune, Maharashtra",
      experience: "7 years",
      rating: 0,
      totalJobs: 0,
      status: "Pending",
      joinDate: "2024-03-20",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "Meera Patel",
      email: "meera.patel@email.com",
      phone: "+91 65432 10987",
      services: ["Beauty & Spa", "Massage"],
      location: "Ahmedabad, Gujarat",
      experience: "4 years",
      rating: 4.7,
      totalJobs: 234,
      status: "Approved",
      joinDate: "2024-01-25",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <AdminNav />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Helper Management</h1>
          <p className="text-gray-600">Manage service providers and their applications</p>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Search Helpers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, service, or location..."
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

        {/* Helper Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-gray-900">3,421</div>
              <p className="text-sm text-gray-600">Total Helpers</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">3,234</div>
              <p className="text-sm text-gray-600">Approved</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-yellow-600">125</div>
              <p className="text-sm text-gray-600">Pending</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-red-600">62</div>
              <p className="text-sm text-gray-600">Rejected</p>
            </CardContent>
          </Card>
        </div>

        {/* Helpers List */}
        <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
          <CardHeader>
            <CardTitle className="text-gray-900">All Helpers</CardTitle>
            <CardDescription>Complete list of service providers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {helpers.map((helper) => (
                <div
                  key={helper.id}
                  className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-100"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={helper.avatar || "/placeholder.svg"} alt={helper.name} />
                      <AvatarFallback className="bg-purple-200 text-purple-700">
                        {helper.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{helper.name}</h3>
                      <p className="text-sm text-gray-600">{helper.email}</p>
                      <p className="text-sm text-gray-500">{helper.phone}</p>
                      <div className="flex gap-1 mt-1">
                        {helper.services.map((service, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">{helper.location}</p>
                    <p className="text-xs text-gray-500">{helper.experience} experience</p>
                    <p className="text-xs text-gray-500">Joined {helper.joinDate}</p>
                  </div>

                  <div className="text-center">
                    {helper.rating > 0 ? (
                      <>
                        <div className="flex items-center gap-1 justify-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium text-gray-900">{helper.rating}</span>
                        </div>
                        <p className="text-xs text-gray-500">{helper.totalJobs} jobs completed</p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">No ratings yet</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        helper.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : helper.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {helper.status}
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
                    {helper.status === "Pending" && (
                      <>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
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
