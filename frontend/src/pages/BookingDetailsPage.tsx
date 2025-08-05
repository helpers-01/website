import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../api/supabaseClient';
import { Loader2, Calendar, Clock, DollarSign, User, ShieldCheck, XCircle, CheckCircle2 } from 'lucide-react';

const BookingDetailsPage: React.FC = () => {
  const { id } = useParams(); // booking id
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);

  const fetchBookingDetails = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id, date_time, status,
        users ( id, name, email, contact ),
        helpers ( id, name, profession, verified ),
        services ( id, name, price ),
        payments ( id, status, razorpay_payment_id )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Booking Fetch Failed:', error);
      return;
    }

    setBooking(data);
    setLoading(false);
  };

  const handleStatusUpdate = async (newStatus: 'completed' | 'cancelled') => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      console.error('Status Update Failed:', error);
      return;
    }

    setBooking({ ...booking, status: newStatus });
    alert(`Booking marked as ${newStatus}`);
  };

  useEffect(() => {
    fetchBookingDetails();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  const bookingDate = new Date(booking.date_time).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const bookingTime = new Date(booking.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Booking Details</h1>

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          {/* Service Info */}
          <div className="flex items-center space-x-4">
            <DollarSign className="h-6 w-6 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Service</p>
              <p className="text-lg font-semibold text-gray-900">{booking.services.name}</p>
            </div>
          </div>

          {/* Date & Time */}
          <div className="flex items-center space-x-4">
            <Calendar className="h-6 w-6 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="text-gray-900">{bookingDate} at {bookingTime}</p>
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            <User className="h-6 w-6 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Customer</p>
              <p className="text-gray-900">{booking.users.name} ({booking.users.contact})</p>
              <p className="text-sm text-gray-500">{booking.users.email}</p>
            </div>
          </div>

          {/* Helper Info */}
          <div className="flex items-center space-x-4">
            <ShieldCheck className="h-6 w-6 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Helper</p>
              <p className="text-gray-900">{booking.helpers.name} - {booking.helpers.profession}</p>
              <p className="text-sm text-gray-500">{booking.helpers.verified ? 'Verified' : 'Not Verified'}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="flex items-center space-x-4">
            <DollarSign className="h-6 w-6 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Payment</p>
              <p className="text-gray-900">Status: {booking.payments?.status || 'Pending'}</p>
              <p className="text-sm text-gray-500">Transaction ID: {booking.payments?.razorpay_payment_id || 'N/A'}</p>
            </div>
          </div>

          {/* Booking Status */}
          <div className="flex items-center space-x-4">
            <Clock className="h-6 w-6 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Booking Status</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">{booking.status}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-6">
            {booking.status !== 'completed' && (
              <button
                onClick={() => handleStatusUpdate('completed')}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle2 className="h-5 w-5" />
                <span>Mark as Completed</span>
              </button>
            )}
            {booking.status !== 'cancelled' && (
              <button
                onClick={() => handleStatusUpdate('cancelled')}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <XCircle className="h-5 w-5" />
                <span>Cancel Booking</span>
              </button>
            )}
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Back
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookingDetailsPage;