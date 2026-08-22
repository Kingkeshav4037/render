import { supabase } from '../lib/supabase';

export interface Deal {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number;
  discount_percentage: number;
  valid_until: string;
  image_url: string;
  featured: boolean;
  status: string;
}

export const dealService = {
  getAllDeals: async (): Promise<Deal[]> => {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching deals:', error);
      return [];
    }
    return (data || []) as Deal[];
  },
  
  getFeaturedDeals: async (): Promise<Deal[]> => {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .eq('featured', true)
      .eq('status', 'PUBLISHED')
      .order('created_at', { ascending: false })
      .limit(6);
      
    if (error) {
      console.error('Error fetching featured deals:', error);
      return [];
    }
    return (data || []) as Deal[];
  },

  getPublishedDeals: async (): Promise<Deal[]> => {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .eq('status', 'PUBLISHED')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching published deals:', error);
      return [];
    }
    return (data || []) as Deal[];
  }
};
