import { supabase } from '../lib/supabase';

export interface Notification {
  id: string;
  user_id: string;
  type: 'SYSTEM' | 'BOOKING' | 'TRIP' | 'PROMOTION' | 'SAFETY' | 'PAYMENT' | 'WEATHER' | 'AURORA' | 'TRANSPORT';
  title: string;
  message: string;
  is_read: boolean;
  link_url: string | null;
  created_at: string;
}

export const notificationService = {
  async getNotifications(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data as Notification[];
  },

  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;
  },

  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
  },
  
  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return count || 0;
  },

  async createNotification(params: {
    userId: string;
    type: 'SYSTEM' | 'BOOKING' | 'TRIP' | 'PROMOTION' | 'SAFETY' | 'PAYMENT' | 'WEATHER' | 'AURORA' | 'TRANSPORT';
    title: string;
    message: string;
    linkUrl?: string | null;
  }): Promise<Notification | null> {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: params.userId,
        type: params.type,
        title: params.title,
        message: params.message,
        link_url: params.linkUrl || null,
        is_read: false,
      })
      .select()
      .single();

    if (error) {
      console.warn('Could not create notification:', error);
      return null;
    }
    return data as Notification;
  }
};
