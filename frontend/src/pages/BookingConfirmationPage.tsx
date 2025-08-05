import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, DollarSign, User, FileText } from 'lucide-react';
import { supabase } from '../api/supabaseClient';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface BookingDetails {
  helper: { id: string; name: string; profession: string };
  service: { id: string; name: string; price: number };
  date: Date;
  time: string;
  user: { id: string; email: string; contact: string };
}

const BookingConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const bookingDetails = location.state as BookingDetails | undefined;

  useEffect(() => {
    if (!bookingDetails) {
      navigate('/'); // Redirect to home if no booking details
    }
  }, [bookingDetails, navigate]);

  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  if (!bookingDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Invalid Booking Details.</p>
      </div>
    );
  }

  const formattedDate = bookingDetails.date.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const handleConfirmAndPay = async () => {
    try {
      setLoading(true);
      setErrorMsg('');

      // Insert Booking
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert([{
          user_id: bookingDetails.user.id,
          helper_id: bookingDetails.helper.id,
          service_id: bookingDetails.service.id,
          date_time: new Date(bookingDetails.date),
          status: 'pending'
        }])
        .select();

      if (bookingError || !bookingData) {
        throw new Error(bookingError?.message || 'Booking creation failed.');
      }

      const createdBooking = bookingData[0];

      // Razorpay Payment Integration
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: bookingDetails.service.price * 100, // in paise
        currency: 'INR',
        name: 'Helpers App',
        description: bookingDetails.service.name,
        handler: async (response: any) => {
          // Insert Payment Record
          const { error: paymentError } = await supabase
            .from('payments')
            .insert([{
              booking_id: createdBooking.id,
              razorpay_payment_id: response.razorpay_payment_id,
              status: 'success',
              amount: bookingDetails.service.price
            }]);

          if (paymentError) {
            console.error('Failed to record payment:', paymentError);
            alert('Payment recorded failed, but booking was successful.');
          }

          // Update Booking Status to Confirmed
          await supabase
            .from('bookings')
            .update({ status: 'confirmed' })
            .eq('id', createdBooking.id);

          navigate('/dashboard');
        },
        prefill: {
          email: bookingDetails.user.email,
          contact: bookingDetails.user.contact
        },
        theme: { color: '#7C3AED' },
        modal: {
          ondismiss: async () => {
            // Update Booking Status to Cancelled on Payment Dismiss
            await supabase
              .from('bookings')
              .update({ status: 'cancelled' })
              .eq('id', createdBooking.id);

            setErrorMsg('Payment was cancelled. Booking is not confirmed.');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err: any) {
      console.error('Error:', err);
      setErrorMsg(err.message || 'An error occurred during booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Initiated!</h1>
          <p className="text-lg text-gray-600">
            Booking with {bookingDetails.helper.name} for {bookingDetails.service.name} is ready.
            Proceed to payment to confirm.
          </p>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="bg-purple-50 px-6 py-4 border-b border-purple-100">
            <h2 className="text-xl font-semibold text-gray-900">Booking Details</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailRow icon={<FileText />} label="Service" value={bookingDetails.service.name} />
            <DetailRow icon={<User />} label="Helper" value={bookingDetails.helper.name} />
            <DetailRow icon={<Calendar />} label="Date & Time" value={`${formattedDate}, ${bookingDetails.time}`} />
            <DetailRow icon={<DollarSign />} label="Price" value={`$${bookingDetails.service.price}`} />
          </div>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg p-4 mb-6">
            {errorMsg}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleConfirmAndPay}
            disabled={loading}
            className={`px-8 py-3 rounded-lg font-semibold text-center transition-colors 
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
          >
            {loading ? 'Processing...' : 'Confirm & Pay'}
          </button>
          <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
            Contact {bookingDetails.helper.name.split(' ')[0]}
          </button>
        </div>

        <div className="text-center mt-8">
          <button className="text-purple-600 hover:text-purple-700 font-medium">
            Cancel/Reschedule
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ icon, label, value }: { icon: JSX.Element; label: string; value: string }) => (
  <div className="flex items-start space-x-3">
    <div className="mt-1 text-gray-400">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-gray-900">{value}</p>
    </div>
  </div>
);

export default BookingConfirmationPage;