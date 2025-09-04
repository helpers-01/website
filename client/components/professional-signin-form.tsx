"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Mail, Phone } from "lucide-react"
import Link from "next/link"

export function ProfessionalSignInForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email")

  return (
    <Card className="border-orange-200">
      <CardHeader>
        <CardTitle className="text-orange-900">Professional Sign In</CardTitle>
        <CardDescription>Access your service provider account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Login Method Toggle */}
        <div className="flex rounded-lg border border-orange-200 p-1">
          <button
            onClick={() => setLoginMethod("email")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              loginMethod === "email" ? "bg-orange-100 text-orange-700" : "text-orange-600 hover:bg-orange-50"
            }`}
          >
            <Mail className="w-4 h-4" />
            Email
          </button>
          <button
            onClick={() => setLoginMethod("phone")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              loginMethod === "phone" ? "bg-orange-100 text-orange-700" : "text-orange-600 hover:bg-orange-50"
            }`}
          >
            <Phone className="w-4 h-4" />
            Phone
          </button>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-input">{loginMethod === "email" ? "Email Address" : "Phone Number"}</Label>
            <Input
              id="login-input"
              type={loginMethod === "email" ? "email" : "tel"}
              placeholder={loginMethod === "email" ? "Enter your email" : "Enter your phone number"}
              className="border-orange-200 focus:border-orange-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="border-orange-200 focus:border-orange-400 pr-10"
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

          <div className="flex items-center justify-between">
            <Link href="/auth/professional/forgot-password" className="text-sm text-orange-600 hover:text-orange-700">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
            Sign In
          </Button>
        </form>

        <div className="space-y-4">
          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
              OR
            </span>
          </div>

          <Button
            variant="outline"
            className="w-full border-orange-200 text-orange-700 hover:bg-orange-50 bg-transparent"
          >
            Sign in with OTP
          </Button>
        </div>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link href="/auth/professional/signup" className="text-orange-600 hover:text-orange-700 font-medium">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
