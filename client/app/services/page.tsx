import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ServiceCategoryGrid } from "@/components/service-category-grid"

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">All Services</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Browse our comprehensive range of home services
          </p>
        </div>
        <ServiceCategoryGrid />
      </main>
      <Footer />
    </div>
  )
}
