-- Function to handle secure profile creation automatically after Supabase auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    requested_role text;
    assigned_role public.user_role;
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

    -- Insert the new profile
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        avatar_url,
        role,
        created_at,
        updated_at
    )
    VALUES (
        new.id,
        new.email,
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'avatar_url',
        assigned_role,
        now(),
        now()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(public.profiles.full_name, EXCLUDED.full_name),
        avatar_url = COALESCE(public.profiles.avatar_url, EXCLUDED.avatar_url),
        updated_at = now();
        
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute the function on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Revoke the insecure INSERT policy on public.profiles
DROP POLICY IF EXISTS "Users can insert own profile." ON public.profiles;
