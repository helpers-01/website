"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, CreditCard, Bell, Shield, User } from "lucide-react"
import Link from "next/link"

export default function HelperSettings() {
  const [bankDetails, setBankDetails] = useState({
    accountHolder: "Alex Johnson",
    bankName: "Chase Bank",
    accountNumber: "****4567",
    routingNumber: "****1234",
    accountType: "checking",
  })

  const [notifications, setNotifications] = useState({
    newJobRequests: true,
    jobReminders: true,
    paymentNotifications: true,
    customerMessages: true,
    emailNewJobs: true,
    emailPayments: true,
    emailPromotions: false,
    smsJobAlerts: true,
    smsPayments: true,
    smsPromotions: false,
  })

  const [availability, setAvailability] = useState({
    acceptingJobs: true,
    instantBooking: false,
    maxJobsPerDay: 3,
    advanceNotice: 2, // hours
  })

  const handleNotificationUpdate = (key: string, value: boolean) => {
    setNotifications({ ...notifications, [key]: value })
  }

  const handleAvailabilityUpdate = (key: string, value: any) => {
    setAvailability({ ...availability, [key]: value })
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
              <h1 className="text-xl font-bold text-helpers-dark">Helper Settings</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="banking" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="banking">Banking</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Banking Tab */}
          <TabsContent value="banking">
            <Card className="bg-white border-helpers-muted">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-helpers-dark">
                  <CreditCard className="w-5 h-5" />
                  Bank Account Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-helpers-pale border border-helpers-muted rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center">
                      BANK
                    </div>
                    <div>
                      <p className="font-medium text-helpers-dark">{bankDetails.bankName}</p>
                      <p className="text-sm text-helpers-purple">Primary Account</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-helpers-purple">Account Holder:</span>
                      <div className="font-medium text-helpers-dark">{bankDetails.accountHolder}</div>
                    </div>
                    <div>
                      <span className="text-helpers-purple">Account Number:</span>
                      <div className="font-medium text-helpers-dark">{bankDetails.accountNumber}</div>
                    </div>
                    <div>
                      <span className="text-helpers-purple">Routing Number:</span>
                      <div className="font-medium text-helpers-dark">{bankDetails.routingNumber}</div>
                    </div>
                    <div>
                      <span className="text-helpers-purple">Account Type:</span>
                      <div className="font-medium text-helpers-dark capitalize">{bankDetails.accountType}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-helpers-dark">Update Bank Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="accountHolder" className="text-helpers-dark">
                        Account Holder Name
                      </Label>
                      <Input
                        id="accountHolder"
                        value={bankDetails.accountHolder}
                        onChange={(e) => setBankDetails({ ...bankDetails, accountHolder: e.target.value })}
                        className="border-helpers-muted focus:border-helpers-accent"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bankName" className="text-helpers-dark">
                        Bank Name
                      </Label>
                      <Input
                        id="bankName"
                        value={bankDetails.bankName}
                        onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                        className="border-helpers-muted focus:border-helpers-accent"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="accountNumber" className="text-helpers-dark">
                        Account Number
                      </Label>
                      <Input
                        id="accountNumber"
                        placeholder="Enter full account number"
                        className="border-helpers-muted focus:border-helpers-accent"
                      />
                    </div>
                    <div>
                      <Label htmlFor="routingNumber" className="text-helpers-dark">
                        Routing Number
                      </Label>
                      <Input
                        id="routingNumber"
                        placeholder="Enter routing number"
                        className="border-helpers-muted focus:border-helpers-accent"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="accountType" className="text-helpers-dark">
                      Account Type
                    </Label>
                    <select
                      id="accountType"
                      className="w-full border border-helpers-muted rounded-lg px-3 py-2 text-helpers-dark"
                      value={bankDetails.accountType}
                      onChange={(e) => setBankDetails({ ...bankDetails, accountType: e.target.value })}
                    >
                      <option value="checking">Checking</option>
                      <option value="savings">Savings</option>
                    </select>
                  </div>
                  <Button className="bg-helpers-accent hover:bg-helpers-accent-dark text-white">
                    Update Bank Details
                  </Button>
                </div>
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
                  <h3 className="font-semibold text-helpers-dark mb-4">Push Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-helpers-dark">New Job Requests</p>
                        <p className="text-sm text-helpers-purple">Get notified when customers request your services</p>
                      </div>
                      <Switch
                        checked={notifications.newJobRequests}
                        onCheckedChange={(checked) => handleNotificationUpdate("newJobRequests", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-helpers-dark">Job Reminders</p>
                        <p className="text-sm text-helpers-purple">Reminders before scheduled jobs</p>
                      </div>
                      <Switch
                        checked={notifications.jobReminders}
                        onCheckedChange={(checked) => handleNotificationUpdate("jobReminders", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-helpers-dark">Payment Notifications</p>
                        <p className="text-sm text-helpers-purple">Updates on payments and payouts</p>
                      </div>
                      <Switch
                        checked={notifications.paymentNotifications}
                        onCheckedChange={(checked) => handleNotificationUpdate("paymentNotifications", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-helpers-dark">Customer Messages</p>
                        <p className="text-sm text-helpers-purple">Messages from customers</p>
                      </div>
                      <Switch
                        checked={notifications.customerMessages}
                        onCheckedChange={(checked) => handleNotificationUpdate("customerMessages", checked)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-helpers-dark mb-4">Email Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-helpers-dark">New Job Alerts</p>
                        <p className="text-sm text-helpers-purple">Email alerts for new job opportunities</p>
                      </div>
                      <Switch
                        checked={notifications.emailNewJobs}
                        onCheckedChange={(checked) => handleNotificationUpdate("emailNewJobs", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-helpers-dark">Payment Updates</p>
                        <p className="text-sm text-helpers-purple">Email confirmations for payments</p>
                      </div>
                      <Switch
                        checked={notifications.emailPayments}
                        onCheckedChange={(checked) => handleNotificationUpdate("emailPayments", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-helpers-dark">Promotions & Tips</p>
                        <p className="text-sm text-helpers-purple">Helper tips and promotional offers</p>
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
                        <p className="font-medium text-helpers-dark">Job Alerts</p>
                        <p className="text-sm text-helpers-purple">SMS alerts for urgent job requests</p>
                      </div>
                      <Switch
                        checked={notifications.smsJobAlerts}
                        onCheckedChange={(checked) => handleNotificationUpdate("smsJobAlerts", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-helpers-dark">Payment Confirmations</p>
                        <p className="text-sm text-helpers-purple">SMS confirmations for payments</p>
                      </div>
                      <Switch
                        checked={notifications.smsPayments}
                        onCheckedChange={(checked) => handleNotificationUpdate("smsPayments", checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Availability Tab */}
          <TabsContent value="availability">
            <Card className="bg-white border-helpers-muted">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-helpers-dark">
                  <User className="w-5 h-5" />
                  Availability Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-helpers-dark">Currently Accepting Jobs</p>
                      <p className="text-sm text-helpers-purple">Turn off to stop receiving new job requests</p>
                    </div>
                    <Switch
                      checked={availability.acceptingJobs}
                      onCheckedChange={(checked) => handleAvailabilityUpdate("acceptingJobs", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-helpers-dark">Instant Booking</p>
                      <p className="text-sm text-helpers-purple">Allow customers to book without approval</p>
                    </div>
                    <Switch
                      checked={availability.instantBooking}
                      onCheckedChange={(checked) => handleAvailabilityUpdate("instantBooking", checked)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="maxJobs" className="text-helpers-dark">
                      Maximum Jobs Per Day
                    </Label>
                    <select
                      id="maxJobs"
                      className="w-full border border-helpers-muted rounded-lg px-3 py-2 text-helpers-dark"
                      value={availability.maxJobsPerDay}
                      onChange={(e) => handleAvailabilityUpdate("maxJobsPerDay", Number.parseInt(e.target.value))}
                    >
                      <option value={1}>1 job</option>
                      <option value={2}>2 jobs</option>
                      <option value={3}>3 jobs</option>
                      <option value={4}>4 jobs</option>
                      <option value={5}>5 jobs</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="advanceNotice" className="text-helpers-dark">
                      Minimum Advance Notice
                    </Label>
                    <select
                      id="advanceNotice"
                      className="w-full border border-helpers-muted rounded-lg px-3 py-2 text-helpers-dark"
                      value={availability.advanceNotice}
                      onChange={(e) => handleAvailabilityUpdate("advanceNotice", Number.parseInt(e.target.value))}
                    >
                      <option value={1}>1 hour</option>
                      <option value={2}>2 hours</option>
                      <option value={4}>4 hours</option>
                      <option value={8}>8 hours</option>
                      <option value={24}>24 hours</option>
                    </select>
                  </div>
                </div>

                <Button className="bg-helpers-accent hover:bg-helpers-accent-dark text-white">
                  Save Availability Settings
                </Button>
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
                  <h3 className="font-semibold text-helpers-dark mb-4">Change Password</h3>
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
                  <h3 className="font-semibold text-helpers-dark mb-4">Account Verification</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-helpers-muted rounded-lg">
                      <div>
                        <p className="font-medium text-helpers-dark">Identity Verification</p>
                        <p className="text-sm text-helpers-purple">Government ID verified</p>
                      </div>
                      <span className="text-sm text-green-600">✓ Verified</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-helpers-muted rounded-lg">
                      <div>
                        <p className="font-medium text-helpers-dark">Background Check</p>
                        <p className="text-sm text-helpers-purple">Criminal background check completed</p>
                      </div>
                      <span className="text-sm text-green-600">✓ Verified</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-helpers-muted rounded-lg">
                      <div>
                        <p className="font-medium text-helpers-dark">Insurance Verification</p>
                        <p className="text-sm text-helpers-purple">Liability insurance confirmed</p>
                      </div>
                      <span className="text-sm text-green-600">✓ Verified</span>
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
