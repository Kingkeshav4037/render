-- Conditionally create the avatars storage bucket and policies if storage schema exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_schema = 'storage' AND table_name = 'buckets'
    ) THEN
        -- Create the avatars storage bucket if it does not already exist
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('avatars', 'avatars', true)
        ON CONFLICT (id) DO NOTHING;

        -- 1. Anyone can view avatar images (Public read)
        DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
        CREATE POLICY "Avatar images are publicly accessible"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'avatars');

        -- 2. Authenticated users can upload their own avatars
        DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
        CREATE POLICY "Users can upload their own avatar"
        ON storage.objects FOR INSERT
        TO authenticated
        WITH CHECK (
          bucket_id = 'avatars' 
          AND (auth.uid()::text = (storage.foldername(name))[1])
        );

        -- 3. Authenticated users can update/overwrite their own avatars
        DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
        CREATE POLICY "Users can update their own avatar"
        ON storage.objects FOR UPDATE
        TO authenticated
        USING (
          bucket_id = 'avatars' 
          AND (auth.uid()::text = (storage.foldername(name))[1])
        );

        -- 4. Authenticated users can delete their own avatars
        DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
        CREATE POLICY "Users can delete their own avatar"
        ON storage.objects FOR DELETE
        TO authenticated
        USING (
          bucket_id = 'avatars' 
          AND (auth.uid()::text = (storage.foldername(name))[1])
        );
    END IF;
EXCEPTION
    WHEN insufficient_privilege THEN
        NULL; -- Gracefully handle Supabase cloud managed storage permissions
END $$;
