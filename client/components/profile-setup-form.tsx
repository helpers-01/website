"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { MapPin, Plus, X } from "lucide-react"

export function ProfileSetupForm() {
  const [addresses, setAddresses] = useState([{ id: 1, label: "Home", address: "", pincode: "", isDefault: true }])
  const [preferences, setPreferences] = useState<string[]>([])

  const serviceCategories = [
    "Home Cleaning",
    "Salon & Beauty",
    "Appliance Repair",
    "Plumbing",
    "Electrical",
    "Painting",
    "Carpentry",
    "Pest Control",
    "AC Service",
    "Gardening",
  ]

  const addAddress = () => {
    const newId = Math.max(...addresses.map((a) => a.id)) + 1
    setAddresses([...addresses, { id: newId, label: "", address: "", pincode: "", isDefault: false }])
  }

  const removeAddress = (id: number) => {
    if (addresses.length > 1) {
      setAddresses(addresses.filter((addr) => addr.id !== id))
    }
  }

  const updateAddress = (id: number, field: string, value: string | boolean) => {
    setAddresses(addresses.map((addr) => (addr.id === id ? { ...addr, [field]: value } : addr)))
  }

  const togglePreference = (category: string) => {
    setPreferences((prev) => (prev.includes(category) ? prev.filter((p) => p !== category) : [...prev, category]))
  }

  return (
    <div className="space-y-8">
      {/* Address Section */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Your Addresses
          </CardTitle>
          <CardDescription>Add your addresses to get accurate service availability and pricing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {addresses.map((addr, index) => (
            <div key={addr.id} className="space-y-4 p-4 border border-blue-100 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Input
                    placeholder="Address label (e.g., Home, Office)"
                    value={addr.label}
                    onChange={(e) => updateAddress(addr.id, "label", e.target.value)}
                    className="w-48 border-blue-200"
                  />
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`default-${addr.id}`}
                      checked={addr.isDefault}
                      onCheckedChange={(checked) => updateAddress(addr.id, "isDefault", checked)}
                    />
                    <Label htmlFor={`default-${addr.id}`} className="text-sm">
                      Default
                    </Label>
                  </div>
                </div>
                {addresses.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAddress(addr.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label>Full Address</Label>
                  <Textarea
                    placeholder="Enter complete address with landmarks"
                    value={addr.address}
                    onChange={(e) => updateAddress(addr.id, "address", e.target.value)}
                    className="border-blue-200 resize-none"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>PIN Code</Label>
                  <Input
                    placeholder="PIN Code"
                    value={addr.pincode}
                    onChange={(e) => updateAddress(addr.id, "pincode", e.target.value)}
                    className="border-blue-200"
                    maxLength={6}
                  />
                </div>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addAddress}
            className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Another Address
          </Button>
        </CardContent>
      </Card>

      {/* Preferences Section */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Service Preferences</CardTitle>
          <CardDescription>
            Select services you're interested in to get personalized recommendations (optional)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {serviceCategories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={preferences.includes(category)}
                  onCheckedChange={() => togglePreference(category)}
                  className="border-blue-300"
                />
                <Label htmlFor={category} className="text-sm cursor-pointer">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button variant="outline" className="flex-1 border-blue-200 text-blue-700 bg-transparent">
          Skip for Now
        </Button>
        <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Complete Setup</Button>
      </div>
    </div>
  )
}
