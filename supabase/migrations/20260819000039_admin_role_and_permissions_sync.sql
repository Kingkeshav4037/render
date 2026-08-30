-- Migration: Synchronize Admin & Super Admin Roles, Permissions, and RLS
-- Allows users set as SUPER_ADMIN or ADMIN in public.profiles to be recognized everywhere

-- 1. Upgrade public.has_permission function to recognize profiles.role directly
CREATE OR REPLACE FUNCTION public.has_permission(p_user_id uuid, p_permission_name text)
RETURNS boolean AS $$
DECLARE
    v_has boolean;
    v_role text;
BEGIN
    IF p_user_id IS NULL THEN
        RETURN false;
    END IF;

    -- Check if user is directly SUPER_ADMIN or ADMIN in public.profiles (case-insensitive and format-tolerant)
    SELECT UPPER(REPLACE(COALESCE(role, ''), ' ', '_')) INTO v_role
    FROM public.profiles
    WHERE id = p_user_id;

    IF v_role IN ('SUPER_ADMIN', 'ADMIN') THEN
        RETURN true;
    END IF;

    -- Check granular RBAC tables if present
    BEGIN
        SELECT EXISTS (
            SELECT 1
            FROM public.app_user_roles ur
            JOIN public.app_role_permissions rp ON ur.role_id = rp.role_id
            JOIN public.app_permissions p ON rp.permission_id = p.id
            WHERE ur.user_id = p_user_id AND p.name = p_permission_name
        ) INTO v_has;
    EXCEPTION WHEN undefined_table THEN
        v_has := false;
    END;
    
    RETURN COALESCE(v_has, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Trigger function to auto-sync profiles.role into app_user_roles table
CREATE OR REPLACE FUNCTION public.sync_profile_role_to_app_roles()
RETURNS trigger AS $$
DECLARE
    v_clean_role text;
    v_role_id uuid;
BEGIN
    v_clean_role := UPPER(REPLACE(COALESCE(NEW.role, 'USER'), ' ', '_'));
    
    -- Ensure app_roles has this role
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'app_roles') THEN
        INSERT INTO public.app_roles (name, description)
        VALUES (v_clean_role, 'Auto-synced role from profiles')
        ON CONFLICT (name) DO NOTHING;

        SELECT id INTO v_role_id FROM public.app_roles WHERE name = v_clean_role LIMIT 1;

        IF v_role_id IS NOT NULL AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'app_user_roles') THEN
            INSERT INTO public.app_user_roles (user_id, role_id)
            VALUES (NEW.id, v_role_id)
            ON CONFLICT DO NOTHING;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_sync_profile_role ON public.profiles;
CREATE TRIGGER trg_sync_profile_role
    AFTER INSERT OR UPDATE OF role ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_profile_role_to_app_roles();

-- 3. Ensure RLS policies on public.profiles allow admins to view and manage all profiles
DO $$ BEGIN
    DROP POLICY IF EXISTS "Authorized admins can view all profiles" ON public.profiles;
    CREATE POLICY "Authorized admins can view all profiles" ON public.profiles
        FOR SELECT USING (
            auth.uid() = id OR
            EXISTS (
                SELECT 1 FROM public.profiles p 
                WHERE p.id = auth.uid() 
                AND UPPER(REPLACE(COALESCE(p.role, ''), ' ', '_')) IN ('ADMIN', 'SUPER_ADMIN')
            )
        );

    DROP POLICY IF EXISTS "Authorized admins can update all profiles" ON public.profiles;
    CREATE POLICY "Authorized admins can update all profiles" ON public.profiles
        FOR UPDATE USING (
            auth.uid() = id OR
            EXISTS (
                SELECT 1 FROM public.profiles p 
                WHERE p.id = auth.uid() 
                AND UPPER(REPLACE(COALESCE(p.role, ''), ' ', '_')) IN ('ADMIN', 'SUPER_ADMIN')
            )
        );
EXCEPTION WHEN undefined_table THEN NULL;
END $$;
