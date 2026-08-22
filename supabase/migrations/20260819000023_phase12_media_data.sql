-- Phase 12: Content Media Mappings


INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'HERO', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Trysil%2C_Norges_st%C3%B8rste_skisted.jpg/1280px-Trysil%2C_Norges_st%C3%B8rste_skisted.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Trysil Hero', 'Wikimedia Commons', 1
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Trysil';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'THUMBNAIL', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Trysil%2C_Norges_st%C3%B8rste_skisted.jpg/1280px-Trysil%2C_Norges_st%C3%B8rste_skisted.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Trysil Thumbnail', 'Wikimedia Commons', 2
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Trysil';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'GALLERY', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Trysil%2C_Norges_st%C3%B8rste_skisted.jpg/1280px-Trysil%2C_Norges_st%C3%B8rste_skisted.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Trysil Gallery Image', 'Wikimedia Commons', 3
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Trysil';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'HERO', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Hydnefossen3.jpg/1280px-Hydnefossen3.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Hemsedal Hero', 'Wikimedia Commons', 1
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Hemsedal';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'THUMBNAIL', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Hydnefossen3.jpg/1280px-Hydnefossen3.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Hemsedal Thumbnail', 'Wikimedia Commons', 2
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Hemsedal';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'GALLERY', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Hydnefossen3.jpg/1280px-Hydnefossen3.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Hemsedal Gallery Image', 'Wikimedia Commons', 3
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Hemsedal';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'HERO', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Hafjell.jpg/1280px-Hafjell.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Hafjell Hero', 'Wikimedia Commons', 1
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Hafjell';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'THUMBNAIL', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Hafjell.jpg/1280px-Hafjell.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Hafjell Thumbnail', 'Wikimedia Commons', 2
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Hafjell';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'GALLERY', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Hafjell.jpg/1280px-Hafjell.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Hafjell Gallery Image', 'Wikimedia Commons', 3
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Hafjell';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'HERO', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Kvitfjell_over_M%C3%A6lum.jpg/1280px-Kvitfjell_over_M%C3%A6lum.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Kvitfjell Hero', 'Wikimedia Commons', 1
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Kvitfjell';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'THUMBNAIL', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Kvitfjell_over_M%C3%A6lum.jpg/1280px-Kvitfjell_over_M%C3%A6lum.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Kvitfjell Thumbnail', 'Wikimedia Commons', 2
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Kvitfjell';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'GALLERY', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Kvitfjell_over_M%C3%A6lum.jpg/1280px-Kvitfjell_over_M%C3%A6lum.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Kvitfjell Gallery Image', 'Wikimedia Commons', 3
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Kvitfjell';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'HERO', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Geilo Hero', 'Unsplash Fallback', 1
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Geilo';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Geilo Thumbnail', 'Unsplash Fallback', 2
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Geilo';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'GALLERY', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Geilo Gallery Image', 'Unsplash Fallback', 3
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Geilo';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'HERO', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/OppdalFromAlmannberget.jpg/1280px-OppdalFromAlmannberget.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Oppdal Hero', 'Wikimedia Commons', 1
FROM public.locations WHERE slug = 'oppdal';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'THUMBNAIL', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/OppdalFromAlmannberget.jpg/1280px-OppdalFromAlmannberget.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Oppdal Thumbnail', 'Wikimedia Commons', 2
FROM public.locations WHERE slug = 'oppdal';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'GALLERY', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/OppdalFromAlmannberget.jpg/1280px-OppdalFromAlmannberget.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Oppdal Gallery Image', 'Wikimedia Commons', 3
FROM public.locations WHERE slug = 'oppdal';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'HERO', 'https://upload.wikimedia.org/wikipedia/commons/6/6c/VossNorway2005.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'Voss Hero', 'Wikimedia Commons', 1
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Voss';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'THUMBNAIL', 'https://upload.wikimedia.org/wikipedia/commons/6/6c/VossNorway2005.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'Voss Thumbnail', 'Wikimedia Commons', 2
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Voss';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'GALLERY', 'https://upload.wikimedia.org/wikipedia/commons/6/6c/VossNorway2005.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'Voss Gallery Image', 'Wikimedia Commons', 3
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Voss';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'HERO', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Myrkdalen Hero', 'Unsplash Fallback', 1
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Myrkdalen';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Myrkdalen Thumbnail', 'Unsplash Fallback', 2
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Myrkdalen';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'GALLERY', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Myrkdalen Gallery Image', 'Unsplash Fallback', 3
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Myrkdalen';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'HERO', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Narvikfjellet Hero', 'Unsplash Fallback', 1
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Narvikfjellet';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Narvikfjellet Thumbnail', 'Unsplash Fallback', 2
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Narvikfjellet';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'GALLERY', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Narvikfjellet Gallery Image', 'Unsplash Fallback', 3
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Narvikfjellet';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'HERO', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/IMG_1060a_-_Mot_Malnesberget_ved_Hovden.jpg/1280px-IMG_1060a_-_Mot_Malnesberget_ved_Hovden.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Hovden Hero', 'Wikimedia Commons', 1
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Hovden';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'THUMBNAIL', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/IMG_1060a_-_Mot_Malnesberget_ved_Hovden.jpg/1280px-IMG_1060a_-_Mot_Malnesberget_ved_Hovden.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Hovden Thumbnail', 'Wikimedia Commons', 2
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Hovden';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'GALLERY', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/IMG_1060a_-_Mot_Malnesberget_ved_Hovden.jpg/1280px-IMG_1060a_-_Mot_Malnesberget_ved_Hovden.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Hovden Gallery Image', 'Wikimedia Commons', 3
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Hovden';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'HERO', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Norefjell Hero', 'Unsplash Fallback', 1
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Norefjell';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Norefjell Thumbnail', 'Unsplash Fallback', 2
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Norefjell';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'GALLERY', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Norefjell Gallery Image', 'Unsplash Fallback', 3
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Norefjell';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'HERO', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Beitostølen Hero', 'Unsplash Fallback', 1
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Beitostølen';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Beitostølen Thumbnail', 'Unsplash Fallback', 2
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Beitostølen';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'GALLERY', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Beitostølen Gallery Image', 'Unsplash Fallback', 3
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Beitostølen';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'HERO', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Gaustablikk Hero', 'Unsplash Fallback', 1
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Gaustablikk';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Gaustablikk Thumbnail', 'Unsplash Fallback', 2
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Gaustablikk';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'GALLERY', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Gaustablikk Gallery Image', 'Unsplash Fallback', 3
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Gaustablikk';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'HERO', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Skeikampen Hero', 'Unsplash Fallback', 1
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Skeikampen';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Skeikampen Thumbnail', 'Unsplash Fallback', 2
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Skeikampen';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'GALLERY', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Skeikampen Gallery Image', 'Unsplash Fallback', 3
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Skeikampen';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'HERO', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Røldal Hero', 'Unsplash Fallback', 1
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Røldal';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Røldal Thumbnail', 'Unsplash Fallback', 2
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Røldal';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'GALLERY', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Røldal Gallery Image', 'Unsplash Fallback', 3
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Røldal';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'HERO', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Kongsberg Hero', 'Unsplash Fallback', 1
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Kongsberg';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Kongsberg Thumbnail', 'Unsplash Fallback', 2
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Kongsberg';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'GALLERY', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Kongsberg Gallery Image', 'Unsplash Fallback', 3
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Kongsberg';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'HERO', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Strandafjellet Hero', 'Unsplash Fallback', 1
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Strandafjellet';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Strandafjellet Thumbnail', 'Unsplash Fallback', 2
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Strandafjellet';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'GALLERY', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Strandafjellet Gallery Image', 'Unsplash Fallback', 3
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Strandafjellet';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'HERO', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Sirdal Hero', 'Unsplash Fallback', 1
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Sirdal';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Sirdal Thumbnail', 'Unsplash Fallback', 2
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Sirdal';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'GALLERY', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Sirdal Gallery Image', 'Unsplash Fallback', 3
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Sirdal';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'HERO', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Tromsø Alpinpark Hero', 'Unsplash Fallback', 1
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Tromsø Alpinpark';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Tromsø Alpinpark Thumbnail', 'Unsplash Fallback', 2
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Tromsø Alpinpark';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'GALLERY', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Tromsø Alpinpark Gallery Image', 'Unsplash Fallback', 3
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Tromsø Alpinpark';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'HERO', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Vrådal Hero', 'Unsplash Fallback', 1
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Vrådal';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Vrådal Thumbnail', 'Unsplash Fallback', 2
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Vrådal';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'GALLERY', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Vrådal Gallery Image', 'Unsplash Fallback', 3
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Vrådal';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'HERO', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Stryn Sommerski Hero', 'Unsplash Fallback', 1
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Stryn Sommerski';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Stryn Sommerski Thumbnail', 'Unsplash Fallback', 2
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Stryn Sommerski';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'GALLERY', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Stryn Sommerski Gallery Image', 'Unsplash Fallback', 3
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Stryn Sommerski';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'HERO', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Bjorli Hero', 'Unsplash Fallback', 1
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Bjorli';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Bjorli Thumbnail', 'Unsplash Fallback', 2
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Bjorli';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'GALLERY', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Bjorli Gallery Image', 'Unsplash Fallback', 3
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Bjorli';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'HERO', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Gålå Hero', 'Unsplash Fallback', 1
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Gålå';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Gålå Thumbnail', 'Unsplash Fallback', 2
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Gålå';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'GALLERY', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Gålå Gallery Image', 'Unsplash Fallback', 3
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Gålå';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'HERO', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Oslo Vinterpark Hero', 'Unsplash Fallback', 1
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Oslo Vinterpark';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Oslo Vinterpark Thumbnail', 'Unsplash Fallback', 2
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Oslo Vinterpark';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'GALLERY', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Oslo Vinterpark Gallery Image', 'Unsplash Fallback', 3
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Oslo Vinterpark';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'HERO', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Rauland Hero', 'Unsplash Fallback', 1
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Rauland';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Rauland Thumbnail', 'Unsplash Fallback', 2
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Rauland';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'ski_resorts', s.id, 'GALLERY', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Rauland Gallery Image', 'Unsplash Fallback', 3
FROM public.ski_resorts s JOIN public.locations l ON s.location_id = l.id WHERE l.name = 'Rauland';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'HERO', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Atlantic Ocean Road Hero', 'Unsplash Fallback', 1
FROM public.road_trips WHERE name = 'Atlantic Ocean Road';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Atlantic Ocean Road Thumbnail', 'Unsplash Fallback', 2
FROM public.road_trips WHERE name = 'Atlantic Ocean Road';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'GALLERY', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Atlantic Ocean Road Gallery Image', 'Unsplash Fallback', 3
FROM public.road_trips WHERE name = 'Atlantic Ocean Road';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'HERO', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Trollstigen Hero', 'Unsplash Fallback', 1
FROM public.road_trips WHERE name = 'Trollstigen';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Trollstigen Thumbnail', 'Unsplash Fallback', 2
FROM public.road_trips WHERE name = 'Trollstigen';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'GALLERY', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Trollstigen Gallery Image', 'Unsplash Fallback', 3
FROM public.road_trips WHERE name = 'Trollstigen';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'HERO', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Lofoten Scenic Route Hero', 'Unsplash Fallback', 1
FROM public.road_trips WHERE name = 'Lofoten Scenic Route';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Lofoten Scenic Route Thumbnail', 'Unsplash Fallback', 2
FROM public.road_trips WHERE name = 'Lofoten Scenic Route';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'GALLERY', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Lofoten Scenic Route Gallery Image', 'Unsplash Fallback', 3
FROM public.road_trips WHERE name = 'Lofoten Scenic Route';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'HERO', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Seven-Sisters-2018.jpg/1280px-Seven-Sisters-2018.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Helgeland Coast Hero', 'Wikimedia Commons', 1
FROM public.road_trips WHERE name = 'Helgeland Coast';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'THUMBNAIL', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Seven-Sisters-2018.jpg/1280px-Seven-Sisters-2018.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Helgeland Coast Thumbnail', 'Wikimedia Commons', 2
FROM public.road_trips WHERE name = 'Helgeland Coast';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'GALLERY', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Seven-Sisters-2018.jpg/1280px-Seven-Sisters-2018.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Helgeland Coast Gallery Image', 'Wikimedia Commons', 3
FROM public.road_trips WHERE name = 'Helgeland Coast';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'HERO', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/S%C3%B6rreisa_Lenvik_IMG_4917_senja_solbergfjorden_reisfjorden.JPG/1280px-S%C3%B6rreisa_Lenvik_IMG_4917_senja_solbergfjorden_reisfjorden.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Senja Hero', 'Wikimedia Commons', 1
FROM public.road_trips WHERE name = 'Senja';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'THUMBNAIL', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/S%C3%B6rreisa_Lenvik_IMG_4917_senja_solbergfjorden_reisfjorden.JPG/1280px-S%C3%B6rreisa_Lenvik_IMG_4917_senja_solbergfjorden_reisfjorden.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Senja Thumbnail', 'Wikimedia Commons', 2
FROM public.road_trips WHERE name = 'Senja';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'GALLERY', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/S%C3%B6rreisa_Lenvik_IMG_4917_senja_solbergfjorden_reisfjorden.JPG/1280px-S%C3%B6rreisa_Lenvik_IMG_4917_senja_solbergfjorden_reisfjorden.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Senja Gallery Image', 'Wikimedia Commons', 3
FROM public.road_trips WHERE name = 'Senja';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'HERO', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Hardanger_Fiddle_-_St_Cecilia%27s_Hall.webm/1280px--Hardanger_Fiddle_-_St_Cecilia%27s_Hall.webm.jpg', 'Hardanger Hero', 'Wikimedia Commons', 1
FROM public.road_trips WHERE name = 'Hardanger';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'THUMBNAIL', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Hardanger_Fiddle_-_St_Cecilia%27s_Hall.webm/1280px--Hardanger_Fiddle_-_St_Cecilia%27s_Hall.webm.jpg', 'Hardanger Thumbnail', 'Wikimedia Commons', 2
FROM public.road_trips WHERE name = 'Hardanger';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'GALLERY', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Hardanger_Fiddle_-_St_Cecilia%27s_Hall.webm/1280px--Hardanger_Fiddle_-_St_Cecilia%27s_Hall.webm.jpg', 'Hardanger Gallery Image', 'Wikimedia Commons', 3
FROM public.road_trips WHERE name = 'Hardanger';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'HERO', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/P1000439SneeuwwegLaerdalAurland.JPG/1280px-P1000439SneeuwwegLaerdalAurland.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Aurlandsfjellet Hero', 'Wikimedia Commons', 1
FROM public.road_trips WHERE name = 'Aurlandsfjellet';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'THUMBNAIL', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/P1000439SneeuwwegLaerdalAurland.JPG/1280px-P1000439SneeuwwegLaerdalAurland.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Aurlandsfjellet Thumbnail', 'Wikimedia Commons', 2
FROM public.road_trips WHERE name = 'Aurlandsfjellet';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'GALLERY', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/P1000439SneeuwwegLaerdalAurland.JPG/1280px-P1000439SneeuwwegLaerdalAurland.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Aurlandsfjellet Gallery Image', 'Wikimedia Commons', 3
FROM public.road_trips WHERE name = 'Aurlandsfjellet';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'HERO', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/A_view_from_Riksveg_55_at_Sognefjellet.jpg/1280px-A_view_from_Riksveg_55_at_Sognefjellet.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Sognefjellet Hero', 'Wikimedia Commons', 1
FROM public.road_trips WHERE name = 'Sognefjellet';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'THUMBNAIL', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/A_view_from_Riksveg_55_at_Sognefjellet.jpg/1280px-A_view_from_Riksveg_55_at_Sognefjellet.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Sognefjellet Thumbnail', 'Wikimedia Commons', 2
FROM public.road_trips WHERE name = 'Sognefjellet';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'GALLERY', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/A_view_from_Riksveg_55_at_Sognefjellet.jpg/1280px-A_view_from_Riksveg_55_at_Sognefjellet.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Sognefjellet Gallery Image', 'Wikimedia Commons', 3
FROM public.road_trips WHERE name = 'Sognefjellet';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'HERO', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Valdresflye.jpg/1280px-Valdresflye.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Valdresflye Hero', 'Wikimedia Commons', 1
FROM public.road_trips WHERE name = 'Valdresflye';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'THUMBNAIL', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Valdresflye.jpg/1280px-Valdresflye.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Valdresflye Thumbnail', 'Wikimedia Commons', 2
FROM public.road_trips WHERE name = 'Valdresflye';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'GALLERY', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Valdresflye.jpg/1280px-Valdresflye.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Valdresflye Gallery Image', 'Wikimedia Commons', 3
FROM public.road_trips WHERE name = 'Valdresflye';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'HERO', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Rondane.jpg/1280px-Rondane.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Rondane Hero', 'Wikimedia Commons', 1
FROM public.road_trips WHERE name = 'Rondane';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'THUMBNAIL', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Rondane.jpg/1280px-Rondane.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Rondane Thumbnail', 'Wikimedia Commons', 2
FROM public.road_trips WHERE name = 'Rondane';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'GALLERY', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Rondane.jpg/1280px-Rondane.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Rondane Gallery Image', 'Wikimedia Commons', 3
FROM public.road_trips WHERE name = 'Rondane';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'HERO', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Loc_Rv258.svg/1280px-Loc_Rv258.svg.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Gamle Strynefjellsvegen Hero', 'Wikimedia Commons', 1
FROM public.road_trips WHERE name = 'Gamle Strynefjellsvegen';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'THUMBNAIL', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Loc_Rv258.svg/1280px-Loc_Rv258.svg.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Gamle Strynefjellsvegen Thumbnail', 'Wikimedia Commons', 2
FROM public.road_trips WHERE name = 'Gamle Strynefjellsvegen';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'GALLERY', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Loc_Rv258.svg/1280px-Loc_Rv258.svg.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Gamle Strynefjellsvegen Gallery Image', 'Wikimedia Commons', 3
FROM public.road_trips WHERE name = 'Gamle Strynefjellsvegen';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'HERO', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Lysebotn_Lysefjord_2004_2.jpg/1280px-Lysebotn_Lysefjord_2004_2.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Ryfylke Hero', 'Wikimedia Commons', 1
FROM public.road_trips WHERE name = 'Ryfylke';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'THUMBNAIL', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Lysebotn_Lysefjord_2004_2.jpg/1280px-Lysebotn_Lysefjord_2004_2.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Ryfylke Thumbnail', 'Wikimedia Commons', 2
FROM public.road_trips WHERE name = 'Ryfylke';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'GALLERY', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Lysebotn_Lysefjord_2004_2.jpg/1280px-Lysebotn_Lysefjord_2004_2.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Ryfylke Gallery Image', 'Wikimedia Commons', 3
FROM public.road_trips WHERE name = 'Ryfylke';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'HERO', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Orrestranda.jpg/1280px-Orrestranda.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Jæren Hero', 'Wikimedia Commons', 1
FROM public.road_trips WHERE name = 'Jæren';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'THUMBNAIL', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Orrestranda.jpg/1280px-Orrestranda.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Jæren Thumbnail', 'Wikimedia Commons', 2
FROM public.road_trips WHERE name = 'Jæren';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'GALLERY', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Orrestranda.jpg/1280px-Orrestranda.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Jæren Gallery Image', 'Wikimedia Commons', 3
FROM public.road_trips WHERE name = 'Jæren';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'HERO', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Andøya Hero', 'Unsplash Fallback', 1
FROM public.locations WHERE slug = 'andoya';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Andøya Thumbnail', 'Unsplash Fallback', 2
FROM public.locations WHERE slug = 'andoya';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'GALLERY', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Andøya Gallery Image', 'Unsplash Fallback', 3
FROM public.locations WHERE slug = 'andoya';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'HERO', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Varanger Hero', 'Unsplash Fallback', 1
FROM public.road_trips WHERE name = 'Varanger';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Varanger Thumbnail', 'Unsplash Fallback', 2
FROM public.road_trips WHERE name = 'Varanger';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'GALLERY', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Varanger Gallery Image', 'Unsplash Fallback', 3
FROM public.road_trips WHERE name = 'Varanger';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'HERO', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Gaularfjellet Hero', 'Unsplash Fallback', 1
FROM public.road_trips WHERE name = 'Gaularfjellet';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Gaularfjellet Thumbnail', 'Unsplash Fallback', 2
FROM public.road_trips WHERE name = 'Gaularfjellet';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'GALLERY', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Gaularfjellet Gallery Image', 'Unsplash Fallback', 3
FROM public.road_trips WHERE name = 'Gaularfjellet';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'HERO', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Geiranger–Trollstigen Hero', 'Unsplash Fallback', 1
FROM public.road_trips WHERE name = 'Geiranger–Trollstigen';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Geiranger–Trollstigen Thumbnail', 'Unsplash Fallback', 2
FROM public.road_trips WHERE name = 'Geiranger–Trollstigen';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'GALLERY', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Geiranger–Trollstigen Gallery Image', 'Unsplash Fallback', 3
FROM public.road_trips WHERE name = 'Geiranger–Trollstigen';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'HERO', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Nordkapp Route Hero', 'Unsplash Fallback', 1
FROM public.road_trips WHERE name = 'Nordkapp Route';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Nordkapp Route Thumbnail', 'Unsplash Fallback', 2
FROM public.road_trips WHERE name = 'Nordkapp Route';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'GALLERY', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Nordkapp Route Gallery Image', 'Unsplash Fallback', 3
FROM public.road_trips WHERE name = 'Nordkapp Route';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'HERO', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Lyngenfjord Coastal Drive Hero', 'Unsplash Fallback', 1
FROM public.road_trips WHERE name = 'Lyngenfjord Coastal Drive';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Lyngenfjord Coastal Drive Thumbnail', 'Unsplash Fallback', 2
FROM public.road_trips WHERE name = 'Lyngenfjord Coastal Drive';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'GALLERY', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Lyngenfjord Coastal Drive Gallery Image', 'Unsplash Fallback', 3
FROM public.road_trips WHERE name = 'Lyngenfjord Coastal Drive';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'HERO', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Sogn og Fjordane Explorer Hero', 'Unsplash Fallback', 1
FROM public.road_trips WHERE name = 'Sogn og Fjordane Explorer';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Sogn og Fjordane Explorer Thumbnail', 'Unsplash Fallback', 2
FROM public.road_trips WHERE name = 'Sogn og Fjordane Explorer';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'road_trips', id, 'GALLERY', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Sogn og Fjordane Explorer Gallery Image', 'Unsplash Fallback', 3
FROM public.road_trips WHERE name = 'Sogn og Fjordane Explorer';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'HERO', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Alta Hero', 'Unsplash Fallback', 1
FROM public.locations WHERE slug = 'alta';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Alta Thumbnail', 'Unsplash Fallback', 2
FROM public.locations WHERE slug = 'alta';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'GALLERY', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Alta Gallery Image', 'Unsplash Fallback', 3
FROM public.locations WHERE slug = 'alta';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'HERO', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Kirkenes Hero', 'Unsplash Fallback', 1
FROM public.locations WHERE slug = 'kirkenes';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Kirkenes Thumbnail', 'Unsplash Fallback', 2
FROM public.locations WHERE slug = 'kirkenes';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'GALLERY', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Kirkenes Gallery Image', 'Unsplash Fallback', 3
FROM public.locations WHERE slug = 'kirkenes';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'HERO', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Svalbard Hero', 'Unsplash Fallback', 1
FROM public.locations WHERE slug = 'svalbard';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Svalbard Thumbnail', 'Unsplash Fallback', 2
FROM public.locations WHERE slug = 'svalbard';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'GALLERY', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Svalbard Gallery Image', 'Unsplash Fallback', 3
FROM public.locations WHERE slug = 'svalbard';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'HERO', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Lofoten Hero', 'Unsplash Fallback', 1
FROM public.locations WHERE slug = 'lofoten';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Lofoten Thumbnail', 'Unsplash Fallback', 2
FROM public.locations WHERE slug = 'lofoten';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'GALLERY', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Lofoten Gallery Image', 'Unsplash Fallback', 3
FROM public.locations WHERE slug = 'lofoten';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'HERO', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Vesterålen Hero', 'Unsplash Fallback', 1
FROM public.locations WHERE slug = 'vesteralen';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Vesterålen Thumbnail', 'Unsplash Fallback', 2
FROM public.locations WHERE slug = 'vesteralen';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'GALLERY', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Vesterålen Gallery Image', 'Unsplash Fallback', 3
FROM public.locations WHERE slug = 'vesteralen';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'HERO', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Narvik Hero', 'Unsplash Fallback', 1
FROM public.locations WHERE slug = 'narvik';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Narvik Thumbnail', 'Unsplash Fallback', 2
FROM public.locations WHERE slug = 'narvik';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'GALLERY', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Narvik Gallery Image', 'Unsplash Fallback', 3
FROM public.locations WHERE slug = 'narvik';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'HERO', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Bodø Hero', 'Unsplash Fallback', 1
FROM public.locations WHERE slug = 'bodo';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Bodø Thumbnail', 'Unsplash Fallback', 2
FROM public.locations WHERE slug = 'bodo';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'GALLERY', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Bodø Gallery Image', 'Unsplash Fallback', 3
FROM public.locations WHERE slug = 'bodo';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'HERO', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Lyngen Hero', 'Unsplash Fallback', 1
FROM public.locations WHERE slug = 'lyngen';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Lyngen Thumbnail', 'Unsplash Fallback', 2
FROM public.locations WHERE slug = 'lyngen';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'GALLERY', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Lyngen Gallery Image', 'Unsplash Fallback', 3
FROM public.locations WHERE slug = 'lyngen';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'HERO', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Hammerfest Hero', 'Unsplash Fallback', 1
FROM public.locations WHERE slug = 'hammerfest';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Hammerfest Thumbnail', 'Unsplash Fallback', 2
FROM public.locations WHERE slug = 'hammerfest';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'GALLERY', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Hammerfest Gallery Image', 'Unsplash Fallback', 3
FROM public.locations WHERE slug = 'hammerfest';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'HERO', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Nordkapp Hero', 'Unsplash Fallback', 1
FROM public.locations WHERE slug = 'nordkapp';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Nordkapp Thumbnail', 'Unsplash Fallback', 2
FROM public.locations WHERE slug = 'nordkapp';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'GALLERY', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Nordkapp Gallery Image', 'Unsplash Fallback', 3
FROM public.locations WHERE slug = 'nordkapp';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'HERO', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Kautokeino Hero', 'Unsplash Fallback', 1
FROM public.locations WHERE slug = 'kautokeino';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Kautokeino Thumbnail', 'Unsplash Fallback', 2
FROM public.locations WHERE slug = 'kautokeino';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'GALLERY', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Kautokeino Gallery Image', 'Unsplash Fallback', 3
FROM public.locations WHERE slug = 'kautokeino';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'HERO', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Karasjok Hero', 'Unsplash Fallback', 1
FROM public.locations WHERE slug = 'karasjok';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Karasjok Thumbnail', 'Unsplash Fallback', 2
FROM public.locations WHERE slug = 'karasjok';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'GALLERY', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Karasjok Gallery Image', 'Unsplash Fallback', 3
FROM public.locations WHERE slug = 'karasjok';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'transport_routes', id, 'HERO', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Oslo–Bergen Railway Hero', 'Unsplash Fallback', 1
FROM public.transport_routes WHERE name = 'Oslo–Bergen Railway';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'transport_routes', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Oslo–Bergen Railway Thumbnail', 'Unsplash Fallback', 2
FROM public.transport_routes WHERE name = 'Oslo–Bergen Railway';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'transport_routes', id, 'GALLERY', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Oslo–Bergen Railway Gallery Image', 'Unsplash Fallback', 3
FROM public.transport_routes WHERE name = 'Oslo–Bergen Railway';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'transport_routes', id, 'HERO', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Flåm Railway Hero', 'Unsplash Fallback', 1
FROM public.transport_routes WHERE name = 'Flåm Railway';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'transport_routes', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Flåm Railway Thumbnail', 'Unsplash Fallback', 2
FROM public.transport_routes WHERE name = 'Flåm Railway';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'transport_routes', id, 'GALLERY', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Flåm Railway Gallery Image', 'Unsplash Fallback', 3
FROM public.transport_routes WHERE name = 'Flåm Railway';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'transport_routes', id, 'HERO', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Raumabanen Hero', 'Unsplash Fallback', 1
FROM public.transport_routes WHERE name = 'Raumabanen';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'transport_routes', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Raumabanen Thumbnail', 'Unsplash Fallback', 2
FROM public.transport_routes WHERE name = 'Raumabanen';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'transport_routes', id, 'GALLERY', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Raumabanen Gallery Image', 'Unsplash Fallback', 3
FROM public.transport_routes WHERE name = 'Raumabanen';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'transport_routes', id, 'HERO', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Nordland Railway Hero', 'Unsplash Fallback', 1
FROM public.transport_routes WHERE name = 'Nordland Railway';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'transport_routes', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Nordland Railway Thumbnail', 'Unsplash Fallback', 2
FROM public.transport_routes WHERE name = 'Nordland Railway';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'transport_routes', id, 'GALLERY', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Nordland Railway Gallery Image', 'Unsplash Fallback', 3
FROM public.transport_routes WHERE name = 'Nordland Railway';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'transport_routes', id, 'HERO', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Hurtigruten Coastal Route Hero', 'Unsplash Fallback', 1
FROM public.transport_routes WHERE name = 'Hurtigruten Coastal Route';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'transport_routes', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Hurtigruten Coastal Route Thumbnail', 'Unsplash Fallback', 2
FROM public.transport_routes WHERE name = 'Hurtigruten Coastal Route';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'transport_routes', id, 'GALLERY', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Hurtigruten Coastal Route Gallery Image', 'Unsplash Fallback', 3
FROM public.transport_routes WHERE name = 'Hurtigruten Coastal Route';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'transport_routes', id, 'HERO', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Havila Coastal Route Hero', 'Unsplash Fallback', 1
FROM public.transport_routes WHERE name = 'Havila Coastal Route';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'transport_routes', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Havila Coastal Route Thumbnail', 'Unsplash Fallback', 2
FROM public.transport_routes WHERE name = 'Havila Coastal Route';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'transport_routes', id, 'GALLERY', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Havila Coastal Route Gallery Image', 'Unsplash Fallback', 3
FROM public.transport_routes WHERE name = 'Havila Coastal Route';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'transport_routes', id, 'HERO', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Oslo to Tromsø Flight Hero', 'Unsplash Fallback', 1
FROM public.transport_routes WHERE name = 'Oslo to Tromsø Flight';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'transport_routes', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Oslo to Tromsø Flight Thumbnail', 'Unsplash Fallback', 2
FROM public.transport_routes WHERE name = 'Oslo to Tromsø Flight';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'transport_routes', id, 'GALLERY', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Oslo to Tromsø Flight Gallery Image', 'Unsplash Fallback', 3
FROM public.transport_routes WHERE name = 'Oslo to Tromsø Flight';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'transport_routes', id, 'HERO', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Bergen to Tromsø Flight Hero', 'Unsplash Fallback', 1
FROM public.transport_routes WHERE name = 'Bergen to Tromsø Flight';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'transport_routes', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Bergen to Tromsø Flight Thumbnail', 'Unsplash Fallback', 2
FROM public.transport_routes WHERE name = 'Bergen to Tromsø Flight';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'transport_routes', id, 'GALLERY', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Bergen to Tromsø Flight Gallery Image', 'Unsplash Fallback', 3
FROM public.transport_routes WHERE name = 'Bergen to Tromsø Flight';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'transport_routes', id, 'HERO', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Bodø - Lofoten Express Boat Hero', 'Unsplash Fallback', 1
FROM public.transport_routes WHERE name = 'Bodø - Lofoten Express Boat';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'transport_routes', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Bodø - Lofoten Express Boat Thumbnail', 'Unsplash Fallback', 2
FROM public.transport_routes WHERE name = 'Bodø - Lofoten Express Boat';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'transport_routes', id, 'GALLERY', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Bodø - Lofoten Express Boat Gallery Image', 'Unsplash Fallback', 3
FROM public.transport_routes WHERE name = 'Bodø - Lofoten Express Boat';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'transport_routes', id, 'HERO', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Geirangerfjord Ferry Hero', 'Unsplash Fallback', 1
FROM public.transport_routes WHERE name = 'Geirangerfjord Ferry';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'transport_routes', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Geirangerfjord Ferry Thumbnail', 'Unsplash Fallback', 2
FROM public.transport_routes WHERE name = 'Geirangerfjord Ferry';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'transport_routes', id, 'GALLERY', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Geirangerfjord Ferry Gallery Image', 'Unsplash Fallback', 3
FROM public.transport_routes WHERE name = 'Geirangerfjord Ferry';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'transport_routes', id, 'HERO', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Sognefjord Express Bus Hero', 'Unsplash Fallback', 1
FROM public.transport_routes WHERE name = 'Sognefjord Express Bus';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'transport_routes', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Sognefjord Express Bus Thumbnail', 'Unsplash Fallback', 2
FROM public.transport_routes WHERE name = 'Sognefjord Express Bus';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'transport_routes', id, 'GALLERY', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Sognefjord Express Bus Gallery Image', 'Unsplash Fallback', 3
FROM public.transport_routes WHERE name = 'Sognefjord Express Bus';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'transport_routes', id, 'HERO', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'The Arctic Route (Tromsø - Narvik) Hero', 'Unsplash Fallback', 1
FROM public.transport_routes WHERE name = 'The Arctic Route (Tromsø - Narvik)';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'transport_routes', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'The Arctic Route (Tromsø - Narvik) Thumbnail', 'Unsplash Fallback', 2
FROM public.transport_routes WHERE name = 'The Arctic Route (Tromsø - Narvik)';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'transport_routes', id, 'GALLERY', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'The Arctic Route (Tromsø - Narvik) Gallery Image', 'Unsplash Fallback', 3
FROM public.transport_routes WHERE name = 'The Arctic Route (Tromsø - Narvik)';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'HERO', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Oslo Hero', 'Unsplash Fallback', 1
FROM public.locations WHERE slug = 'oslo';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Oslo Thumbnail', 'Unsplash Fallback', 2
FROM public.locations WHERE slug = 'oslo';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'GALLERY', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Oslo Gallery Image', 'Unsplash Fallback', 3
FROM public.locations WHERE slug = 'oslo';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'HERO', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Bergen Hero', 'Unsplash Fallback', 1
FROM public.locations WHERE slug = 'bergen';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Bergen Thumbnail', 'Unsplash Fallback', 2
FROM public.locations WHERE slug = 'bergen';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'GALLERY', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Bergen Gallery Image', 'Unsplash Fallback', 3
FROM public.locations WHERE slug = 'bergen';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'HERO', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Tromsø Hero', 'Unsplash Fallback', 1
FROM public.locations WHERE slug = 'tromsø';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Tromsø Thumbnail', 'Unsplash Fallback', 2
FROM public.locations WHERE slug = 'tromsø';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'GALLERY', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Tromsø Gallery Image', 'Unsplash Fallback', 3
FROM public.locations WHERE slug = 'tromsø';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'HERO', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Flåm Hero', 'Unsplash Fallback', 1
FROM public.locations WHERE slug = 'flåm';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Flåm Thumbnail', 'Unsplash Fallback', 2
FROM public.locations WHERE slug = 'flåm';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'GALLERY', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Flåm Gallery Image', 'Unsplash Fallback', 3
FROM public.locations WHERE slug = 'flåm';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'HERO', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Geiranger Hero', 'Unsplash Fallback', 1
FROM public.locations WHERE slug = 'geiranger';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Geiranger Thumbnail', 'Unsplash Fallback', 2
FROM public.locations WHERE slug = 'geiranger';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'GALLERY', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Geiranger Gallery Image', 'Unsplash Fallback', 3
FROM public.locations WHERE slug = 'geiranger';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'HERO', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Trollstigen Viewpoint Hero', 'Unsplash Fallback', 1
FROM public.locations WHERE slug = 'trollstigen viewpoint';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Trollstigen Viewpoint Thumbnail', 'Unsplash Fallback', 2
FROM public.locations WHERE slug = 'trollstigen viewpoint';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'GALLERY', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Trollstigen Viewpoint Gallery Image', 'Unsplash Fallback', 3
FROM public.locations WHERE slug = 'trollstigen viewpoint';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'HERO', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Svolvær Hero', 'Unsplash Fallback', 1
FROM public.locations WHERE slug = 'svolvær';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Svolvær Thumbnail', 'Unsplash Fallback', 2
FROM public.locations WHERE slug = 'svolvær';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'GALLERY', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Svolvær Gallery Image', 'Unsplash Fallback', 3
FROM public.locations WHERE slug = 'svolvær';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'HERO', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Stavanger Hero', 'Unsplash Fallback', 1
FROM public.locations WHERE slug = 'stavanger';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Stavanger Thumbnail', 'Unsplash Fallback', 2
FROM public.locations WHERE slug = 'stavanger';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'GALLERY', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Stavanger Gallery Image', 'Unsplash Fallback', 3
FROM public.locations WHERE slug = 'stavanger';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'HERO', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Atlantic_Ocean_Road_map.svg/1280px-Atlantic_Ocean_Road_map.svg.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Eldhusøya Hero', 'Wikimedia Commons', 1
FROM public.locations WHERE slug = 'eldhusøya';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'THUMBNAIL', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Atlantic_Ocean_Road_map.svg/1280px-Atlantic_Ocean_Road_map.svg.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Eldhusøya Thumbnail', 'Wikimedia Commons', 2
FROM public.locations WHERE slug = 'eldhusøya';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'GALLERY', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Atlantic_Ocean_Road_map.svg/1280px-Atlantic_Ocean_Road_map.svg.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'Eldhusøya Gallery Image', 'Wikimedia Commons', 3
FROM public.locations WHERE slug = 'eldhusøya';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'HERO', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Oslo S Supercharger Hero', 'Unsplash Fallback', 1
FROM public.locations WHERE slug = 'ev-oslo-s-1';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Oslo S Supercharger Thumbnail', 'Unsplash Fallback', 2
FROM public.locations WHERE slug = 'ev-oslo-s-1';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'GALLERY', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Oslo S Supercharger Gallery Image', 'Unsplash Fallback', 3
FROM public.locations WHERE slug = 'ev-oslo-s-1';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'HERO', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Bergen Sentrum Fast Charger Hero', 'Unsplash Fallback', 1
FROM public.locations WHERE slug = 'ev-bergen-center-1';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Bergen Sentrum Fast Charger Thumbnail', 'Unsplash Fallback', 2
FROM public.locations WHERE slug = 'ev-bergen-center-1';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'GALLERY', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Bergen Sentrum Fast Charger Gallery Image', 'Unsplash Fallback', 3
FROM public.locations WHERE slug = 'ev-bergen-center-1';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'HERO', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Tromsø Lufthavn Charger Hero', 'Unsplash Fallback', 1
FROM public.locations WHERE slug = 'ev-tromso-airport-1';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Tromsø Lufthavn Charger Thumbnail', 'Unsplash Fallback', 2
FROM public.locations WHERE slug = 'ev-tromso-airport-1';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'GALLERY', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Tromsø Lufthavn Charger Gallery Image', 'Unsplash Fallback', 3
FROM public.locations WHERE slug = 'ev-tromso-airport-1';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'HERO', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Flåm Tourist Charger Hero', 'Unsplash Fallback', 1
FROM public.locations WHERE slug = 'ev-flam-1';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Flåm Tourist Charger Thumbnail', 'Unsplash Fallback', 2
FROM public.locations WHERE slug = 'ev-flam-1';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'GALLERY', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Flåm Tourist Charger Gallery Image', 'Unsplash Fallback', 3
FROM public.locations WHERE slug = 'ev-flam-1';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'HERO', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Geirangerfjord Supercharger Hero', 'Unsplash Fallback', 1
FROM public.locations WHERE slug = 'ev-geiranger-1';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Geirangerfjord Supercharger Thumbnail', 'Unsplash Fallback', 2
FROM public.locations WHERE slug = 'ev-geiranger-1';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'GALLERY', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Geirangerfjord Supercharger Gallery Image', 'Unsplash Fallback', 3
FROM public.locations WHERE slug = 'ev-geiranger-1';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'HERO', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Trollstigen Base Charger Hero', 'Unsplash Fallback', 1
FROM public.locations WHERE slug = 'ev-trollstigen-1';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Trollstigen Base Charger Thumbnail', 'Unsplash Fallback', 2
FROM public.locations WHERE slug = 'ev-trollstigen-1';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'GALLERY', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Trollstigen Base Charger Gallery Image', 'Unsplash Fallback', 3
FROM public.locations WHERE slug = 'ev-trollstigen-1';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'HERO', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Svolvær Port Charger Hero', 'Unsplash Fallback', 1
FROM public.locations WHERE slug = 'ev-lofoten-svolvaer';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Svolvær Port Charger Thumbnail', 'Unsplash Fallback', 2
FROM public.locations WHERE slug = 'ev-lofoten-svolvaer';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'GALLERY', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Svolvær Port Charger Gallery Image', 'Unsplash Fallback', 3
FROM public.locations WHERE slug = 'ev-lofoten-svolvaer';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'HERO', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/TeslaV2DualCable.jpg/1280px-TeslaV2DualCable.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'North Cape Charger Hero', 'Wikimedia Commons', 1
FROM public.locations WHERE slug = 'ev-nordkapp-1';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'THUMBNAIL', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/TeslaV2DualCable.jpg/1280px-TeslaV2DualCable.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'North Cape Charger Thumbnail', 'Wikimedia Commons', 2
FROM public.locations WHERE slug = 'ev-nordkapp-1';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'GALLERY', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/TeslaV2DualCable.jpg/1280px-TeslaV2DualCable.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'North Cape Charger Gallery Image', 'Wikimedia Commons', 3
FROM public.locations WHERE slug = 'ev-nordkapp-1';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'HERO', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'E6 Oppdal Highway Charger Hero', 'Unsplash Fallback', 1
FROM public.locations WHERE slug = 'ev-e6-oppdal';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'E6 Oppdal Highway Charger Thumbnail', 'Unsplash Fallback', 2
FROM public.locations WHERE slug = 'ev-e6-oppdal';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'GALLERY', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'E6 Oppdal Highway Charger Gallery Image', 'Unsplash Fallback', 3
FROM public.locations WHERE slug = 'ev-e6-oppdal';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'HERO', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'E39 Stavanger Hub Hero', 'Unsplash Fallback', 1
FROM public.locations WHERE slug = 'ev-e39-stavanger';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'E39 Stavanger Hub Thumbnail', 'Unsplash Fallback', 2
FROM public.locations WHERE slug = 'ev-e39-stavanger';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'GALLERY', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'E39 Stavanger Hub Gallery Image', 'Unsplash Fallback', 3
FROM public.locations WHERE slug = 'ev-e39-stavanger';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'HERO', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Atlantic Road Rest Stop Hero', 'Unsplash Fallback', 1
FROM public.locations WHERE slug = 'ev-atlantic-road-1';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Atlantic Road Rest Stop Thumbnail', 'Unsplash Fallback', 2
FROM public.locations WHERE slug = 'ev-atlantic-road-1';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'locations', id, 'GALLERY', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Atlantic Road Rest Stop Gallery Image', 'Unsplash Fallback', 3
FROM public.locations WHERE slug = 'ev-atlantic-road-1';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'HERO', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Norway in a Nutshell: Winter Edition Hero', 'Unsplash Fallback', 1
FROM public.deals WHERE name = 'Norway in a Nutshell: Winter Edition';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Norway in a Nutshell: Winter Edition Thumbnail', 'Unsplash Fallback', 2
FROM public.deals WHERE name = 'Norway in a Nutshell: Winter Edition';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'GALLERY', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Norway in a Nutshell: Winter Edition Gallery Image', 'Unsplash Fallback', 3
FROM public.deals WHERE name = 'Norway in a Nutshell: Winter Edition';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'HERO', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Tromsø Northern Lights Cruise Hero', 'Unsplash Fallback', 1
FROM public.deals WHERE name = 'Tromsø Northern Lights Cruise';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Tromsø Northern Lights Cruise Thumbnail', 'Unsplash Fallback', 2
FROM public.deals WHERE name = 'Tromsø Northern Lights Cruise';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'GALLERY', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Tromsø Northern Lights Cruise Gallery Image', 'Unsplash Fallback', 3
FROM public.deals WHERE name = 'Tromsø Northern Lights Cruise';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'HERO', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Oslo Pass - 48 Hours Hero', 'Unsplash Fallback', 1
FROM public.deals WHERE name = 'Oslo Pass - 48 Hours';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Oslo Pass - 48 Hours Thumbnail', 'Unsplash Fallback', 2
FROM public.deals WHERE name = 'Oslo Pass - 48 Hours';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'GALLERY', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Oslo Pass - 48 Hours Gallery Image', 'Unsplash Fallback', 3
FROM public.deals WHERE name = 'Oslo Pass - 48 Hours';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'HERO', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Svalbard Polar Bear Safari (Editorial Promo) Hero', 'Unsplash Fallback', 1
FROM public.deals WHERE name = 'Svalbard Polar Bear Safari (Editorial Promo)';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Svalbard Polar Bear Safari (Editorial Promo) Thumbnail', 'Unsplash Fallback', 2
FROM public.deals WHERE name = 'Svalbard Polar Bear Safari (Editorial Promo)';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'GALLERY', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Svalbard Polar Bear Safari (Editorial Promo) Gallery Image', 'Unsplash Fallback', 3
FROM public.deals WHERE name = 'Svalbard Polar Bear Safari (Editorial Promo)';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'HERO', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Bergen Card - 72 Hours Hero', 'Unsplash Fallback', 1
FROM public.deals WHERE name = 'Bergen Card - 72 Hours';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Bergen Card - 72 Hours Thumbnail', 'Unsplash Fallback', 2
FROM public.deals WHERE name = 'Bergen Card - 72 Hours';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'GALLERY', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Bergen Card - 72 Hours Gallery Image', 'Unsplash Fallback', 3
FROM public.deals WHERE name = 'Bergen Card - 72 Hours';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'HERO', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Geirangerfjord RIB Boat Tour Hero', 'Unsplash Fallback', 1
FROM public.deals WHERE name = 'Geirangerfjord RIB Boat Tour';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Geirangerfjord RIB Boat Tour Thumbnail', 'Unsplash Fallback', 2
FROM public.deals WHERE name = 'Geirangerfjord RIB Boat Tour';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'GALLERY', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Geirangerfjord RIB Boat Tour Gallery Image', 'Unsplash Fallback', 3
FROM public.deals WHERE name = 'Geirangerfjord RIB Boat Tour';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'HERO', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Lofoten Surfing Weekend Package Hero', 'Unsplash Fallback', 1
FROM public.deals WHERE name = 'Lofoten Surfing Weekend Package';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Lofoten Surfing Weekend Package Thumbnail', 'Unsplash Fallback', 2
FROM public.deals WHERE name = 'Lofoten Surfing Weekend Package';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'GALLERY', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Lofoten Surfing Weekend Package Gallery Image', 'Unsplash Fallback', 3
FROM public.deals WHERE name = 'Lofoten Surfing Weekend Package';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'HERO', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Flåm Railway & Zipline Combo Hero', 'Unsplash Fallback', 1
FROM public.deals WHERE name = 'Flåm Railway & Zipline Combo';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Flåm Railway & Zipline Combo Thumbnail', 'Unsplash Fallback', 2
FROM public.deals WHERE name = 'Flåm Railway & Zipline Combo';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'GALLERY', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Flåm Railway & Zipline Combo Gallery Image', 'Unsplash Fallback', 3
FROM public.deals WHERE name = 'Flåm Railway & Zipline Combo';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'HERO', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Hardangerfjord Cider Tasting Tour Hero', 'Unsplash Fallback', 1
FROM public.deals WHERE name = 'Hardangerfjord Cider Tasting Tour';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Hardangerfjord Cider Tasting Tour Thumbnail', 'Unsplash Fallback', 2
FROM public.deals WHERE name = 'Hardangerfjord Cider Tasting Tour';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'GALLERY', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Hardangerfjord Cider Tasting Tour Gallery Image', 'Unsplash Fallback', 3
FROM public.deals WHERE name = 'Hardangerfjord Cider Tasting Tour';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'HERO', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Vy Train Pass: 7 Days (Editorial Example) Hero', 'Unsplash Fallback', 1
FROM public.deals WHERE name = 'Vy Train Pass: 7 Days (Editorial Example)';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Vy Train Pass: 7 Days (Editorial Example) Thumbnail', 'Unsplash Fallback', 2
FROM public.deals WHERE name = 'Vy Train Pass: 7 Days (Editorial Example)';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'GALLERY', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Vy Train Pass: 7 Days (Editorial Example) Gallery Image', 'Unsplash Fallback', 3
FROM public.deals WHERE name = 'Vy Train Pass: 7 Days (Editorial Example)';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'HERO', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Hurtigruten Coastal Voyage (Port-to-Port) Hero', 'Unsplash Fallback', 1
FROM public.deals WHERE name = 'Hurtigruten Coastal Voyage (Port-to-Port)';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Hurtigruten Coastal Voyage (Port-to-Port) Thumbnail', 'Unsplash Fallback', 2
FROM public.deals WHERE name = 'Hurtigruten Coastal Voyage (Port-to-Port)';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'GALLERY', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Hurtigruten Coastal Voyage (Port-to-Port) Gallery Image', 'Unsplash Fallback', 3
FROM public.deals WHERE name = 'Hurtigruten Coastal Voyage (Port-to-Port)';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'HERO', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Preikestolen Guided Sunrise Hike Hero', 'Unsplash Fallback', 1
FROM public.deals WHERE name = 'Preikestolen Guided Sunrise Hike';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Preikestolen Guided Sunrise Hike Thumbnail', 'Unsplash Fallback', 2
FROM public.deals WHERE name = 'Preikestolen Guided Sunrise Hike';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'GALLERY', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Preikestolen Guided Sunrise Hike Gallery Image', 'Unsplash Fallback', 3
FROM public.deals WHERE name = 'Preikestolen Guided Sunrise Hike';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'HERO', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Dog Sledding in Alta Hero', 'Unsplash Fallback', 1
FROM public.deals WHERE name = 'Dog Sledding in Alta';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Dog Sledding in Alta Thumbnail', 'Unsplash Fallback', 2
FROM public.deals WHERE name = 'Dog Sledding in Alta';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'GALLERY', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Dog Sledding in Alta Gallery Image', 'Unsplash Fallback', 3
FROM public.deals WHERE name = 'Dog Sledding in Alta';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'HERO', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Fjord Sauna & Cold Plunge Pass Hero', 'Unsplash Fallback', 1
FROM public.deals WHERE name = 'Fjord Sauna & Cold Plunge Pass';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Fjord Sauna & Cold Plunge Pass Thumbnail', 'Unsplash Fallback', 2
FROM public.deals WHERE name = 'Fjord Sauna & Cold Plunge Pass';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'GALLERY', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Fjord Sauna & Cold Plunge Pass Gallery Image', 'Unsplash Fallback', 3
FROM public.deals WHERE name = 'Fjord Sauna & Cold Plunge Pass';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'HERO', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Stavanger Museum Multi-Pass Hero', 'Unsplash Fallback', 1
FROM public.deals WHERE name = 'Stavanger Museum Multi-Pass';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Stavanger Museum Multi-Pass Thumbnail', 'Unsplash Fallback', 2
FROM public.deals WHERE name = 'Stavanger Museum Multi-Pass';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'GALLERY', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Stavanger Museum Multi-Pass Gallery Image', 'Unsplash Fallback', 3
FROM public.deals WHERE name = 'Stavanger Museum Multi-Pass';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'HERO', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Jotunheimen Glacier Walk Hero', 'Unsplash Fallback', 1
FROM public.deals WHERE name = 'Jotunheimen Glacier Walk';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Jotunheimen Glacier Walk Thumbnail', 'Unsplash Fallback', 2
FROM public.deals WHERE name = 'Jotunheimen Glacier Walk';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'GALLERY', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Jotunheimen Glacier Walk Gallery Image', 'Unsplash Fallback', 3
FROM public.deals WHERE name = 'Jotunheimen Glacier Walk';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'HERO', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Trolltunga Via Ferrata (Editorial Deal) Hero', 'Unsplash Fallback', 1
FROM public.deals WHERE name = 'Trolltunga Via Ferrata (Editorial Deal)';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Trolltunga Via Ferrata (Editorial Deal) Thumbnail', 'Unsplash Fallback', 2
FROM public.deals WHERE name = 'Trolltunga Via Ferrata (Editorial Deal)';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'GALLERY', 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=1080', 'Trolltunga Via Ferrata (Editorial Deal) Gallery Image', 'Unsplash Fallback', 3
FROM public.deals WHERE name = 'Trolltunga Via Ferrata (Editorial Deal)';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'HERO', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Arctic Whale Safari - Andenes Hero', 'Unsplash Fallback', 1
FROM public.deals WHERE name = 'Arctic Whale Safari - Andenes';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Arctic Whale Safari - Andenes Thumbnail', 'Unsplash Fallback', 2
FROM public.deals WHERE name = 'Arctic Whale Safari - Andenes';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'GALLERY', 'https://images.unsplash.com/photo-1516629910-c11438902888?w=1080', 'Arctic Whale Safari - Andenes Gallery Image', 'Unsplash Fallback', 3
FROM public.deals WHERE name = 'Arctic Whale Safari - Andenes';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'HERO', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Trondheim Nidaros Cathedral Tower Tour Hero', 'Unsplash Fallback', 1
FROM public.deals WHERE name = 'Trondheim Nidaros Cathedral Tower Tour';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Trondheim Nidaros Cathedral Tower Tour Thumbnail', 'Unsplash Fallback', 2
FROM public.deals WHERE name = 'Trondheim Nidaros Cathedral Tower Tour';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'GALLERY', 'https://images.unsplash.com/photo-1490001851140-5e586071ea91?w=1080', 'Trondheim Nidaros Cathedral Tower Tour Gallery Image', 'Unsplash Fallback', 3
FROM public.deals WHERE name = 'Trondheim Nidaros Cathedral Tower Tour';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'HERO', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Kautokeino Sami Cultural Experience Hero', 'Unsplash Fallback', 1
FROM public.deals WHERE name = 'Kautokeino Sami Cultural Experience';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'THUMBNAIL', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Kautokeino Sami Cultural Experience Thumbnail', 'Unsplash Fallback', 2
FROM public.deals WHERE name = 'Kautokeino Sami Cultural Experience';

INSERT INTO public.content_media (id, entity_type, entity_id, media_type, media_url, alt_text, credits, sort_order)
SELECT gen_random_uuid(), 'deals', id, 'GALLERY', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1080', 'Kautokeino Sami Cultural Experience Gallery Image', 'Unsplash Fallback', 3
FROM public.deals WHERE name = 'Kautokeino Sami Cultural Experience';
