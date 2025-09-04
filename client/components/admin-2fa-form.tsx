"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Smartphone, Mail, RefreshCw, AlertCircle } from "lucide-react"

export function Admin2FAForm() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [method, setMethod] = useState<"app" | "sms" | "email">("app")
  const [timeLeft, setTimeLeft] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const [attempts, setAttempts] = useState(0)
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
    setTimeLeft(30)
    setCanResend(false)
    setOtp(["", "", "", "", "", ""])
    inputRefs.current[0]?.focus()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const otpValue = otp.join("")
    if (otpValue.length === 6) {
      console.log("Admin 2FA submitted:", otpValue)
      // Handle 2FA verification
      setAttempts((prev) => prev + 1)
    }
  }

  const getMethodIcon = () => {
    switch (method) {
      case "app":
        return <Shield className="w-8 h-8 text-slate-600" />
      case "sms":
        return <Smartphone className="w-8 h-8 text-slate-600" />
      case "email":
        return <Mail className="w-8 h-8 text-slate-600" />
    }
  }

  const getMethodDescription = () => {
    switch (method) {
      case "app":
        return "Enter the 6-digit code from your authenticator app"
      case "sms":
        return "Enter the code sent to your registered phone number"
      case "email":
        return "Enter the code sent to your admin email"
    }
  }

  return (
    <Card className="border-slate-200">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          {getMethodIcon()}
        </div>
        <CardTitle className="text-slate-900">Two-Factor Authentication</CardTitle>
        <CardDescription>{getMethodDescription()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Method Selection */}
        <div className="flex rounded-lg border border-slate-200 p-1">
          <button
            onClick={() => setMethod("app")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              method === "app" ? "bg-slate-100 text-slate-700" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Shield className="w-4 h-4" />
            App
          </button>
          <button
            onClick={() => setMethod("sms")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              method === "sms" ? "bg-slate-100 text-slate-700" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            SMS
          </button>
          <button
            onClick={() => setMethod("email")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              method === "email" ? "bg-slate-100 text-slate-700" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Mail className="w-4 h-4" />
            Email
          </button>
        </div>

        {attempts > 2 && (
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-red-900">Security Alert</p>
                <p className="text-xs text-red-700">
                  Multiple failed attempts detected. Your session will be locked after 2 more attempts.
                </p>
              </div>
            </div>
          </div>
        )}

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
                className="w-12 h-12 text-center text-lg font-semibold border-slate-200 focus:border-slate-400"
              />
            ))}
          </div>

          <Button type="submit" className="w-full bg-slate-700 hover:bg-slate-800" disabled={otp.join("").length !== 6}>
            Verify & Access Admin Panel
          </Button>
        </form>

        <div className="text-center space-y-2">
          {method !== "app" &&
            (!canResend ? (
              <p className="text-sm text-muted-foreground">Resend code in {timeLeft}s</p>
            ) : (
              <button
                onClick={handleResend}
                className="text-sm text-slate-600 hover:text-slate-700 flex items-center gap-1 mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                Resend Code
              </button>
            ))}
        </div>

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <p className="text-xs text-slate-600 text-center">
            <Shield className="w-3 h-3 inline mr-1" />
            This is a secure admin area. All access attempts are monitored and logged.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
