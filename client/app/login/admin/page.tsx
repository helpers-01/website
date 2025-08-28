"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Shield, Eye, EyeOff, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function AdminLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = () => {
    // Redirect to admin dashboard
    window.location.href = "/admin/dashboard"
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
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-helpers-dark">Admin Login</h1>
          <p className="text-helpers-purple">Administrative access only</p>
        </div>

        <Card className="bg-white border-helpers-muted shadow-sm">
          <CardHeader>
            <CardTitle className="text-center text-helpers-dark">Admin Portal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Security Notice */}
            <div className="bg-helpers-pale border border-helpers-muted rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-helpers-purple mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-helpers-dark">Restricted Access</p>
                  <p className="text-xs text-helpers-purple">This portal is for authorized administrators only.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-helpers-dark">
                  Admin Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-helpers-muted focus:border-helpers-accent"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-helpers-dark">
                  Admin Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
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
                  <span className="text-sm text-helpers-purple">Keep me signed in</span>
                </label>
                <Link href="#" className="text-sm text-helpers-accent hover:underline">
                  Reset password
                </Link>
              </div>

              <Button
                onClick={handleLogin}
                className="w-full bg-helpers-accent hover:bg-helpers-accent-dark text-white"
              >
                Access Admin Panel
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-helpers-purple">
                All admin activities are logged and monitored for security purposes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
