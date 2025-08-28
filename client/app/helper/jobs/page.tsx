"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Clock, MapPin, Star, MessageCircle, Phone, DollarSign } from "lucide-react"
import Link from "next/link"

export default function HelperJobs() {
  const [activeTab, setActiveTab] = useState("accepted")

  const jobs = {
    accepted: [
      {
        id: 1,
        service: "Deep House Cleaning",
        customer: "Sarah M.",
        customerRating: 4.9,
        date: "2025-01-15",
        time: "14:00 - 16:00",
        address: "123 Main St, Manhattan, NY",
        price: 89,
        status: "upcoming",
        phone: "+1 (555) 123-4567",
        image: "/house-cleaning-service.png",
      },
      {
        id: 2,
        service: "AC Repair & Maintenance",
        customer: "Mike R.",
        customerRating: 4.7,
        date: "2025-01-16",
        time: "10:00 - 12:00",
        address: "456 Oak Ave, Brooklyn, NY",
        price: 65,
        status: "upcoming",
        phone: "+1 (555) 987-6543",
        image: "/air-conditioning-repair.png",
      },
    ],
    completed: [
      {
        id: 3,
        service: "Interior Wall Painting",
        customer: "Jennifer L.",
        customerRating: 4.8,
        date: "2025-01-10",
        time: "09:00 - 13:00",
        address: "789 Pine St, Queens, NY",
        price: 120,
        status: "completed",
        phone: "+1 (555) 456-7890",
        image: "/interior-painting.png",
        customerReview: "Excellent work! Very professional and clean.",
        myRating: 5,
      },
      {
        id: 4,
        service: "Bathroom Deep Clean",
        customer: "David K.",
        customerRating: 4.6,
        date: "2025-01-08",
        time: "13:00 - 15:00",
        address: "321 Elm St, Manhattan, NY",
        price: 45,
        status: "completed",
        phone: "+1 (555) 234-5678",
        image: "/house-cleaning-service.png",
        customerReview: "Good service, arrived on time and did thorough work.",
        myRating: 4,
      },
    ],
    cancelled: [
      {
        id: 5,
        service: "Kitchen Appliance Repair",
        customer: "Lisa P.",
        customerRating: 4.8,
        date: "2025-01-12",
        time: "15:00 - 17:00",
        address: "654 Maple Dr, Bronx, NY",
        price: 85,
        status: "cancelled",
        phone: "+1 (555) 345-6789",
        image: "/air-conditioning-repair.png",
        cancelReason: "Customer cancelled due to scheduling conflict",
        cancelledBy: "customer",
      },
    ],
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-700"
      case "completed":
        return "bg-green-100 text-green-700"
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
    <div className="min-h-screen bg-helpers-light">
      {/* Header */}
      <header className="bg-white border-b border-helpers-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/helper/dashboard" className="text-helpers-purple hover:text-helpers-dark">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-bold text-helpers-dark">My Jobs</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="accepted">Accepted ({jobs.accepted.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({jobs.completed.length})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled ({jobs.cancelled.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="accepted" className="space-y-6">
            {jobs.accepted.map((job) => (
              <Card key={job.id} className="bg-white border-helpers-muted">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <img
                      src={job.image || "/placeholder.svg"}
                      alt={job.service}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-helpers-dark">{job.service}</h3>
                          <p className="text-helpers-purple">Customer: {job.customer}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{job.customerRating}</span>
                            <span className="text-sm text-helpers-purple">customer rating</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                          <div className="text-lg font-bold text-helpers-dark mt-1">${job.price}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-helpers-purple">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(job.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{job.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{job.address}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-helpers-muted text-helpers-purple hover:bg-helpers-pale bg-transparent"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message Customer
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-helpers-muted text-helpers-purple hover:bg-helpers-pale bg-transparent"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Call Customer
                        </Button>
                        <Button size="sm" className="bg-helpers-accent hover:bg-helpers-accent-dark text-white">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            {jobs.completed.map((job) => (
              <Card key={job.id} className="bg-white border-helpers-muted">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <img
                      src={job.image || "/placeholder.svg"}
                      alt={job.service}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-helpers-dark">{job.service}</h3>
                          <p className="text-helpers-purple">Customer: {job.customer}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{job.customerRating}</span>
                            <span className="text-sm text-helpers-purple">customer rating</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                          <div className="text-lg font-bold text-helpers-dark mt-1">${job.price}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-helpers-purple">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(job.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{job.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{job.address}</span>
                        </div>
                      </div>

                      {job.customerReview && (
                        <div className="bg-helpers-pale border border-helpers-muted rounded-lg p-3 mb-4">
                          <p className="text-sm font-medium text-helpers-dark mb-1">Customer Review:</p>
                          <p className="text-sm text-helpers-purple">{job.customerReview}</p>
                          <div className="flex items-center gap-1 mt-2">
                            <span className="text-sm text-helpers-purple">Customer rated you:</span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < (job.myRating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-helpers-muted text-helpers-purple hover:bg-helpers-pale bg-transparent"
                        >
                          <DollarSign className="w-4 h-4 mr-2" />
                          View Payment
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-helpers-muted text-helpers-purple hover:bg-helpers-pale bg-transparent"
                        >
                          Contact Customer
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-6">
            {jobs.cancelled.map((job) => (
              <Card key={job.id} className="bg-white border-helpers-muted">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <img
                      src={job.image || "/placeholder.svg"}
                      alt={job.service}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-helpers-dark">{job.service}</h3>
                          <p className="text-helpers-purple">Customer: {job.customer}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{job.customerRating}</span>
                            <span className="text-sm text-helpers-purple">customer rating</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                          <div className="text-sm text-helpers-purple mt-1">Cancelled by {job.cancelledBy}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-helpers-purple">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(job.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{job.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{job.address}</span>
                        </div>
                      </div>

                      {job.cancelReason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                          <p className="text-sm font-medium text-red-800 mb-1">Cancellation Reason:</p>
                          <p className="text-sm text-red-700">{job.cancelReason}</p>
                        </div>
                      )}
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
