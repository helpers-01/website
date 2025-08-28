import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Settings, Save, Bell, DollarSign, Shield } from "lucide-react"
import AdminNav from "@/components/admin-nav"

export default function AdminSettings() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <AdminNav />

      <div className="max-w-4xl mx-auto space-y-8 p-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Platform Settings</h1>
          <p className="text-gray-600">Configure platform-wide settings and preferences</p>
        </div>

        {/* General Settings */}
        <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-600" />
              General Settings
            </CardTitle>
            <CardDescription>Basic platform configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="platform-name">Platform Name</Label>
                <Input
                  id="platform-name"
                  defaultValue="Helpers"
                  className="border-purple-200 focus:border-purple-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-email">Support Email</Label>
                <Input
                  id="support-email"
                  defaultValue="support@helpers.com"
                  className="border-purple-200 focus:border-purple-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform-description">Platform Description</Label>
              <Textarea
                id="platform-description"
                defaultValue="Your trusted platform for home services and professional assistance"
                className="border-purple-200 focus:border-purple-400"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <Label htmlFor="maintenance-mode" className="text-base font-medium">
                  Maintenance Mode
                </Label>
                <p className="text-sm text-gray-600">Temporarily disable the platform for maintenance</p>
              </div>
              <Switch id="maintenance-mode" />
            </div>
          </CardContent>
        </Card>

        {/* Commission Settings */}
        <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              Commission Settings
            </CardTitle>
            <CardDescription>Configure platform commission rates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="default-commission">Default Commission Rate (%)</Label>
                <Input
                  id="default-commission"
                  type="number"
                  defaultValue="15"
                  className="border-purple-200 focus:border-purple-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="premium-commission">Premium Helper Commission (%)</Label>
                <Input
                  id="premium-commission"
                  type="number"
                  defaultValue="12"
                  className="border-purple-200 focus:border-purple-400"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Service-Specific Rates</h4>
              <div className="space-y-3">
                {[
                  { service: "House Cleaning", rate: "15" },
                  { service: "Plumbing", rate: "18" },
                  { service: "AC Repair", rate: "20" },
                  { service: "Beauty & Spa", rate: "12" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="font-medium text-gray-900">{item.service}</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        defaultValue={item.rate}
                        className="w-20 border-purple-200 focus:border-purple-400"
                      />
                      <span className="text-gray-600">%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Bell className="h-5 w-5 text-purple-600" />
              Notification Settings
            </CardTitle>
            <CardDescription>Configure platform notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {[
                {
                  title: "New User Registration",
                  description: "Notify when new users register",
                  enabled: true,
                },
                {
                  title: "Helper Application",
                  description: "Notify when helpers apply to join",
                  enabled: true,
                },
                {
                  title: "Booking Disputes",
                  description: "Notify when booking disputes are reported",
                  enabled: true,
                },
                {
                  title: "Payment Issues",
                  description: "Notify when payment failures occur",
                  enabled: true,
                },
                {
                  title: "Daily Reports",
                  description: "Send daily platform summary reports",
                  enabled: false,
                },
              ].map((notification, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div>
                    <Label className="text-base font-medium">{notification.title}</Label>
                    <p className="text-sm text-gray-600">{notification.description}</p>
                  </div>
                  <Switch defaultChecked={notification.enabled} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              Security Settings
            </CardTitle>
            <CardDescription>Platform security and access controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input
                  id="session-timeout"
                  type="number"
                  defaultValue="30"
                  className="border-purple-200 focus:border-purple-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
                <Input
                  id="max-login-attempts"
                  type="number"
                  defaultValue="5"
                  className="border-purple-200 focus:border-purple-400"
                />
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: "Two-Factor Authentication",
                  description: "Require 2FA for admin accounts",
                  enabled: true,
                },
                {
                  title: "IP Whitelist",
                  description: "Restrict admin access to specific IP addresses",
                  enabled: false,
                },
                {
                  title: "Audit Logging",
                  description: "Log all admin actions for security audits",
                  enabled: true,
                },
              ].map((security, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div>
                    <Label className="text-base font-medium">{security.title}</Label>
                    <p className="text-sm text-gray-600">{security.description}</p>
                  </div>
                  <Switch defaultChecked={security.enabled} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-center">
          <Button className="bg-purple-600 hover:bg-purple-700 px-8 py-3">
            <Save className="h-4 w-4 mr-2" />
            Save All Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
