import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, UserCheck, CheckCircle, Play, ArrowRight } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Find Your Helper",
    description: "Browse through verified professionals in your area with detailed profiles, ratings, and reviews",
    color: "bg-blue-500",
  },
  {
    icon: UserCheck,
    title: "Book & Agree on Price",
    description: "Contact your chosen helper, discuss requirements, and agree on a fair price that works for both",
    color: "bg-green-500",
  },
  {
    icon: CheckCircle,
    title: "Get Service Done",
    description: "Enjoy professional service at your doorstep with complete satisfaction guarantee",
    color: "bg-purple-500",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-balance bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-muted-foreground text-xl text-pretty max-w-2xl mx-auto">
            Get professional services in just 3 simple steps
          </p>
        </div>

        {/* Video Placeholder */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="overflow-hidden shadow-2xl">
            <CardContent className="p-0">
              <div className="relative bg-gradient-to-br from-purple-600 to-blue-600 h-64 md:h-80 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative z-10 text-center text-white">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                    <Play className="w-10 h-10 ml-1" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Watch How It Works</h3>
                  <p className="text-white/90">See the platform in action</p>
                </div>
                <div className="absolute bottom-4 right-4 bg-black/50 px-3 py-1 rounded-full text-xs text-white backdrop-blur-sm">
                  Demo Video
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="text-center group">
                <Card className="mb-6 hover:shadow-xl transition-all duration-300 border-0 shadow-lg group-hover:-translate-y-2">
                  <CardContent className="p-8">
                    <div className={`w-20 h-20 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-300 mb-4">{index + 1}</div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900">{step.title}</h3>
                    <p className="text-gray-600 text-pretty leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>

                {/* Arrow between steps (hidden on mobile, shown on desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-full ml-4 z-10">
                    <ArrowRight className="w-8 h-8 text-purple-400" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg shadow-lg">
            Get Started Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}
