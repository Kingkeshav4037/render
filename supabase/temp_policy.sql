CREATE POLICY "Users can insert own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
GRANT INSERT ON public.profiles TO authenticated;
