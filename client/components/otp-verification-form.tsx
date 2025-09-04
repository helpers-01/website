"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, RefreshCw } from "lucide-react"

export function OTPVerificationForm() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [timeLeft, setTimeLeft] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

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

  const handleResend = () => {
    setTimeLeft(60)
    setCanResend(false)
    setOtp(["", "", "", "", "", ""])
    inputRefs.current[0]?.focus()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const otpValue = otp.join("")
    if (otpValue.length === 6) {
      console.log("OTP submitted:", otpValue)
      // Handle OTP verification
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
        <form onSubmit={handleSubmit} className="space-y-6">
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
              />
            ))}
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={otp.join("").length !== 6}>
            Verify Code
          </Button>
        </form>

        <div className="text-center space-y-2">
          {!canResend ? (
            <p className="text-sm text-muted-foreground">Resend code in {timeLeft}s</p>
          ) : (
            <button
              onClick={handleResend}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Resend Code
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
