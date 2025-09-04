"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Mail, Phone } from "lucide-react"
import Link from "next/link"

export function CustomerSignInForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email")

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="text-blue-900">Sign In</CardTitle>
        <CardDescription>Choose your preferred sign in method</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Login Method Toggle */}
        <div className="flex rounded-lg border border-blue-200 p-1">
          <button
            onClick={() => setLoginMethod("email")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              loginMethod === "email" ? "bg-blue-100 text-blue-700" : "text-blue-600 hover:bg-blue-50"
            }`}
          >
            <Mail className="w-4 h-4" />
            Email
          </button>
          <button
            onClick={() => setLoginMethod("phone")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              loginMethod === "phone" ? "bg-blue-100 text-blue-700" : "text-blue-600 hover:bg-blue-50"
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
              className="border-blue-200 focus:border-blue-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="border-blue-200 focus:border-blue-400 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link href="/auth/customer/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
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

          <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent">
            Sign in with OTP
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent">
              Google
            </Button>
            <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent">
              Apple
            </Button>
          </div>
        </div>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link href="/auth/customer/signup" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
