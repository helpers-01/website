import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, UserCheck, Calendar, DollarSign, TrendingUp, AlertTriangle, Star, Clock } from "lucide-react"
import AdminNav from "@/components/admin-nav"

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <AdminNav />

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your Helpers platform</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">12,847</div>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Helpers</CardTitle>
              <UserCheck className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">3,421</div>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">45,892</div>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +15% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">₹8,94,567</div>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +22% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Pending Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Recent Activity</CardTitle>
              <CardDescription>Latest platform activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New helper registered</p>
                  <p className="text-xs text-gray-600">Rajesh Kumar - Plumbing Services</p>
                </div>
                <span className="text-xs text-gray-500">2 min ago</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Booking completed</p>
                  <p className="text-xs text-gray-600">House Cleaning - ₹1,200</p>
                </div>
                <span className="text-xs text-gray-500">5 min ago</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Dispute reported</p>
                  <p className="text-xs text-gray-600">Booking #12847 - Payment issue</p>
                </div>
                <span className="text-xs text-gray-500">12 min ago</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New user registered</p>
                  <p className="text-xs text-gray-600">Priya Sharma from Mumbai</p>
                </div>
                <span className="text-xs text-gray-500">18 min ago</span>
              </div>
            </CardContent>
          </Card>

          {/* Pending Actions */}
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Pending Actions
              </CardTitle>
              <CardDescription>Items requiring your attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div>
                  <p className="text-sm font-medium text-gray-900">Helper Applications</p>
                  <p className="text-xs text-gray-600">12 pending approvals</p>
                </div>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  Review
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <p className="text-sm font-medium text-gray-900">Reported Issues</p>
                  <p className="text-xs text-gray-600">5 disputes to resolve</p>
                </div>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  Resolve
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div>
                  <p className="text-sm font-medium text-gray-900">Payment Issues</p>
                  <p className="text-xs text-gray-600">3 failed transactions</p>
                </div>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  Check
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <p className="text-sm font-medium text-gray-900">Service Reviews</p>
                  <p className="text-xs text-gray-600">8 flagged reviews</p>
                </div>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  Moderate
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Platform Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">4.8</div>
              <p className="text-sm text-gray-600">Based on 15,847 reviews</p>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                Avg Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">12</div>
              <p className="text-sm text-gray-600">minutes</p>
              <Badge className="mt-2 bg-green-100 text-green-800">Excellent</Badge>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Top Service</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-gray-900">House Cleaning</div>
              <p className="text-sm text-gray-600">2,847 bookings this month</p>
              <Badge className="mt-2 bg-purple-100 text-purple-800">Most Popular</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="bg-purple-600 hover:bg-purple-700 h-auto p-4 flex flex-col gap-2">
                <Users className="h-6 w-6" />
                <span>Manage Users</span>
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700 h-auto p-4 flex flex-col gap-2">
                <UserCheck className="h-6 w-6" />
                <span>Manage Helpers</span>
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700 h-auto p-4 flex flex-col gap-2">
                <Calendar className="h-6 w-6" />
                <span>View Bookings</span>
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700 h-auto p-4 flex flex-col gap-2">
                <TrendingUp className="h-6 w-6" />
                <span>Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
