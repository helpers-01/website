import React, { useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient';
import { Loader2, Camera, CheckCircle } from 'lucide-react';

const UserProfileSettingsPage: React.FC = () => {
  const userId = 'USER_ID'; // Replace with actual session user ID later

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const fetchProfile = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
    } else {
      setProfile(data);
      setPreviewUrl(data.profile_image_url);
    }
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const filePath = `profile-images/${userId}-${Date.now()}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from('profile-images')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error('Upload failed:', uploadError);
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('profile-images')
      .getPublicUrl(filePath);

    setProfile({ ...profile, profile_image_url: publicUrlData.publicUrl });
    setPreviewUrl(publicUrlData.publicUrl);
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('users')
      .update({
        name: profile.name,
        contact: profile.contact,
        profile_image_url: profile.profile_image_url
      })
      .eq('id', userId);

    if (error) {
      console.error('Error saving profile:', error);
    } else {
      console.log('Profile Updated');
    }
    setSaving(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1>

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-32 h-32">
              <img
                src={previewUrl || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border"
              />
              <label className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full cursor-pointer">
                <Camera className="text-white w-4 h-4" />
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              {uploading && (
                <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                </div>
              )}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={profile.name || ''}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
            <input
              type="text"
              value={profile.contact || ''}
              onChange={(e) => setProfile({ ...profile, contact: e.target.value })}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Email (Read Only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="text"
              value={profile.email || ''}
              readOnly
              className="w-full bg-gray-100 border-gray-300 rounded-lg shadow-sm cursor-not-allowed"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

          {saving === false && (
            <div className="flex items-center justify-center mt-4 text-green-600">
              <CheckCircle className="w-5 h-5 mr-2" /> Profile Updated Successfully
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileSettingsPage;