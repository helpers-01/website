import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../api/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { fetchUserProfile } = useUser();

  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        console.error('Failed to retrieve session:', error);
        navigate('/login');
        return;
      }

      // Save session user in context
      setUser(data.session.user);

      // Fetch user profile and save in UserContext
      await fetchUserProfile(data.session.user.id);

      // Redirect to dashboard
      navigate('/dashboard');
    };

    handleAuth();
  }, [navigate, setUser, fetchUserProfile]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <p className="text-gray-600">Logging you in...</p>
    </div>
  );
};

export default AuthCallback;