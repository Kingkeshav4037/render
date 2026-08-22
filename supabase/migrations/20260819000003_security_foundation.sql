-- Phase 10: Security Foundation & RBAC

-- 1. Security Events Audit Log
CREATE TABLE public.security_events (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    event_type text NOT NULL,
    description text,
    ip_address text,
    user_agent text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now()
);

-- 2. Granular RBAC Tables
CREATE TABLE public.app_permissions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text UNIQUE NOT NULL, -- e.g., 'bookings.read', 'iot.manage'
    description text,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.app_roles (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text UNIQUE NOT NULL, -- e.g., 'ADMIN', 'PROVIDER', 'USER'
    description text,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.app_role_permissions (
    role_id uuid REFERENCES public.app_roles(id) ON DELETE CASCADE,
    permission_id uuid REFERENCES public.app_permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE public.app_user_roles (
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_id uuid REFERENCES public.app_roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- 3. Security Settings
CREATE TABLE public.user_security_settings (
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    mfa_enabled boolean DEFAULT false,
    session_timeout_minutes integer DEFAULT 120,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 4. Helper Function for RLS
CREATE OR REPLACE FUNCTION public.has_permission(p_user_id uuid, p_permission_name text)
RETURNS boolean AS $$
DECLARE
    v_has boolean;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM public.app_user_roles ur
        JOIN public.app_role_permissions rp ON ur.role_id = rp.role_id
        JOIN public.app_permissions p ON rp.permission_id = p.id
        WHERE ur.user_id = p_user_id AND p.name = p_permission_name
    ) INTO v_has;
    
    RETURN v_has;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply RLS to the new tables
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_security_settings ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own security settings
CREATE POLICY "Users can read own security settings"
    ON public.user_security_settings FOR SELECT
    USING (auth.uid() = user_id);

-- Admins can read security events
CREATE POLICY "Admins can read security events"
    ON public.security_events FOR SELECT
    USING (public.has_permission(auth.uid(), 'security.read'));

-- Everyone can read permissions and roles
CREATE POLICY "Public read permissions" ON public.app_permissions FOR SELECT USING (true);
CREATE POLICY "Public read roles" ON public.app_roles FOR SELECT USING (true);
CREATE POLICY "Public read role_permissions" ON public.app_role_permissions FOR SELECT USING (true);
CREATE POLICY "Public read user_roles" ON public.app_user_roles FOR SELECT USING (true);
