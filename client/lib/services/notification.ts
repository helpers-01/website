import { supabase } from '../supabase/client';
import { messaging } from '../clients';
import { getToken } from 'firebase/messaging';

type Notification = any;
type UserDevice = any;

export const notificationService = {
  async requestPermission(): Promise<string | null> {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(messaging);
        return token;
      }
      return null;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return null;
    }
  },

  async registerDevice(userId: string, token: string): Promise<void> {
    const device: UserDevice = {
      user_id: userId,
      device_token: token,
      device_type: 'web',
      last_used_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('user_devices')
      .upsert(device, { onConflict: 'user_id,device_token' });

    if (error) throw error;
  },

  async createNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
    data?: any
  ): Promise<void> {
    const notification: Notification = {
      user_id: userId,
      type,
      title,
      message,
      data,
      read: false
    };

    const { error } = await supabase
      .from('notifications')
      .insert(notification);

    if (error) throw error;

    // Get user's devices
    const { data: devices } = await supabase
      .from('user_devices')
      .select('device_token')
      .eq('user_id', userId);

    if (devices && devices.length > 0) {
      // Send to Firebase Cloud Messaging
      const tokens = devices.map(d => d.device_token);
      // Implement FCM send logic here
    }
  },

  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw error;
  },

  async getNotifications(userId: string, page = 1, limit = 20) {
    const { data, error, count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw error;
    return { notifications: data, total: count };
  },

  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
    return count || 0;
  }
};
