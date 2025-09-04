import { Card, CardContent } from "@/components/ui/card"
import { Scissors, Sparkles, Wrench, Paintbrush, Zap, Hammer, Car, Laptop } from "lucide-react"

const services = [
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
]

export function ServiceCategories() {
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
          {services.map((service, index) => {
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
      </div>
    </section>
  )
}
