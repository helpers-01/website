"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, ArrowLeft, Shield, AlertTriangle } from "lucide-react"
import Link from "next/link"

export function AdminForgotPasswordForm() {
  const [step, setStep] = useState<"input" | "sent">("input")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("sent")
  }

  if (step === "sent") {
    return (
      <Card className="border-slate-200">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-slate-600" />
          </div>
          <CardTitle className="text-slate-900">Reset Instructions Sent</CardTitle>
          <CardDescription>Check your registered email for secure reset instructions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-slate-600 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-900">Security Notice</p>
                <p className="text-xs text-slate-600">
                  For security reasons, password reset links expire in 15 minutes. If you don't receive the email,
                  contact your system administrator.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reset-code">Or Enter Reset Code</Label>
            <Input
              id="reset-code"
              type="text"
              placeholder="Enter 8-digit security code"
              className="border-slate-200 focus:border-slate-400 text-center text-lg tracking-widest"
              maxLength={8}
            />
          </div>

          <Button className="w-full bg-slate-700 hover:bg-slate-800">Verify Reset Code</Button>

          <div className="text-center">
            <button
              onClick={() => setStep("input")}
              className="text-sm text-slate-600 hover:text-slate-700 flex items-center gap-1 mx-auto"
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
    <Card className="border-slate-200">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
            <Shield className="w-5 h-5 text-slate-600" />
          </div>
          <CardTitle className="text-slate-900">Secure Password Reset</CardTitle>
        </div>
        <CardDescription>Enter your registered email address for password recovery</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-amber-900">Admin Account Security</p>
              <p className="text-xs text-amber-700">
                Only registered administrator emails can request password resets. All reset attempts are logged for
                security monitoring.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Administrator Email</Label>
            <Input
              id="admin-email"
              type="email"
              placeholder="Enter your registered admin email"
              className="border-slate-200 focus:border-slate-400"
              required
            />
          </div>

          <Button type="submit" className="w-full bg-slate-700 hover:bg-slate-800">
            Send Secure Reset Link
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Remember your password? </span>
          <Link href="/auth/admin/signin" className="text-slate-600 hover:text-slate-700 font-medium">
            Back to sign in
          </Link>
        </div>

        <div className="text-center text-xs text-slate-500">Need help? Contact your system administrator</div>
      </CardContent>
    </Card>
  )
}
