import React, { useState } from 'react';

interface Props {
  initialData: any;
  onNext: (data: any) => void;
}

const Step1PersonalDetails: React.FC<Props> = ({ initialData, onNext }) => {
  const [name, setName] = useState(initialData.name || '');
  const [phone, setPhone] = useState(initialData.phone || '');

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ name, phone });
  };

  return (
    <form onSubmit={handleNext} className="space-y-6">
      <h2 className="text-xl font-semibold">Personal Details</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <button
        type="submit"
        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
      >
        Next
      </button>
    </form>
  );
};

export default Step1PersonalDetails;