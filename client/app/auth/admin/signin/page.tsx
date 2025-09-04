import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdminSignInForm } from "@/components/admin-signin-form"

export default function AdminSignInPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Sign In</h1>
            <p className="text-muted-foreground">Secure access to platform management</p>
          </div>
          <AdminSignInForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
