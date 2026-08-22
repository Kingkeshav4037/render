-- 6. Update missing images for Activities
UPDATE public.activities
SET image_url = 'https://images.unsplash.com/photo-1547844075-8e2b2fb0c930?q=80&w=1600'
WHERE image_url IS NULL AND type = 'WILDLIFE';

UPDATE public.activities
SET image_url = 'https://images.unsplash.com/photo-1516214104703-d2507f01dda4?q=80&w=1600'
WHERE image_url IS NULL AND type = 'ADVENTURE';

UPDATE public.activities
SET image_url = 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?q=80&w=1600'
WHERE image_url IS NULL AND type = 'CULTURE';

UPDATE public.activities
SET image_url = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600'
WHERE image_url IS NULL AND type = 'SIGHTSEEING';

UPDATE public.activities
SET image_url = 'https://images.unsplash.com/photo-1444384851176-6e23071c6127?q=80&w=1600'
WHERE image_url IS NULL AND type = 'WATER_SPORTS';

UPDATE public.activities
SET image_url = 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=1600'
WHERE image_url IS NULL AND type = 'SKIING';

UPDATE public.activities
SET image_url = 'https://images.unsplash.com/photo-1521685313589-9154a43bba12?q=80&w=1600'
WHERE image_url IS NULL AND type = 'HIKING';

UPDATE public.activities
SET image_url = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1600'
WHERE image_url IS NULL;
