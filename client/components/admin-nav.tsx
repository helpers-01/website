"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Home,
  Users,
  UserCheck,
  SettingsIcon,
  Calendar,
  BarChart3,
  Grid3X3,
  LogOut,
  Menu,
  X,
  Shield,
} from "lucide-react"

export default function AdminNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { href: "/dashboard/admin", label: "Dashboard", icon: Home },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/helpers", label: "Helpers", icon: UserCheck },
    { href: "/admin/services", label: "Services", icon: Grid3X3 },
    { href: "/admin/bookings", label: "Bookings", icon: Calendar },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/admin/settings", label: "Settings", icon: SettingsIcon },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <nav className="bg-white border-b border-purple-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Helpers</span>
            <span className="text-sm text-purple-600 font-medium">Admin</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const IconComponent = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Admin Profile */}
          <div className="hidden md:flex items-center gap-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt="Admin" />
              <AvatarFallback className="bg-purple-200 text-purple-700">A</AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              size="sm"
              className="border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent"
              onClick={() => router.push("/")}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="outline"
            size="sm"
            className="md:hidden border-purple-200 bg-transparent"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-purple-200">
            <div className="space-y-2">
              {navItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "bg-purple-100 text-purple-700"
                        : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <IconComponent className="w-4 h-4" />
                    {item.label}
                  </Link>
                )
              })}
              <div className="pt-4 border-t border-purple-200">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent"
                  onClick={() => router.push("/")}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
