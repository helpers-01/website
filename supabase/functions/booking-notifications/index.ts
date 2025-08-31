import { createClient } from '@supabase/supabase-js';
import { serve } from 'https://deno.fresh.dev/std@v1.0/http/server.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

interface NotificationEvent {
  type: 'BOOKING_STATUS_CHANGE';
  booking: {
    id: string;
    status: 'confirmed' | 'in_progress';
    user_id: string;
    helper_id: string;
    service_date: string;
    service_time: string;
  };
}

// Stubbed notification sending functions
async function sendPushNotification(userId: string, title: string, body: string) {
  console.log(`[PUSH] Sending to ${userId}: ${title} - ${body}`);
  // Implement FCM/OneSignal push here
}

async function sendSMS(phone: string, message: string) {
  console.log(`[SMS] Sending to ${phone}: ${message}`);
  // Implement Twilio/MessageBird SMS here
}

async function sendEmail(email: string, subject: string, body: string) {
  console.log(`[EMAIL] Sending to ${email}: ${subject} - ${body}`);
  // Implement SendGrid/AWS SES email here
}

async function insertAuditLog(action: string, details: any) {
  await supabase.from('audit_logs').insert({
    action,
    details,
    created_at: new Date().toISOString()
  });
}

async function insertNotification(userId: string, message: string, type: string) {
  await supabase.from('notifications').insert({
    user_id: userId,
    type,
    message,
    created_at: new Date().toISOString()
  });
}

async function getUserContactInfo(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('email, phone')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

async function startRouteTracking(helperId: string, bookingId: string) {
  const { error } = await supabase
    .from('provider_locations')
    .upsert({
      helper_id: helperId,
      booking_id: bookingId,
      tracking_enabled: true,
      updated_at: new Date().toISOString()
    });

  if (error) throw error;
}

serve(async (req) => {
  try {
    const event: NotificationEvent = await req.json();
    const { booking } = event;

    if (!['confirmed', 'in_progress'].includes(booking.status)) {
      return new Response(JSON.stringify({ message: 'Status not supported' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get contact info for both user and helper
    const [userInfo, helperInfo] = await Promise.all([
      getUserContactInfo(booking.user_id),
      getUserContactInfo(booking.helper_id)
    ]);

    // Prepare notification messages
    const isConfirmed = booking.status === 'confirmed';
    const statusText = isConfirmed ? 'confirmed' : 'started';
    const serviceDateTime = new Date(
      `${booking.service_date}T${booking.service_time}`
    );

    // Customer notifications
    const customerMessage = `Your booking has been ${statusText}. Service ${
      isConfirmed ? 'scheduled for' : 'started at'
    } ${serviceDateTime.toLocaleString()}.`;

    await Promise.all([
      // Customer notifications
      sendPushNotification(booking.user_id, 'Booking Update', customerMessage),
      userInfo.phone && sendSMS(userInfo.phone, customerMessage),
      sendEmail(userInfo.email, `Booking ${statusText}`, customerMessage),
      insertNotification(booking.user_id, customerMessage, 'booking_update'),

      // Helper notifications
      sendPushNotification(
        booking.helper_id,
        'Booking Update',
        `Booking #${booking.id} has been ${statusText}.`
      ),
      helperInfo.phone && sendSMS(
        helperInfo.phone,
        `Booking #${booking.id} ${statusText}. Please check your app for details.`
      ),
      sendEmail(
        helperInfo.email,
        `Booking ${statusText}`,
        `Booking #${booking.id} has been ${statusText}. Please check your app for details.`
      ),
      insertNotification(
        booking.helper_id,
        `Booking #${booking.id} has been ${statusText}.`,
        'booking_update'
      )
    ]);

    // Enable route tracking for in-progress bookings
    if (booking.status === 'in_progress') {
      await startRouteTracking(booking.helper_id, booking.id);
    }

    // Log the operation
    await insertAuditLog('BOOKING_NOTIFICATIONS_SENT', {
      booking_id: booking.id,
      status: booking.status,
      notifications_sent: {
        user_push: true,
        user_sms: Boolean(userInfo.phone),
        user_email: true,
        helper_push: true,
        helper_sms: Boolean(helperInfo.phone),
        helper_email: true
      }
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in booking-notifications:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: error.status || 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
