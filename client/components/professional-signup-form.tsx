"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Upload, User, FileText } from "lucide-react"
import Link from "next/link"

export function ProfessionalSignUpForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [step, setStep] = useState<"basic" | "kyc">("basic")

  const handleBasicSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("kyc")
  }

  if (step === "kyc") {
    return <KYCForm onBack={() => setStep("basic")} />
  }

  return (
    <Card className="border-orange-200">
      <CardHeader>
        <CardTitle className="text-orange-900">Create Professional Account</CardTitle>
        <CardDescription>Step 1 of 2: Basic Information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleBasicSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              className="border-orange-200 focus:border-orange-400"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="border-orange-200 focus:border-orange-400"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                className="border-orange-200 focus:border-orange-400"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="border-orange-200 focus:border-orange-400 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-600 hover:text-orange-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="border-orange-200 focus:border-orange-400 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-600 hover:text-orange-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
            Continue to KYC Verification
          </Button>
        </form>

        <div className="space-y-4">
          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
              OR
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50 bg-transparent">
              Google
            </Button>
            <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50 bg-transparent">
              Apple
            </Button>
          </div>
        </div>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link href="/auth/professional/signin" className="text-orange-600 hover:text-orange-700 font-medium">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

function KYCForm({ onBack }: { onBack: () => void }) {
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])

  const serviceCategories = [
    "Home Cleaning",
    "Deep Cleaning",
    "Salon & Beauty",
    "Men's Grooming",
    "Women's Beauty",
    "Appliance Repair",
    "AC Service",
    "Plumbing",
    "Electrical Work",
    "Painting",
    "Carpentry",
    "Pest Control",
    "Gardening",
    "Home Renovation",
  ]

  const toggleService = (service: string) => {
    setSelectedServices((prev) => (prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]))
  }

  return (
    <div className="space-y-6">
      {/* KYC Documents */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-900 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            KYC Verification
          </CardTitle>
          <CardDescription>Upload your documents for identity verification</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label>ID Proof (Aadhaar/PAN/Driving License)</Label>
              <div className="border-2 border-dashed border-orange-200 rounded-lg p-6 text-center hover:border-orange-300 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload ID proof</p>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 5MB</p>
              </div>
            </div>
            <div className="space-y-3">
              <Label>Profile Photo</Label>
              <div className="border-2 border-dashed border-orange-200 rounded-lg p-6 text-center hover:border-orange-300 transition-colors cursor-pointer">
                <User className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload photo</p>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 2MB</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services & Skills */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-900">Services You Provide</CardTitle>
          <CardDescription>Select all services you can provide to customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {serviceCategories.map((service) => (
              <div key={service} className="flex items-center space-x-2">
                <Checkbox
                  id={service}
                  checked={selectedServices.includes(service)}
                  onCheckedChange={() => toggleService(service)}
                  className="border-orange-300"
                />
                <Label htmlFor={service} className="text-sm cursor-pointer">
                  {service}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Service Areas */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-900">Service Areas</CardTitle>
          <CardDescription>Enter PIN codes where you can provide services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input placeholder="Enter PIN code" className="border-orange-200 focus:border-orange-400" maxLength={6} />
            <Button variant="outline" className="border-orange-200 text-orange-700 bg-transparent">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedAreas.map((area) => (
              <span key={area} className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                {area}
                <button className="ml-2 text-orange-500 hover:text-orange-700">×</button>
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Availability */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-900">Availability Schedule</CardTitle>
          <CardDescription>Set your working hours and days</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input type="time" defaultValue="09:00" className="border-orange-200 focus:border-orange-400" />
            </div>
            <div className="space-y-2">
              <Label>End Time</Label>
              <Input type="time" defaultValue="18:00" className="border-orange-200 focus:border-orange-400" />
            </div>
            <div className="space-y-2">
              <Label>Working Days</Label>
              <select className="w-full p-2 border border-orange-200 rounded-md focus:border-orange-400">
                <option>Monday to Saturday</option>
                <option>Monday to Friday</option>
                <option>All 7 Days</option>
                <option>Custom</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Max Bookings/Day</Label>
              <Input
                type="number"
                defaultValue="5"
                min="1"
                max="20"
                className="border-orange-200 focus:border-orange-400"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms & Actions */}
      <Card className="border-orange-200">
        <CardContent className="pt-6 space-y-6">
          <div className="flex items-start space-x-2">
            <Checkbox id="terms" className="border-orange-300 mt-1" />
            <Label htmlFor="terms" className="text-sm leading-relaxed">
              I agree to the{" "}
              <Link href="/terms" className="text-orange-600 hover:text-orange-700">
                Terms & Conditions
              </Link>
              ,{" "}
              <Link href="/privacy" className="text-orange-600 hover:text-orange-700">
                Privacy Policy
              </Link>
              , and{" "}
              <Link href="/professional-terms" className="text-orange-600 hover:text-orange-700">
                Professional Service Agreement
              </Link>
            </Label>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1 border-orange-200 text-orange-700 bg-transparent"
            >
              Back
            </Button>
            <Button className="flex-1 bg-orange-600 hover:bg-orange-700">Submit for Verification</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
