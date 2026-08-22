-- ==============================================================================
-- Migration: 20260819000032_phase26_flora_and_invoices.sql
-- Description: Phase 26 - Norway Plants, Trees & Flora Catalog + Invoices
-- ==============================================================================

-- ── 1. Flora & Botanical Species Table ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.flora_species (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  common_name TEXT NOT NULL,
  norwegian_name TEXT NOT NULL,
  scientific_name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'Trees', 'Alpine', 'Berries', 'Wildflowers', 'Orchids'
  habitat TEXT NOT NULL,
  distribution_region TEXT NOT NULL,
  flowering_season TEXT NOT NULL,
  foraging_status TEXT NOT NULL, -- 'Edible & Forageable', 'Protected - Do Not Pick', 'Medicinal', 'Non-Edible'
  conservation_status TEXT NOT NULL DEFAULT 'Least Concern',
  description TEXT NOT NULL,
  ecological_role TEXT NOT NULL,
  traditional_uses TEXT,
  foraging_tips TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for flora_species
ALTER TABLE public.flora_species ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published flora species" ON public.flora_species;
CREATE POLICY "Public can view published flora species"
  ON public.flora_species FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage flora species" ON public.flora_species;
CREATE POLICY "Admins can manage flora species"
  ON public.flora_species FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND (profiles.role = 'ADMIN' OR profiles.role = 'SUPER_ADMIN')
    )
  );

-- ── 2. Invoices Table ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id TEXT,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_country TEXT DEFAULT 'Norway',
  currency TEXT NOT NULL DEFAULT 'NOK',
  subtotal_amount NUMERIC(10, 2) NOT NULL,
  vat_standard_amount NUMERIC(10, 2) DEFAULT 0, -- 25% MVA
  vat_reduced_amount NUMERIC(10, 2) DEFAULT 0,  -- 12% MVA (Transport/Lodging)
  total_amount NUMERIC(10, 2) NOT NULL,
  payment_method TEXT DEFAULT 'CARD',
  payment_gateway_ref TEXT,
  status TEXT NOT NULL DEFAULT 'PAID', -- 'PAID', 'REFUNDED', 'PENDING'
  invoice_date TIMESTAMPTZ DEFAULT NOW(),
  due_date TIMESTAMPTZ DEFAULT NOW(),
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for invoices
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own invoices" ON public.invoices;
CREATE POLICY "Users can view own invoices"
  ON public.invoices FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all invoices" ON public.invoices;
CREATE POLICY "Admins can manage all invoices"
  ON public.invoices FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND (profiles.role = 'ADMIN' OR profiles.role = 'SUPER_ADMIN')
    )
  );

-- ── 3. Seed Comprehensive Norwegian Flora Data ───────────────────────────────
INSERT INTO public.flora_species (
  slug, common_name, norwegian_name, scientific_name, category, habitat, 
  distribution_region, flowering_season, foraging_status, conservation_status, 
  description, ecological_role, traditional_uses, foraging_tips, image_url
) VALUES
-- 1. Scots Pine
(
  'scots-pine', 'Scots Pine', 'Furu', 'Pinus sylvestris', 'Trees',
  'Boreal coniferous forests and rocky terrain', 'Nationwide, up to 1000m altitude', 'May - June (Pollen)',
  'Edible & Forageable', 'Least Concern',
  'The Scots Pine is the dominant evergreen conifer of the Norwegian taiga, renowned for its reddish-orange upper bark, twisted crown, and resilient timber that has built Stave churches for a millennium.',
  'Provides critical habitat for Western Capercaillie, Pine Martens, and Red Squirrels. Pine needles generate resin-rich forest floors.',
  'Needles used for vitamin C-rich tea by Sami and Norse settlers. Inner bark (furusav) was historically dried and ground into emergency flour.',
  'Harvest tender young green needles in spring for herbal tea. Avoid old bitter needles.',
  'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=scots+pine+norway&w=1080'
),
-- 2. Norway Spruce
(
  'norway-spruce', 'Norway Spruce', 'Gran', 'Picea abies', 'Trees',
  'Deep taiga valleys and moist mountain slopes', 'Eastern Norway, Trøndelag, Central Highlands', 'May - June',
  'Edible & Forageable', 'Least Concern',
  'The quintessential Scandinavian forest giant, growing tall with drooping branchlets and resinous needle scent. Famous globally as the annual Trafalgar Square Christmas tree gifted by Oslo.',
  'Forms dense canopy cover sheltering forest fauna during severe Nordic blizzards. Keystone species of the boreal biome.',
  'Spruce shoot syrup (granskuddsirup) is a beloved Norwegian culinary delicacy paired with wild venison and waffles.',
  'Pick tender neon-green spring shoots in May/June. They have a bright citrus, resinous flavor ideal for infusing honeys and syrups.',
  'https://images.unsplash.com/photo-1448375240586-882707db888b?q=norway+spruce+forest&w=1080'
),
-- 3. Downy Mountain Birch
(
  'downy-birch', 'Mountain Birch', 'Fjellbjørk', 'Betula pubescens czerepanovii', 'Trees',
  'Subalpine tree line and tundra border', 'All mountain ranges, Arctic Circle & Finnmark', 'May - September',
  'Edible & Forageable', 'Least Concern',
  'The hardy, gnarled birch that defines Norway''s alpine treeline. Its white peeling bark and wind-sculpted branches withstand howling sub-zero winter gales.',
  'Pioneer tree species stabilizing alpine scree slopes and feeding Willow Ptarmigan and Reindeer.',
  'Sap tapped in early spring as a sweet tonic. Leaves used for natural yellow textile dyes and purifying herbal infusions.',
  'Tap sap in April as snow melts before leaves bud. Collect young sticky leaves in early June.',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=birch+forest+norway&w=1080'
),
-- 4. European Rowan / Mountain Ash
(
  'european-rowan', 'European Rowan', 'Rogn', 'Sorbus aucuparia', 'Trees',
  'Open woodlands, cliff edges, fjord hillsides', 'Nationwide, from sea level to mountain cliffs', 'May - June (Berries: Aug - Oct)',
  'Edible & Forageable', 'Least Concern',
  'A sacred tree in Norse mythology known for its creamy summer blossom clusters and fiery scarlet autumn berry bundles that illuminate the Norwegian landscape.',
  'Essential winter survival fruit for Waxwings, Fieldfares, and migratory thrushes.',
  'Berries made into traditional Rowanberry Jelly (rognebærgelé), rich in pectin and vitamin C, paired with reindeer roast.',
  'Best harvested after the first autumn frost, which softens the astringent bitterness and concentrates natural sugars.',
  'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=rowan+berries+autumn&w=1080'
),
-- 5. Cloudberry (Arctic Gold)
(
  'cloudberry', 'Cloudberry', 'Molte', 'Rubus chamaemorus', 'Berries',
  'Arctic peat bogs, sphagnum moss mires, alpine tundra', 'Northern Norway, Finnmark, Dovrefjell, Hardangervidda', 'June (Berries: July - August)',
  'Edible & Forageable', 'Least Concern',
  'Revered across Scandinavia as "Arctic Gold", the cloudberry is an amber-orange jewel that grows singularly on delicate low creeping plants in remote peat bogs.',
  'Provides high-energy nutrition to Arctic migratory birds and voles before the onset of winter.',
  'Served as the centerpiece Norwegian Christmas dessert "Multekrem" (whipped cream with fresh cloudberries and sugar).',
  'Look for translucent golden-apricot berries that slip easily off their calyx. Hard red berries are unripe.',
  'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=cloudberries+norway&w=1080'
),
-- 6. Lingonberry / Cowberry
(
  'lingonberry', 'Lingonberry', 'Tyttebær', 'Vaccinium vitis-idaea', 'Berries',
  'Dry pine forests, heathlands, and mossy mountain crags', 'Nationwide, abundant in coniferous forests', 'June - July (Berries: Aug - Oct)',
  'Edible & Forageable', 'Least Concern',
  'A low evergreen dwarf shrub with glossy leathery leaves and tart, ruby-red berries that cling to the plant through early snows.',
  'Primary late-autumn foraging food for Brown Bears, Moose, and forest birds.',
  'Stirred raw with sugar into "Rørte tyttebær", the indispensable companion to traditional Norwegian meatballs (*Kjøttkaker*) and game meats.',
  'Abundant everywhere under Allemannsretten. Easy to pick in late August with a traditional berry-picker comb.',
  'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?q=lingonberries+forest&w=1080'
),
-- 7. European Bilberry / Wild Arctic Blueberry
(
  'bilberry', 'Wild Bilberry', 'Blåbær', 'Vaccinium myrtillus', 'Berries',
  'Moist acidic forest floors and mountain slopes', 'Nationwide, from south coast to 1200m altitude', 'May - June (Berries: July - Sept)',
  'Edible & Forageable', 'Least Concern',
  'Unlike cultivated blueberries, wild Norwegian bilberries have intense blue-black skins and deeply pigmented violet-red flesh brimming with anthocyanin antioxidants.',
  'Keystone understory plant supporting bumblebees in spring and wood grouse in summer.',
  'Eaten fresh with cold whole milk, baked into summer tarts, or preserved as rich blueberry jam.',
  'Pick throughout late July and August. Clean in water to remove pine needles.',
  'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?q=wild+blueberries+norway&w=1080'
),
-- 8. Glacier Buttercup
(
  'glacier-buttercup', 'Glacier Buttercup', 'Issoleie', 'Ranunculus glacialis', 'Alpine',
  'Glacial moraines, alpine snowbeds, high summits', 'Jotunheimen, Dovrefjell, High Arctic Svalbard', 'July - August',
  'Protected - Do Not Pick', 'Least Concern',
  'The highest-altitude flowering plant in northern Europe, blooming directly against permanent ice fields at over 2,300 meters on Galdhøpiggen. Flowers start white and turn pinkish-purple as they are pollinated.',
  'Produces antifreeze proteins allowing its cells to survive freezing nightly summer blizzards.',
  'Symbol of alpine resilience and high-mountain Norwegian mountaineering heritage.',
  'Strictly observe Leave No Trace principles; alpine tundra plants take decades to recover from trampling.',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=alpine+flower+glacier&w=1080'
),
-- 9. Mountain Avens / White Dryas
(
  'mountain-avens', 'Mountain Avens', 'Reinrose', 'Dryas octopetala', 'Alpine',
  'Dry limestone mountain heaths and Arctic tundra ridges', 'Dovrefjell, Jotunheimen, Troms, Svalbard', 'June - July',
  'Protected - Do Not Pick', 'Least Concern',
  'An Arctic-alpine evergreen dwarf shrub with eight-petaled pure white blossoms that track the midnight sun across the sky to focus heat into their central pistils.',
  'Fixes atmospheric nitrogen in barren limestone soils, creating fertile footholds for other alpine flora.',
  'Official county flower of historic Oppland; famous paleoclimatological marker of ancient Younger Dryas ice age epoch.',
  'Look for circular blooming mats on sun-exposed rocky limestone outcrops.',
  'https://images.unsplash.com/photo-1508873696983-2df5293cb325?q=mountain+avens+flower&w=1080'
),
-- 10. Purple Saxifrage
(
  'purple-saxifrage', 'Purple Saxifrage', 'Rødsildre', 'Saxifraga oppositifolia', 'Alpine',
  'High Arctic tundra, screes, gravelly snowbeds', 'Svalbard, Northern Norway, Jotunheimen summits', 'June - July',
  'Protected - Do Not Pick', 'Least Concern',
  'The earliest blooming flower of the high Arctic spring, bursting into vivid carpets of crimson-purple blossoms while surrounding rocks are still encased in winter frost.',
  'Adapted to extreme wind shear by growing in dense cushion mats that trap solar warmth.',
  'Chewed by Arctic indigenous hunters for its sweet, nectar-rich petals during early spring expeditions.',
  'Common in Svalbard and high plateaus; do not pick roots or step on fragile cushion mats.',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=purple+saxifrage+arctic&w=1080'
),
-- 11. Lady''s Slipper Orchid
(
  'ladys-slipper', 'Lady''s Slipper Orchid', 'Marisko', 'Cypripedium calceolus', 'Orchids',
  'Calcareous beech and pine forests, marshy woodland clearings', 'Eastern Norway (Ringerike, Snåsa), Trøndelag, Nordland', 'Late May - June',
  'Protected - Do Not Pick', 'Vulnerable (Strictly Protected)',
  'Norway''s largest and most flamboyant wild orchid, featuring an inflated golden-yellow slipper pouch framed by four twisted maroon-purple sepals. It operates a complex one-way trap pollination mechanism for solitary mining bees.',
  'Highly specialized mycorrhizal symbiosis with soil fungi required for germination.',
  'Crown jewel of Norwegian botanical photography. Completely protected by law under the Nature Diversity Act.',
  'Strictly protected under Norwegian law. Photograph from designated boardwalks; touching or digging up is illegal.',
  'https://images.unsplash.com/photo-1563245372-f21724e3856d?q=yellow+wild+orchid&w=1080'
),
-- 12. Moss Campion
(
  'moss-campion', 'Moss Campion', 'Fjellsmelle', 'Silene acaulis', 'Alpine',
  'Exposed mountain ridges, Arctic gravel terraces', 'Jotunheimen, Rondane, Lofoten peaks, Svalbard', 'June - August',
  'Protected - Do Not Pick', 'Least Concern',
  'Forms striking, dense hemisphere cushions studded with hundreds of star-shaped bright pink blossoms. Acts as a natural mountain compass, blooming first on its south-facing side.',
  'Long taproot anchors deeply into fractured bedrock, stabilizing fragile mountain summits.',
  'Used traditionally by hikers as a natural sun-facing directional indicator on fog-covered plateaus.',
  'Admire the compact pink cushions clinging to windswept granite crags.',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=pink+moss+campion+norway&w=1080'
)
ON CONFLICT (slug) DO UPDATE SET
  common_name = EXCLUDED.common_name,
  norwegian_name = EXCLUDED.norwegian_name,
  scientific_name = EXCLUDED.scientific_name,
  category = EXCLUDED.category,
  habitat = EXCLUDED.habitat,
  distribution_region = EXCLUDED.distribution_region,
  flowering_season = EXCLUDED.flowering_season,
  foraging_status = EXCLUDED.foraging_status,
  conservation_status = EXCLUDED.conservation_status,
  description = EXCLUDED.description,
  ecological_role = EXCLUDED.ecological_role,
  traditional_uses = EXCLUDED.traditional_uses,
  foraging_tips = EXCLUDED.foraging_tips,
  image_url = EXCLUDED.image_url,
  updated_at = NOW();
