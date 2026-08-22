-- 1. Create deals table
CREATE TABLE public.deals (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    name text NOT NULL,
    description text NOT NULL,
    price numeric NOT NULL,
    original_price numeric NOT NULL,
    discount_percentage numeric,
    valid_until timestamptz,
    image_url text NOT NULL,
    featured boolean DEFAULT false,
    status public.content_status DEFAULT 'PUBLISHED'::public.content_status,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- 2. Setup RLS Policies
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deals are viewable by everyone." 
ON public.deals FOR SELECT USING (true);

CREATE POLICY "Deals can be managed by admin." 
ON public.deals FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND (profiles.role = 'ADMIN' OR profiles.role = 'SUPER_ADMIN')
    )
);

-- 3. Add DEAL to booking_type if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_type') THEN
        -- Type doesn't exist? (it should)
    ELSE
        IF NOT EXISTS (
            SELECT 1 FROM pg_enum 
            WHERE enumtypid = 'booking_type'::regtype 
            AND enumlabel = 'DEAL'
        ) THEN
            ALTER TYPE public.booking_type ADD VALUE 'DEAL';
        END IF;
    END IF;
END
$$;

-- 4. Replace process_checkout to support EVENT and DEAL pricing
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

        ELSIF v_item->>'item_type' = 'EVENT' THEN
            SELECT COALESCE(ticket_price, 0) INTO v_calculated_amount 
            FROM public.events 
            WHERE id = (v_item->>'item_id')::UUID;

        ELSIF v_item->>'item_type' = 'DEAL' THEN
            SELECT COALESCE(price, 0) INTO v_calculated_amount 
            FROM public.deals 
            WHERE id = (v_item->>'item_id')::UUID;
        END IF;

        -- Multiply by quantity and pax
        v_calculated_amount := COALESCE(v_calculated_amount, 0) * 
                               COALESCE((v_item->>'quantity')::INTEGER, 1) * 
                               COALESCE((v_item->>'pax')::INTEGER, 1);

        v_total_amount := v_total_amount + v_calculated_amount;
        
        IF (v_item->>'item_type') IN ('ACCOMMODATION', 'ACTIVITY', 'TRANSPORT', 'RESTAURANT', 'PACKAGE', 'EVENT', 'DEAL') THEN
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

-- 5. Add Seed Data
INSERT INTO public.deals (name, description, price, original_price, discount_percentage, valid_until, image_url, featured)
VALUES 
('Northern Lights Package', '5-day fully guided Northern Lights adventure in Tromsø including husky sledding.', 8500, 10000, 15, now() + interval '30 days', '/images/northern_lights_1786935879330.jpg', true),
('Fjord Cruise Special', '2-day premium Geirangerfjord cruise with overnight stay at Hotel Union.', 3200, 4000, 20, now() + interval '14 days', '/images/fjords_1786935800026.jpg', true),
('Oslo City Break', 'Weekend getaway including museum pass, 2 nights accommodation, and dinner.', 2500, 2800, 10, now() + interval '60 days', '/images/login_background_1786937688053.jpg', false);

INSERT INTO public.events (name, category, description, start_date, end_date, ticket_price, image_url, featured, status)
VALUES 
('Tromsø International Film Festival', 'CULTURAL', 'The largest film festival in Norway taking place in the dark winter.', now() + interval '5 days', now() + interval '10 days', 450, '/images/northern_lights_1786935879330.jpg', true, 'PUBLISHED'),
('Bergen Food Festival', 'FESTIVAL', 'A celebration of local western Norwegian food and drink.', now() + interval '15 days', now() + interval '18 days', 150, '/images/food_salmon_1787013684123.jpg', true, 'PUBLISHED'),
('Oslo Marathon', 'SPORTS', 'Annual marathon running through the scenic streets of Oslo.', now() + interval '30 days', now() + interval '31 days', 800, '/images/login_background_1786937688053.jpg', false, 'PUBLISHED');
