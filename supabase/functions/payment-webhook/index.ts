import { createClient } from '@supabase/supabase-js';
import { serve } from 'https://deno.fresh.dev/std@v1.0/http/server.ts';
import { verifySignature } from '../_shared/payment.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const razorpayWebhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

interface RazorpayPayment {
  entity: {
    id: string;
    amount: number;
    status: string;
    order_id: string;
    method: string;
    captured: boolean;
  };
}

async function insertAuditLog(action: string, details: any) {
  await supabase.from('audit_logs').insert({
    action,
    details,
    created_at: new Date().toISOString()
  });
}

async function updatePaymentStatus(paymentId: string, orderData: any) {
  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .update({
      status: 'paid',
      captured_at: new Date().toISOString(),
      payment_details: orderData
    })
    .eq('payment_id', paymentId)
    .select('booking_id, amount, user_id')
    .single();

  if (paymentError) throw paymentError;
  return payment;
}

async function createInvoice(payment: any) {
  const { error: invoiceError } = await supabase
    .from('invoices')
    .insert({
      payment_id: payment.payment_id,
      booking_id: payment.booking_id,
      amount: payment.amount,
      user_id: payment.user_id,
      created_at: new Date().toISOString()
    });

  if (invoiceError) throw invoiceError;
}

async function processCashback(payment: any) {
  // Calculate cashback (example: 5% cashback)
  const cashbackAmount = Math.floor(payment.amount * 0.05);
  
  if (cashbackAmount > 0) {
    const { error: walletError } = await supabase
      .from('wallet_transactions')
      .insert({
        user_id: payment.user_id,
        amount: cashbackAmount,
        type: 'cashback',
        reference_id: payment.payment_id,
        created_at: new Date().toISOString()
      });

    if (walletError) throw walletError;
  }

  return cashbackAmount;
}

async function createNotification(userId: string, message: string) {
  const { error: notificationError } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type: 'payment',
      message,
      created_at: new Date().toISOString()
    });

  if (notificationError) throw notificationError;
}

serve(async (req) => {
  try {
    const signature = req.headers.get('x-razorpay-signature');
    if (!signature) {
      throw new Error('No signature provided');
    }

    const body = await req.text();
    
    // Verify webhook signature
    const isValid = verifySignature(body, signature, razorpayWebhookSecret);
    if (!isValid) {
      throw new Error('Invalid signature');
    }

    const payload: RazorpayPayment = JSON.parse(body);
    const { entity } = payload;

    if (entity.status !== 'captured' || !entity.captured) {
      return new Response(JSON.stringify({ message: 'Payment not captured' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Update payment status
    const payment = await updatePaymentStatus(entity.id, entity);

    // Create invoice
    await createInvoice(payment);

    // Process cashback
    const cashbackAmount = await processCashback(payment);

    // Create notifications
    const message = `Payment of ₹${entity.amount/100} successful${
      cashbackAmount ? `. Cashback of ₹${cashbackAmount/100} added to wallet!` : ''
    }`;
    await createNotification(payment.user_id, message);

    // Log the operation
    await insertAuditLog('PAYMENT_SUCCESS', {
      payment_id: entity.id,
      order_id: entity.order_id,
      amount: entity.amount,
      method: entity.method,
      cashback_amount: cashbackAmount
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in payment-webhook:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: error.status || 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
