import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ServiceListingPage } from "@/components/service-listing-page"

interface ServiceCategoryPageProps {
  params: {
    category: string
  }
}

export default function ServiceCategoryPage({ params }: ServiceCategoryPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ServiceListingPage categoryId={params.category} />
      <Footer />
    </div>
  )
}
