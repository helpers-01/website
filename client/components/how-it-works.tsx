import { Card, CardContent } from "@/components/ui/card"
import { Search, UserCheck, Calendar, CreditCard, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Search",
    description: "Find the service you need in your area",
  },
  {
    icon: UserCheck,
    title: "Select",
    description: "Choose from verified professionals",
  },
  {
    icon: Calendar,
    title: "Book",
    description: "Schedule at your convenient time",
  },
  {
    icon: CreditCard,
    title: "Pay",
    description: "Secure payment after service completion",
  },
  {
    icon: CheckCircle,
    title: "Service Delivered",
    description: "Enjoy professional service at your doorstep",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-balance">How It Works</h2>
          <p className="text-muted-foreground text-lg text-pretty">Get professional services in 5 simple steps</p>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="text-center">
                <Card className="mb-4">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-primary mb-2">{index + 1}</div>
                  </CardContent>
                </Card>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground text-pretty">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
