"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, Check, X, Eye, Star, UserCheck, Clock, TrendingUp, Users as UsersIcon } from "lucide-react"
import AdminNav from "@/components/admin-nav"
import { supabase } from "@/lib/supabase/client"
import { useRealtimeProviders } from "@/hooks/use-realtime"

interface Helper {
  id: string
  name: string
  email: string
  phone: string
  services: string[]
  location: string
  experience: string
  rating: number
  totalJobs: number
  status: string
  joinDate: string
  avatar: string
}

export default function HelperManagement() {
  const [helpers, setHelpers] = useState<Helper[]>([])
  const [stats, setStats] = useState({
    totalHelpers: 0,
    approvedHelpers: 0,
    pendingHelpers: 0,
    rejectedHelpers: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Real-time subscription
  useRealtimeProviders(() => {
    console.log('Helpers data changed, refreshing...')
    fetchHelpers()
  })

  useEffect(() => {
    fetchHelpers()
  }, [])

  const fetchHelpers = async () => {
    try {
      setLoading(true)

      // Fetch helpers with their service counts and ratings
      const { data: helpersData, error: helpersError } = await supabase
        .from('providers')
        .select(`
          id,
          name,
          email,
          phone,
          location,
          experience,
          rating,
          total_jobs,
          status,
          avatar_url,
          created_at,
          services
        `)
        .order('created_at', { ascending: false })

      if (helpersError) throw helpersError

      // Ensure helpersData is an array
      const safeHelpersData = helpersData || []

      // Calculate statistics
      const totalHelpers = safeHelpersData.length
      const approvedHelpers = safeHelpersData.filter((helper: any) => helper.status === 'approved').length
      const pendingHelpers = safeHelpersData.filter((helper: any) => helper.status === 'pending').length
      const rejectedHelpers = safeHelpersData.filter((helper: any) => helper.status === 'rejected').length

      setStats({
        totalHelpers,
        approvedHelpers,
        pendingHelpers,
        rejectedHelpers
      })

      // Format helpers data
      const formattedHelpers = safeHelpersData.map((helper: any) => ({
        id: helper.id,
        name: helper.name || 'Unknown Helper',
        email: helper.email,
        phone: helper.phone || 'N/A',
        services: helper.services || [],
        location: helper.location || 'N/A',
        experience: helper.experience || 'N/A',
        rating: helper.rating || 0,
        totalJobs: helper.total_jobs || 0,
        status: helper.status === 'approved' ? 'Approved' : helper.status === 'pending' ? 'Pending' : 'Rejected',
        joinDate: new Date(helper.created_at).toLocaleDateString(),
        avatar: helper.avatar_url || "/placeholder.svg?height=40&width=40",
      }))

      setHelpers(formattedHelpers)
    } catch (error) {
      console.error('Error fetching helpers:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredHelpers = helpers.filter(helper =>
    helper.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    helper.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    helper.services.some(service => service.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-orange-100 to-orange-200">
        <AdminNav />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <span className="text-primary font-medium">Loading helpers...</span>
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
          <h1 className="text-4xl font-bold text-textPrimary hover:scale-105 transition-transform duration-300">Helper Management</h1>
          <p className="text-textSecondary">Manage service providers and their applications</p>
        </div>

        {/* Search and Filters */}
        <Card className="card-style hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-textPrimary">Search Helpers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-textSecondary" />
                <Input
                  placeholder="Search by name, service, or location..."
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

        {/* Helper Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="card-style hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-textPrimary">{stats.totalHelpers.toLocaleString()}</div>
                  <p className="text-sm text-textSecondary">Total Helpers</p>
                </div>
                <UsersIcon className="h-8 w-8 text-primary" />
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-xs text-success">+15% from last month</span>
              </div>
            </CardContent>
          </Card>
          <Card className="card-style hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-success">{stats.approvedHelpers.toLocaleString()}</div>
                  <p className="text-sm text-textSecondary">Approved</p>
                </div>
                <UserCheck className="h-8 w-8 text-success" />
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
                  <div className="text-2xl font-bold text-warning">{stats.pendingHelpers.toLocaleString()}</div>
                  <p className="text-sm text-textSecondary">Pending</p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
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
                  <div className="text-2xl font-bold text-error">{stats.rejectedHelpers.toLocaleString()}</div>
                  <p className="text-sm text-textSecondary">Rejected</p>
                </div>
                <X className="h-8 w-8 text-error" />
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-xs text-success">-3% from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Helpers List */}
        <Card className="card-style hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-textPrimary">All Helpers</CardTitle>
            <CardDescription>Complete list of service providers ({filteredHelpers.length} helpers)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredHelpers.length === 0 ? (
                <div className="text-center py-8">
                  <UsersIcon className="h-12 w-12 text-textSecondary mx-auto mb-4" />
                  <p className="text-textSecondary">No helpers found matching your search.</p>
                </div>
              ) : (
                filteredHelpers.map((helper) => (
                  <div
                    key={helper.id}
                    className="flex items-center justify-between p-4 bg-surface/50 rounded-2xl border border-border hover:bg-surface/80 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                        <AvatarImage src={helper.avatar || "/placeholder.svg"} alt={helper.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {helper.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-textPrimary">{helper.name}</h3>
                        <p className="text-sm text-textSecondary">{helper.email}</p>
                        <p className="text-sm text-textSecondary">{helper.phone}</p>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {helper.services.slice(0, 3).map((service, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-primary/10 text-primary hover:bg-primary/20">
                              {service}
                            </Badge>
                          ))}
                          {helper.services.length > 3 && (
                            <Badge variant="secondary" className="text-xs bg-textSecondary/10 text-textSecondary">
                              +{helper.services.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-sm font-medium text-textPrimary">{helper.location}</p>
                      <p className="text-xs text-textSecondary">{helper.experience} experience</p>
                      <p className="text-xs text-textSecondary">Joined {helper.joinDate}</p>
                    </div>

                    <div className="text-center">
                      {helper.rating > 0 ? (
                        <>
                          <div className="flex items-center gap-1 justify-center">
                            <Star className="h-4 w-4 fill-warning text-warning" />
                            <span className="text-sm font-medium text-textPrimary">{helper.rating}</span>
                          </div>
                          <p className="text-xs text-textSecondary">{helper.totalJobs} jobs completed</p>
                        </>
                      ) : (
                        <p className="text-sm text-textSecondary">No ratings yet</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          helper.status === "Approved"
                            ? "bg-success/20 text-success hover:bg-success/30"
                            : helper.status === "Pending"
                            ? "bg-warning/20 text-warning hover:bg-warning/30"
                            : "bg-error/20 text-error hover:bg-error/30"
                        }
                      >
                        {helper.status}
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
                      {helper.status === "Pending" && (
                        <>
                          <Button
                            size="sm"
                            className="hover:scale-110 transition-all duration-200 bg-success hover:bg-success/90"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="hover:scale-110 transition-all duration-200 hover:bg-error/10 hover:border-error/30"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
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
