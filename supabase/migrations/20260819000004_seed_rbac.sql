-- Phase 10: Seed RBAC Roles and Permissions

-- 1. Insert Base Permissions
INSERT INTO public.app_permissions (id, name, description) VALUES
  (gen_random_uuid(), 'platform.admin', 'Full platform administrative access'),
  (gen_random_uuid(), 'users.read', 'Can read all user profiles'),
  (gen_random_uuid(), 'users.manage', 'Can suspend or modify users'),
  (gen_random_uuid(), 'providers.read', 'Can read provider details'),
  (gen_random_uuid(), 'providers.approve', 'Can approve provider verifications'),
  (gen_random_uuid(), 'content.manage', 'Can create and edit CMS content'),
  (gen_random_uuid(), 'bookings.read', 'Can read bookings'),
  (gen_random_uuid(), 'bookings.manage', 'Can modify or cancel bookings'),
  (gen_random_uuid(), 'payments.read', 'Can view transactions'),
  (gen_random_uuid(), 'payments.refund', 'Can issue refunds'),
  (gen_random_uuid(), 'iot.read', 'Can view IoT telemetry'),
  (gen_random_uuid(), 'iot.manage', 'Can control IoT devices'),
  (gen_random_uuid(), 'security.read', 'Can view security audit logs')
ON CONFLICT (name) DO NOTHING;

-- 2. Insert Base Roles
INSERT INTO public.app_roles (id, name, description) VALUES
  (gen_random_uuid(), 'SUPER_ADMIN', 'Super Administrator with all permissions'),
  (gen_random_uuid(), 'ADMIN', 'Standard Administrator'),
  (gen_random_uuid(), 'CONTENT_ADMIN', 'Content Manager'),
  (gen_random_uuid(), 'PROVIDER_OWNER', 'Provider Organization Owner'),
  (gen_random_uuid(), 'PROVIDER_STAFF', 'Provider Organization Staff'),
  (gen_random_uuid(), 'USER', 'Standard Customer')
ON CONFLICT (name) DO NOTHING;

-- 3. Map Permissions to Roles
DO $$
DECLARE
  v_super_admin_id uuid;
  v_admin_id uuid;
  v_content_admin_id uuid;
BEGIN
  SELECT id INTO v_super_admin_id FROM public.app_roles WHERE name = 'SUPER_ADMIN';
  SELECT id INTO v_admin_id FROM public.app_roles WHERE name = 'ADMIN';
  SELECT id INTO v_content_admin_id FROM public.app_roles WHERE name = 'CONTENT_ADMIN';

  -- SUPER_ADMIN gets EVERYTHING
  INSERT INTO public.app_role_permissions (role_id, permission_id)
  SELECT v_super_admin_id, id FROM public.app_permissions
  ON CONFLICT DO NOTHING;

  -- ADMIN gets read access to most things and some management
  INSERT INTO public.app_role_permissions (role_id, permission_id)
  SELECT v_admin_id, id FROM public.app_permissions
  WHERE name IN ('users.read', 'providers.read', 'bookings.read', 'payments.read', 'iot.read', 'security.read')
  ON CONFLICT DO NOTHING;
  
  -- CONTENT_ADMIN gets content access
  INSERT INTO public.app_role_permissions (role_id, permission_id)
  SELECT v_content_admin_id, id FROM public.app_permissions
  WHERE name IN ('content.manage')
  ON CONFLICT DO NOTHING;

  -- 4. Map Existing Users Based on profiles.role
  -- Any existing SUPER_ADMIN profiles get the SUPER_ADMIN role
  INSERT INTO public.app_user_roles (user_id, role_id)
  SELECT id, v_super_admin_id FROM public.profiles WHERE role = 'SUPER_ADMIN'
  ON CONFLICT DO NOTHING;
  
  -- Any existing ADMIN profiles get the ADMIN role
  INSERT INTO public.app_user_roles (user_id, role_id)
  SELECT id, v_admin_id FROM public.profiles WHERE role = 'ADMIN'
  ON CONFLICT DO NOTHING;
  
  -- We don't map PROVIDER yet to a specific RBAC role unless we want to, 
  -- because RLS currently relies on auth.uid() = provider_id anyway for legacy.
  
END $$;
