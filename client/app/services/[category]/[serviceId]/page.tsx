import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ServiceDetailPage } from "@/components/service-detail-page"

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
