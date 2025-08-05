import React, { useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient';
import { useAuth } from '../context/AuthContext';

interface Booking {
  id: string;
  date_time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  user: { id: string; email: string };
  service: { name: string };
}

const BookingsManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id, date_time, status,
        users ( id, email ),
        services ( name )
      `)
      .eq('helper_id', user.id)
      .order('date_time', { ascending: false });

    if (error) {
      console.error('Failed to fetch bookings:', error);
    } else {
      // Transform data
      const transformed = data.map((b: any) => ({
        id: b.id,
        date_time: b.date_time,
        status: b.status,
        user: b.users,
        service: b.services
      }));
      setBookings(transformed);
    }
    setLoading(false);
  };

  const updateBookingStatus = async (bookingId: string, status: 'confirmed' | 'cancelled') => {
    setActionLoading(bookingId);
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId);

    if (error) {
      console.error(`Failed to ${status} booking:`, error);
      alert('Action failed. Please try again.');
    } else {
      fetchBookings(); // Refresh list
    }
    setActionLoading(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-gray-600">Loading bookings...</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-gray-500">No bookings found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Bookings</h1>

        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white p-6 rounded-lg shadow-sm flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold text-gray-900">{booking.service.name}</p>
              <p className="text-sm text-gray-600">Client: {booking.user.email}</p>
              <p className="text-sm text-gray-600">Date: {new Date(booking.date_time).toLocaleString()}</p>
              <p className={`text-sm font-medium mt-1 ${
                booking.status === 'pending' ? 'text-yellow-500' :
                booking.status === 'confirmed' ? 'text-green-600' : 'text-red-500'
              }`}>
                Status: {booking.status}
              </p>
            </div>

            {booking.status === 'pending' && (
              <div className="flex space-x-3">
                <button
                  onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                  disabled={actionLoading === booking.id}
                  className={`px-4 py-2 rounded-md text-white font-medium ${
                    actionLoading === booking.id ? 'bg-green-300' : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {actionLoading === booking.id ? 'Processing...' : 'Accept'}
                </button>
                <button
                  onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                  disabled={actionLoading === booking.id}
                  className={`px-4 py-2 rounded-md text-white font-medium ${
                    actionLoading === booking.id ? 'bg-red-300' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {actionLoading === booking.id ? 'Processing...' : 'Reject'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingsManagementPage;