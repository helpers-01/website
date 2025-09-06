import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Scissors, Sparkles, Wrench, Paintbrush, Zap, Hammer, Car, Laptop, Heart, Stethoscope, ShoppingBag, MoreHorizontal } from "lucide-react"

const allServices = [
  {
    icon: Scissors,
    title: "Salon & Beauty",
    description: "Hair styling, makeup, manicure & more",
    color: "text-primary",
  },
  {
    icon: Sparkles,
    title: "Home Cleaning",
    description: "Deep cleaning, regular maintenance",
    color: "text-accent",
  },
  {
    icon: Wrench,
    title: "Plumbing",
    description: "Repairs, installations, maintenance",
    color: "text-primary",
  },
  {
    icon: Paintbrush,
    title: "Painting",
    description: "Interior & exterior painting services",
    color: "text-accent",
  },
  {
    icon: Zap,
    title: "Electrical",
    description: "Wiring, repairs, installations",
    color: "text-primary",
  },
  {
    icon: Hammer,
    title: "Handyman",
    description: "General repairs & maintenance",
    color: "text-accent",
  },
  {
    icon: Car,
    title: "Car Services",
    description: "Washing, detailing, maintenance",
    color: "text-primary",
  },
  {
    icon: Laptop,
    title: "Tech Support",
    description: "Computer repair, setup, troubleshooting",
    color: "text-accent",
  },
  {
    icon: Heart,
    title: "Healthcare",
    description: "Medical assistance and consultations",
    color: "text-primary",
  },
  {
    icon: Stethoscope,
    title: "Medical Store",
    description: "Medicines and healthcare products",
    color: "text-accent",
  },
  {
    icon: ShoppingBag,
    title: "General Store",
    description: "Daily essentials and groceries",
    color: "text-primary",
  },
]

export function ServiceCategories() {
  const [showAll, setShowAll] = useState(false)
  const [expandedService, setExpandedService] = useState<number | null>(null)

  const displayedServices = showAll ? allServices : allServices.slice(0, 8)
  const hasMoreServices = allServices.length > 8

  return (
    <section id="services" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-balance">Popular Service Categories</h2>
          <p className="text-muted-foreground text-lg text-pretty">
            Choose from our wide range of professional home services
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {displayedServices.map((service, index) => {
            const Icon = service.icon
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="mb-4">
                    <Icon className={`w-12 h-12 mx-auto ${service.color} group-hover:scale-110 transition-transform`} />
                  </div>
                  <h3 className="font-semibold mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground text-pretty">{service.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {hasMoreServices && (
          <div className="text-center mt-8">
            <Button
              onClick={() => setShowAll(!showAll)}
              variant="outline"
              className="px-8 py-2"
            >
              <MoreHorizontal className="w-4 h-4 mr-2" />
              {showAll ? 'Show Less' : `View All Services (${allServices.length})`}
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
