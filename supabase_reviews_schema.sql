-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    location_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    user_email TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Reviews are viewable by everyone." ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert their own reviews." ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);
