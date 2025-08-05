import React from 'react';

interface Props {
  data: any;
  onSubmit: () => void;
}

const ReviewSubmit: React.FC<Props> = ({ data, onSubmit }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Review & Submit</h2>
      <div>
        <p><strong>Name:</strong> {data.name}</p>
        <p><strong>Phone:</strong> {data.phone}</p>
        <p><strong>Profession:</strong> {data.profession}</p>
        <p><strong>Skills:</strong> {data.skills.join(', ')}</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {data.portfolio.map((url: string, index: number) => (
          <img key={index} src={url} alt="Portfolio" className="w-full h-24 object-cover rounded-md" />
        ))}
      </div>
      <button
        onClick={onSubmit}
        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
      >
        Submit Registration
      </button>
    </div>
  );
};

export default ReviewSubmit;