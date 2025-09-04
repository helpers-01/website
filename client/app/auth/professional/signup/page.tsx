import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProfessionalSignUpForm } from "@/components/professional-signup-form"

export default function ProfessionalSignUpPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Join as a Service Professional</h1>
            <p className="text-muted-foreground">Start your journey to connect with customers and grow your business</p>
          </div>
          <ProfessionalSignUpForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
