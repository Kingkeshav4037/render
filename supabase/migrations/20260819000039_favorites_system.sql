-- ==============================================================================
-- Migration: 20260819000039_favorites_system.sql
-- Description: Production-ready Favorites system schema, indexes, and RLS policies
-- ==============================================================================

-- 1. Create table if not exists
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_type TEXT NOT NULL,
    item_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure item_id is of type TEXT to accommodate UUIDs, slug identifiers, and compound keys
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'favorites' 
          AND column_name = 'item_id' 
          AND data_type = 'uuid'
    ) THEN
        ALTER TABLE public.favorites ALTER COLUMN item_id TYPE TEXT;
    END IF;
END $$;

-- 2. Add Unique Constraint to prevent duplicate favorites (user_id + item_type + item_id)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'favorites_user_item_uniq_idx' OR conname = 'favorites_user_id_item_type_item_id_key'
    ) THEN
        ALTER TABLE public.favorites 
        ADD CONSTRAINT favorites_user_id_item_type_item_id_key UNIQUE (user_id, item_type, item_id);
    END IF;
END $$;

-- 3. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_type ON public.favorites(user_id, item_type);
CREATE INDEX IF NOT EXISTS idx_favorites_user_item ON public.favorites(user_id, item_type, item_id);
CREATE INDEX IF NOT EXISTS idx_favorites_created_at ON public.favorites(created_at DESC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies to ensure clean idempotent creation
DROP POLICY IF EXISTS "Users can view own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can insert own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can update own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON public.favorites;

-- 6. Define Strict RLS Policies (Users can ONLY view, insert, update, delete their own favorites)
CREATE POLICY "Users can view own favorites"
    ON public.favorites
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
    ON public.favorites
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own favorites"
    ON public.favorites
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
    ON public.favorites
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- 7. Grant Permissions
GRANT ALL ON TABLE public.favorites TO authenticated;
GRANT ALL ON TABLE public.favorites TO service_role;
