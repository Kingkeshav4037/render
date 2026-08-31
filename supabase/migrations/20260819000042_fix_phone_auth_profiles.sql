-- Fix profiles table and handle_new_user trigger to support phone-only OTP authentication
-- When a user signs in/up with Phone OTP, new.email is NULL and new.phone is set.

-- 1. Ensure email column in public.profiles is nullable for phone-only travelers
DO $$
BEGIN
    ALTER TABLE public.profiles ALTER COLUMN email DROP NOT NULL;
EXCEPTION
    WHEN OTHERS THEN
        NULL;
END $$;

-- 2. Update handle_new_user trigger function to safely support phone OTP and OAuth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    requested_role text;
    assigned_role public.user_role;
    user_phone text;
    user_email text;
    user_name text;
BEGIN
    -- Extract the requested role from user metadata
    requested_role := new.raw_user_meta_data->>'role';
    
    -- Sanitize and assign role securely. Default to USER.
    -- Explicitly block any attempt to assign ADMIN or SUPERADMIN via client-side metadata.
    IF requested_role = 'PROVIDER' THEN
        assigned_role := 'PROVIDER'::public.user_role;
    ELSE
        assigned_role := 'USER'::public.user_role;
    END IF;

    -- Extract phone and email
    user_phone := COALESCE(new.phone, new.raw_user_meta_data->>'phone');
    user_email := new.email;

    -- Derive fallback name
    user_name := COALESCE(
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'name',
        CASE 
            WHEN user_phone IS NOT NULL AND user_phone != '' THEN 'Traveler ' || RIGHT(user_phone, 4)
            WHEN user_email IS NOT NULL AND user_email != '' THEN SPLIT_PART(user_email, '@', 1)
            ELSE 'Traveler'
        END
    );

    -- Insert or update the new profile
    INSERT INTO public.profiles (
        id,
        email,
        phone,
        phone_verified,
        full_name,
        avatar_url,
        role,
        created_at,
        updated_at
    )
    VALUES (
        new.id,
        user_email,
        user_phone,
        CASE WHEN user_phone IS NOT NULL AND user_phone != '' THEN true ELSE false END,
        user_name,
        new.raw_user_meta_data->>'avatar_url',
        assigned_role,
        now(),
        now()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = COALESCE(EXCLUDED.email, public.profiles.email),
        phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
        phone_verified = COALESCE(EXCLUDED.phone_verified, public.profiles.phone_verified),
        full_name = COALESCE(public.profiles.full_name, EXCLUDED.full_name),
        avatar_url = COALESCE(public.profiles.avatar_url, EXCLUDED.avatar_url),
        updated_at = now();
        
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Re-bind the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
