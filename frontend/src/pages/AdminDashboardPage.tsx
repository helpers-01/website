import React, { useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient';
import { Loader2, Users, CalendarCheck, DollarSign, UserCheck } from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalHelpers: 0,
    totalBookings: 0,
    totalRevenue: 0
  });

  const [helpers, setHelpers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  const fetchAdminData = async () => {
    // Fetch Users Count
    const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true });

    // Fetch Helpers Count
    const { count: helpersCount, data: helpersData } = await supabase
      .from('helpers')
      .select('*', { count: 'exact' });

    // Fetch Bookings
    const { data: bookingsData } = await supabase
      .from('bookings')
      .select('id, date_time, status, services ( price )');

    const totalBookings = bookingsData?.length || 0;
    const totalRevenue = bookingsData
      ? bookingsData.reduce((acc, booking) => {
          if (booking.status === 'confirmed') {
            acc += booking.services.price;
          }
          return acc;
        }, 0)
      : 0;

    setStats({
      totalUsers: usersCount || 0,
      totalHelpers: helpersCount || 0,
      totalBookings,
      totalRevenue
    });

    setHelpers(helpersData || []);
    setBookings(bookingsData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white shadow rounded-xl p-6 flex items-center space-x-4">
            <Users className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
          <div className="bg-white shadow rounded-xl p-6 flex items-center space-x-4">
            <UserCheck className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Helpers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalHelpers}</p>
            </div>
          </div>
          <div className="bg-white shadow rounded-xl p-6 flex items-center space-x-4">
            <CalendarCheck className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
            </div>
          </div>
          <div className="bg-white shadow rounded-xl p-6 flex items-center space-x-4">
            <DollarSign className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue}</p>
            </div>
          </div>
        </div>

        {/* Helpers List */}
        <div className="bg-white rounded-xl shadow-sm mb-10">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900">Helpers</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profession</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {helpers.map(helper => (
                  <tr key={helper.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{helper.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{helper.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{helper.profession}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {helper.verified ? (
                        <span className="text-green-600 font-medium">Yes</span>
                      ) : (
                        <span className="text-red-500 font-medium">No</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bookings Overview */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map(booking => {
                  const date = new Date(booking.date_time).toLocaleDateString();
                  return (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.services.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm capitalize text-gray-500">{booking.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${booking.services.price}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboardPage;