import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search, Settings } from "lucide-react"
import AdminNav from "@/components/admin-nav"

export default function ServiceManagement() {
  const services = [
    {
      id: 1,
      name: "House Cleaning",
      category: "Home Services",
      basePrice: 299,
      providers: 234,
      bookings: 2847,
      status: "Active",
      description: "Professional house cleaning services",
    },
    {
      id: 2,
      name: "Plumbing",
      category: "Home Services",
      basePrice: 199,
      providers: 156,
      bookings: 1923,
      status: "Active",
      description: "Expert plumbing repair and installation",
    },
    {
      id: 3,
      name: "AC Repair",
      category: "Appliance Services",
      basePrice: 399,
      providers: 89,
      bookings: 1456,
      status: "Active",
      description: "Air conditioning repair and maintenance",
    },
    {
      id: 4,
      name: "Beauty & Spa",
      category: "Personal Care",
      basePrice: 599,
      providers: 67,
      bookings: 892,
      status: "Active",
      description: "Professional beauty and spa services",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <AdminNav />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Service Management</h1>
            <p className="text-gray-600">Manage service categories and pricing</p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-purple-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Search Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Search services..." className="pl-10 border-purple-200 focus:border-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-gray-900">47</div>
              <p className="text-sm text-gray-600">Total Services</p>
              <Badge className="mt-2 bg-green-100 text-green-800">12 Active Categories</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Services List */}
        <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
          <CardHeader>
            <CardTitle className="text-gray-900">All Services</CardTitle>
            <CardDescription>Manage your service offerings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-100"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">{service.name}</h3>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                        {service.category}
                      </Badge>
                      <Badge className="bg-green-100 text-green-800">{service.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      <span>{service.providers} providers</span>
                      <span>{service.bookings} total bookings</span>
                    </div>
                  </div>

                  <div className="text-center mr-6">
                    <div className="text-xl font-bold text-purple-600">₹{service.basePrice}</div>
                    <p className="text-xs text-gray-500">Base Price</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Categories Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Home Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">23</div>
              <p className="text-sm text-gray-600">Services available</p>
              <p className="text-xs text-gray-500 mt-1">Most popular category</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Personal Care</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">12</div>
              <p className="text-sm text-gray-600">Services available</p>
              <p className="text-xs text-gray-500 mt-1">Growing category</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Appliance Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">12</div>
              <p className="text-sm text-gray-600">Services available</p>
              <p className="text-xs text-gray-500 mt-1">High demand</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
