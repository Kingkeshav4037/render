-- Phase 11: Seed Content (Wildlife, Aurora, Foods)


-- Insert Foods (using existing 'foods' table)
INSERT INTO public.foods (id, slug, name, description)
VALUES
('50000000-0000-0000-0000-000000000001', 'farikal', 'Fårikål', 'Traditional Norwegian mutton and cabbage stew.'),
('50000000-0000-0000-0000-000000000002', 'brunost', 'Brunost', 'Sweet, brown cheese made from goat''s milk.')
ON CONFLICT DO NOTHING;
