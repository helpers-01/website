"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, User, Camera, Plus, X, Star, Clock } from "lucide-react"
import Link from "next/link"

export default function HelperProfile() {
  const [profile, setProfile] = useState({
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Professional cleaner with 5+ years of experience. Specializing in deep cleaning and eco-friendly solutions.",
    location: "New York, NY",
    experience: "5 years",
  })

  const [services, setServices] = useState([
    {
      id: 1,
      name: "Deep House Cleaning",
      category: "Cleaning",
      price: 89,
      duration: "3-4 hours",
      description: "Complete deep cleaning service for your entire home",
    },
    {
      id: 2,
      name: "Bathroom Deep Clean",
      category: "Cleaning",
      price: 45,
      duration: "1-2 hours",
      description: "Thorough bathroom cleaning and sanitization",
    },
    {
      id: 3,
      name: "Kitchen Deep Clean",
      category: "Cleaning",
      price: 65,
      duration: "2-3 hours",
      description: "Complete kitchen cleaning including appliances",
    },
  ])

  const [availability, setAvailability] = useState({
    monday: { available: true, start: "09:00", end: "17:00" },
    tuesday: { available: true, start: "09:00", end: "17:00" },
    wednesday: { available: true, start: "09:00", end: "17:00" },
    thursday: { available: true, start: "09:00", end: "17:00" },
    friday: { available: true, start: "09:00", end: "17:00" },
    saturday: { available: true, start: "10:00", end: "16:00" },
    sunday: { available: false, start: "10:00", end: "16:00" },
  })

  const stats = {
    rating: 4.8,
    totalJobs: 127,
    responseRate: 95,
    onTimeRate: 98,
  }

  const handleProfileUpdate = () => {
    console.log("Profile updated:", profile)
  }

  const handleServiceUpdate = (serviceId: number, updatedService: any) => {
    setServices(services.map((service) => (service.id === serviceId ? { ...service, ...updatedService } : service)))
  }

  const handleAvailabilityUpdate = (day: string, updates: any) => {
    setAvailability({ ...availability, [day]: { ...availability[day as keyof typeof availability], ...updates } })
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
              <h1 className="text-xl font-bold text-helpers-dark">Profile Management</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="bg-white border-helpers-muted">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-helpers-dark">
                      <User className="w-5 h-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-helpers-accent rounded-full flex items-center justify-center">
                        <User className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <Button
                          variant="outline"
                          className="border-helpers-muted text-helpers-purple hover:bg-helpers-pale bg-transparent"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Change Photo
                        </Button>
                        <p className="text-sm text-helpers-purple mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="firstName" className="text-helpers-dark">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          value={profile.firstName}
                          onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                          className="border-helpers-muted focus:border-helpers-accent"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-helpers-dark">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          value={profile.lastName}
                          onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                          className="border-helpers-muted focus:border-helpers-accent"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-helpers-dark">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="border-helpers-muted focus:border-helpers-accent"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-helpers-dark">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="border-helpers-muted focus:border-helpers-accent"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="location" className="text-helpers-dark">
                          Location
                        </Label>
                        <Input
                          id="location"
                          value={profile.location}
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                          className="border-helpers-muted focus:border-helpers-accent"
                        />
                      </div>
                      <div>
                        <Label htmlFor="experience" className="text-helpers-dark">
                          Experience
                        </Label>
                        <Input
                          id="experience"
                          value={profile.experience}
                          onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                          className="border-helpers-muted focus:border-helpers-accent"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bio" className="text-helpers-dark">
                        Bio
                      </Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        className="border-helpers-muted focus:border-helpers-accent min-h-[100px]"
                        placeholder="Tell customers about your experience and specialties..."
                      />
                    </div>

                    <Button
                      onClick={handleProfileUpdate}
                      className="bg-helpers-accent hover:bg-helpers-accent-dark text-white"
                    >
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Stats Sidebar */}
              <div className="space-y-6">
                <Card className="bg-white border-helpers-muted">
                  <CardHeader>
                    <CardTitle className="text-helpers-dark">Profile Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-helpers-purple">Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-helpers-dark">{stats.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-helpers-purple">Total Jobs</span>
                      <span className="font-medium text-helpers-dark">{stats.totalJobs}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-helpers-purple">Response Rate</span>
                      <span className="font-medium text-helpers-dark">{stats.responseRate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-helpers-purple">On-Time Rate</span>
                      <span className="font-medium text-helpers-dark">{stats.onTimeRate}%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-helpers-muted">
                  <CardHeader>
                    <CardTitle className="text-helpers-dark">Profile Completion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-helpers-purple">Profile Info</span>
                        <span className="text-green-600">✓ Complete</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-helpers-purple">Services</span>
                        <span className="text-green-600">✓ Complete</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-helpers-purple">Availability</span>
                        <span className="text-green-600">✓ Complete</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-helpers-purple">Verification</span>
                        <span className="text-green-600">✓ Verified</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card className="bg-white border-helpers-muted">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-helpers-dark">
                  Services Offered
                  <Button className="bg-helpers-accent hover:bg-helpers-accent-dark text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Service
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {services.map((service) => (
                  <div key={service.id} className="border border-helpers-muted rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-helpers-dark">{service.name}</h3>
                        <Badge variant="secondary" className="bg-helpers-pale text-helpers-purple">
                          {service.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-helpers-muted text-helpers-purple hover:bg-helpers-pale bg-transparent"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-helpers-purple mb-4">{service.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-helpers-purple">Price:</span>
                        <span className="font-medium text-helpers-dark">${service.price}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-helpers-purple" />
                        <span className="text-helpers-dark">{service.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Availability Tab */}
          <TabsContent value="availability">
            <Card className="bg-white border-helpers-muted">
              <CardHeader>
                <CardTitle className="text-helpers-dark">Weekly Availability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(availability).map(([day, schedule]) => (
                  <div
                    key={day}
                    className="flex items-center justify-between p-4 border border-helpers-muted rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-20">
                        <span className="font-medium text-helpers-dark capitalize">{day}</span>
                      </div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={schedule.available}
                          onChange={(e) => handleAvailabilityUpdate(day, { available: e.target.checked })}
                          className="rounded border-helpers-muted"
                        />
                        <span className="text-sm text-helpers-purple">Available</span>
                      </label>
                    </div>
                    {schedule.available && (
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={schedule.start}
                          onChange={(e) => handleAvailabilityUpdate(day, { start: e.target.value })}
                          className="w-24 border-helpers-muted focus:border-helpers-accent"
                        />
                        <span className="text-helpers-purple">to</span>
                        <Input
                          type="time"
                          value={schedule.end}
                          onChange={(e) => handleAvailabilityUpdate(day, { end: e.target.value })}
                          className="w-24 border-helpers-muted focus:border-helpers-accent"
                        />
                      </div>
                    )}
                  </div>
                ))}
                <Button className="bg-helpers-accent hover:bg-helpers-accent-dark text-white">Save Availability</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
