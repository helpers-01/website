"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, MoreHorizontal, Eye, Ban, Mail, Users as UsersIcon, UserCheck, UserX, TrendingUp } from "lucide-react"
import AdminNav from "@/components/admin-nav"
import { supabase } from "@/lib/supabase/client"
import { useRealtimeUsers } from "@/hooks/use-realtime"

interface User {
  id: string
  name: string
  email: string
  phone: string
  location: string
  joinDate: string
  totalBookings: number
  status: string
  avatar: string
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    suspendedUsers: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Real-time subscription
  useRealtimeUsers(() => {
    console.log('Users data changed, refreshing...')
    fetchUsers()
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)

      // Fetch users with their booking counts
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select(`
          id,
          name,
          email,
          phone,
          location,
          created_at,
          status,
          avatar_url,
          bookings(count)
        `)
        .order('created_at', { ascending: false })

      if (usersError) throw usersError

      // Calculate statistics
      const totalUsers = usersData?.length || 0
      const activeUsers = usersData?.filter(user => user.status === 'active').length || 0
      const inactiveUsers = usersData?.filter(user => user.status === 'inactive').length || 0
      const suspendedUsers = usersData?.filter(user => user.status === 'suspended').length || 0

      setStats({
        totalUsers,
        activeUsers,
        inactiveUsers,
        suspendedUsers
      })

      // Format users data
      const formattedUsers = usersData?.map(user => ({
        id: user.id,
        name: user.name || 'Unknown User',
        email: user.email,
        phone: user.phone || 'N/A',
        location: user.location || 'N/A',
        joinDate: new Date(user.created_at).toLocaleDateString(),
        totalBookings: user.bookings?.[0]?.count || 0,
        status: user.status === 'active' ? 'Active' : user.status === 'suspended' ? 'Suspended' : 'Inactive',
        avatar: user.avatar_url || "/placeholder.svg?height=40&width=40",
      })) || []

      setUsers(formattedUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery)
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-orange-100 to-orange-200">
        <AdminNav />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <span className="text-primary font-medium">Loading users...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-100 to-orange-200">
      <AdminNav />

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-textPrimary hover:scale-105 transition-transform duration-300">User Management</h1>
          <p className="text-textSecondary">Manage platform users and their accounts</p>
        </div>

        {/* Search and Filters */}
        <Card className="card-style hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-textPrimary">Search Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-textSecondary" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 hover:ring-2 hover:ring-primary/20 transition-all"
                />
              </div>
              <Button variant="outline" className="hover:scale-105 transition-all duration-300">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* User Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="card-style hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-textPrimary">{stats.totalUsers.toLocaleString()}</div>
                  <p className="text-sm text-textSecondary">Total Users</p>
                </div>
                <UsersIcon className="h-8 w-8 text-primary" />
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-xs text-success">+12% from last month</span>
              </div>
            </CardContent>
          </Card>
          <Card className="card-style hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-success">{stats.activeUsers.toLocaleString()}</div>
                  <p className="text-sm text-textSecondary">Active Users</p>
                </div>
                <UserCheck className="h-8 w-8 text-success" />
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-xs text-success">+8% from last month</span>
              </div>
            </CardContent>
          </Card>
          <Card className="card-style hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-warning">{stats.inactiveUsers.toLocaleString()}</div>
                  <p className="text-sm text-textSecondary">Inactive Users</p>
                </div>
                <UserX className="h-8 w-8 text-warning" />
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-xs text-success">+5% from last month</span>
              </div>
            </CardContent>
          </Card>
          <Card className="card-style hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-error">{stats.suspendedUsers.toLocaleString()}</div>
                  <p className="text-sm text-textSecondary">Suspended Users</p>
                </div>
                <Ban className="h-8 w-8 text-error" />
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-xs text-success">-2% from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        <Card className="card-style hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-textPrimary">All Users</CardTitle>
            <CardDescription>Complete list of platform users ({filteredUsers.length} users)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <UsersIcon className="h-12 w-12 text-textSecondary mx-auto mb-4" />
                  <p className="text-textSecondary">No users found matching your search.</p>
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 bg-surface/50 rounded-2xl border border-border hover:bg-surface/80 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-textPrimary">{user.name}</h3>
                        <p className="text-sm text-textSecondary">{user.email}</p>
                        <p className="text-sm text-textSecondary">{user.phone}</p>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-sm font-medium text-textPrimary">{user.location}</p>
                      <p className="text-xs text-textSecondary">Joined {user.joinDate}</p>
                    </div>

                    <div className="text-center">
                      <p className="text-lg font-bold text-primary">{user.totalBookings}</p>
                      <p className="text-xs text-textSecondary">Total Bookings</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          user.status === "Active"
                            ? "bg-success/20 text-success hover:bg-success/30"
                            : user.status === "Suspended"
                            ? "bg-error/20 text-error hover:bg-error/30"
                            : "bg-warning/20 text-warning hover:bg-warning/30"
                        }
                      >
                        {user.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="hover:scale-110 transition-all duration-200"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="hover:scale-110 transition-all duration-200"
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="hover:scale-110 transition-all duration-200 hover:bg-error/10 hover:border-error/30"
                      >
                        <Ban className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="hover:scale-110 transition-all duration-200"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
