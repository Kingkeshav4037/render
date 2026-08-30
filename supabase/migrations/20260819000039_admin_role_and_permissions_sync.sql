-- Migration: Synchronize Admin & Super Admin Roles, Permissions, and Non-Recursive RLS
-- Fixes "infinite recursion detected in policy for relation profiles"

-- 0. Ensure SUPER_ADMIN and other roles exist in the user_role enum if it is an enum type
DO $$ BEGIN
    ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'SUPER_ADMIN';
    ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'ADMIN';
    ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'PROVIDER';
    ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'MODERATOR';
    ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'ANALYST';
    ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'DATA_MANAGER';
EXCEPTION WHEN duplicate_object THEN NULL;
          WHEN undefined_object THEN NULL;
END $$;

-- 1. Create a SECURITY DEFINER helper function to check admin status
-- NOTE: SECURITY DEFINER functions bypass table RLS, preventing infinite recursion!
CREATE OR REPLACE FUNCTION public.is_admin(p_user_id uuid)
RETURNS boolean AS $$
BEGIN
    IF p_user_id IS NULL THEN
        RETURN false;
    END IF;
    
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = p_user_id
        AND UPPER(REPLACE(COALESCE(role::text, ''), ' ', '_')) IN ('ADMIN', 'SUPER_ADMIN')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Upgrade public.has_permission function to recognize admin roles directly
CREATE OR REPLACE FUNCTION public.has_permission(p_user_id uuid, p_permission_name text)
RETURNS boolean AS $$
DECLARE
    v_has boolean;
BEGIN
    IF p_user_id IS NULL THEN
        RETURN false;
    END IF;

    -- Admins and Super Admins have all permissions
    IF public.is_admin(p_user_id) THEN
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Trigger function to auto-sync profiles.role into app_user_roles table
CREATE OR REPLACE FUNCTION public.sync_profile_role_to_app_roles()
RETURNS trigger AS $$
DECLARE
    v_clean_role text;
    v_role_id uuid;
BEGIN
    v_clean_role := UPPER(REPLACE(COALESCE(NEW.role::text, 'USER'), ' ', '_'));
    
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_sync_profile_role ON public.profiles;
CREATE TRIGGER trg_sync_profile_role
    AFTER INSERT OR UPDATE OF role ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_profile_role_to_app_roles();

-- 4. Clean up existing recursive/conflicting policies on public.profiles and replace with clean SECURITY DEFINER policies
DO $$ BEGIN
    -- Drop old recursive policies
    DROP POLICY IF EXISTS "Authorized admins can view all profiles" ON public.profiles;
    DROP POLICY IF EXISTS "Authorized admins can update all profiles" ON public.profiles;
    DROP POLICY IF EXISTS "Authorized users can view all profiles" ON public.profiles;
    DROP POLICY IF EXISTS "Authorized users can manage all profiles" ON public.profiles;
    DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
    DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
    DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Users can view own profile or admins view all" ON public.profiles;
    DROP POLICY IF EXISTS "Users can update own profile or admins update all" ON public.profiles;
    DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Users can insert own profile." ON public.profiles;

    -- Create non-recursive policies using public.is_admin()
    CREATE POLICY "Users can view own profile or admins view all" ON public.profiles
        FOR SELECT USING (
            auth.uid() = id OR public.is_admin(auth.uid())
        );

    CREATE POLICY "Users can update own profile or admins update all" ON public.profiles
        FOR UPDATE USING (
            auth.uid() = id OR public.is_admin(auth.uid())
        );

    CREATE POLICY "Users can insert own profile" ON public.profiles
        FOR INSERT WITH CHECK (
            auth.uid() = id
        );
EXCEPTION WHEN undefined_table THEN NULL;
END $$;
