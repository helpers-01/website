import express from 'express';
import { supabaseAdmin } from '../config/supabase';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { paymentSchema, paymentConfirmSchema } from '@shared/validation/schemas';
import { logger } from '../utils/logger';

const router = express.Router();

// POST /api/payments/create-intent - Create payment intent
router.post('/create-intent', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const validation = paymentSchema.safeParse(req.body);
  
  if (!validation.success) {
    throw createError('Validation failed', 400, 'VALIDATION_ERROR', validation.error.errors);
  }

  const { booking_id, amount, currency } = validation.data;

  // Verify booking belongs to user
  const { data: booking, error: bookingError } = await supabaseAdmin
    .from('bookings')
    .select('id, customer_id, total_amount, status')
    .eq('id', booking_id)
    .eq('customer_id', req.user!.id)
    .single();

  if (bookingError || !booking) {
    throw createError('Booking not found', 404, 'BOOKING_NOT_FOUND');
  }

  if (booking.status !== 'confirmed') {
    throw createError('Booking must be confirmed before payment', 400, 'INVALID_BOOKING_STATUS');
  }

  try {
    // Create payment record
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .insert({
        booking_id,
        customer_id: req.user!.id,
        amount,
        currency,
        status: 'pending',
        payment_method: 'stripe',
      })
      .select()
      .single();

    if (paymentError) {
      throw createError('Failed to create payment record', 500, 'PAYMENT_CREATION_ERROR', paymentError);
    }

    logger.info(`Payment intent created for booking ${booking_id}`, {
      paymentId: payment.id,
      amount,
      userId: req.user!.id,
    });

    res.json({
      success: true,
      message: 'Payment intent created successfully',
      data: {
        payment_id: payment.id,
        client_secret: `pi_${payment.id}_secret_${Date.now()}`, // Mock client secret
        amount,
        currency,
      },
    });
  } catch (error: any) {
    logger.error('Payment intent creation failed:', error);
    throw createError('Failed to create payment intent', 500, 'PAYMENT_INTENT_ERROR');
  }
}));

// POST /api/payments/confirm - Confirm payment
router.post('/confirm', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const validation = paymentConfirmSchema.safeParse(req.body);
  
  if (!validation.success) {
    throw createError('Validation failed', 400, 'VALIDATION_ERROR', validation.error.errors);
  }

  const { payment_id, payment_intent_id } = validation.data;

  // Update payment status
  const { data: payment, error: paymentError } = await supabaseAdmin
    .from('payments')
    .update({
      status: 'completed',
      payment_intent_id,
      completed_at: new Date().toISOString(),
    })
    .eq('id', payment_id)
    .eq('customer_id', req.user!.id)
    .select()
    .single();

  if (paymentError || !payment) {
    throw createError('Payment not found or update failed', 404, 'PAYMENT_NOT_FOUND');
  }

  // Update booking status to paid
  await supabaseAdmin
    .from('bookings')
    .update({ payment_status: 'paid' })
    .eq('id', payment.booking_id);

  logger.info(`Payment confirmed for booking ${payment.booking_id}`, {
    paymentId: payment.id,
    userId: req.user!.id,
  });

  res.json({
    success: true,
    message: 'Payment confirmed successfully',
    data: payment,
  });
}));

// GET /api/payments/user - Get user's payment history
router.get('/user', authenticateToken, asyncHandler(async (req: AuthRequest, res) => {
  const { data: payments, error } = await supabaseAdmin
    .from('payments')
    .select(`
      *,
      booking:bookings(
        id,
        booking_date,
        service:services(name)
      )
    `)
    .eq('customer_id', req.user!.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw createError('Failed to fetch payment history', 500, 'FETCH_ERROR', error);
  }

  res.json({
    success: true,
    data: payments,
  });
}));

// Webhook endpoint for payment providers (Stripe, Razorpay, etc.)
router.post('/webhook', asyncHandler(async (req, res) => {
  const { type, data } = req.body;

  logger.info('Payment webhook received', { type, data });

  // Handle different webhook events
  switch (type) {
    case 'payment_intent.succeeded':
      // Handle successful payment
      break;
    case 'payment_intent.payment_failed':
      // Handle failed payment
      break;
    default:
      logger.warn('Unhandled webhook event type:', type);
  }

  res.json({ received: true });
}));

export default router;