'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth';
import { notificationService } from '@/lib/services/notification';

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
};

export function NotificationCenter() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotifications();
      setupPushNotifications();
    }
  }, [user]);

  async function setupPushNotifications() {
    const token = await notificationService.requestPermission();
    if (token) {
      await notificationService.registerDevice(user!.id, token);
    }
  }

  async function loadNotifications() {
    try {
      const { notifications } = await notificationService.getNotifications(user!.id);
      const count = await notificationService.getUnreadCount(user!.id);
      setNotifications(notifications);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(id: string) {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading notifications...</div>;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-textPrimary hover:bg-surface rounded-lg transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-lg border border-border overflow-hidden z-50">
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-semibold text-textPrimary">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b border-border last:border-0 ${
                  notification.read ? 'bg-white' : 'bg-surface'
                }`}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <h4 className="font-medium text-textPrimary">{notification.title}</h4>
                <p className="text-sm text-textSecondary mt-1">{notification.message}</p>
                <p className="text-xs text-muted mt-2">
                  {new Date(notification.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
            {notifications.length === 0 && (
              <p className="text-center text-textSecondary py-8">
                No notifications
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
