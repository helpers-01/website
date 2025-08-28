import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, MoreHorizontal, Eye, Ban, Mail } from "lucide-react"
import AdminNav from "@/components/admin-nav"

export default function UserManagement() {
  const users = [
    {
      id: 1,
      name: "Priya Sharma",
      email: "priya.sharma@email.com",
      phone: "+91 98765 43210",
      location: "Mumbai, Maharashtra",
      joinDate: "2024-01-15",
      totalBookings: 23,
      status: "Active",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Rahul Kumar",
      email: "rahul.kumar@email.com",
      phone: "+91 87654 32109",
      location: "Delhi, NCR",
      joinDate: "2024-02-20",
      totalBookings: 15,
      status: "Active",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Anjali Patel",
      email: "anjali.patel@email.com",
      phone: "+91 76543 21098",
      location: "Ahmedabad, Gujarat",
      joinDate: "2024-03-10",
      totalBookings: 8,
      status: "Suspended",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "Vikram Singh",
      email: "vikram.singh@email.com",
      phone: "+91 65432 10987",
      location: "Jaipur, Rajasthan",
      joinDate: "2024-03-25",
      totalBookings: 31,
      status: "Active",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <AdminNav />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage platform users and their accounts</p>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Search Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or phone..."
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

        {/* User Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-gray-900">12,847</div>
              <p className="text-sm text-gray-600">Total Users</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">12,234</div>
              <p className="text-sm text-gray-600">Active Users</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-yellow-600">456</div>
              <p className="text-sm text-gray-600">Inactive Users</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-red-600">157</div>
              <p className="text-sm text-gray-600">Suspended Users</p>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
          <CardHeader>
            <CardTitle className="text-gray-900">All Users</CardTitle>
            <CardDescription>Complete list of platform users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-100"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="bg-purple-200 text-purple-700">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-sm text-gray-500">{user.phone}</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">{user.location}</p>
                    <p className="text-xs text-gray-500">Joined {user.joinDate}</p>
                  </div>

                  <div className="text-center">
                    <p className="text-lg font-bold text-purple-600">{user.totalBookings}</p>
                    <p className="text-xs text-gray-500">Total Bookings</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      className={user.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {user.status}
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
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
                    >
                      <Ban className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
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
