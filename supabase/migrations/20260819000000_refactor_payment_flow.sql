-- Drop redundant payments table
DROP TABLE IF EXISTS public.payments;

-- Enhance order_items to support fulfillment data without premature bookings
ALTER TABLE public.order_items
ADD COLUMN IF NOT EXISTS item_type public.booking_type,
ADD COLUMN IF NOT EXISTS item_id uuid,
ADD COLUMN IF NOT EXISTS start_time timestamp with time zone,
ADD COLUMN IF NOT EXISTS end_time timestamp with time zone,
ADD COLUMN IF NOT EXISTS pax integer DEFAULT 1;

-- Redefine process_checkout to NOT create premature bookings
CREATE OR REPLACE FUNCTION public.process_checkout(p_user_id uuid, p_total_amount numeric, p_currency text, p_items jsonb) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_order_id UUID;
    v_item JSONB;
    v_amount DECIMAL;
BEGIN
    -- 1. Create the master order record
    INSERT INTO public.orders (user_id, total_amount, currency, status)
    VALUES (p_user_id, p_total_amount, p_currency, 'PENDING_PAYMENT')
    RETURNING id INTO v_order_id;

    -- 2. Process each item in the cart
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_amount := COALESCE((v_item->>'amount')::DECIMAL, 0);
        
        -- Create order item linking everything (NO BOOKING CREATED YET)
        INSERT INTO public.order_items (
            order_id, 
            item_type,
            item_id,
            start_time,
            end_time,
            pax,
            amount, 
            currency, 
            description
        ) VALUES (
            v_order_id,
            (v_item->>'item_type')::booking_type,
            (v_item->>'item_id')::UUID,
            (v_item->>'start_time')::TIMESTAMPTZ,
            (v_item->>'end_time')::TIMESTAMPTZ,
            COALESCE((v_item->>'pax')::INTEGER, 1),
            v_amount,
            p_currency,
            v_item->>'description'
        );
    END LOOP;

    RETURN v_order_id;
END;
$$;

-- Redefine process_payment_webhook to CREATE bookings upon fulfillment
CREATE OR REPLACE FUNCTION public.process_payment_webhook(p_gateway_order_id text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_order_id UUID;
    v_user_id UUID;
    v_order_item RECORD;
    v_booking_id UUID;
BEGIN
    -- Find the order via payment_transactions
    SELECT order_id, user_id INTO v_order_id, v_user_id
    FROM public.payment_transactions
    WHERE gateway_order_id = p_gateway_order_id
    LIMIT 1;
    
    IF v_order_id IS NULL THEN
        RAISE EXCEPTION 'Order not found for gateway order ID %', p_gateway_order_id;
    END IF;
    
    -- Update transaction
    UPDATE public.payment_transactions
    SET status = 'SUCCESS'
    WHERE gateway_order_id = p_gateway_order_id;
    
    -- Update order
    UPDATE public.orders
    SET status = 'PAID'
    WHERE id = v_order_id;
    
    -- CREATE Bookings from Order Items (Fulfillment)
    FOR v_order_item IN SELECT * FROM public.order_items WHERE order_id = v_order_id
    LOOP
        -- Only create bookings for bookable items
        IF v_order_item.item_type IN ('ACCOMMODATION', 'ACTIVITY', 'TRANSPORT', 'RESTAURANT', 'PACKAGE', 'EVENT') THEN
            INSERT INTO public.bookings (
                user_id, 
                item_type, 
                item_id, 
                status, 
                start_time, 
                end_time, 
                pax, 
                total_amount, 
                currency
            ) VALUES (
                v_user_id,
                v_order_item.item_type,
                v_order_item.item_id,
                'CONFIRMED',
                v_order_item.start_time,
                v_order_item.end_time,
                v_order_item.pax,
                v_order_item.amount,
                v_order_item.currency
            ) RETURNING id INTO v_booking_id;
            
            -- Optionally update the order_item with the fulfilled booking_id
            UPDATE public.order_items SET booking_id = v_booking_id WHERE id = v_order_item.id;
        END IF;
    END LOOP;
    
    RETURN TRUE;
END;
$$;
