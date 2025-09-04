import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdminForgotPasswordForm } from "@/components/admin-forgot-password-form"

export default function AdminForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Password Reset</h1>
            <p className="text-muted-foreground">Secure password recovery for administrators</p>
          </div>
          <AdminForgotPasswordForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
