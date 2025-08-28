"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Users, Shield } from "lucide-react"

export default function LoginDashboard() {
  const loginOptions = [
    {
      id: "user",
      title: "User Login",
      description:
        "Login with your User ID and Password to access your personal account and services. Keep track of your progress and stay updated.",
      icon: User,
      href: "/login/user",
    },
    {
      id: "helper",
      title: "Helper Login",
      description:
        "Login to your Helper account using your Employee ID and Password. Access helper tools and manage your assigned tasks.",
      icon: Users,
      href: "/login/helper",
    },
    {
      id: "admin",
      title: "Admin Login",
      description:
        "For Admin Staff only. Use your Admin credentials to access administrative services and system management tools.",
      icon: Shield,
      href: "/login/admin",
    },
  ]

  return (
    <div className="min-h-screen bg-helpers-light">
      {/* Header */}
      <div className="flex justify-center py-8">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-helpers-accent rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-helpers-dark">Helpers</h1>
            <p className="text-helpers-purple text-sm">Management System</p>
          </div>
        </div>
      </div>

      {/* Login Cards Grid */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loginOptions.map((option) => {
            const IconComponent = option.icon
            return (
              <Card
                key={option.id}
                className="bg-white border-helpers-muted shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-start space-y-4">
                    {/* Icon */}
                    <div className="w-12 h-12 bg-helpers-pale rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-helpers-purple" />
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-semibold text-helpers-dark">{option.title}</h2>

                    {/* Description */}
                    <p className="text-sm text-helpers-purple leading-relaxed">{option.description}</p>

                    {/* Login Button */}
                    <Button
                      className="w-full bg-helpers-accent hover:bg-helpers-accent-dark text-white font-medium"
                      onClick={() => (window.location.href = option.href)}
                    >
                      Login Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-8">
        <p className="text-xs text-helpers-purple">© 2025 Helpers Management System. All rights reserved.</p>
      </div>
    </div>
  )
}
