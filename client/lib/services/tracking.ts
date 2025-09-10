import { supabase } from '../supabase/client';
import type { Database } from '@/types/database.types';

type LocationUpdate = Database['public']['Tables']['location_updates']['Insert'];

export const trackingService = {
  async updateLocation(
    bookingId: string,
    helperId: string,
    latitude: number,
    longitude: number,
    accuracy?: number
  ): Promise<void> {
    const update: LocationUpdate = {
      booking_id: bookingId,
      helper_id: helperId,
      latitude,
      longitude,
      accuracy
    };

    const { error } = await (supabase as any)
      .from('location_updates')
      .insert(update);

    if (error) throw error;
  },

  async getLocationUpdates(bookingId: string) {
    const { data, error } = await supabase
      .from('location_updates')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  async getLatestLocation(bookingId: string) {
    const { data, error } = await supabase
      .from('location_updates')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;
    return data;
  },

  watchLocation(bookingId: string, helperId: string): (() => void) {
    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        try {
          await this.updateLocation(
            bookingId,
            helperId,
            position.coords.latitude,
            position.coords.longitude,
            position.coords.accuracy
          );
        } catch (error) {
          console.error('Error updating location:', error);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30000, // 30 seconds
        timeout: 27000 // 27 seconds
      }
    );

    // Return cleanup function
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }
};
