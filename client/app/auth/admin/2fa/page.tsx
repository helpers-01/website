import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Admin2FAForm } from "@/components/admin-2fa-form"

export default function Admin2FAPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Two-Factor Authentication</h1>
            <p className="text-muted-foreground">Complete your secure admin login</p>
          </div>
          <Admin2FAForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
