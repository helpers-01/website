import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProfessionalSignInForm } from "@/components/professional-signin-form"

export default function ProfessionalSignInPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Professional Sign In</h1>
            <p className="text-muted-foreground">Access your service provider dashboard</p>
          </div>
          <ProfessionalSignInForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
