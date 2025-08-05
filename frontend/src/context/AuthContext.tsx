import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient';

interface UserType {
  id: string;
  email: string;
  role: 'user' | 'helper' | 'admin' | null;
  name?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: UserType | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, role, name, avatar_url')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Failed to fetch user profile:', error);
      return null;
    }

    return data;
  };

  useEffect(() => {
    const getSessionAndProfile = async () => {
      const { data: sessionData, error } = await supabase.auth.getSession();
      if (sessionData.session?.user) {
        const profile = await fetchUserProfile(sessionData.session.user.id);
        if (profile) {
          setUser(profile);
        }
      }
      setLoading(false);
    };

    getSessionAndProfile();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        if (profile) {
          setUser(profile);
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);