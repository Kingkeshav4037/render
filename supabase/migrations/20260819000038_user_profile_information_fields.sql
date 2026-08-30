-- Migration: Add address and postal_code columns to profiles and update handle_new_user trigger
-- Phase: User Profile & Onboarding Information Enhancement

-- 1. Add columns to public.profiles safely if they don't already exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'address'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN address text;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'postal_code'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN postal_code text;
    END IF;
END $$;

-- 2. Update the handle_new_user function to automatically extract and populate new profile fields from auth signup metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    requested_role text;
    assigned_role public.user_role;
BEGIN
    -- Extract the requested role from user metadata
    requested_role := new.raw_user_meta_data->>'role';
    
    -- Sanitize and assign role securely. Default to USER. 
    IF requested_role = 'PROVIDER' THEN
        assigned_role := 'PROVIDER'::public.user_role;
    ELSE
        assigned_role := 'USER'::public.user_role;
    END IF;

    -- Insert or update the new profile with comprehensive user details
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        avatar_url,
        role,
        gender,
        date_of_birth,
        address,
        city,
        postal_code,
        country,
        created_at,
        updated_at
    )
    VALUES (
        new.id,
        new.email,
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'avatar_url',
        assigned_role,
        new.raw_user_meta_data->>'gender',
        CASE 
          WHEN new.raw_user_meta_data->>'date_of_birth' IS NOT NULL AND new.raw_user_meta_data->>'date_of_birth' <> '' 
          THEN (new.raw_user_meta_data->>'date_of_birth')::date 
          ELSE NULL 
        END,
        new.raw_user_meta_data->>'address',
        new.raw_user_meta_data->>'city',
        new.raw_user_meta_data->>'postal_code',
        COALESCE(new.raw_user_meta_data->>'country', 'Norway'),
        now(),
        now()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(public.profiles.full_name, EXCLUDED.full_name),
        avatar_url = COALESCE(public.profiles.avatar_url, EXCLUDED.avatar_url),
        gender = COALESCE(public.profiles.gender, EXCLUDED.gender),
        date_of_birth = COALESCE(public.profiles.date_of_birth, EXCLUDED.date_of_birth),
        address = COALESCE(public.profiles.address, EXCLUDED.address),
        city = COALESCE(public.profiles.city, EXCLUDED.city),
        postal_code = COALESCE(public.profiles.postal_code, EXCLUDED.postal_code),
        country = COALESCE(public.profiles.country, EXCLUDED.country),
        updated_at = now();
        
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Ensure RLS policies on public.profiles allow users to select and update their own profile
DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
    CREATE POLICY "Users can view own profile" ON public.profiles
        FOR SELECT USING (auth.uid() = id);

    DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
    CREATE POLICY "Users can update own profile" ON public.profiles
        FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;
