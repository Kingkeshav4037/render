-- Phase 27: Comprehensive Order, Payment, and Marketplace RLS Hardening

-- 1. Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 2. Define RLS Policies
DO $$ BEGIN
    -- Orders Policies
    DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
    CREATE POLICY "Users can view own orders" ON public.orders
        FOR SELECT USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Authorized admins can view all orders" ON public.orders;
    CREATE POLICY "Authorized admins can view all orders" ON public.orders
        FOR SELECT USING (
            public.has_permission(auth.uid(), 'orders.read') OR 
            EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('ADMIN', 'SUPER_ADMIN'))
        );

    DROP POLICY IF EXISTS "Authorized admins can manage orders" ON public.orders;
    CREATE POLICY "Authorized admins can manage orders" ON public.orders
        FOR UPDATE USING (
            public.has_permission(auth.uid(), 'orders.manage') OR 
            EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('ADMIN', 'SUPER_ADMIN'))
        );

    -- Order Items Policies
    DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
    CREATE POLICY "Users can view own order items" ON public.order_items
        FOR SELECT USING (
            EXISTS (
                SELECT 1 FROM public.orders 
                WHERE orders.id = order_items.order_id 
                AND orders.user_id = auth.uid()
            )
        );

    DROP POLICY IF EXISTS "Authorized admins can view all order items" ON public.order_items;
    CREATE POLICY "Authorized admins can view all order items" ON public.order_items
        FOR SELECT USING (
            public.has_permission(auth.uid(), 'orders.read') OR 
            EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('ADMIN', 'SUPER_ADMIN'))
        );

    DROP POLICY IF EXISTS "Authorized admins can manage order items" ON public.order_items;
    CREATE POLICY "Authorized admins can manage order items" ON public.order_items
        FOR ALL USING (
            public.has_permission(auth.uid(), 'orders.manage') OR 
            EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('ADMIN', 'SUPER_ADMIN'))
        );

    -- Payment Transactions Policies
    DROP POLICY IF EXISTS "Users can view their own payment transactions" ON public.payment_transactions;
    CREATE POLICY "Users can view their own payment transactions" ON public.payment_transactions
        FOR SELECT USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Authorized admins can view all payment transactions" ON public.payment_transactions;
    CREATE POLICY "Authorized admins can view all payment transactions" ON public.payment_transactions
        FOR SELECT USING (
            public.has_permission(auth.uid(), 'payments.read') OR 
            EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('ADMIN', 'SUPER_ADMIN'))
        );

    -- Marketplace Products Policies
    DROP POLICY IF EXISTS "Products viewable by everyone" ON public.products;
    CREATE POLICY "Products viewable by everyone" ON public.products
        FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Authorized admins can manage products" ON public.products;
    CREATE POLICY "Authorized admins can manage products" ON public.products
        FOR ALL USING (
            public.has_permission(auth.uid(), 'products.manage') OR 
            EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('ADMIN', 'SUPER_ADMIN'))
        );
EXCEPTION WHEN undefined_table THEN NULL;
END $$;
