"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, User, Bell, Shield, CreditCard, MapPin, Phone, Mail } from "lucide-react"
import Link from "next/link"

export default function UserSettings() {
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, New York, NY 10001",
  })

  const [notifications, setNotifications] = useState({
    emailBookingConfirmation: true,
    emailReminders: true,
    emailPromotions: false,
    smsBookingConfirmation: true,
    smsReminders: true,
    smsPromotions: false,
    pushNotifications: true,
  })

  const handleProfileUpdate = () => {
    // Update profile logic
    console.log("Profile updated:", profile)
  }

  const handleNotificationUpdate = (key: string, value: boolean) => {
    setNotifications({ ...notifications, [key]: value })
  }

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
              <h1 className="text-xl font-bold text-helpers-dark">Account Settings</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
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
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="border-helpers-muted focus:border-helpers-accent"
                    />
                    <Button
                      variant="outline"
                      className="border-helpers-muted text-helpers-purple hover:bg-helpers-pale bg-transparent"
                    >
                      <Mail className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-helpers-dark">
                    Phone Number
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="border-helpers-muted focus:border-helpers-accent"
                    />
                    <Button
                      variant="outline"
                      className="border-helpers-muted text-helpers-purple hover:bg-helpers-pale bg-transparent"
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="address" className="text-helpers-dark">
                    Default Address
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="address"
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      className="border-helpers-muted focus:border-helpers-accent"
                    />
                    <Button
                      variant="outline"
                      className="border-helpers-muted text-helpers-purple hover:bg-helpers-pale bg-transparent"
                    >
                      <MapPin className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleProfileUpdate}
                  className="bg-helpers-accent hover:bg-helpers-accent-dark text-white"
                >
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="bg-white border-helpers-muted">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-helpers-dark">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-helpers-dark mb-4">Email Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-helpers-dark">Booking Confirmations</p>
                        <p className="text-sm text-helpers-purple">Get notified when bookings are confirmed</p>
                      </div>
                      <Switch
                        checked={notifications.emailBookingConfirmation}
                        onCheckedChange={(checked) => handleNotificationUpdate("emailBookingConfirmation", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-helpers-dark">Service Reminders</p>
                        <p className="text-sm text-helpers-purple">Reminders before scheduled services</p>
                      </div>
                      <Switch
                        checked={notifications.emailReminders}
                        onCheckedChange={(checked) => handleNotificationUpdate("emailReminders", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-helpers-dark">Promotions & Offers</p>
                        <p className="text-sm text-helpers-purple">Special deals and promotional offers</p>
                      </div>
                      <Switch
                        checked={notifications.emailPromotions}
                        onCheckedChange={(checked) => handleNotificationUpdate("emailPromotions", checked)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-helpers-dark mb-4">SMS Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-helpers-dark">Booking Confirmations</p>
                        <p className="text-sm text-helpers-purple">SMS alerts for booking confirmations</p>
                      </div>
                      <Switch
                        checked={notifications.smsBookingConfirmation}
                        onCheckedChange={(checked) => handleNotificationUpdate("smsBookingConfirmation", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-helpers-dark">Service Reminders</p>
                        <p className="text-sm text-helpers-purple">SMS reminders before services</p>
                      </div>
                      <Switch
                        checked={notifications.smsReminders}
                        onCheckedChange={(checked) => handleNotificationUpdate("smsReminders", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-helpers-dark">Promotions & Offers</p>
                        <p className="text-sm text-helpers-purple">SMS deals and offers</p>
                      </div>
                      <Switch
                        checked={notifications.smsPromotions}
                        onCheckedChange={(checked) => handleNotificationUpdate("smsPromotions", checked)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-helpers-dark mb-4">Push Notifications</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-helpers-dark">App Notifications</p>
                      <p className="text-sm text-helpers-purple">Receive push notifications on your device</p>
                    </div>
                    <Switch
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) => handleNotificationUpdate("pushNotifications", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card className="bg-white border-helpers-muted">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-helpers-dark">
                  <Shield className="w-5 h-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-helpers-dark mb-4">Password</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword" className="text-helpers-dark">
                        Current Password
                      </Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        className="border-helpers-muted focus:border-helpers-accent"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword" className="text-helpers-dark">
                        New Password
                      </Label>
                      <Input
                        id="newPassword"
                        type="password"
                        className="border-helpers-muted focus:border-helpers-accent"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword" className="text-helpers-dark">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        className="border-helpers-muted focus:border-helpers-accent"
                      />
                    </div>
                    <Button className="bg-helpers-accent hover:bg-helpers-accent-dark text-white">
                      Update Password
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-helpers-dark mb-4">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between p-4 border border-helpers-muted rounded-lg">
                    <div>
                      <p className="font-medium text-helpers-dark">Enable 2FA</p>
                      <p className="text-sm text-helpers-purple">Add an extra layer of security to your account</p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-helpers-muted text-helpers-purple hover:bg-helpers-pale bg-transparent"
                    >
                      Enable
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-helpers-dark mb-4">Login Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-helpers-muted rounded-lg">
                      <div>
                        <p className="font-medium text-helpers-dark">Current Session</p>
                        <p className="text-sm text-helpers-purple">New York, NY • Chrome • Active now</p>
                      </div>
                      <span className="text-sm text-green-600">Current</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-helpers-muted rounded-lg">
                      <div>
                        <p className="font-medium text-helpers-dark">Mobile App</p>
                        <p className="text-sm text-helpers-purple">New York, NY • iOS • 2 hours ago</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                      >
                        Revoke
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <Card className="bg-white border-helpers-muted">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-helpers-dark">
                  <CreditCard className="w-5 h-5" />
                  Billing & Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-helpers-dark mb-4">Payment Methods</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border border-helpers-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center">
                          VISA
                        </div>
                        <div>
                          <p className="font-medium text-helpers-dark">•••• •••• •••• 4242</p>
                          <p className="text-sm text-helpers-purple">Expires 12/26</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
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
                          Remove
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-helpers-muted text-helpers-purple hover:bg-helpers-pale bg-transparent"
                    >
                      Add New Payment Method
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-helpers-dark mb-4">Billing History</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-helpers-muted rounded-lg">
                      <div>
                        <p className="font-medium text-helpers-dark">Deep House Cleaning</p>
                        <p className="text-sm text-helpers-purple">Jan 10, 2025 • CleanPro Services</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-helpers-dark">$94.00</p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-helpers-muted text-helpers-purple hover:bg-helpers-pale bg-transparent"
                        >
                          Receipt
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-helpers-muted rounded-lg">
                      <div>
                        <p className="font-medium text-helpers-dark">Bathroom Deep Clean</p>
                        <p className="text-sm text-helpers-purple">Jan 5, 2025 • Sparkle Clean Co</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-helpers-dark">$50.00</p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-helpers-muted text-helpers-purple hover:bg-helpers-pale bg-transparent"
                        >
                          Receipt
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
