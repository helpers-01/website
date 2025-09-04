import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProfileSetupForm } from "@/components/profile-setup-form"

export default function ProfileSetupPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Complete Your Profile</h1>
            <p className="text-muted-foreground">
              Add your address and preferences to get personalized service recommendations
            </p>
          </div>
          <ProfileSetupForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
