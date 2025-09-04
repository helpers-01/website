import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { OTPVerificationForm } from "@/components/otp-verification-form"

export default function OTPVerificationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Verify Your Account</h1>
            <p className="text-muted-foreground">Enter the verification code sent to your device</p>
          </div>
          <OTPVerificationForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
