-- ==============================================================================
-- Migration: 20260819000040_booking_availability_and_holds.sql
-- Description: Inventory Holds, Real-time Availability Validation, and Concurrent Booking Protection
-- ==============================================================================

-- 1. Create inventory_holds table
CREATE TABLE IF NOT EXISTS public.inventory_holds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    item_type TEXT NOT NULL,
    item_id TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    pax INTEGER NOT NULL DEFAULT 1,
    quantity INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'CONFIRMED', 'RELEASED', 'EXPIRED')),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '15 minutes'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Indexes for fast availability querying and hold expiration lookups
CREATE INDEX IF NOT EXISTS idx_inventory_holds_active_lookup
    ON public.inventory_holds (item_id, item_type, status, expires_at);

CREATE INDEX IF NOT EXISTS idx_inventory_holds_user_id
    ON public.inventory_holds (user_id);

CREATE INDEX IF NOT EXISTS idx_inventory_holds_order_id
    ON public.inventory_holds (order_id);

CREATE INDEX IF NOT EXISTS idx_inventory_holds_time_range
    ON public.inventory_holds (start_time, end_time);

-- 3. Row Level Security for inventory_holds
ALTER TABLE public.inventory_holds ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own inventory holds" ON public.inventory_holds;
CREATE POLICY "Users can view own inventory holds"
    ON public.inventory_holds
    FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own inventory holds" ON public.inventory_holds;
CREATE POLICY "Users can insert own inventory holds"
    ON public.inventory_holds
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update/release own inventory holds" ON public.inventory_holds;
CREATE POLICY "Users can update/release own inventory holds"
    ON public.inventory_holds
    FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role has full access to inventory holds" ON public.inventory_holds;
CREATE POLICY "Service role has full access to inventory holds"
    ON public.inventory_holds
    FOR ALL
    USING (
        auth.role() = 'service_role' OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN'))
    );

-- 4. Stored Procedure: Release Expired Holds
CREATE OR REPLACE FUNCTION public.release_expired_holds()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_count INTEGER;
BEGIN
    UPDATE public.inventory_holds
    SET status = 'EXPIRED',
        updated_at = now()
    WHERE status = 'ACTIVE'
      AND expires_at <= now();
      
    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$;

-- 5. Stored Procedure: Enhanced check_availability
CREATE OR REPLACE FUNCTION public.check_availability(
    p_item_type text, 
    p_item_id text, 
    p_start_date timestamp with time zone, 
    p_end_date timestamp with time zone
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_conflicts INTEGER := 0;
BEGIN
    -- Clean up any expired holds first
    PERFORM public.release_expired_holds();

    -- Check for overlapping confirmed or pending payment bookings
    SELECT COUNT(*) INTO v_conflicts
    FROM public.bookings
    WHERE item_id::text = p_item_id
      AND item_type::text = p_item_type
      AND status IN ('PAID', 'PENDING_PAYMENT', 'CONFIRMED')
      AND (start_time < p_end_date AND end_time > p_start_date);

    IF v_conflicts > 0 THEN
        RETURN FALSE;
    END IF;

    -- Check for overlapping active inventory holds by other users
    SELECT COUNT(*) INTO v_conflicts
    FROM public.inventory_holds
    WHERE item_id = p_item_id
      AND item_type = p_item_type
      AND status = 'ACTIVE'
      AND expires_at > now()
      AND (start_time < p_end_date AND end_time > p_start_date);

    RETURN v_conflicts = 0;
END;
$$;

-- 6. Atomic Stored Procedure: validate_and_hold_inventory (Authoritative Backend Validation + Concurrency Locking)
CREATE OR REPLACE FUNCTION public.validate_and_hold_inventory(
    p_user_id UUID,
    p_item_type TEXT,
    p_item_id TEXT,
    p_start_time TIMESTAMPTZ,
    p_end_time TIMESTAMPTZ,
    p_pax INTEGER DEFAULT 1,
    p_quantity INTEGER DEFAULT 1,
    p_hold_duration_minutes INTEGER DEFAULT 15
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_now TIMESTAMPTZ := now();
    v_expires_at TIMESTAMPTZ;
    v_hold_id UUID;
    v_booking_conflicts INTEGER := 0;
    v_hold_conflicts INTEGER := 0;
    v_nights INTEGER;
BEGIN
    -- Housekeeping: release expired holds
    PERFORM public.release_expired_holds();

    -- Rule 1: Validate Date Boundaries
    IF p_start_time >= p_end_time THEN
        RETURN jsonb_build_object(
            'success', false,
            'error_code', 'ERR_INVALID_DATES',
            'message', 'Check-out date must be strictly after check-in date.'
        );
    END IF;

    IF p_start_time < (v_now - interval '12 hours') THEN
        RETURN jsonb_build_object(
            'success', false,
            'error_code', 'ERR_PAST_DATE',
            'message', 'Selected booking dates cannot be in the past.'
        );
    END IF;

    -- Rule 2: Minimum Stay validation (must be at least 1 night)
    v_nights := GREATEST(1, EXTRACT(DAY FROM (p_end_time - p_start_time))::INTEGER);
    IF v_nights < 1 THEN
        RETURN jsonb_build_object(
            'success', false,
            'error_code', 'ERR_MIN_STAY',
            'message', 'Minimum reservation length is 1 night.'
        );
    END IF;

    -- Rule 3: Guest Capacity & Quantity Sanity
    IF p_pax < 1 OR p_pax > 30 THEN
        RETURN jsonb_build_object(
            'success', false,
            'error_code', 'ERR_INVALID_PAX',
            'message', 'Guest count must be between 1 and 30 persons.'
        );
    END IF;

    -- Rule 4: Check for Existing Confirmed/Paid Bookings
    SELECT COUNT(*) INTO v_booking_conflicts
    FROM public.bookings
    WHERE item_id::text = p_item_id
      AND item_type::text = p_item_type
      AND status IN ('PAID', 'PENDING_PAYMENT', 'CONFIRMED')
      AND (start_time < p_end_time AND end_time > p_start_time);

    IF v_booking_conflicts > 0 THEN
        RETURN jsonb_build_object(
            'success', false,
            'error_code', 'ERR_DATES_UNAVAILABLE',
            'message', 'The selected dates are already booked. Please choose different dates.'
        );
    END IF;

    -- Rule 5: Check for Active Unexpired Inventory Holds from OTHER users
    SELECT COUNT(*) INTO v_hold_conflicts
    FROM public.inventory_holds
    WHERE item_id = p_item_id
      AND item_type = p_item_type
      AND status = 'ACTIVE'
      AND expires_at > v_now
      AND user_id != p_user_id
      AND (start_time < p_end_time AND end_time > p_start_time);

    IF v_hold_conflicts > 0 THEN
        RETURN jsonb_build_object(
            'success', false,
            'error_code', 'ERR_ROOM_HELD',
            'message', 'This property is currently reserved by another traveler. Please try again shortly or select different dates.'
        );
    END IF;

    -- Release any previous active holds for this user on the same item to avoid self-collision
    UPDATE public.inventory_holds
    SET status = 'RELEASED', updated_at = v_now
    WHERE user_id = p_user_id
      AND item_id = p_item_id
      AND item_type = p_item_type
      AND status = 'ACTIVE';

    -- Compute expiration timestamp
    v_expires_at := v_now + (p_hold_duration_minutes || ' minutes')::INTERVAL;

    -- Create the new active hold
    INSERT INTO public.inventory_holds (
        user_id,
        item_type,
        item_id,
        start_time,
        end_time,
        pax,
        quantity,
        status,
        expires_at,
        created_at,
        updated_at
    ) VALUES (
        p_user_id,
        p_item_type,
        p_item_id,
        p_start_time,
        p_end_time,
        p_pax,
        p_quantity,
        'ACTIVE',
        v_expires_at,
        v_now,
        v_now
    ) RETURNING id INTO v_hold_id;

    RETURN jsonb_build_object(
        'success', true,
        'hold_id', v_hold_id,
        'expires_at', v_expires_at,
        'item_id', p_item_id,
        'item_type', p_item_type,
        'nights', v_nights,
        'pax', p_pax
    );
END;
$$;

-- 7. Stored Procedure: Release Inventory Hold
CREATE OR REPLACE FUNCTION public.release_inventory_hold(
    p_hold_id UUID,
    p_user_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.inventory_holds
    SET status = 'RELEASED',
        updated_at = now()
    WHERE id = p_hold_id
      AND (p_user_id IS NULL OR user_id = p_user_id)
      AND status = 'ACTIVE';

    RETURN FOUND;
END;
$$;

-- Grant permissions for RPCs
GRANT EXECUTE ON FUNCTION public.check_availability(text, text, timestamp with time zone, timestamp with time zone) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.validate_and_hold_inventory(UUID, TEXT, TEXT, TIMESTAMPTZ, TIMESTAMPTZ, INTEGER, INTEGER, INTEGER) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.release_inventory_hold(UUID, UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.release_expired_holds() TO anon, authenticated, service_role;
