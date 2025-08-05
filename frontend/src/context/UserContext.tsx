import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '../api/supabaseClient';

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
}

interface UserContextType {
  userProfile: UserProfile | null;
  fetchUserProfile: (userId: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, avatar')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Failed to fetch user profile:', error);
    } else {
      setUserProfile(data);
    }
  };

  return (
    <UserContext.Provider value={{ userProfile, fetchUserProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};