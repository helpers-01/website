"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Users, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function HelperLogin() {
  const [employeeId, setEmployeeId] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = () => {
    // Redirect to helper dashboard
    window.location.href = "/helper/dashboard"
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
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-helpers-dark">Helper Login</h1>
          <p className="text-helpers-purple">Access your service provider account</p>
        </div>

        <Card className="bg-white border-helpers-muted shadow-sm">
          <CardHeader>
            <CardTitle className="text-center text-helpers-dark">Service Provider Portal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId" className="text-helpers-dark">
                  Employee ID
                </Label>
                <Input
                  id="employeeId"
                  type="text"
                  placeholder="Enter your Employee ID"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="border-helpers-muted focus:border-helpers-accent"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-helpers-dark">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-helpers-muted focus:border-helpers-accent pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-helpers-purple hover:text-helpers-dark"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-helpers-muted" />
                  <span className="text-sm text-helpers-purple">Remember me</span>
                </label>
                <Link href="#" className="text-sm text-helpers-accent hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button
                onClick={handleLogin}
                className="w-full bg-helpers-accent hover:bg-helpers-accent-dark text-white"
              >
                Login to Helper Portal
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-helpers-purple">
                New helper?{" "}
                <Link href="#" className="text-helpers-accent hover:underline">
                  Apply to join
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
