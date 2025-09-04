import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Scissors, Home, Wrench, Paintbrush, Zap, Droplets, Hammer, Bug, Wind, Leaf } from "lucide-react"
import Link from "next/link"

const serviceCategories = [
  {
    id: "salon-beauty",
    name: "Salon & Beauty",
    description: "Professional beauty and grooming services",
    icon: Scissors,
    serviceCount: 24,
    startingPrice: 299,
    subcategories: ["Men's Haircut", "Women's Styling", "Facial", "Manicure", "Pedicure", "Massage"],
  },
  {
    id: "home-cleaning",
    name: "Home Cleaning",
    description: "Complete home cleaning solutions",
    icon: Home,
    serviceCount: 18,
    startingPrice: 199,
    subcategories: ["Regular Cleaning", "Deep Cleaning", "Kitchen Cleaning", "Bathroom Cleaning", "Sofa Cleaning"],
  },
  {
    id: "appliance-repair",
    name: "Appliance Repair",
    description: "Fix and maintain home appliances",
    icon: Wrench,
    serviceCount: 32,
    startingPrice: 149,
    subcategories: ["Washing Machine", "Refrigerator", "Microwave", "TV Repair", "Water Purifier"],
  },
  {
    id: "painting",
    name: "Painting",
    description: "Interior and exterior painting services",
    icon: Paintbrush,
    serviceCount: 15,
    startingPrice: 89,
    subcategories: ["Wall Painting", "Texture Painting", "Waterproofing", "Wood Polishing"],
  },
  {
    id: "electrical",
    name: "Electrical",
    description: "Electrical installation and repair",
    icon: Zap,
    serviceCount: 28,
    startingPrice: 99,
    subcategories: ["Wiring", "Switch Installation", "Fan Installation", "Light Fitting", "Inverter Service"],
  },
  {
    id: "plumbing",
    name: "Plumbing",
    description: "Plumbing installation and repair",
    icon: Droplets,
    serviceCount: 22,
    startingPrice: 129,
    subcategories: ["Tap Repair", "Pipe Installation", "Toilet Repair", "Drainage Cleaning"],
  },
  {
    id: "carpentry",
    name: "Carpentry",
    description: "Custom furniture and woodwork",
    icon: Hammer,
    serviceCount: 19,
    startingPrice: 199,
    subcategories: ["Furniture Repair", "Custom Furniture", "Door Installation", "Shelving"],
  },
  {
    id: "pest-control",
    name: "Pest Control",
    description: "Professional pest management",
    icon: Bug,
    serviceCount: 12,
    startingPrice: 299,
    subcategories: ["Cockroach Control", "Termite Treatment", "Bed Bug Treatment", "General Pest Control"],
  },
  {
    id: "ac-service",
    name: "AC Service",
    description: "Air conditioner service and repair",
    icon: Wind,
    serviceCount: 16,
    startingPrice: 249,
    subcategories: ["AC Installation", "AC Repair", "AC Cleaning", "Gas Refilling"],
  },
  {
    id: "gardening",
    name: "Gardening",
    description: "Garden maintenance and landscaping",
    icon: Leaf,
    serviceCount: 14,
    startingPrice: 179,
    subcategories: ["Garden Cleaning", "Plant Care", "Landscaping", "Tree Trimming"],
  },
]

export function ServiceCategoryGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {serviceCategories.map((category) => {
        const IconComponent = category.icon
        return (
          <Link key={category.id} href={`/services/${category.id}`}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-primary/20 hover:border-primary/40">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {category.serviceCount} services
                      </Badge>
                      <span className="text-sm text-muted-foreground">from ₹{category.startingPrice}</span>
                    </div>
                  </div>
                </div>
                <CardDescription className="text-sm">{category.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Popular services:</p>
                  <div className="flex flex-wrap gap-1">
                    {category.subcategories.slice(0, 4).map((sub) => (
                      <Badge key={sub} variant="outline" className="text-xs">
                        {sub}
                      </Badge>
                    ))}
                    {category.subcategories.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{category.subcategories.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
