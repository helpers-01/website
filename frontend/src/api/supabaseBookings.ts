import { supabase } from './supabaseClient';

// Cancel a booking
export const cancelBooking = async (bookingId: string) => {
  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId);

  if (error) throw error;
};

// Reschedule a booking
export const rescheduleBooking = async (bookingId: string, newDateTime: Date) => {
  const { error } = await supabase
    .from('bookings')
    .update({ date_time: newDateTime.toISOString(), status: 'rescheduled' })
    .eq('id', bookingId);

  if (error) throw error;
};