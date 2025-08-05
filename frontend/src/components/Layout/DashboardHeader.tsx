import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../api/supabaseClient';
import { useNavigate } from 'react-router-dom';

const DashboardHeader: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        {user && (
          <p className="text-sm text-gray-500">Logged in as: {user.email}</p>
        )}
      </div>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm font-medium"
      >
        Logout
      </button>
    </div>
  );
};

export default DashboardHeader;