"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Shield, AlertTriangle } from "lucide-react"
import Link from "next/link"

export function AdminSignInForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setAttempts((prev) => prev + 1)
    // Redirect to 2FA page after successful password verification
    window.location.href = "/auth/admin/2fa"
  }

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
            <Shield className="w-5 h-5 text-slate-600" />
          </div>
          <CardTitle className="text-slate-900">Admin Access</CardTitle>
        </div>
        <CardDescription>Secure login for platform administrators</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {attempts > 2 && (
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-amber-900">Security Warning</p>
                <p className="text-xs text-amber-700">
                  Multiple login attempts detected. Account will be temporarily locked after 2 more failed attempts.
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username or Email</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username or email"
              className="border-slate-200 focus:border-slate-400"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="border-slate-200 focus:border-slate-400 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link href="/auth/admin/forgot-password" className="text-sm text-slate-600 hover:text-slate-700">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full bg-slate-700 hover:bg-slate-800">
            Continue to 2FA
          </Button>
        </form>

        <div className="bg-slate-50 p-4 rounded-lg">
          <p className="text-xs text-slate-600 text-center">
            <Shield className="w-3 h-3 inline mr-1" />
            Two-factor authentication will be required after password verification
          </p>
        </div>

        <div className="text-center text-xs text-slate-500">
          Admin accounts are created manually for security purposes
        </div>
      </CardContent>
    </Card>
  )
}
