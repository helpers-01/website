import { Database } from '@/types/database.types';

export type DbResult<T> = T extends PromiseLike<infer U> ? U : never;
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never;
export type Row<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

// Helper function to parse the response from Supabase
export const parseSupabaseResponse = <T>(response: { data: T | null; error: Error | null }) => {
  if (response.error) {
    throw response.error;
  }
  if (!response.data) {
    throw new Error("No data returned");
  }
  return response.data as T;
};

export const assertProfile = <T extends { role?: string }>(profile: T | null): T => {
  if (!profile) {
    throw new Error("No profile found");
  }
  if (!profile.role) {
    throw new Error("Profile has no role");
  }
  return profile;
};
