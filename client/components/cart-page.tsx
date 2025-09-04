"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, X, ShoppingCart, Tag } from "lucide-react"
import Link from "next/link"

const mockCartItems = [
  {
    id: "1",
    name: "Premium Men's Haircut & Styling",
    provider: "StyleCraft Salon",
    price: 299,
    originalPrice: 399,
    quantity: 1,
    duration: "45 min",
    image: "/professional-haircut-salon.png",
    addOns: [{ name: "Beard Styling", price: 99 }],
  },
  {
    id: "2",
    name: "Complete Home Deep Cleaning",
    provider: "CleanPro Services",
    price: 1299,
    originalPrice: 1599,
    quantity: 1,
    duration: "3-4 hours",
    image: "/home-cleaning-service.png",
    addOns: [],
  },
]

export function CartPage() {
  const [cartItems, setCartItems] = useState(mockCartItems)
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null)

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
      return
    }
    setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const applyCoupon = () => {
    // Mock coupon validation
    if (couponCode.toLowerCase() === "save20") {
      setAppliedCoupon({ code: couponCode, discount: 20 })
      setCouponCode("")
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const itemTotal = item.price * item.quantity
      const addOnTotal = item.addOns.reduce((sum, addOn) => sum + addOn.price, 0)
      return total + itemTotal + addOnTotal
    }, 0)
  }

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0
    return (calculateSubtotal() * appliedCoupon.discount) / 100
  }

  const calculateTax = () => {
    const subtotal = calculateSubtotal() - calculateDiscount()
    return Math.round(subtotal * 0.18) // 18% GST
  }

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount() + calculateTax()
  }

  if (cartItems.length === 0) {
    return (
      <main className="container mx-auto px-4 py-12">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
            <ShoppingCart className="w-12 h-12 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground">Add some services to get started</p>
          </div>
          <Button asChild>
            <Link href="/services">Browse Services</Link>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
        <p className="text-muted-foreground">{cartItems.length} items in your cart</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.provider}</p>
                        <p className="text-xs text-muted-foreground">{item.duration}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {item.addOns.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Add-ons:</p>
                        {item.addOns.map((addOn, index) => (
                          <div key={index} className="flex justify-between text-xs">
                            <span>{addOn.name}</span>
                            <span>₹{addOn.price}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">₹{item.price * item.quantity}</span>
                          {item.originalPrice > item.price && (
                            <span className="text-sm text-muted-foreground line-through">
                              ₹{item.originalPrice * item.quantity}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Coupon Code */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Coupon Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {appliedCoupon.code}
                    </Badge>
                    <span className="text-sm text-green-700">{appliedCoupon.discount}% off applied</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={removeCoupon}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button onClick={applyCoupon} disabled={!couponCode}>
                    Apply
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{calculateSubtotal()}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({appliedCoupon.discount}%)</span>
                    <span>-₹{calculateDiscount()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>GST (18%)</span>
                  <span>₹{calculateTax()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{calculateTotal()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/booking">Proceed to Booking</Link>
                </Button>
                <Button variant="outline" asChild className="w-full bg-transparent">
                  <Link href="/services">Continue Shopping</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
