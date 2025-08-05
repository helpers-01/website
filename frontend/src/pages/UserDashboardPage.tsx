import React, { useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient';
import BookingCard from '../components/Bookings/BookingCard';

const UserDashboardPage: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Fetch user session
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchBookings = async () => {
        const { data, error } = await supabase
          .from('bookings')
          .select('*, helpers(name, profession, image)')
          .eq('user_id', user.id)
          .order('date_time', { ascending: true });

        if (error) {
          console.error('Failed to fetch bookings:', error.message);
        } else {
          setBookings(data || []);
        }
      };

      fetchBookings();
    }
  }, [user]);

  const upcoming = bookings.filter(b => new Date(b.date_time) >= new Date());
  const past = bookings.filter(b => new Date(b.date_time) < new Date());

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome{user ? `, ${user.email}` : ''}!
          </h1>
          <p className="text-gray-600">
            Manage your bookings, view history, and update your profile.
          </p>
        </div>

        {/* Upcoming Bookings */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Upcoming Bookings</h2>
          {upcoming.length === 0 ? (
            <p className="text-gray-500">You have no upcoming bookings.</p>
          ) : (
            <div className="space-y-4">
              {upcoming.map((booking) => (
                <BookingCard key={booking.id} booking={booking} isUpcoming />
              ))}
            </div>
          )}
        </div>

        {/* Past Bookings */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Past Bookings</h2>
          {past.length === 0 ? (
            <p className="text-gray-500">No completed bookings yet.</p>
          ) : (
            <div className="space-y-4">
              {past.map((booking) => (
                <BookingCard key={booking.id} booking={booking} isUpcoming={false} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;