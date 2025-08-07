import React, { useState } from 'react';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReschedule: (newDateTime: string) => void;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({
  isOpen,
  onClose,
  onReschedule,
}) => {
  const [newDateTime, setNewDateTime] = useState('');

  const handleSubmit = () => {
    if (!newDateTime) return;
    onReschedule(newDateTime);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Reschedule Booking</h2>
        <input
          type="datetime-local"
          value={newDateTime}
          onChange={(e) => setNewDateTime(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default RescheduleModal;