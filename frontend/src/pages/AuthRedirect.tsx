import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../api/supabaseClient';
import { useAuth } from '../context/AuthContext';

const AuthRedirect: React.FC = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleRedirect = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        console.error('Session error:', error);
        navigate('/login');
        return;
      }

      const { user } = session;

      // Update global auth context
      setUser(user);

      // Check if helper profile exists
      const { data: helperProfile, error: helperError } = await supabase
        .from('helpers')
        .select('id')
        .eq('email', user.email)
        .single();

      if (helperError && helperError.code !== 'PGRST116') { // Ignore "No Rows Found" error
        console.error('Error checking helper profile:', helperError);
        navigate('/dashboard');
        return;
      }

      if (!helperProfile) {
        // Auto-create minimal helper entry
        const { error: insertError } = await supabase.from('helpers').insert([{
          email: user.email,
          name: user.user_metadata?.full_name || '',
          phone: user.user_metadata?.phone || '',
          profession: '',
          skills: [],
          portfolio: []
        }]);

        if (insertError) {
          console.error('Failed to auto-create helper profile:', insertError);
        }
      }

      // Determine where to redirect post-login
      const redirectTo = (location.state as { redirectTo?: string })?.redirectTo || '/dashboard';
      navigate(redirectTo);
    };

    handleRedirect();
  }, [navigate, location, setUser]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <p className="text-gray-600">Signing you in...</p>
    </div>
  );
};

export default AuthRedirect;