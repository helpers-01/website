import React, { useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient';
import { Loader2, BadgeCheck, Clock, Calendar, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HelperDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);

  const fetchHelperBookings = async () => {
    const user = supabase.auth.user();
    if (!user) {
      navigate('/login');
      return;
    }

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id,
        date_time,
        status,
        users ( id, email ),
        services ( id, name, price ),
        payments ( status )
      `)
      .eq('helper_id', user.id)
      .order('date_time', { ascending: true });

    if (error) {
      console.error('Fetch Error:', error);
    } else {
      setBookings(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchHelperBookings();
  }, []);

  const acceptBooking = async (bookingId: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'confirmed' })
      .eq('id', bookingId);

    if (!error) {
      fetchHelperBookings();
    }
  };

  const rejectBooking = async (bookingId: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);

    if (!error) {
      fetchHelperBookings();
    }
  };

  const formatDateTime = (datetime: string) => {
    const dateObj = new Date(datetime);
    const date = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const time = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return { date, time };
  };

  const pendingRequests = bookings.filter(b => b.status === 'pending');
  const upcomingBookings = bookings.filter(b => b.status === 'confirmed' && new Date(b.date_time) >= new Date());
  const pastBookings = bookings.filter(b => new Date(b.date_time) < new Date() || b.status === 'cancelled');

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Helper Dashboard</h1>

        {/* Pending Requests */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Pending Requests</h2>
          {pendingRequests.length > 0 ? (
            <div className="space-y-4">
              {pendingRequests.map((booking) => {
                const { date, time } = formatDateTime(booking.date_time);
                return (
                  <div key={booking.id} className="bg-white rounded-xl shadow-sm p-6 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-lg text-gray-900">{booking.services.name}</p>
                      <p className="text-sm text-gray-600">{date}, {time}</p>
                      <p className="text-sm text-gray-500">Client: {booking.users.email}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => acceptBooking(booking.id)}
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg font-semibold hover:bg-green-700 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => rejectBooking(booking.id)}
                        className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg font-semibold hover:bg-red-600 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No pending requests.</p>
          )}
        </section>

        {/* Upcoming Bookings */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upcoming Bookings</h2>
          {upcomingBookings.length > 0 ? (
            <div className="space-y-4">
              {upcomingBookings.map((booking) => {
                const { date, time } = formatDateTime(booking.date_time);
                const paymentStatus = booking.payments?.[0]?.status || 'pending';

                return (
                  <div key={booking.id} className="bg-white rounded-xl shadow-sm p-6 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-lg text-gray-900">{booking.services.name}</p>
                      <p className="text-sm text-gray-600">{date}, {time}</p>
                      <p className="text-sm text-gray-500">Client: {booking.users.email}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center space-x-2 text-sm mb-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="font-semibold text-gray-900">${booking.services.price}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm mb-2">
                        {paymentStatus === 'completed' ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-500" />
                        )}
                        <span className={`capitalize ${paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                          {paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No upcoming bookings.</p>
          )}
        </section>

        {/* Past Bookings */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Past Bookings</h2>
          {pastBookings.length > 0 ? (
            <div className="space-y-4">
              {pastBookings.map((booking) => {
                const { date, time } = formatDateTime(booking.date_time);
                return (
                  <div key={booking.id} className="bg-white rounded-xl shadow-sm p-6 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-lg text-gray-900">{booking.services.name}</p>
                      <p className="text-sm text-gray-600">{date}, {time}</p>
                      <p className="text-sm text-gray-500">Client: {booking.users.email}</p>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      {booking.status === 'cancelled' ? (
                        <XCircle className="h-4 w-4 text-red-500" />
                      ) : (
                        <BadgeCheck className="h-4 w-4 text-green-500" />
                      )}
                      <span className="capitalize text-gray-600">{booking.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No past bookings.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default HelperDashboardPage;