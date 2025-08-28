"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  ArrowLeft,
  Home,
  Wrench,
  Paintbrush,
  Car,
  Zap,
  Droplets,
  Scissors,
  Dumbbell,
  Camera,
  Laptop,
  Truck,
  Baby,
} from "lucide-react"
import Link from "next/link"

export default function ServiceCategories() {
  const categories = [
    {
      id: 1,
      name: "Home Cleaning",
      icon: Home,
      services: 45,
      color: "bg-blue-100 text-blue-600",
      description: "Professional house cleaning services",
    },
    {
      id: 2,
      name: "Repairs & Maintenance",
      icon: Wrench,
      services: 32,
      color: "bg-green-100 text-green-600",
      description: "Home repairs and maintenance",
    },
    {
      id: 3,
      name: "Painting",
      icon: Paintbrush,
      services: 18,
      color: "bg-purple-100 text-purple-600",
      description: "Interior and exterior painting",
    },
    {
      id: 4,
      name: "Car Service",
      icon: Car,
      services: 24,
      color: "bg-orange-100 text-orange-600",
      description: "Car wash and maintenance",
    },
    {
      id: 5,
      name: "Electrical",
      icon: Zap,
      services: 28,
      color: "bg-yellow-100 text-yellow-600",
      description: "Electrical repairs and installation",
    },
    {
      id: 6,
      name: "Plumbing",
      icon: Droplets,
      services: 21,
      color: "bg-cyan-100 text-cyan-600",
      description: "Plumbing services and repairs",
    },
    {
      id: 7,
      name: "Beauty & Grooming",
      icon: Scissors,
      services: 36,
      color: "bg-pink-100 text-pink-600",
      description: "Hair, beauty, and grooming services",
    },
    {
      id: 8,
      name: "Fitness & Wellness",
      icon: Dumbbell,
      services: 15,
      color: "bg-red-100 text-red-600",
      description: "Personal training and wellness",
    },
    {
      id: 9,
      name: "Photography",
      icon: Camera,
      services: 12,
      color: "bg-indigo-100 text-indigo-600",
      description: "Event and portrait photography",
    },
    {
      id: 10,
      name: "Tech Support",
      icon: Laptop,
      services: 19,
      color: "bg-gray-100 text-gray-600",
      description: "Computer and device support",
    },
    {
      id: 11,
      name: "Moving & Delivery",
      icon: Truck,
      services: 8,
      color: "bg-amber-100 text-amber-600",
      description: "Moving and delivery services",
    },
    {
      id: 12,
      name: "Childcare",
      icon: Baby,
      services: 14,
      color: "bg-rose-100 text-rose-600",
      description: "Babysitting and childcare",
    },
  ]

  return (
    <div className="min-h-screen bg-helpers-light">
      {/* Header */}
      <header className="bg-white border-b border-helpers-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/user/dashboard" className="text-helpers-purple hover:text-helpers-dark">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-bold text-helpers-dark">Service Categories</h1>
            </div>
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-helpers-purple" />
                <Input
                  placeholder="Search categories..."
                  className="pl-10 border-helpers-muted focus:border-helpers-accent"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-helpers-dark mb-2">Browse All Services</h2>
          <p className="text-helpers-purple">Find the perfect service for your needs</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Card
                key={category.id}
                className="bg-white border-helpers-muted hover:border-helpers-accent transition-colors cursor-pointer group"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    {/* Icon */}
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center ${category.color} group-hover:scale-110 transition-transform`}
                    >
                      <IconComponent className="w-8 h-8" />
                    </div>

                    {/* Category Name */}
                    <h3 className="text-lg font-semibold text-helpers-dark">{category.name}</h3>

                    {/* Description */}
                    <p className="text-sm text-helpers-purple">{category.description}</p>

                    {/* Services Count */}
                    <Badge variant="secondary" className="bg-helpers-pale text-helpers-purple">
                      {category.services} services
                    </Badge>

                    {/* Browse Button */}
                    <Button
                      className="w-full bg-helpers-accent hover:bg-helpers-accent-dark text-white"
                      onClick={() => (window.location.href = `/user/search?category=${category.id}`)}
                    >
                      Browse Services
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Popular Categories Section */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-helpers-dark mb-6">Most Popular This Week</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.slice(0, 3).map((category) => {
              const IconComponent = category.icon
              return (
                <Card key={category.id} className="bg-white border-helpers-muted">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${category.color}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-helpers-dark">{category.name}</h4>
                        <p className="text-sm text-helpers-purple">{category.services} services available</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-helpers-muted text-helpers-purple hover:bg-helpers-pale bg-transparent"
                      >
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
