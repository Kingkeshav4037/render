-- Phase 28: Accommodation and Booking RLS & RPC Hardening

-- 1. Enable Row Level Security
ALTER TABLE public.accommodations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accommodation_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 2. Define RLS Policies
DO $$ BEGIN
    -- Accommodations Policies
    DROP POLICY IF EXISTS "Published accommodations viewable by everyone" ON public.accommodations;
    CREATE POLICY "Published accommodations viewable by everyone" ON public.accommodations
        FOR SELECT USING (status = 'PUBLISHED' OR status IS NULL);

    DROP POLICY IF EXISTS "Authorized admins can manage accommodations" ON public.accommodations;
    CREATE POLICY "Authorized admins can manage accommodations" ON public.accommodations
        FOR ALL USING (
            public.has_permission(auth.uid(), 'accommodations.manage') OR 
            EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('ADMIN', 'SUPER_ADMIN'))
        );

    -- Accommodation Rooms Policies
    DROP POLICY IF EXISTS "Accommodation rooms viewable by everyone" ON public.accommodation_rooms;
    CREATE POLICY "Accommodation rooms viewable by everyone" ON public.accommodation_rooms
        FOR SELECT USING (
            EXISTS (
                SELECT 1 FROM public.accommodations 
                WHERE accommodations.id = accommodation_rooms.accommodation_id
                AND (accommodations.status = 'PUBLISHED' OR accommodations.status IS NULL)
            )
        );

    DROP POLICY IF EXISTS "Authorized admins can manage accommodation rooms" ON public.accommodation_rooms;
    CREATE POLICY "Authorized admins can manage accommodation rooms" ON public.accommodation_rooms
        FOR ALL USING (
            public.has_permission(auth.uid(), 'accommodations.manage') OR 
            EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('ADMIN', 'SUPER_ADMIN'))
        );

    -- Bookings Policies
    DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
    CREATE POLICY "Users can view own bookings" ON public.bookings
        FOR SELECT USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Users can cancel own bookings" ON public.bookings;
    CREATE POLICY "Users can cancel own bookings" ON public.bookings
        FOR UPDATE USING (auth.uid() = user_id)
        WITH CHECK (status = 'CANCELLED');

    DROP POLICY IF EXISTS "Authorized admins can view all bookings" ON public.bookings;
    CREATE POLICY "Authorized admins can view all bookings" ON public.bookings
        FOR SELECT USING (
            public.has_permission(auth.uid(), 'bookings.read') OR 
            EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('ADMIN', 'SUPER_ADMIN'))
        );

    DROP POLICY IF EXISTS "Authorized admins can manage all bookings" ON public.bookings;
    CREATE POLICY "Authorized admins can manage all bookings" ON public.bookings
        FOR ALL USING (
            public.has_permission(auth.uid(), 'bookings.manage') OR 
            EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('ADMIN', 'SUPER_ADMIN'))
        );
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- 3. Ensure check_availability RPC handles room availability smoothly
CREATE OR REPLACE FUNCTION public.check_availability(
    p_item_type text, 
    p_item_id uuid, 
    p_start_date timestamp with time zone, 
    p_end_date timestamp with time zone
) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
    v_conflicts INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_conflicts
    FROM public.bookings
    WHERE item_id = p_item_id
      AND item_type = p_item_type::public.booking_type
      AND status IN ('PAID', 'PENDING_PAYMENT', 'CONFIRMED')
      AND (
          (start_time < p_end_date AND end_time > p_start_date)
      );
      
    RETURN v_conflicts = 0;
END;
$$;

GRANT EXECUTE ON FUNCTION public.check_availability(text, uuid, timestamp with time zone, timestamp with time zone) TO anon, authenticated, service_role;
