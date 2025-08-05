import React, { useEffect, useState } from 'react';
import { supabase } from '../../api/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ProfileData {
  id: string;
  name: string;
  profession: string;
  bio?: string;
  avatar_url?: string;
  skills: string[];
  portfolio: string[];
}

const MyProfileSection: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('helpers')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Failed to fetch profile:', error);
      } else if (data) {
        setProfile({
          id: data.id,
          name: data.name || '',
          profession: data.profession || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || '',
          skills: data.skills || [],
          portfolio: data.portfolio || [],
        });
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  if (loading) {
    return <p className="text-gray-600">Loading profile...</p>;
  }

  if (!profile) {
    return <p className="text-red-500">Profile not found.</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">My Profile</h2>
        <button
          onClick={() => navigate('/edit-profile')}
          className="text-sm text-purple-600 hover:underline"
        >
          Edit Profile
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <img
          src={profile.avatar_url || '/default-avatar.png'}
          alt="Avatar"
          className="w-16 h-16 rounded-full object-cover border"
        />
        <div>
          <p className="font-semibold text-gray-800">{profile.name}</p>
          <p className="text-gray-500">{profile.profession}</p>
        </div>
      </div>

      {profile.bio && (
        <div>
          <h3 className="font-medium text-gray-700 mb-1">Bio</h3>
          <p className="text-gray-600 text-sm">{profile.bio}</p>
        </div>
      )}

      <div>
        <h3 className="font-medium text-gray-700 mb-1">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {profile.skills.length > 0 ? (
            profile.skills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No skills added.</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-gray-700 mb-1">Portfolio</h3>
        <div className="grid grid-cols-3 gap-3">
          {profile.portfolio.length > 0 ? (
            profile.portfolio.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Portfolio ${idx + 1}`}
                className="w-full h-24 object-cover rounded-md"
              />
            ))
          ) : (
            <p className="text-gray-400 text-sm">No portfolio uploaded.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfileSection;