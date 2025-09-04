import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CustomerSignInForm } from "@/components/customer-signin-form"

export default function CustomerSignInPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Customer Sign In</h1>
            <p className="text-muted-foreground">Welcome back! Sign in to book services</p>
          </div>
          <CustomerSignInForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
