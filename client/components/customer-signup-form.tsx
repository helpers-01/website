"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { signupSchema } from "@/lib/validations"
import { toast } from "sonner"

export function CustomerSignUpForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const router = useRouter()

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      // Validate form data
      const validationResult = signupSchema.safeParse(formData)
      if (!validationResult.success) {
        const validationErrors: Record<string, string> = {}
        validationResult.error.errors.forEach(error => {
          validationErrors[error.path[0] as string] = error.message
        })
        setErrors(validationErrors)
        return
      }

      // Create user account with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
            phone: formData.phone,
          }
        }
      })

      if (error) {
        // Handle specific error cases
        switch (error.message) {
          case "User already registered":
            setErrors({ email: "An account with this email already exists" })
            break
          case "Password should be at least 6 characters":
            setErrors({ password: "Password must be at least 6 characters" })
            break
          default:
            setErrors({ general: error.message })
        }
        return
      }

      if (data.user && !data.session) {
        // Email confirmation required
        // Only run on client side
        if (typeof window !== 'undefined') {
          // SECURITY FIX: Store email in sessionStorage instead of URL
          sessionStorage.setItem('otp_email', formData.email)
        }
        toast.success("Account created! Please check your email to confirm your account.")
        router.push("/auth/otp-verification")
      } else if (data.session) {
        // Auto-confirmed (if email confirmation is disabled)
        toast.success("Account created successfully!")
        router.push("/user/dashboard")
      }
    } catch (error) {
      console.error("Sign up error:", error)
      setErrors({ general: "An unexpected error occurred. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="text-blue-900">Create Account</CardTitle>
        <CardDescription>Fill in your details to get started</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {errors.general && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={formData.full_name}
              onChange={(e) => handleInputChange("full_name", e.target.value)}
              placeholder="Enter your full name"
              className={`border-blue-200 focus:border-blue-400 ${errors.full_name ? "border-red-500" : ""}`}
              disabled={isLoading}
            />
            {errors.full_name && (
              <span className="text-sm text-red-600">{errors.full_name}</span>
            )}
          </div>

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
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="Enter your phone number"
              className={`border-blue-200 focus:border-blue-400 ${errors.phone ? "border-red-500" : ""}`}
              disabled={isLoading}
            />
            {errors.phone && (
              <span className="text-sm text-red-600">{errors.phone}</span>
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
                placeholder="Create a password"
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

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                placeholder="Confirm your password"
                className={`border-blue-200 focus:border-blue-400 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-sm text-red-600">{errors.confirmPassword}</span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={formData.terms}
              onCheckedChange={(checked) => handleInputChange("terms", checked as boolean)}
              className="border-blue-300"
              disabled={isLoading}
            />
            <Label htmlFor="terms" className="text-sm">
              I agree to the{" "}
              <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                Privacy Policy
              </Link>
            </Label>
          </div>
          {errors.terms && (
            <span className="text-sm text-red-600">{errors.terms}</span>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
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
          <span className="text-muted-foreground">Already have an account? </span>
          <Link href="/auth/customer/signin" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
