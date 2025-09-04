import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Wrench, Shield } from "lucide-react"
import Link from "next/link"

export function AuthBanners() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {/* Customer Banner */}
      <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors bg-blue-50/50">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl text-blue-900">I'm a Customer</CardTitle>
          <CardDescription className="text-blue-700">Book trusted professionals for home services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/auth/customer/signin">Sign In</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 bg-transparent"
          >
            <Link href="/auth/customer/signup">Sign Up</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Service Professional Banner */}
      <Card className="border-2 border-orange-200 hover:border-orange-300 transition-colors bg-orange-50/50">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Wrench className="w-8 h-8 text-orange-600" />
          </div>
          <CardTitle className="text-2xl text-orange-900">I'm a Service Professional</CardTitle>
          <CardDescription className="text-orange-700">Grow your business and connect with customers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button asChild className="w-full bg-orange-600 hover:bg-orange-700 text-white">
            <Link href="/auth/professional/signin">Sign In</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full border-orange-300 text-orange-700 hover:bg-orange-50 bg-transparent"
          >
            <Link href="/auth/professional/signup">Sign Up</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Admin Banner */}
      <Card className="border-2 border-slate-200 hover:border-slate-300 transition-colors bg-slate-50/50">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-slate-600" />
          </div>
          <CardTitle className="text-2xl text-slate-900">I'm an Admin</CardTitle>
          <CardDescription className="text-slate-700">Manage platform operations and users</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full bg-slate-700 hover:bg-slate-800 text-white">
            <Link href="/auth/admin/signin">Sign In</Link>
          </Button>
          <p className="text-xs text-slate-500 text-center mt-2">Admin accounts are created manually</p>
        </CardContent>
      </Card>
    </div>
  )
}
