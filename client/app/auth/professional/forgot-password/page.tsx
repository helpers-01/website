import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProfessionalForgotPasswordForm } from "@/components/professional-forgot-password-form"

export default function ProfessionalForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Reset Professional Password</h1>
            <p className="text-muted-foreground">Enter your email or phone to receive a reset code</p>
          </div>
          <ProfessionalForgotPasswordForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
