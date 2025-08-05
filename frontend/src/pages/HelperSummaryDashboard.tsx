import React, { useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient';
import { useAuth } from '../context/AuthContext';
import BookingCard from '../components/bookings/BookingCard';
import MyProfileSection from '../components/Dashboard/MyProfileSection';

interface Stats {
  totalJobs: number;
  totalEarnings: number;
  upcomingBookings: any[];
  averageRating: number;
}

const HelperSummaryDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalJobs: 0,
    totalEarnings: 0,
    upcomingBookings: [],
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchStats();
  }, [user]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Fetch completed bookings and earnings
      const { data: completed, error: completedError } = await supabase
        .from('bookings')
        .select('id, service_id, status, date_time, payments(amount)')
        .eq('helper_id', user.id)
        .eq('status', 'confirmed');

      if (completedError) throw completedError;

      const totalJobs = completed?.length || 0;
      const totalEarnings = completed?.reduce((sum, b: any) => {
        return sum + (b.payments ? b.payments.reduce((s: number, p: any) => s + p.amount, 0) : 0);
      }, 0) || 0;

      // Fetch upcoming bookings
      const { data: upcoming } = await supabase
        .from('bookings')
        .select(`*, users(id, email), services(name)`)
        .eq('helper_id', user.id)
        .eq('status', 'confirmed')
        .gtd('date_time', new Date())
        .order('date_time', { ascending: true });

      // Fetch average rating
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('helper_id', user.id);

      const averageRating = reviews?.length
        ? reviews.reduce((sum, r: any) => sum + r.rating, 0) / reviews.length
        : 0;

      setStats({ totalJobs, totalEarnings, upcomingBookings: upcoming || [], averageRating });
    } catch (err) {
      console.error('Failed to fetch helper stats:', err);
    }
    setLoading(false);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Profile section */}
        <MyProfileSection />

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium">Total Jobs</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.totalJobs}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium">Total Earnings</h3>
            <p className="text-3xl font-bold text-green-600">₹{stats.totalEarnings}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium">Avg. Rating</h3>
            <p className="text-3xl font-bold text-yellow-500">
              {stats.averageRating.toFixed(1)}/5
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium">Upcoming Bookings</h3>
            <p className="text-3xl font-bold text-indigo-600">
              {stats.upcomingBookings.length}
            </p>
          </div>
        </div>

        {/* Upcoming bookings list */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Upcoming Bookings</h2>
          {stats.upcomingBookings.length === 0 ? (
            <p className="text-gray-600">No upcoming bookings.</p>
          ) : (
            stats.upcomingBookings.map((booking: any) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                isUpcoming={true}
                refreshBookings={fetchStats}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HelperSummaryDashboard;