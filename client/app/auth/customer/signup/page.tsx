import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CustomerSignUpForm } from "@/components/customer-signup-form"

export default function CustomerSignUpPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Create Customer Account</h1>
            <p className="text-muted-foreground">Join thousands of satisfied customers</p>
          </div>
          <CustomerSignUpForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
