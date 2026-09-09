-- ==============================================================================
-- Migration: 20260819000042_smart_tourism_features.sql
-- Description: Smart Tourism Features — Recently Viewed, Trip Sharing, Notes, and Archive
-- ==============================================================================

-- 1. Create recently_viewed table
CREATE TABLE IF NOT EXISTS public.recently_viewed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_type TEXT NOT NULL,
    item_id TEXT NOT NULL,
    title TEXT NOT NULL,
    image_url TEXT,
    route TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_recently_viewed_user_item UNIQUE (user_id, item_type, item_id)
);

-- Indexes for fast querying & ordering
CREATE INDEX IF NOT EXISTS idx_recently_viewed_user_time
    ON public.recently_viewed (user_id, viewed_at DESC);

CREATE INDEX IF NOT EXISTS idx_recently_viewed_item
    ON public.recently_viewed (item_type, item_id);

-- 2. Add Smart Tourism columns to public.trips safely
DO $$
BEGIN
    -- share_token for public/link sharing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'trips' AND column_name = 'share_token'
    ) THEN
        ALTER TABLE public.trips ADD COLUMN share_token TEXT UNIQUE;
    END IF;

    -- is_archived flag for soft deletion / archiving
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'trips' AND column_name = 'is_archived'
    ) THEN
        ALTER TABLE public.trips ADD COLUMN is_archived BOOLEAN DEFAULT false;
    END IF;

    -- notes for trip-level notes
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'trips' AND column_name = 'notes'
    ) THEN
        ALTER TABLE public.trips ADD COLUMN notes TEXT;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_trips_share_token
    ON public.trips (share_token)
    WHERE share_token IS NOT NULL;

-- 3. Row Level Security for recently_viewed
ALTER TABLE public.recently_viewed ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own recently viewed" ON public.recently_viewed;
CREATE POLICY "Users can view own recently viewed"
    ON public.recently_viewed
    FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own recently viewed" ON public.recently_viewed;
CREATE POLICY "Users can insert own recently viewed"
    ON public.recently_viewed
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own recently viewed" ON public.recently_viewed;
CREATE POLICY "Users can update own recently viewed"
    ON public.recently_viewed
    FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own recently viewed" ON public.recently_viewed;
CREATE POLICY "Users can delete own recently viewed"
    ON public.recently_viewed
    FOR DELETE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role has full access to recently viewed" ON public.recently_viewed;
CREATE POLICY "Service role has full access to recently viewed"
    ON public.recently_viewed
    FOR ALL
    USING (
        auth.role() = 'service_role' OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN'))
    );

-- 4. Trip Sharing RLS Policy for Public and Shared-with-Link trips
DROP POLICY IF EXISTS "Anyone can view public or shared trips by token" ON public.trips;
CREATE POLICY "Anyone can view public or shared trips by token"
    ON public.trips
    FOR SELECT
    USING (
        visibility IN ('PUBLIC', 'SHARED_WITH_LINK') OR 
        auth.uid() = user_id OR
        auth.role() = 'service_role' OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN'))
    );

-- 5. Stored Procedure: Upsert and Sync Recently Viewed Items
CREATE OR REPLACE FUNCTION public.sync_recently_viewed(
    p_user_id UUID,
    p_items JSONB
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_item JSONB;
    v_count INTEGER := 0;
BEGIN
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        INSERT INTO public.recently_viewed (
            user_id,
            item_type,
            item_id,
            title,
            image_url,
            route,
            metadata,
            viewed_at
        ) VALUES (
            p_user_id,
            v_item->>'item_type',
            v_item->>'item_id',
            v_item->>'title',
            v_item->>'image_url',
            v_item->>'route',
            COALESCE(v_item->'metadata', '{}'::jsonb),
            COALESCE((v_item->>'viewed_at')::timestamptz, now())
        )
        ON CONFLICT (user_id, item_type, item_id)
        DO UPDATE SET
            title = EXCLUDED.title,
            image_url = EXCLUDED.image_url,
            route = EXCLUDED.route,
            metadata = EXCLUDED.metadata,
            viewed_at = EXCLUDED.viewed_at;
            
        v_count := v_count + 1;
    END LOOP;

    -- Enforce max 30 items per user
    DELETE FROM public.recently_viewed
    WHERE user_id = p_user_id
      AND id NOT IN (
          SELECT id FROM public.recently_viewed
          WHERE user_id = p_user_id
          ORDER BY viewed_at DESC
          LIMIT 30
      );

    RETURN v_count;
END;
$$;

-- Grant permissions for RPC
GRANT EXECUTE ON FUNCTION public.sync_recently_viewed(UUID, JSONB) TO authenticated, service_role;
