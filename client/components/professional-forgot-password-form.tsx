"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, ArrowLeft } from "lucide-react"
import Link from "next/link"

export function ProfessionalForgotPasswordForm() {
  const [resetMethod, setResetMethod] = useState<"email" | "phone">("email")
  const [step, setStep] = useState<"input" | "sent">("input")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("sent")
  }

  if (step === "sent") {
    return (
      <Card className="border-orange-200">
        <CardHeader className="text-center">
          <CardTitle className="text-orange-900">Reset Code Sent</CardTitle>
          <CardDescription>We've sent a reset code to your {resetMethod}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {resetMethod === "email" ? (
                <Mail className="w-8 h-8 text-orange-600" />
              ) : (
                <Phone className="w-8 h-8 text-orange-600" />
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
              className="border-orange-200 focus:border-orange-400 text-center text-lg tracking-widest"
              maxLength={6}
            />
          </div>

          <Button className="w-full bg-orange-600 hover:bg-orange-700">Verify Code</Button>

          <div className="text-center">
            <button
              onClick={() => setStep("input")}
              className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1 mx-auto"
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
    <Card className="border-orange-200">
      <CardHeader>
        <CardTitle className="text-orange-900">Reset Password</CardTitle>
        <CardDescription>Choose how you'd like to receive your reset code</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Reset Method Toggle */}
        <div className="flex rounded-lg border border-orange-200 p-1">
          <button
            onClick={() => setResetMethod("email")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              resetMethod === "email" ? "bg-orange-100 text-orange-700" : "text-orange-600 hover:bg-orange-50"
            }`}
          >
            <Mail className="w-4 h-4" />
            Email
          </button>
          <button
            onClick={() => setResetMethod("phone")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              resetMethod === "phone" ? "bg-orange-100 text-orange-700" : "text-orange-600 hover:bg-orange-50"
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
              className="border-orange-200 focus:border-orange-400"
              required
            />
          </div>

          <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
            Send Reset Code
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Remember your password? </span>
          <Link href="/auth/professional/signin" className="text-orange-600 hover:text-orange-700 font-medium">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
