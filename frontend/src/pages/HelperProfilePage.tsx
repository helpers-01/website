import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../api/supabaseClient';
import { Star, MapPin, Calendar, Clock, Shield } from 'lucide-react';
import CalendarComponent from '../components/Calendar/CalendarComponent';

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

interface PortfolioItem {
  id: number;
  title: string;
  image: string;
  description: string;
}

interface Helper {
  id: string;
  name: string;
  profession: string;
  bio: string;
  avatar_url: string;
  location: string;
  verified: boolean;
  rating: number;
  completedJobs: number;
  price: string;
  availability: Record<string, string[]>;
  skills: string[];
  reviews: Review[];
  portfolio: PortfolioItem[];
}

const HelperProfilePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [helper, setHelper] = useState<Helper | null>(null);
  const [activeTab, setActiveTab] = useState('about');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');

  useEffect(() => {
    const fetchHelperProfile = async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from('helpers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Failed to fetch helper profile:', error);
      } else {
        setHelper(data as Helper);
      }
    };

    fetchHelperProfile();
  }, [id]);

  const timeSlots = selectedDate
    ? helper?.availability[selectedDate.toISOString().split('T')[0]] || []
    : [];

  const handleBooking = () => {
    if (selectedDate && selectedTime && helper) {
      navigate('/booking-confirmation', {
        state: {
          helperId: helper.id,
          helperName: helper.name,
          profession: helper.profession,
          date: selectedDate,
          time: selectedTime,
          price: helper.price,
        },
      });
    }
  };

  if (!helper) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/3 p-6 space-y-6">
            {/* Profile Header */}
            <div className="flex items-center space-x-6">
              <img
                src={helper.avatar_url || '/default-avatar.png'}
                alt={helper.name}
                className="w-24 h-24 rounded-full object-cover border"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{helper.name}</h1>
                <p className="text-gray-600">{helper.profession}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
                  <MapPin className="h-4 w-4" /> <span>{helper.location}</span>
                  {helper.verified && (
                    <span className="flex items-center text-green-600 ml-4">
                      <Shield className="h-4 w-4 mr-1" /> Verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-8 border-b border-gray-200 mt-6">
              {['about', 'reviews', 'portfolio'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'about' && (
              <div className="mt-4">
                <p className="text-gray-700">{helper.bio}</p>
                <div className="mt-4">
                  <h3 className="font-medium text-gray-700 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {helper.skills.length > 0 ? (
                      helper.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm">No skills listed.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="mt-4 space-y-4">
                {helper.reviews.length > 0 ? (
                  helper.reviews.map((review) => (
                    <div key={review.id} className="border p-4 rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-gray-800">{review.author}</div>
                        <div className="flex items-center text-yellow-500">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{review.comment}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(review.date).toLocaleDateString()}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No reviews available.</p>
                )}
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                {helper.portfolio.length > 0 ? (
                  helper.portfolio.map((item) => (
                    <div key={item.id} className="space-y-2">
                      <img src={item.image} alt={item.title} className="w-full h-32 object-cover rounded-md" />
                      <div>
                        <h4 className="font-medium text-gray-800">{item.title}</h4>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No portfolio uploaded.</p>
                )}
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="md:w-1/3 border-l border-gray-100 p-6 bg-gray-50 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center text-gray-700">
                <Calendar className="h-5 w-5 mr-2" /> Select Date
              </div>
              <CalendarComponent selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
            </div>

            {selectedDate && (
              <div className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <Clock className="h-5 w-5 mr-2" /> Available Time Slots
                </div>
                <div className="flex flex-wrap gap-2">
                  {timeSlots.length > 0 ? (
                    timeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
                        className={`px-3 py-1 rounded-md border ${
                          selectedTime === slot
                            ? 'bg-purple-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-purple-50'
                        }`}
                      >
                        {slot}
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">No slots available</p>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={handleBooking}
              disabled={!selectedDate || !selectedTime}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                selectedDate && selectedTime
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Book {helper.name}
            </button>

            {selectedDate && selectedTime && (
              <div className="mt-4 p-3 bg-purple-50 rounded-lg text-sm text-purple-700 space-y-1">
                <p>
                  <strong>Selected:</strong> {selectedDate.toLocaleDateString()} at {selectedTime}
                </p>
                <p>
                  <strong>Price:</strong> {helper.price}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelperProfilePage;