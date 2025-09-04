"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, MapPin, CreditCard, Wallet, Smartphone } from "lucide-react"
import { GoogleMaps } from "@/components/google-maps"

export function BookingPage() {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedAddress, setSelectedAddress] = useState("home")
  const [paymentMethod, setPaymentMethod] = useState("upi")

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
  ]

  const addresses = [
    {
      id: "home",
      label: "Home",
      address: "123 MG Road, Koramangala, Bangalore - 560034",
      isDefault: true,
    },
    {
      id: "office",
      label: "Office",
      address: "456 Brigade Road, Commercial Street, Bangalore - 560025",
      isDefault: false,
    },
  ]

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Book Your Service</h1>
        <p className="text-muted-foreground">Complete your booking details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Date & Time Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Select Date & Time
              </CardTitle>
              <CardDescription>Choose your preferred date and time slot</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Select Date</Label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="space-y-3">
                <Label>Available Time Slots</Label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                      className="text-xs"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Service Address
              </CardTitle>
              <CardDescription>Where should we provide the service?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                {addresses.map((address) => (
                  <div key={address.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                    <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={address.id} className="font-medium cursor-pointer">
                        {address.label}
                        {address.isDefault && (
                          <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded">Default</span>
                        )}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">{address.address}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>

              <Button variant="outline" className="w-full bg-transparent">
                Add New Address
              </Button>

              {/* Map for location selection */}
              <div className="mt-4">
                <Label className="text-sm font-medium mb-2 block">Select Location on Map</Label>
                <GoogleMaps
                  center={{ lat: 12.9716, lng: 77.5946 }} // Bangalore coordinates
                  zoom={12}
                  className="w-full h-64 rounded-lg border"
                  onMapClick={(location) => {
                    console.log("Selected location:", location)
                    // Handle location selection
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Special Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Special Instructions</CardTitle>
              <CardDescription>Any specific requirements or notes for the service provider</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea placeholder="Enter any special instructions or requirements..." className="min-h-[100px]" />
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Method
              </CardTitle>
              <CardDescription>Choose your preferred payment option</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <RadioGroupItem value="upi" id="upi" />
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-muted-foreground" />
                      <Label htmlFor="upi" className="cursor-pointer">
                        UPI Payment
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <RadioGroupItem value="wallet" id="wallet" />
                    <div className="flex items-center gap-3">
                      <Wallet className="w-5 h-5 text-muted-foreground" />
                      <Label htmlFor="wallet" className="cursor-pointer">
                        Wallet (₹250 available)
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <RadioGroupItem value="card" id="card" />
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-muted-foreground" />
                      <Label htmlFor="card" className="cursor-pointer">
                        Credit/Debit Card
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <RadioGroupItem value="cod" id="cod" />
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-muted-foreground rounded text-white text-xs flex items-center justify-center">
                        ₹
                      </div>
                      <Label htmlFor="cod" className="cursor-pointer">
                        Cash on Delivery
                      </Label>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Booking Summary */}
        <div className="space-y-6">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                    <img src="/professional-haircut-salon.png" alt="Service" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">Premium Men's Haircut & Styling</h4>
                    <p className="text-xs text-muted-foreground">StyleCraft Salon</p>
                    <p className="text-xs text-muted-foreground">45 min • Qty: 1</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Service</span>
                  <span>₹299</span>
                </div>
                <div className="flex justify-between">
                  <span>Add-ons</span>
                  <span>₹99</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span>₹72</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹470</span>
                </div>
              </div>

              {selectedDate && selectedTime && (
                <>
                  <Separator />
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{new Date(selectedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedTime}</span>
                    </div>
                  </div>
                </>
              )}

              <Button className="w-full" disabled={!selectedDate || !selectedTime}>
                Confirm Booking
              </Button>

              <div className="text-xs text-muted-foreground text-center">
                You can cancel or reschedule up to 2 hours before the service time
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
