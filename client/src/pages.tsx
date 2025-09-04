import { HeroSection } from "@/components/hero-section"
import { ServiceCategories } from "@/components/service-categories"
import { SearchSection } from "@/components/search-section"
import { HowItWorks } from "@/components/how-it-works"
import { Testimonials } from "@/components/testimonials"
import { AppDownload } from "@/components/app-download"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <SearchSection />
        <ServiceCategories />
        <HowItWorks />
        <Testimonials />
        <AppDownload />
      </main>
      <Footer />
    </div>
  )
}
