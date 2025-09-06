"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Mail, Phone, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { loginSchema } from "@/lib/validations"
import { useAuth } from "@/lib/contexts/AuthContext"
import { toast } from "sonner"

export function CustomerSignInForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email")
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const router = useRouter()
  const { refreshProfile } = useAuth()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      // Validate form data
      const validationResult = loginSchema.safeParse(formData)
      if (!validationResult.success) {
        const validationErrors: Record<string, string> = {}
        validationResult.error.errors.forEach(error => {
          validationErrors[error.path[0] as string] = error.message
        })
        setErrors(validationErrors)
        return
      }

      // Attempt sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        // Handle specific error cases
        switch (error.message) {
          case "Invalid login credentials":
            setErrors({ email: "Invalid email or password" })
            break
          case "Email not confirmed":
            setErrors({ email: "Please check your email and confirm your account" })
            break
          default:
            setErrors({ general: error.message })
        }
        return
      }

      if (data.session && data.user) {
        // Refresh profile to get user role
        await refreshProfile()

        toast.success("Successfully signed in!")
        router.push("/dashboard/customer")
      }
    } catch (error) {
      console.error("Sign in error:", error)
      setErrors({ general: "An unexpected error occurred. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpSignIn = async () => {
    if (!formData.email) {
      setErrors({ email: "Email is required for OTP sign in" })
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: formData.email,
      })

      if (error) {
        setErrors({ general: error.message })
        return
      }

      // SECURITY FIX: Store email in sessionStorage instead of URL
      sessionStorage.setItem('otp_email', formData.email)
      toast.success("OTP sent to your email!")
      router.push("/auth/otp-verification")
    } catch (error) {
      console.error("OTP sign in error:", error)
      setErrors({ general: "Failed to send OTP. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

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

        {errors.general && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter your email"
              className={`border-blue-200 focus:border-blue-400 ${errors.email ? "border-red-500" : ""}`}
              disabled={isLoading}
            />
            {errors.email && (
              <span className="text-sm text-red-600">{errors.email}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Enter your password"
                className={`border-blue-200 focus:border-blue-400 pr-10 ${errors.password ? "border-red-500" : ""}`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <span className="text-sm text-red-600">{errors.password}</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Link href="/auth/customer/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
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
            type="button"
            onClick={handleOtpSignIn}
            variant="outline"
            className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending OTP...
              </>
            ) : (
              "Sign in with OTP"
            )}
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
