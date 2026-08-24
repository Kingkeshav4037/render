-- Migration: 20260819000034_fix_webhook_and_invoices.sql
-- Description: Fix webhook duplicate handling and add invoice generation

CREATE OR REPLACE FUNCTION public.process_payment_webhook(p_gateway_order_id text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_order_id UUID;
    v_user_id UUID;
    v_order_status TEXT;
    v_tx_status TEXT;
    v_order_item RECORD;
    v_booking_id UUID;
    v_profile RECORD;
    v_invoice_number TEXT;
    v_total_amount NUMERIC;
    v_currency TEXT;
BEGIN
    -- 1. Find the order via payment_transactions
    SELECT t.order_id, t.user_id, t.status, o.status, o.total_amount, o.currency 
    INTO v_order_id, v_user_id, v_tx_status, v_order_status, v_total_amount, v_currency
    FROM public.payment_transactions t
    JOIN public.orders o ON t.order_id = o.id
    WHERE t.gateway_order_id = p_gateway_order_id
    LIMIT 1;
    
    IF v_order_id IS NULL THEN
        RAISE EXCEPTION 'Order not found for gateway order ID %', p_gateway_order_id;
    END IF;

    -- 2. Idempotency Check (Prevent duplicate processing)
    IF v_tx_status = 'SUCCESS' OR v_order_status = 'PAID' THEN
        -- Already processed, return success silently to ack webhook
        RETURN TRUE;
    END IF;
    
    -- 3. Update transaction
    UPDATE public.payment_transactions
    SET status = 'SUCCESS', updated_at = NOW()
    WHERE gateway_order_id = p_gateway_order_id;
    
    -- 4. Update order
    UPDATE public.orders
    SET status = 'PAID', updated_at = NOW()
    WHERE id = v_order_id;

    -- 5. Get user profile for invoice
    SELECT p.full_name, u.email 
    INTO v_profile
    FROM public.profiles p
    JOIN auth.users u ON p.id = u.id
    WHERE p.id = v_user_id;
    
    -- 6. CREATE Bookings and Invoices from Order Items
    FOR v_order_item IN SELECT * FROM public.order_items WHERE order_id = v_order_id
    LOOP
        -- Only create bookings for bookable items
        IF v_order_item.item_type IN ('ACCOMMODATION', 'ACTIVITY', 'TRANSPORT', 'RESTAURANT', 'PACKAGE', 'EVENT') THEN
            
            -- Create Booking
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
            
            -- Update the order_item with the fulfilled booking_id
            UPDATE public.order_items SET booking_id = v_booking_id WHERE id = v_order_item.id;

            -- Generate Invoice Number: INV-YYYYMMDD-XXXX
            v_invoice_number := 'INV-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(v_booking_id::text FROM 1 FOR 6));

            -- Create Invoice
            INSERT INTO public.invoices (
                invoice_number,
                user_id,
                order_id,
                booking_id,
                customer_name,
                customer_email,
                currency,
                subtotal_amount,
                vat_standard_amount,
                total_amount,
                payment_gateway_ref,
                items
            ) VALUES (
                v_invoice_number,
                v_user_id,
                v_order_id::text,
                v_booking_id,
                COALESCE(v_profile.full_name, 'Guest User'),
                COALESCE(v_profile.email, 'no-email@smartlife.no'),
                v_order_item.currency,
                v_order_item.amount * 0.8, -- 80% subtotal
                v_order_item.amount * 0.2, -- 20% VAT
                v_order_item.amount,
                p_gateway_order_id,
                jsonb_build_array(
                    jsonb_build_object(
                        'description', v_order_item.description,
                        'quantity', v_order_item.quantity,
                        'unit_price', v_order_item.amount / v_order_item.quantity,
                        'total', v_order_item.amount
                    )
                )
            );
        END IF;
    END LOOP;
    
    RETURN TRUE;
END;
$$;
