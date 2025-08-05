import React, { useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';
import BookingCard from '../components/bookings/BookingCard';
import MyProfileSection from '../components/Dashboard/MyProfileSection';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'chats'>('bookings');
  const [bookings, setBookings] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadDashboardData();

      // Real-time listener for new messages
      const channel = supabase
        .channel('dashboard-messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
          const msg = payload.new;
          if (msg.sender_id === user.id || msg.receiver_id === user.id) {
            fetchChats();  // Update chat list on new message
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    await Promise.all([fetchBookings(), fetchChats()]);
    setLoading(false);
  };

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        helpers ( id, name, avatar_url, profession )
      `)
      .eq('user_id', user?.id)
      .order('date_time', { ascending: false });

    if (error) {
      console.error('Failed to fetch bookings:', error);
    } else {
      setBookings(data || []);
    }
  };

  const fetchChats = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        id, sender_id, receiver_id, content, created_at,
        sender:sender_id ( id, name, avatar_url ),
        receiver:receiver_id ( id, name, avatar_url )
      `)
      .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch chats:', error);
    } else {
      const groupedChats: { [key: string]: any } = {};
      data.forEach((msg) => {
        const otherUser = msg.sender_id === user?.id ? msg.receiver : msg.sender;
        if (otherUser && !groupedChats[otherUser.id]) {
          groupedChats[otherUser.id] = {
            id: msg.id,
            otherUser,
            content: msg.content,
            created_at: msg.created_at
          };
        }
      });
      setChats(Object.values(groupedChats));
    }
  };

  const handleChatClick = (otherUserId: string) => {
    if (user?.role === 'user') {
      navigate(`/user-chat/${otherUserId}`);
    } else if (user?.role === 'helper') {
      navigate(`/helper-chat/${otherUserId}`);
    }
  };

  const handleRefreshBookings = async () => {
    setLoading(true);
    await fetchBookings();
    setLoading(false);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-gray-600">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Profile Section */}
        <MyProfileSection />

        {/* Tabs */}
        <div className="flex space-x-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'bookings'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Bookings
          </button>
          <button
            onClick={() => setActiveTab('chats')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'chats'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Chats
          </button>
        </div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">My Bookings</h3>
              <button
                onClick={handleRefreshBookings}
                className="text-sm text-purple-600 hover:underline"
              >
                Refresh
              </button>
            </div>
            {bookings.length === 0 ? (
              <p className="text-gray-600">No bookings found.</p>
            ) : (
              bookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  isUpcoming={new Date(booking.date_time) >= new Date() && booking.status !== 'cancelled'}
                  refreshBookings={handleRefreshBookings}
                />
              ))
            )}
          </div>
        )}

        {/* Chats Tab */}
        {activeTab === 'chats' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Chats</h3>
            {chats.length === 0 ? (
              <p className="text-gray-600">No chats yet.</p>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleChatClick(chat.otherUser.id)}
                  className="bg-white p-4 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={chat.otherUser.avatar_url || '/default-avatar.png'}
                      alt={chat.otherUser.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{chat.otherUser.name}</p>
                      <p className="text-sm text-gray-600 truncate max-w-xs">{chat.content}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(chat.created_at).toLocaleDateString()}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;