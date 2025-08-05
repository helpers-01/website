import React, { useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignUpPage: React.FC = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [profession, setProfession] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const metadata = user.user_metadata || {};
      setName(metadata.full_name || '');
      setProfession(metadata.profession || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!user) {
      setLoading(false);
      return;
    }

    // Update Supabase user_metadata
    const { error: updateUserError, data: updatedUser } = await supabase.auth.updateUser({
      data: {
        full_name: name,
        profession: profession
      }
    });

    if (updateUserError) {
      console.error('Failed to update user metadata:', updateUserError);
      setLoading(false);
      return;
    }

    // Update helpers table
    const updates = {
      email: user.email,
      name,
      profession
    };

    const { error: helperUpdateError } = await supabase.from('helpers').upsert(updates, { onConflict: 'email' });

    if (helperUpdateError) {
      console.error('Failed to update helpers table:', helperUpdateError);
    } else {
      // Update AuthContext with fresh user
      setUser(updatedUser.user);
      navigate('/dashboard');
    }

    setLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Complete Your Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Profession</label>
            <input
              type="text"
              required
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md font-semibold text-white ${
              loading ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {loading ? 'Saving...' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;