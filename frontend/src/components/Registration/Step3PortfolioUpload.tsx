import React, { useState } from 'react';

interface Props {
  initialData: any;
  onNext: (data: any) => void;
}

const Step3PortfolioUpload: React.FC<Props> = ({ initialData, onNext }) => {
  const [portfolio, setPortfolio] = useState(initialData.portfolio || []);
  const [fileInput, setFileInput] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileInput(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (fileInput) {
      setPortfolio([...portfolio, URL.createObjectURL(fileInput)]);
      setFileInput(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ portfolio });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">Portfolio Upload</h2>
      <div className="flex space-x-2">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button
          type="button"
          onClick={handleUpload}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
        >
          Upload
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {portfolio.map((url: string, index: number) => (
          <img key={index} src={url} alt="Portfolio" className="w-full h-24 object-cover rounded-md" />
        ))}
      </div>
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
      >
        Proceed to Review
      </button>
    </form>
  );
};

export default Step3PortfolioUpload;