import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../api/supabaseClient';
import { Star, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ReviewPage: React.FC = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState<boolean>(true);
  const [booking, setBooking] = useState<any>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fetchBookingDetails = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id,
        helpers ( id, name ),
        services ( id, name )
      `)
      .eq('id', bookingId)
      .single();

    if (error) {
      console.error('Failed to fetch booking:', error);
    } else {
      setBooking(data);
    }
    setLoading(false);
  };

  const handleSubmitReview = async () => {
    if (rating === 0 || comment.trim() === '') {
      alert('Please provide a rating and comment.');
      return;
    }

    setSubmitting(true);

    const { error } = await supabase
      .from('reviews')
      .insert([{
        booking_id: booking.id,
        helper_id: booking.helpers.id,
        user_id: user?.id, // <-- Dynamically fetched user ID
        rating: rating,
        comment: comment.trim()
      }]);

    if (error) {
      console.error('Review submission failed:', error);
      alert('Failed to submit review. Try again.');
    } else {
      alert('Thank you for your review!');
      navigate('/dashboard');
    }

    setSubmitting(false);
  };

  useEffect(() => {
    fetchBookingDetails();
  }, []);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-gray-600">Booking not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Leave a Review</h1>
        <p className="text-gray-600 mb-6">
          Share your experience with <strong>{booking.helpers.name}</strong> for <strong>{booking.services.name}</strong>.
        </p>

        {/* Rating Stars */}
        <div className="flex items-center space-x-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => setRating(star)}>
              <Star
                className={`w-8 h-8 ${
                  rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Comment Box */}
        <div className="mb-6">
          <textarea
            className="w-full border border-gray-300 rounded-lg p-4 text-sm text-gray-700 focus:ring-purple-500 focus:border-purple-500"
            rows={5}
            placeholder="Write your feedback here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmitReview}
          disabled={submitting}
          className={`w-full py-3 rounded-lg font-semibold transition-colors ${
            submitting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </div>
  );
};

export default ReviewPage;