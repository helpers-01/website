"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, User, Phone, Mail } from "lucide-react"
import Link from "next/link"

export default function UserLogin() {
  const [loginMethod, setLoginMethod] = useState<"phone" | "email">("phone")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [showOtp, setShowOtp] = useState(false)

  const handleSendOtp = () => {
    setShowOtp(true)
  }

  const handleLogin = () => {
    // Redirect to user dashboard
    window.location.href = "/user/dashboard"
  }

  return (
    <div className="min-h-screen bg-helpers-light flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-helpers-purple hover:text-helpers-dark mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Login Options
          </Link>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-helpers-accent rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-helpers-dark">User Login</h1>
          <p className="text-helpers-purple">Access your personal account</p>
        </div>

        <Card className="bg-white border-helpers-muted shadow-sm">
          <CardHeader>
            <CardTitle className="text-center text-helpers-dark">Welcome Back</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Login Method Toggle */}
            <div className="flex bg-helpers-pale rounded-lg p-1">
              <button
                onClick={() => setLoginMethod("phone")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  loginMethod === "phone" ? "bg-white text-helpers-dark shadow-sm" : "text-helpers-purple"
                }`}
              >
                <Phone className="w-4 h-4" />
                Phone
              </button>
              <button
                onClick={() => setLoginMethod("email")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  loginMethod === "email" ? "bg-white text-helpers-dark shadow-sm" : "text-helpers-purple"
                }`}
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
            </div>

            {!showOtp ? (
              <div className="space-y-4">
                {loginMethod === "phone" ? (
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-helpers-dark">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="border-helpers-muted focus:border-helpers-accent"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-helpers-dark">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-helpers-muted focus:border-helpers-accent"
                    />
                  </div>
                )}
                <Button
                  onClick={handleSendOtp}
                  className="w-full bg-helpers-accent hover:bg-helpers-accent-dark text-white"
                >
                  Send OTP
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-helpers-dark">
                    Enter OTP
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="border-helpers-muted focus:border-helpers-accent text-center text-lg tracking-widest"
                    maxLength={6}
                  />
                  <p className="text-sm text-helpers-purple text-center">
                    OTP sent to {loginMethod === "phone" ? phoneNumber : email}
                  </p>
                </div>
                <Button
                  onClick={handleLogin}
                  className="w-full bg-helpers-accent hover:bg-helpers-accent-dark text-white"
                >
                  Verify & Login
                </Button>
                <Button
                  onClick={() => setShowOtp(false)}
                  variant="outline"
                  className="w-full border-helpers-muted text-helpers-purple hover:bg-helpers-pale"
                >
                  Change {loginMethod === "phone" ? "Phone Number" : "Email"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
