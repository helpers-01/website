import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProfessionalDashboard } from "@/components/professional-dashboard"

export default function ProfessionalDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ProfessionalDashboard />
      <Footer />
    </div>
  )
}
