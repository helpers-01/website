// /src/api/uploadAvatar.ts
import { supabase } from './supabaseClient';

export const uploadAvatar = async (userId: string, file: File) => {
  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    throw uploadError;
  }

  const { data: publicUrlData } = supabase
    .storage
    .from('avatars')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};