"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, CheckCircle, Star, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function BookingFlow() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    instructions: "",
  })

  const service = {
    name: "Deep House Cleaning",
    provider: "CleanPro Services",
    package: "Standard Clean",
    price: 89,
    duration: "3-4 hours",
    rating: 4.8,
  }

  const availableDates = [
    { date: "2025-01-15", day: "Today", available: true },
    { date: "2025-01-16", day: "Tomorrow", available: true },
    { date: "2025-01-17", day: "Thu", available: true },
    { date: "2025-01-18", day: "Fri", available: false },
    { date: "2025-01-19", day: "Sat", available: true },
    { date: "2025-01-20", day: "Sun", available: true },
  ]

  const availableTimes = [
    { time: "09:00", available: true },
    { time: "10:00", available: true },
    { time: "11:00", available: false },
    { time: "12:00", available: true },
    { time: "13:00", available: true },
    { time: "14:00", available: true },
    { time: "15:00", available: false },
    { time: "16:00", available: true },
  ]

  const steps = [
    { id: 1, name: "Date & Time", completed: currentStep > 1 },
    { id: 2, name: "Address", completed: currentStep > 2 },
    { id: 3, name: "Payment", completed: currentStep > 3 },
    { id: 4, name: "Confirmation", completed: false },
  ]

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleBooking = () => {
    // Process booking and redirect to success page
    window.location.href = "/user/booking/success"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-200">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/user/service/1" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Book Service</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.completed
                      ? "bg-green-500 text-white"
                      : currentStep === step.id
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.completed ? <CheckCircle className="w-4 h-4" /> : step.id}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    currentStep === step.id ? "text-gray-900" : "text-gray-600"
                  }`}
                >
                  {step.name}
                </span>
                {index < steps.length - 1 && <div className="w-16 h-0.5 bg-gray-200 mx-4 hidden sm:block"></div>}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Date & Time */}
            {currentStep === 1 && (
              <Card className="bg-white border-purple-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Select Date & Time</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Date Selection */}
                  <div>
                    <Label className="text-gray-900 mb-3 block">Choose Date</Label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {availableDates.map((dateOption) => (
                        <button
                          key={dateOption.date}
                          onClick={() => dateOption.available && setSelectedDate(dateOption.date)}
                          disabled={!dateOption.available}
                          className={`p-3 rounded-lg border text-center transition-colors ${
                            selectedDate === dateOption.date
                              ? "border-helpers-accent bg-purple-50 text-gray-900"
                              : dateOption.available
                                ? "border-purple-200 hover:border-purple-600 text-gray-900"
                                : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          <div className="text-sm font-medium">{dateOption.day}</div>
                          <div className="text-xs text-gray-600">{new Date(dateOption.date).getDate()}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Selection */}
                  {selectedDate && (
                    <div>
                      <Label className="text-gray-900 mb-3 block">Choose Time</Label>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                        {availableTimes.map((timeOption) => (
                          <button
                            key={timeOption.time}
                            onClick={() => timeOption.available && setSelectedTime(timeOption.time)}
                            disabled={!timeOption.available}
                            className={`p-2 rounded-lg border text-center transition-colors ${
                              selectedTime === timeOption.time
                                ? "border-helpers-accent bg-purple-50 text-gray-900"
                                : timeOption.available
                                  ? "border-purple-200 hover:border-purple-600 text-gray-900"
                                  : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            <div className="text-sm font-medium">{timeOption.time}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 2: Address */}
            {currentStep === 2 && (
              <Card className="bg-white border-purple-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Service Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="street" className="text-gray-900">
                        Street Address
                      </Label>
                      <Input
                        id="street"
                        placeholder="123 Main Street"
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        className="border-purple-200 focus:border-purple-600"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city" className="text-gray-900">
                          City
                        </Label>
                        <Input
                          id="city"
                          placeholder="New York"
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          className="border-purple-200 focus:border-purple-600"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state" className="text-gray-900">
                          State
                        </Label>
                        <Input
                          id="state"
                          placeholder="NY"
                          value={address.state}
                          onChange={(e) => setAddress({ ...address, state: e.target.value })}
                          className="border-purple-200 focus:border-purple-600"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="zip" className="text-gray-900">
                          ZIP Code
                        </Label>
                        <Input
                          id="zip"
                          placeholder="10001"
                          value={address.zip}
                          onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                          className="border-purple-200 focus:border-purple-600"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="instructions" className="text-gray-900">
                        Special Instructions (Optional)
                      </Label>
                      <Textarea
                        id="instructions"
                        placeholder="Any special instructions for the service provider..."
                        value={address.instructions}
                        onChange={(e) => setAddress({ ...address, instructions: e.target.value })}
                        className="border-purple-200 focus:border-purple-600"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <Card className="bg-white border-purple-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="cardNumber" className="text-gray-900">
                        Card Number
                      </Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        className="border-purple-200 focus:border-purple-600"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry" className="text-gray-900">
                          Expiry Date
                        </Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          className="border-purple-200 focus:border-purple-600"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="text-gray-900">
                          CVV
                        </Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          className="border-purple-200 focus:border-purple-600"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="cardName" className="text-gray-900">
                        Name on Card
                      </Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                        className="border-purple-200 focus:border-purple-600"
                      />
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Payment Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service Fee</span>
                        <span className="text-gray-900">${service.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Platform Fee</span>
                        <span className="text-gray-900">$5</span>
                      </div>
                      <div className="border-t border-purple-200 pt-2 flex justify-between font-medium">
                        <span className="text-gray-900">Total</span>
                        <span className="text-gray-900">${service.price + 5}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <Card className="bg-white border-purple-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Booking Confirmation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                    <p className="text-gray-600">Your service has been successfully booked.</p>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Booking Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service</span>
                        <span className="text-gray-900">{service.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Provider</span>
                        <span className="text-gray-900">{service.provider}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date</span>
                        <span className="text-gray-900">{selectedDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time</span>
                        <span className="text-gray-900">{selectedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Paid</span>
                        <span className="text-gray-900">${service.price + 5}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      className="flex-1 bg-purple-600 hover:bg-purple-600-dark text-white"
                      onClick={() => (window.location.href = "/user/bookings")}
                    >
                      View My Bookings
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-purple-200 text-gray-600 hover:bg-purple-50 bg-transparent"
                      onClick={() => (window.location.href = "/user/dashboard")}
                    >
                      Back to Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            {currentStep < 4 && (
              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="border-purple-200 text-gray-600 hover:bg-purple-50 bg-transparent"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={currentStep === 3 ? handleBooking : handleNext}
                  disabled={
                    (currentStep === 1 && (!selectedDate || !selectedTime)) ||
                    (currentStep === 2 && (!address.street || !address.city || !address.state || !address.zip))
                  }
                  className="bg-purple-600 hover:bg-purple-600-dark text-white"
                >
                  {currentStep === 3 ? "Confirm Booking" : "Continue"}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>

          {/* Booking Summary Sidebar */}
          <div className="space-y-6">
            <Card className="bg-white border-purple-200 sticky top-8">
              <CardHeader>
                <CardTitle className="text-gray-900">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-600">{service.provider}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{service.rating}</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Package</span>
                    <span className="text-gray-900">{service.package}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="text-gray-900">{service.duration}</span>
                  </div>
                  {selectedDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date</span>
                      <span className="text-gray-900">{selectedDate}</span>
                    </div>
                  )}
                  {selectedTime && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time</span>
                      <span className="text-gray-900">{selectedTime}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-purple-200 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">${service.price}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
