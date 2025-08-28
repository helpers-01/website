"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, DollarSign, TrendingUp, Calendar, Download, CreditCard, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function HelperEarnings() {
  const [activeTab, setActiveTab] = useState("overview")

  const earningsStats = {
    totalEarnings: 4850,
    thisMonth: 1240,
    thisWeek: 320,
    today: 89,
    pendingPayouts: 245,
    availableBalance: 995,
  }

  const recentTransactions = [
    {
      id: 1,
      service: "Deep House Cleaning",
      customer: "Sarah M.",
      date: "2025-01-10",
      amount: 89,
      fee: 4.45,
      net: 84.55,
      status: "completed",
    },
    {
      id: 2,
      service: "Bathroom Deep Clean",
      customer: "Mike R.",
      date: "2025-01-08",
      amount: 45,
      fee: 2.25,
      net: 42.75,
      status: "completed",
    },
    {
      id: 3,
      service: "Kitchen Deep Clean",
      customer: "Jennifer L.",
      date: "2025-01-05",
      amount: 65,
      fee: 3.25,
      net: 61.75,
      status: "completed",
    },
    {
      id: 4,
      service: "Interior Painting",
      customer: "David K.",
      date: "2025-01-03",
      amount: 120,
      fee: 6.0,
      net: 114.0,
      status: "completed",
    },
    {
      id: 5,
      service: "AC Repair",
      customer: "Lisa P.",
      date: "2025-01-01",
      amount: 85,
      fee: 4.25,
      net: 80.75,
      status: "pending",
    },
  ]

  const payoutHistory = [
    {
      id: 1,
      date: "2025-01-01",
      amount: 1250.0,
      method: "Bank Transfer",
      status: "completed",
      reference: "PAY_001234",
    },
    {
      id: 2,
      date: "2024-12-15",
      amount: 980.5,
      method: "Bank Transfer",
      status: "completed",
      reference: "PAY_001233",
    },
    {
      id: 3,
      date: "2024-12-01",
      amount: 1150.25,
      method: "Bank Transfer",
      status: "completed",
      reference: "PAY_001232",
    },
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "processing":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="min-h-screen bg-helpers-light">
      {/* Header */}
      <header className="bg-white border-b border-helpers-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/helper/dashboard" className="text-helpers-purple hover:text-helpers-dark">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-bold text-helpers-dark">Earnings & Payouts</h1>
            </div>
            <Button className="bg-helpers-accent hover:bg-helpers-accent-dark text-white">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-helpers-muted">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-helpers-purple">Available Balance</p>
                  <p className="text-2xl font-bold text-helpers-dark">${earningsStats.availableBalance}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-helpers-muted">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-helpers-purple">This Month</p>
                  <p className="text-2xl font-bold text-helpers-dark">${earningsStats.thisMonth}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-helpers-muted">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-helpers-purple">Pending Payouts</p>
                  <p className="text-2xl font-bold text-helpers-dark">${earningsStats.pendingPayouts}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-helpers-muted">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-helpers-purple">Total Earnings</p>
                  <p className="text-2xl font-bold text-helpers-dark">${earningsStats.totalEarnings}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="overview">Transaction History</TabsTrigger>
                <TabsTrigger value="payouts">Payout History</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <Card key={transaction.id} className="bg-white border-helpers-muted">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-helpers-dark">{transaction.service}</h3>
                          <p className="text-helpers-purple">Customer: {transaction.customer}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-3 h-3 text-helpers-purple" />
                            <span className="text-sm text-helpers-purple">{formatDate(transaction.date)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                          <div className="text-lg font-bold text-helpers-dark mt-1">${transaction.amount}</div>
                        </div>
                      </div>

                      <div className="bg-helpers-pale border border-helpers-muted rounded-lg p-3">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-helpers-purple">Service Fee:</span>
                            <div className="font-medium text-helpers-dark">-${transaction.fee}</div>
                          </div>
                          <div>
                            <span className="text-helpers-purple">Platform Fee:</span>
                            <div className="font-medium text-helpers-dark">5%</div>
                          </div>
                          <div>
                            <span className="text-helpers-purple">Net Earnings:</span>
                            <div className="font-bold text-green-600">${transaction.net}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="payouts" className="space-y-4">
                {payoutHistory.map((payout) => (
                  <Card key={payout.id} className="bg-white border-helpers-muted">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-helpers-dark">Payout #{payout.reference}</h3>
                          <p className="text-helpers-purple">{payout.method}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-3 h-3 text-helpers-purple" />
                            <span className="text-sm text-helpers-purple">{formatDate(payout.date)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(payout.status)}>{payout.status}</Badge>
                          <div className="text-lg font-bold text-helpers-dark mt-1">${payout.amount}</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-helpers-muted text-helpers-purple hover:bg-helpers-pale bg-transparent"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Receipt
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-helpers-muted text-helpers-purple hover:bg-helpers-pale bg-transparent"
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Withdrawal Card */}
            <Card className="bg-white border-helpers-muted">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-helpers-dark">
                  <CreditCard className="w-5 h-5" />
                  Withdraw Earnings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-helpers-dark">${earningsStats.availableBalance}</div>
                  <div className="text-sm text-helpers-purple">Available for withdrawal</div>
                </div>
                <Button className="w-full bg-helpers-accent hover:bg-helpers-accent-dark text-white">
                  Withdraw Funds
                </Button>
                <div className="text-xs text-helpers-purple text-center">
                  Withdrawals are processed within 1-3 business days
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="bg-white border-helpers-muted">
              <CardHeader>
                <CardTitle className="text-helpers-dark">Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center">
                    BANK
                  </div>
                  <div>
                    <p className="font-medium text-helpers-dark">Chase Bank</p>
                    <p className="text-sm text-helpers-purple">•••• •••• •••• 4567</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-helpers-muted text-helpers-purple hover:bg-helpers-pale bg-transparent"
                >
                  Update Payment Method
                </Button>
              </CardContent>
            </Card>

            {/* Earnings Summary */}
            <Card className="bg-white border-helpers-muted">
              <CardHeader>
                <CardTitle className="text-helpers-dark">Earnings Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-helpers-purple">This Week</span>
                  <span className="font-medium text-helpers-dark">${earningsStats.thisWeek}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-helpers-purple">This Month</span>
                  <span className="font-medium text-helpers-dark">${earningsStats.thisMonth}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-helpers-purple">Average per Job</span>
                  <span className="font-medium text-helpers-dark">$78</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-helpers-purple">Jobs This Month</span>
                  <span className="font-medium text-helpers-dark">16</span>
                </div>
              </CardContent>
            </Card>

            {/* Tax Information */}
            <Card className="bg-white border-helpers-muted">
              <CardHeader>
                <CardTitle className="text-helpers-dark">Tax Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-helpers-purple">
                  Your 1099 tax form will be available in January for the previous tax year.
                </div>
                <Button
                  variant="outline"
                  className="w-full border-helpers-muted text-helpers-purple hover:bg-helpers-pale bg-transparent"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Tax Documents
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
