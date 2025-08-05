import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { rescheduleBooking, cancelBooking } from '../../api/supabaseBookings';
import CalendarComponent from '../Calendar/CalendarComponent';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  refreshBookings: () => void;
}

const RescheduleModal: React.FC<Props> = ({ isOpen, onClose, booking, refreshBookings }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const availableDates = Object.keys(booking.helpers?.availability || {});
  const timeSlots = selectedDate
    ? booking.helpers?.availability[selectedDate.toISOString().split('T')[0]] || []
    : [];

  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select date and time.');
      return;
    }

    setLoading(true);
    const newDateTime = new Date(
      selectedDate.toISOString().split('T')[0] + 'T' + selectedTime
    );

    try {
      await rescheduleBooking(booking.id, newDateTime);
      alert('Booking rescheduled successfully.');
      refreshBookings();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to reschedule. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    setLoading(true);
    try {
      await cancelBooking(booking.id);
      alert('Booking cancelled successfully.');
      refreshBookings();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to cancel booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-30 px-4">
        <Dialog.Panel className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>

          <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">Reschedule Booking</Dialog.Title>

          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Select New Date</h4>
            <CalendarComponent
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              availableDates={availableDates}
            />
          </div>

          {selectedDate && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Available Time Slots</h4>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.length > 0 ? (
                  timeSlots.map((time: string) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedTime === time
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {time}
                    </button>
                  ))
                ) : (
                  <p className="col-span-2 text-sm text-gray-500 text-center">No slots available</p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between space-x-4">
            <button
              onClick={handleReschedule}
              disabled={loading}
              className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {loading ? 'Processing...' : 'Reschedule'}
            </button>
            <button
              onClick={handleCancelBooking}
              disabled={loading}
              className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              Cancel Booking
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default RescheduleModal;