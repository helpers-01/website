"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, ArrowLeft } from "lucide-react"
import Link from "next/link"

export function ForgotPasswordForm() {
  const [resetMethod, setResetMethod] = useState<"email" | "phone">("email")
  const [step, setStep] = useState<"input" | "sent">("input")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("sent")
  }

  if (step === "sent") {
    return (
      <Card className="border-blue-200">
        <CardHeader className="text-center">
          <CardTitle className="text-blue-900">Reset Code Sent</CardTitle>
          <CardDescription>We've sent a reset code to your {resetMethod}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {resetMethod === "email" ? (
                <Mail className="w-8 h-8 text-blue-600" />
              ) : (
                <Phone className="w-8 h-8 text-blue-600" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Check your {resetMethod} and click the reset link or enter the code below
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reset-code">Reset Code</Label>
            <Input
              id="reset-code"
              type="text"
              placeholder="Enter 6-digit code"
              className="border-blue-200 focus:border-blue-400 text-center text-lg tracking-widest"
              maxLength={6}
            />
          </div>

          <Button className="w-full bg-blue-600 hover:bg-blue-700">Verify Code</Button>

          <div className="text-center">
            <button
              onClick={() => setStep("input")}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to reset form
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="text-blue-900">Reset Password</CardTitle>
        <CardDescription>Choose how you'd like to receive your reset code</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Reset Method Toggle */}
        <div className="flex rounded-lg border border-blue-200 p-1">
          <button
            onClick={() => setResetMethod("email")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              resetMethod === "email" ? "bg-blue-100 text-blue-700" : "text-blue-600 hover:bg-blue-50"
            }`}
          >
            <Mail className="w-4 h-4" />
            Email
          </button>
          <button
            onClick={() => setResetMethod("phone")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              resetMethod === "phone" ? "bg-blue-100 text-blue-700" : "text-blue-600 hover:bg-blue-50"
            }`}
          >
            <Phone className="w-4 h-4" />
            SMS
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-input">{resetMethod === "email" ? "Email Address" : "Phone Number"}</Label>
            <Input
              id="reset-input"
              type={resetMethod === "email" ? "email" : "tel"}
              placeholder={resetMethod === "email" ? "Enter your email" : "Enter your phone number"}
              className="border-blue-200 focus:border-blue-400"
              required
            />
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Send Reset Code
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Remember your password? </span>
          <Link href="/auth/customer/signin" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
