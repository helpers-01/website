import React, { useState } from 'react';
import Step1PersonalDetails from '../components/Registration/Step1PersonalDetails';
import Step2ProfessionalDetails from '../components/Registration/Step2ProfessionalDetails';
import Step3PortfolioUpload from '../components/Registration/Step3PortfolioUpload';
import ReviewSubmit from '../components/Registration/ReviewSubmit';
import { supabase } from '../api/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HelperRegistrationPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    name: '',
    phone: '',
    email: '',
    profession: '',
    skills: [],
    portfolio: []
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNext = (data: any) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (!user) return;

    const finalData = {
      id: user.id,
      name: formData.name,
      phone: formData.phone,
      email: user.email,
      profession: formData.profession,
      skills: formData.skills,
      portfolio: formData.portfolio,
      created_at: new Date().toISOString()
    };

    setLoading(true);
    const { error } = await supabase.from('helpers').upsert(finalData, { onConflict: 'id' });

    if (error) {
      alert('Registration Failed: ' + error.message);
    } else {
      alert('Registration Successful!');
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-2xl">
        {step === 1 && <Step1PersonalDetails onNext={handleNext} initialData={formData} />}
        {step === 2 && <Step2ProfessionalDetails onNext={handleNext} initialData={formData} />}
        {step === 3 && <Step3PortfolioUpload onNext={handleNext} initialData={formData} />}
        {step === 4 && <ReviewSubmit data={formData} onSubmit={handleSubmit} />}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-md">Submitting...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelperRegistrationPage;