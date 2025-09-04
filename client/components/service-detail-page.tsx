"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Clock, Shield, Plus, Minus, ShoppingCart, Heart } from "lucide-react"
import Link from "next/link"

interface ServiceDetailPageProps {
  categoryId: string
  serviceId: string
}

const mockService = {
  id: "1",
  name: "Premium Men's Haircut & Styling",
  provider: "StyleCraft Salon",
  price: 299,
  originalPrice: 399,
  duration: "45 min",
  rating: 4.8,
  reviewCount: 234,
  images: ["/professional-haircut-salon.png", "/modern-salon.png", "/hair-styling-tools.jpg"],
  verified: true,
  location: "Koramangala",
  availability: "Available today",
  description:
    "Experience premium men's grooming with our expert stylists. Includes consultation, wash, cut, styling, and finishing touches.",
  includes: [
    "Hair consultation",
    "Premium shampoo & conditioning",
    "Professional haircut",
    "Styling with premium products",
    "Head massage (5 min)",
    "Beard trimming (if required)",
  ],
  addOns: [
    { name: "Beard Styling", price: 99, duration: "15 min" },
    { name: "Hair Spa Treatment", price: 199, duration: "30 min" },
    { name: "Premium Hair Products", price: 149, duration: "0 min" },
  ],
  safetyMeasures: [
    "Sanitized tools and equipment",
    "Temperature check for staff",
    "Masks mandatory for all",
    "Social distancing maintained",
  ],
  reviews: [
    {
      id: 1,
      name: "Rahul Sharma",
      rating: 5,
      comment: "Excellent service! The stylist understood exactly what I wanted.",
      date: "2 days ago",
      avatar: "/man-face.png",
    },
    {
      id: 2,
      name: "Amit Kumar",
      rating: 4,
      comment: "Good haircut, professional service. Will book again.",
      date: "1 week ago",
      avatar: "/man-face.png",
    },
  ],
  faqs: [
    {
      question: "How long does the service take?",
      answer: "The complete service takes approximately 45 minutes including consultation and styling.",
    },
    {
      question: "Do you provide hair products?",
      answer: "Yes, we use premium hair products. You can also purchase them as add-ons.",
    },
    {
      question: "Can I reschedule my appointment?",
      answer: "Yes, you can reschedule up to 2 hours before your appointment time.",
    },
  ],
}

export function ServiceDetailPage({ categoryId, serviceId }: ServiceDetailPageProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])

  const toggleAddOn = (addOnName: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(addOnName) ? prev.filter((name) => name !== addOnName) : [...prev, addOnName],
    )
  }

  const calculateTotal = () => {
    const basePrice = mockService.price * quantity
    const addOnPrice = mockService.addOns
      .filter((addOn) => selectedAddOns.includes(addOn.name))
      .reduce((sum, addOn) => sum + addOn.price, 0)
    return basePrice + addOnPrice
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <Link href="/services" className="hover:text-foreground">
          Services
        </Link>
        <span>/</span>
        <Link href={`/services/${categoryId}`} className="hover:text-foreground">
          {categoryId.replace("-", " ")}
        </Link>
        <span>/</span>
        <span className="text-foreground">{mockService.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                <img
                  src={mockService.images[selectedImage] || "/placeholder.svg"}
                  alt={mockService.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex gap-2 overflow-x-auto">
                  {mockService.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 ${
                        selectedImage === index ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <img src={image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Details Tabs */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="safety">Safety</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Service Description</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{mockService.description}</p>

                  <div>
                    <h4 className="font-semibold mb-2">What's Included:</h4>
                    <ul className="space-y-1">
                      {mockService.includes.map((item, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                  <CardDescription>
                    {mockService.reviewCount} reviews • Average {mockService.rating} stars
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockService.reviews.map((review) => (
                    <div key={review.id} className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={review.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{review.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{review.name}</span>
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">{review.date}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
                        </div>
                      </div>
                      <Separator />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="safety" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Safety Measures
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {mockService.safetyMeasures.map((measure, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        {measure}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="faq" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockService.faqs.map((faq, index) => (
                    <div key={index} className="space-y-2">
                      <h4 className="font-medium text-sm">{faq.question}</h4>
                      <p className="text-sm text-muted-foreground">{faq.answer}</p>
                      {index < mockService.faqs.length - 1 && <Separator />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Booking Card */}
        <div className="space-y-6">
          <Card className="sticky top-4">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{mockService.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    {mockService.provider}
                    {mockService.verified && (
                      <Badge variant="secondary" className="text-xs">
                        Verified
                      </Badge>
                    )}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Price & Rating */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">₹{mockService.price}</span>
                  {mockService.originalPrice > mockService.price && (
                    <span className="text-lg text-muted-foreground line-through">₹{mockService.originalPrice}</span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>
                      {mockService.rating} ({mockService.reviewCount})
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{mockService.duration}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {mockService.location} • {mockService.availability}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Quantity */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity</label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-8 text-center">{quantity}</span>
                  <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Add-ons */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Add-ons (Optional)</label>
                <div className="space-y-2">
                  {mockService.addOns.map((addOn) => (
                    <div key={addOn.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedAddOns.includes(addOn.name)}
                          onChange={() => toggleAddOn(addOn.name)}
                          className="rounded"
                        />
                        <div>
                          <p className="text-sm font-medium">{addOn.name}</p>
                          <p className="text-xs text-muted-foreground">{addOn.duration}</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium">₹{addOn.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Total */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Service ({quantity}x)</span>
                  <span>₹{mockService.price * quantity}</span>
                </div>
                {selectedAddOns.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Add-ons</span>
                    <span>
                      ₹
                      {mockService.addOns
                        .filter((addOn) => selectedAddOns.includes(addOn.name))
                        .reduce((sum, addOn) => sum + addOn.price, 0)}
                    </span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{calculateTotal()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/booking">Book Now</Link>
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
