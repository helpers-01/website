// Secure payment service that uses server-side API routes
// This prevents exposing payment secrets to the client

export interface PaymentIntent {
  clientSecret: string
  paymentIntentId: string
}

export interface RazorpayOrder {
  orderId: string
  amount: number
  currency: string
  key: string
}

export class PaymentService {
  /**
   * Create a Stripe payment intent
   * @param amount - Amount in dollars
   * @param currency - Currency code (default: 'usd')
   * @param description - Payment description
   */
  static async createStripePaymentIntent(
    amount: number,
    currency: string = 'usd',
    description?: string
  ): Promise<PaymentIntent> {
    const response = await fetch('/api/payments/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
        description,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create payment intent')
    }

    return response.json()
  }

  /**
   * Create a Razorpay order
   * @param amount - Amount in rupees
   * @param currency - Currency code (default: 'INR')
   * @param description - Order description
   * @param customerInfo - Customer information
   */
  static async createRazorpayOrder(
    amount: number,
    currency: string = 'INR',
    description?: string,
    customerInfo?: any
  ): Promise<RazorpayOrder> {
    const response = await fetch('/api/payments/razorpay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
        description,
        customerInfo,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create order')
    }

    return response.json()
  }

  /**
   * Verify payment status (for webhook handling)
   * This would typically be called from server-side webhook handlers
   */
  static async verifyPayment(provider: 'stripe' | 'razorpay', paymentId: string) {
    // This should be implemented with proper webhook verification
    // For now, return a placeholder
    console.log(`Verifying ${provider} payment: ${paymentId}`)
    return { verified: true, status: 'completed' }
  }
}

// Export singleton instance
export const paymentService = PaymentService