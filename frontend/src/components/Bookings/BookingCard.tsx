import React, { useState } from 'react';
import { Calendar, Clock, MessageCircle } from 'lucide-react';
import RescheduleModal from '../Modals/RescheduleModal';
import ContactHelperModal from '../Modals/ContactHelperModal';
import { useNavigate } from 'react-router-dom';

const BookingCard: React.FC<{ booking: any; isUpcoming: boolean; refreshBookings: () => void }> = ({ booking, isUpcoming, refreshBookings }) => {
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const navigate = useNavigate();

  const dateObj = new Date(booking.date_time);
  const dateFormatted = dateObj.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  const timeFormatted = dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  const handleLeaveReview = () => {
    navigate(`/review/${booking.id}`);
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <img
              src={booking.helpers?.image || '/placeholder.png'}
              alt={booking.helpers?.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-gray-900">{booking.helpers?.name}</p>
              <p className="text-sm text-gray-500">{booking.helpers?.profession}</p>
            </div>
          </div>
          <span className={`text-sm font-medium ${isUpcoming ? 'text-purple-600' : 'text-green-600'}`}>
            {isUpcoming ? 'Confirmed' : 'Completed'}
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-600 space-x-4 mb-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {dateFormatted}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {timeFormatted}
          </div>
        </div>

        <div className="flex items-center justify-between">
          {isUpcoming ? (
            <>
              <button
                onClick={() => setIsRescheduleOpen(true)}
                className="text-sm text-purple-600 hover:text-purple-800 font-medium"
              >
                Cancel/Reschedule
              </button>
              <button
                onClick={() => setIsContactOpen(true)}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium flex items-center"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                Contact Helper
              </button>
            </>
          ) : (
            <button
              onClick={handleLeaveReview}
              className="text-sm text-purple-600 hover:text-purple-800 font-medium"
            >
              Leave a Review
            </button>
          )}
        </div>
      </div>

      {/* Reschedule Modal */}
      <RescheduleModal
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        booking={booking}
        refreshBookings={refreshBookings}
      />

      {/* Contact Helper Modal */}
      <ContactHelperModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        helper={booking.helpers}
      />
    </>
  );
};

export default BookingCard;