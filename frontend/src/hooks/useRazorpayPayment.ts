import { supabase } from '../api/supabaseClient';

export const useRazorpayPayment = () => {
  const initiatePayment = (amount: number, bookingId: string, user: {email: string, contact: string}) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: amount * 100,
      currency: 'INR',
      name: 'Helpers App',
      description: 'Booking Payment',
      handler: async function (response: any) {
        console.log('Payment Success:', response);
        await supabase.from('payments').insert([{
          booking_id: bookingId,
          razorpay_payment_id: response.razorpay_payment_id,
          status: 'created',
          amount: amount
        }]);
      },
      prefill: {
        email: user.email,
        contact: user.contact
      },
      theme: {
        color: '#7C3AED'
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return { initiatePayment };
};