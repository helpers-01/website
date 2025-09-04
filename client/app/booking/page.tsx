import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BookingPage } from "@/components/booking-page"

export default function Booking() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <BookingPage />
      <Footer />
    </div>
  )
}
