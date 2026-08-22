-- Phase 10: RLS Hardening using RBAC

-- 1. Harden public.profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- Everyone can view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Users with 'users.read' permission can view all profiles
CREATE POLICY "Authorized users can view all profiles" ON public.profiles
    FOR SELECT USING (public.has_permission(auth.uid(), 'users.read'));

-- Users with 'users.manage' permission can update all profiles
CREATE POLICY "Authorized users can manage all profiles" ON public.profiles
    FOR UPDATE USING (public.has_permission(auth.uid(), 'users.manage'));


-- 2. Harden public.iot_devices
DROP POLICY IF EXISTS "Providers can manage own iot_devices" ON public.iot_devices;

-- Providers can manage their own devices (Owner access)
CREATE POLICY "Providers can manage own iot_devices" ON public.iot_devices
    FOR ALL USING (auth.uid() = provider_id);

-- Users with 'iot.read' permission can view all devices
CREATE POLICY "Authorized users can view all iot_devices" ON public.iot_devices
    FOR SELECT USING (public.has_permission(auth.uid(), 'iot.read'));

-- Users with 'iot.manage' permission can update all devices
CREATE POLICY "Authorized users can manage all iot_devices" ON public.iot_devices
    FOR UPDATE USING (public.has_permission(auth.uid(), 'iot.manage'));
    
-- Note: 'platform.admin' gets super admin access everywhere through the get_user_permissions function mapping, 
-- but we don't strictly need a catch-all if 'users.read' is granted to them in role_permissions.
