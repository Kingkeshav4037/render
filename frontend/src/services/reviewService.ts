import { supabase } from '../lib/supabase';

export interface Review {
  id: string;
  user_id: string;
  product_type: string;
  product_id: string;
  rating: number;
  title: string | null;
  description: string | null;
  status: string;
  photos: string[];
  created_at: string;
  updated_at: string;
  profiles?: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
}

export const reviewService = {
  async getReviews(productType: string, productId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, profiles:user_id (id, full_name, avatar_url)')
      .eq('product_type', productType)
      .eq('product_id', productId)
      .eq('status', 'APPROVED')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Review[];
  },

  async createReview(review: {
    user_id: string;
    product_type: string;
    product_id: string;
    rating: number;
    title?: string;
    description?: string;
    photos?: string[];
  }): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .insert(review)
      .select()
      .single();

    if (error) throw error;
    return data as Review;
  },

  async deleteReview(reviewId: string): Promise<void> {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (error) throw error;
  },

  async getAverageRating(productType: string, productId: string): Promise<{ average: number; count: number }> {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_type', productType)
      .eq('product_id', productId)
      .eq('status', 'APPROVED');

    if (error) throw error;
    
    if (!data || data.length === 0) return { average: 0, count: 0 };
    
    const total = data.reduce((acc: number, curr: any) => acc + curr.rating, 0);
    return {
      average: total / data.length,
      count: data.length
    };
  }
};
