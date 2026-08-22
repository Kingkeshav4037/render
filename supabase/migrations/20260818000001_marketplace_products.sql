-- 1. Create the products table
CREATE TABLE public.products (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    name text NOT NULL,
    category text NOT NULL,
    price numeric NOT NULL,
    co2 numeric NOT NULL,
    img text NOT NULL,
    rating numeric NOT NULL DEFAULT 5.0,
    stock integer NOT NULL DEFAULT 100,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- 2. Setup RLS Policies
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone." 
ON public.products FOR SELECT USING (true);

CREATE POLICY "Products can be managed by admin." 
ON public.products FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND (profiles.role = 'ADMIN' OR profiles.role = 'SUPER_ADMIN')
    )
);

-- 3. Replace process_checkout to support PRODUCT pricing
CREATE OR REPLACE FUNCTION public.process_checkout(p_user_id uuid, p_currency text, p_items jsonb) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_order_id UUID;
    v_item JSONB;
    v_booking_id UUID;
    v_calculated_amount DECIMAL;
    v_total_amount DECIMAL := 0;
    v_nights INTEGER;
BEGIN
    INSERT INTO public.orders (user_id, total_amount, currency, status)
    VALUES (p_user_id, 0, p_currency, 'PENDING_PAYMENT')
    RETURNING id INTO v_order_id;

    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_booking_id := NULL;
        v_calculated_amount := 0;
        v_nights := 1;
        
        -- Secure price calculation
        IF v_item->>'item_type' = 'ACCOMMODATION' THEN
            SELECT COALESCE(price_per_night, 0) INTO v_calculated_amount 
            FROM public.accommodations 
            WHERE id = (v_item->>'item_id')::UUID;
            
            -- Calculate nights if dates provided
            IF v_item->>'start_time' IS NOT NULL AND v_item->>'end_time' IS NOT NULL THEN
                v_nights := GREATEST(1, EXTRACT(DAY FROM ((v_item->>'end_time')::TIMESTAMP - (v_item->>'start_time')::TIMESTAMP))::INTEGER);
            END IF;
            
            v_calculated_amount := v_calculated_amount * v_nights;
            
        ELSIF v_item->>'item_type' = 'ACTIVITY' THEN
            SELECT COALESCE(price, 0) INTO v_calculated_amount 
            FROM public.activities 
            WHERE id = (v_item->>'item_id')::UUID;

        ELSIF v_item->>'item_type' = 'PRODUCT' THEN
            SELECT COALESCE(price, 0) INTO v_calculated_amount 
            FROM public.products 
            WHERE id = (v_item->>'item_id')::UUID;
        END IF;

        -- Multiply by quantity and pax
        v_calculated_amount := COALESCE(v_calculated_amount, 0) * 
                               COALESCE((v_item->>'quantity')::INTEGER, 1) * 
                               COALESCE((v_item->>'pax')::INTEGER, 1);

        v_total_amount := v_total_amount + v_calculated_amount;
        
        IF (v_item->>'item_type') IN ('ACCOMMODATION', 'ACTIVITY', 'TRANSPORT', 'RESTAURANT', 'PACKAGE', 'EVENT') THEN
            INSERT INTO public.bookings (
                user_id, item_type, item_id, status, start_time, end_time, pax, total_amount, currency
            ) VALUES (
                p_user_id, (v_item->>'item_type')::booking_type, (v_item->>'item_id')::UUID, 'PENDING_PAYMENT',
                (v_item->>'start_time')::TIMESTAMPTZ, (v_item->>'end_time')::TIMESTAMPTZ,
                COALESCE((v_item->>'pax')::INTEGER, 1), v_calculated_amount, p_currency
            ) RETURNING id INTO v_booking_id;
        END IF;

        INSERT INTO public.order_items (
            order_id, booking_id, amount, currency, description
        ) VALUES (
            v_order_id, v_booking_id, v_calculated_amount, p_currency, v_item->>'description'
        );
    END LOOP;

    UPDATE public.orders SET total_amount = v_total_amount WHERE id = v_order_id;

    RETURN v_order_id;
END;
$$;
