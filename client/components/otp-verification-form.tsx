"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, RefreshCw, AlertCircle, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { toast } from "sonner"

export function OTPVerificationForm() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [timeLeft, setTimeLeft] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showEmailInput, setShowEmailInput] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const router = useRouter()
  // SECURITY FIX: Remove email from URL parameters to prevent exposure
  // Use sessionStorage for temporary secure storage instead
  const [email, setEmail] = useState("")

  useEffect(() => {
    // SECURITY FIX: Retrieve email from sessionStorage instead of URL
    const storedEmail = sessionStorage.getItem('otp_email')
    if (storedEmail) {
      setEmail(storedEmail)
    } else {
      // If no email in sessionStorage, show email input
      setShowEmailInput(true)
    }

    // Clean up sessionStorage after 5 minutes for security
    const cleanupTimer = setTimeout(() => {
      sessionStorage.removeItem('otp_email')
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearTimeout(cleanupTimer)
  }, [])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleResend = async () => {
    if (!email) {
      setError("No email found. Please try signing up again.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
      })

      if (error) {
        setError(error.message)
        return
      }

      setTimeLeft(60)
      setCanResend(false)
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
      toast.success("OTP sent successfully!")
    } catch (error) {
      console.error("Resend OTP error:", error)
      setError("Failed to resend OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const otpValue = otp.join("")

    if (otpValue.length !== 6) {
      setError("Please enter a complete 6-digit code")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Verify OTP with Supabase
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: otpValue,
        type: 'email'
      })

      if (error) {
        // Handle specific error cases
        switch (error.message) {
          case "Token has expired or is invalid":
            setError("The verification code has expired. Please request a new one.")
            break
          case "Invalid token":
            setError("Invalid verification code. Please check and try again.")
            break
          default:
            setError(error.message)
        }
        return
      }

      if (data.session && data.user) {
        toast.success("Account verified successfully!")
        router.push("/user/dashboard")
      }
    } catch (error) {
      console.error("OTP verification error:", error)
      setError("Verification failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-blue-200">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone className="w-8 h-8 text-blue-600" />
        </div>
        <CardTitle className="text-blue-900">Enter Verification Code</CardTitle>
        <CardDescription>We've sent a 6-digit code to your phone number ending in ****1234</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {showEmailInput && (
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="border-blue-200 focus:border-blue-400"
                disabled={isLoading}
                required
              />
            </div>
          )}

          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-lg font-semibold border-blue-200 focus:border-blue-400"
                disabled={isLoading}
              />
            ))}
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={otp.join("").length !== 6 || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Code"
            )}
          </Button>
        </form>

        <div className="text-center space-y-2">
          {!canResend ? (
            <p className="text-sm text-muted-foreground">Resend code in {timeLeft}s</p>
          ) : (
            <button
              onClick={handleResend}
              disabled={isLoading}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              {isLoading ? "Sending..." : "Resend Code"}
            </button>
          )}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-xs text-blue-700 text-center">
            Didn't receive the code? Check your spam folder or try resending
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
