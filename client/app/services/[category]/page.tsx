import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ServiceListingPage } from "@/components/service-listing-page"

// Force dynamic rendering for this page since it depends on database data
export const dynamic = 'force-dynamic'

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
