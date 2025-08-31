import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, UserCheck, Calendar, DollarSign, TrendingUp, AlertTriangle, Star, Clock, Loader2 } from "lucide-react"
import AdminNav from "@/components/admin-nav"
import { supabase, db } from "@/lib/supabase"
import { useRealtimeBookings, useRealtimeUsers, useRealtimeProviders } from "@/hooks/use-realtime"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeHelpers: 0,
    totalBookings: 0,
    revenue: 0,
    platformRating: 0,
    avgResponseTime: 0,
    topService: 'Loading...'
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [pendingActions, setPendingActions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Real-time subscriptions
  useRealtimeUsers(() => {
    console.log('Users data changed, refreshing dashboard...')
    fetchDashboardData()
  })

  useRealtimeProviders(() => {
    console.log('Providers data changed, refreshing dashboard...')
    fetchDashboardData()
  })

  useRealtimeBookings(() => {
    console.log('Bookings data changed, refreshing dashboard...')
    fetchDashboardData()
  })

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch users count
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id', { count: 'exact' })

      // Fetch providers count
      const { data: providersData, error: providersError } = await supabase
        .from('providers')
        .select('id', { count: 'exact' })
        .eq('verification_status', 'verified')

      // Fetch bookings count and revenue
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('total_amount, status')

      // Fetch services for top service
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('name')
        .limit(1)

      if (!usersError && usersData) {
        setStats(prev => ({ ...prev, totalUsers: usersData.length }))
      }

      if (!providersError && providersData) {
        setStats(prev => ({ ...prev, activeHelpers: providersData.length }))
      }

      if (!bookingsError && bookingsData) {
        const totalBookings = bookingsData.length
        const totalRevenue = bookingsData.reduce((sum, booking) => sum + (booking.total_amount || 0), 0)
        setStats(prev => ({
          ...prev,
          totalBookings,
          revenue: totalRevenue
        }))
      }

      if (!servicesError && servicesData && servicesData.length > 0) {
        setStats(prev => ({ ...prev, topService: servicesData[0].name }))
      }

      // Set default values for demo
      setStats(prev => ({
        ...prev,
        platformRating: 4.8,
        avgResponseTime: 12
      }))

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        <AdminNav />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            <span className="text-purple-700 font-medium">Loading dashboard...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 font-medium">Live Updates</span>
            </div>
          </div>
          <p className="text-muted-foreground">Manage your Helpers platform with real-time data</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card-style">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +12% from last month
              </p>
            </CardContent>
          </div>

          <div className="card-style">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Helpers</CardTitle>
              <UserCheck className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.activeHelpers.toLocaleString()}</div>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +8% from last month
              </p>
            </CardContent>
          </div>

          <div className="card-style">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.totalBookings.toLocaleString()}</div>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +15% from last month
              </p>
            </CardContent>
          </div>

          <div className="card-style">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">₹{stats.revenue.toLocaleString()}</div>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +22% from last month
              </p>
            </CardContent>
          </div>
        </div>

        {/* Recent Activity & Pending Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="card-style">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Activity</CardTitle>
              <CardDescription>Latest platform activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-accent rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">New helper registered</p>
                  <p className="text-xs text-muted-foreground">Rajesh Kumar - Plumbing Services</p>
                </div>
                <span className="text-xs text-muted-foreground">2 min ago</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-accent rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Booking completed</p>
                  <p className="text-xs text-muted-foreground">House Cleaning - ₹1,200</p>
                </div>
                <span className="text-xs text-muted-foreground">5 min ago</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-accent rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Dispute reported</p>
                  <p className="text-xs text-muted-foreground">Booking #12847 - Payment issue</p>
                </div>
                <span className="text-xs text-muted-foreground">12 min ago</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-accent rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">New user registered</p>
                  <p className="text-xs text-muted-foreground">Priya Sharma from Mumbai</p>
                </div>
                <span className="text-xs text-muted-foreground">18 min ago</span>
              </div>
            </CardContent>
          </div>

          {/* Pending Actions */}
          <div className="card-style">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Pending Actions
              </CardTitle>
              <CardDescription>Items requiring your attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div>
                  <p className="text-sm font-medium text-foreground">Helper Applications</p>
                  <p className="text-xs text-muted-foreground">12 pending approvals</p>
                </div>
                <Button size="sm" className="btn-primary">
                  Review
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <p className="text-sm font-medium text-foreground">Reported Issues</p>
                  <p className="text-xs text-muted-foreground">5 disputes to resolve</p>
                </div>
                <Button size="sm" className="btn-primary">
                  Resolve
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div>
                  <p className="text-sm font-medium text-foreground">Payment Issues</p>
                  <p className="text-xs text-muted-foreground">3 failed transactions</p>
                </div>
                <Button size="sm" className="btn-primary">
                  Check
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <p className="text-sm font-medium text-foreground">Service Reviews</p>
                  <p className="text-xs text-muted-foreground">8 flagged reviews</p>
                </div>
                <Button size="sm" className="btn-primary">
                  Moderate
                </Button>
              </div>
            </CardContent>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-style">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Platform Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.platformRating}</div>
              <p className="text-sm text-muted-foreground">Based on {stats.totalBookings * 0.3} reviews</p>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </CardContent>
          </div>

          <div className="card-style">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                Avg Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.avgResponseTime}</div>
              <p className="text-sm text-muted-foreground">minutes</p>
              <Badge className="mt-2 bg-green-100 text-green-800">Excellent</Badge>
            </CardContent>
          </div>

          <div className="card-style">
            <CardHeader>
              <CardTitle className="text-foreground">Top Service</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-foreground">{stats.topService}</div>
              <p className="text-sm text-muted-foreground">{Math.floor(stats.totalBookings * 0.06)} bookings this month</p>
              <Badge className="mt-2 bg-purple-100 text-purple-800">Most Popular</Badge>
            </CardContent>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card-style">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="btn-primary h-auto p-4 flex flex-col gap-2">
                <Users className="h-6 w-6" />
                <span>Manage Users</span>
              </Button>
              <Button className="btn-primary h-auto p-4 flex flex-col gap-2">
                <UserCheck className="h-6 w-6" />
                <span>Manage Helpers</span>
              </Button>
              <Button className="btn-primary h-auto p-4 flex flex-col gap-2">
                <Calendar className="h-6 w-6" />
                <span>View Bookings</span>
              </Button>
              <Button className="btn-primary h-auto p-4 flex flex-col gap-2">
                <TrendingUp className="h-6 w-6" />
                <span>Analytics</span>
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    </div>
  )
}
