import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ServiceDetailPage } from "@/components/service-detail-page"

// Force dynamic rendering for this page since it depends on database data
export const dynamic = 'force-dynamic'

interface ServiceDetailPageProps {
  params: {
    category: string
    serviceId: string
  }
}

export default function ServiceDetail({ params }: ServiceDetailPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ServiceDetailPage categoryId={params.category} serviceId={params.serviceId} />
      <Footer />
    </div>
  )
}
