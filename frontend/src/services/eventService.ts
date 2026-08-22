import { supabase } from '../lib/supabase';

export interface Event {
  id: string;
  location_id: string;
  name: string;
  category: string;
  description: string;
  start_date: string;
  end_date: string;
  ticket_price: number;
  currency: string;
  image_url: string;
  featured: boolean;
  lat: number;
  lng: number;
}

export const eventService = {
  getAllEvents: async (): Promise<Event[]> => {
    const { data, error } = await (supabase as any)
      .from('events')
      .select('*')
      .order('start_date', { ascending: true });
      
    if (error) {
      console.error('Error fetching events:', error);
      return [];
    }
    return (data || []) as unknown as Event[];
  },
  
  getUpcomingEvents: async (): Promise<Event[]> => {
    const { data, error } = await (supabase as any)
      .from('events')
      .select('*')
      .gte('start_date', new Date().toISOString())
      .order('start_date', { ascending: true })
      .limit(10);
      
    if (error) return [];
    return (data || []) as unknown as Event[];
  },

  getEventsByCategory: async (category: string): Promise<Event[]> => {
    const { data, error } = await (supabase as any)
      .from('events')
      .select('*')
      .eq('category', category)
      .order('start_date', { ascending: true });
      
    if (error) return [];
    return (data || []) as unknown as Event[];
  }
};
