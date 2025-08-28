"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Search,
  MessageCircle,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Send,
  HelpCircle,
  Clock,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

export default function HelpSupport() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [chatMessage, setChatMessage] = useState("")
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "support",
      message: "Hi! How can I help you today?",
      timestamp: "2:30 PM",
    },
  ])

  const faqs = [
    {
      id: 1,
      question: "How do I book a service?",
      answer:
        "To book a service, browse our categories, select a service provider, choose your preferred date and time, confirm your address, and complete the payment. You'll receive a confirmation email once your booking is confirmed.",
      category: "Booking",
    },
    {
      id: 2,
      question: "Can I cancel or reschedule my booking?",
      answer:
        "Yes, you can cancel or reschedule your booking up to 24 hours before the scheduled time without any charges. For cancellations within 24 hours, a small fee may apply.",
      category: "Booking",
    },
    {
      id: 3,
      question: "How do I pay for services?",
      answer:
        "We accept all major credit cards, debit cards, and digital wallets. Payment is processed securely through our platform after you confirm your booking.",
      category: "Payment",
    },
    {
      id: 4,
      question: "What if I'm not satisfied with the service?",
      answer:
        "If you're not satisfied with the service, please contact us within 24 hours. We'll work with you and the service provider to resolve the issue or provide a refund if necessary.",
      category: "Service Quality",
    },
    {
      id: 5,
      question: "Are service providers background checked?",
      answer:
        "Yes, all our service providers undergo thorough background checks, verification of credentials, and insurance validation before joining our platform.",
      category: "Safety",
    },
    {
      id: 6,
      question: "How do I leave a review?",
      answer:
        "After your service is completed, you'll receive an email with a link to leave a review. You can also access the review option from your bookings page.",
      category: "Reviews",
    },
  ]

  const supportTickets = [
    {
      id: "T001",
      subject: "Issue with payment processing",
      status: "open",
      priority: "high",
      created: "2 hours ago",
      lastUpdate: "1 hour ago",
    },
    {
      id: "T002",
      subject: "Service provider was late",
      status: "resolved",
      priority: "medium",
      created: "1 day ago",
      lastUpdate: "6 hours ago",
    },
  ]

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        sender: "user",
        message: chatMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setChatMessages([...chatMessages, newMessage])
      setChatMessage("")

      // Simulate support response
      setTimeout(() => {
        const supportResponse = {
          id: chatMessages.length + 2,
          sender: "support",
          message: "Thank you for your message. I'll help you with that right away!",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
        setChatMessages((prev) => [...prev, supportResponse])
      }, 1000)
    }
  }

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-helpers-light">
      {/* Header */}
      <header className="bg-white border-b border-helpers-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/user/dashboard" className="text-helpers-purple hover:text-helpers-dark">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-bold text-helpers-dark">Help & Support</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border-helpers-muted hover:border-helpers-accent transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <MessageCircle className="w-8 h-8 text-helpers-accent mx-auto mb-3" />
              <h3 className="font-semibold text-helpers-dark mb-2">Live Chat</h3>
              <p className="text-sm text-helpers-purple">Get instant help from our support team</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-helpers-muted hover:border-helpers-accent transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <Phone className="w-8 h-8 text-helpers-accent mx-auto mb-3" />
              <h3 className="font-semibold text-helpers-dark mb-2">Call Us</h3>
              <p className="text-sm text-helpers-purple">1-800-HELPERS (24/7)</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-helpers-muted hover:border-helpers-accent transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <Mail className="w-8 h-8 text-helpers-accent mx-auto mb-3" />
              <h3 className="font-semibold text-helpers-dark mb-2">Email Support</h3>
              <p className="text-sm text-helpers-purple">support@helpers.com</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="faq" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="chat">Live Chat</TabsTrigger>
            <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq">
            <Card className="bg-white border-helpers-muted">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-helpers-dark">
                  <HelpCircle className="w-5 h-5" />
                  Frequently Asked Questions
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-helpers-purple" />
                  <Input
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-helpers-muted focus:border-helpers-accent"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <div key={faq.id} className="border border-helpers-muted rounded-lg">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-helpers-pale transition-colors"
                    >
                      <div>
                        <h3 className="font-medium text-helpers-dark">{faq.question}</h3>
                        <Badge variant="secondary" className="mt-1 bg-helpers-pale text-helpers-purple">
                          {faq.category}
                        </Badge>
                      </div>
                      {expandedFaq === faq.id ? (
                        <ChevronUp className="w-5 h-5 text-helpers-purple" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-helpers-purple" />
                      )}
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="px-4 pb-4">
                        <p className="text-helpers-purple">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Chat Tab */}
          <TabsContent value="chat">
            <Card className="bg-white border-helpers-muted">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-helpers-dark">
                  <MessageCircle className="w-5 h-5" />
                  Live Chat Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 border border-helpers-muted rounded-lg flex flex-col">
                  {/* Chat Messages */}
                  <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            message.sender === "user"
                              ? "bg-helpers-accent text-white"
                              : "bg-helpers-pale text-helpers-dark"
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.sender === "user" ? "text-white/70" : "text-helpers-purple"
                            }`}
                          >
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <div className="border-t border-helpers-muted p-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        className="border-helpers-muted focus:border-helpers-accent"
                      />
                      <Button
                        onClick={handleSendMessage}
                        className="bg-helpers-accent hover:bg-helpers-accent-dark text-white"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Tickets Tab */}
          <TabsContent value="tickets">
            <Card className="bg-white border-helpers-muted">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-helpers-dark">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Support Tickets
                  </div>
                  <Button className="bg-helpers-accent hover:bg-helpers-accent-dark text-white">
                    Create New Ticket
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {supportTickets.map((ticket) => (
                  <div key={ticket.id} className="border border-helpers-muted rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-helpers-dark">{ticket.subject}</h3>
                        <p className="text-sm text-helpers-purple">Ticket #{ticket.id}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            ticket.status === "open" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
                          }
                        >
                          {ticket.status === "open" ? (
                            <Clock className="w-3 h-3 mr-1" />
                          ) : (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          )}
                          {ticket.status}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={
                            ticket.priority === "high" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                          }
                        >
                          {ticket.priority}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-helpers-purple">
                      <span>Created: {ticket.created}</span>
                      <span>Last update: {ticket.lastUpdate}</span>
                    </div>
                  </div>
                ))}

                {/* Create New Ticket Form */}
                <Card className="border-helpers-muted">
                  <CardHeader>
                    <CardTitle className="text-helpers-dark">Create New Support Ticket</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-helpers-dark mb-1">Subject</label>
                      <Input
                        placeholder="Brief description of your issue"
                        className="border-helpers-muted focus:border-helpers-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-helpers-dark mb-1">Priority</label>
                      <select className="w-full border border-helpers-muted rounded-lg px-3 py-2 text-helpers-dark">
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Urgent</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-helpers-dark mb-1">Description</label>
                      <Textarea
                        placeholder="Please provide detailed information about your issue..."
                        className="border-helpers-muted focus:border-helpers-accent min-h-[100px]"
                      />
                    </div>
                    <Button className="bg-helpers-accent hover:bg-helpers-accent-dark text-white">Submit Ticket</Button>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
