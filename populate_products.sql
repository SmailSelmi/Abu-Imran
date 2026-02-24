-- 1. Insert/Update Families
INSERT INTO public.families (id, slug, name_ar, name_en, image) VALUES
('52fd8322-ba21-48b8-b8cc-4d09a2df8237', 'australorp', 'أسترالورب', 'Australorp', 'https://res.cloudinary.com/dyi0jxi3g/image/upload/v1771619701/Australorp_Chicks_n30igr.webp'),
('6695dc90-1a86-4919-87af-25480c4ce5c5', 'new-hampshire', 'نيوهامبشير', 'New Hampshire', 'https://res.cloudinary.com/dyi0jxi3g/image/upload/v1771339479/03-fertilized-eggs_kbgqer.jpg'),
('647b1244-adcb-454b-94f9-9b77353537bb', 'plymouth-rock', 'بلايموث روك', 'Plymouth Rock', 'https://res.cloudinary.com/dyi0jxi3g/image/upload/v1771619857/Plymouth-Rock-Barry-chiken-silver-abu-imran_gofobu.jpg'),
('fd5d1d7a-1072-4ee0-aa75-a7fb17b627f7', 'sussex-rhode-island', 'سيساكس / رود آيلاند', 'Sussex & Rhode Island', 'https://res.cloudinary.com/dyi0jxi3g/image/upload/v1771619857/Plymouth-Rock-Barry-chiken-silver-abu-imran_gofobu.jpg'),
('c9b2864f-53f8-4dca-9264-8c1c5132543d', 'sprite', 'سبرايت أنيق', 'Sprite', 'https://res.cloudinary.com/dyi0jxi3g/image/upload/v1771619701/Australorp_Chicks_n30igr.webp'),
('857445fe-637b-4bd5-b85a-59ade002fb65', 'brahma', 'براهما', 'Brahma', 'https://res.cloudinary.com/dyi0jxi3g/image/upload/v1771619857/Plymouth-Rock-Barry-chiken-silver-abu-imran_gofobu.jpg')
ON CONFLICT (id) DO UPDATE SET 
  name_ar = EXCLUDED.name_ar,
  name_en = EXCLUDED.name_en,
  image = EXCLUDED.image,
  slug = EXCLUDED.slug;

-- 2. Insert/Update Breeds
INSERT INTO public.breeds (id, family_id, slug, name_ar, name_en) VALUES
-- Australorp
('484c85a0-b862-433b-86e6-0bb79a189388', '52fd8322-ba21-48b8-b8cc-4d09a2df8237', 'australorp-black', 'أسترالورب محسن أسود', 'Australorp Improved Black'),
('376363c6-98aa-43fd-851d-3a7003cea577', '52fd8322-ba21-48b8-b8cc-4d09a2df8237', 'australorp-grey', 'أسترالورب محسن رمادي', 'Australorp Improved Grey'),
-- New Hampshire
('1cf435b8-7a7e-47ea-9fcb-731d387ac012', '6695dc90-1a86-4919-87af-25480c4ce5c5', 'new-hampshire-black-collar', 'نيوهامبشير الطوق الأسود', 'New Hampshire Black Ring'),
-- Plymouth
('623e3c83-7a7c-4176-b13c-18236cbcbf45', '647b1244-adcb-454b-94f9-9b77353537bb', 'plymouth-rock-barred', 'بليموث روك باري', 'Plymouth Rock Barry'),
('11489ae9-f5ab-4223-887f-e1020d1a10fd', '647b1244-adcb-454b-94f9-9b77353537bb', 'plymouth-rock-silver', 'بليموث روك سيلفر', 'Plymouth Rock Silver'),
-- Sussex/Rhode
('76e9748f-7726-4be2-8f86-e0a2150837f8', 'fd5d1d7a-1072-4ee0-aa75-a7fb17b627f7', 'sussex-armenian', 'سيساكس أرميني', 'Sussex Arminian'),
('f475eeaf-56ec-4510-a082-db20617646b9', 'fd5d1d7a-1072-4ee0-aa75-a7fb17b627f7', 'rhode-island-akaju', 'رود آيلاند أكاجو', 'Rhode Island Acajou'),
-- Sprite
('35f3c69c-8bab-4983-9171-2b0ce1f99656', 'c9b2864f-53f8-4dca-9264-8c1c5132543d', 'sprite-gold', 'سبرايت أنيق ذهبي', 'Sprite Elegant Gold'),
('a87c58fa-49ac-4ecd-ac75-ac0cb3730bd9', 'c9b2864f-53f8-4dca-9264-8c1c5132543d', 'sprite-lemon', 'سبرايت أنيق ليموني', 'Sprite Elegant Lemon'),
('ee12f733-8ae9-49f5-9b09-4420a3b543c9', 'c9b2864f-53f8-4dca-9264-8c1c5132543d', 'sprite-silver', 'سبرايت أنيق فضي', 'Sprite Elegant Silver'),
-- Brahma
('8b89ff4d-0d99-45ab-aa38-77ed07003f02', '857445fe-637b-4bd5-b85a-59ade002fb65', 'brahma-armenian', 'براهما أرميني', 'Brahma Arminian'),
('f1d56616-ed41-4019-b0b0-6288a8917990', '857445fe-637b-4bd5-b85a-59ade002fb65', 'brahma-columbian', 'براهما كولومبي', 'Brahma Colombian'),
('5ab11ca6-1b9c-40ad-9f63-64b18ee89ab0', '857445fe-637b-4bd5-b85a-59ade002fb65', 'brahma-noir-corbeau', 'براهما نوار كوربو', 'Brahma Noir Corbeau'),
('8c0a3e31-1d58-46e9-b6f4-17b961382d38', '857445fe-637b-4bd5-b85a-59ade002fb65', 'brahma-mille-fleur', 'براهما ميل فلور', 'Brahma Mill Fleur'),
('f81f7ff4-01c0-4810-9a6d-15431d19e0fe', '857445fe-637b-4bd5-b85a-59ade002fb65', 'brahma-blue', 'براهما أزرق', 'Brahma Blue'),
('5a862f57-8485-4d8c-820b-867982209048', '857445fe-637b-4bd5-b85a-59ade002fb65', 'brahma-coyote', 'براهما كايوتي', 'Brahma Coyote')
ON CONFLICT (id) DO UPDATE SET 
  name_ar = EXCLUDED.name_ar,
  name_en = EXCLUDED.name_en,
  slug = EXCLUDED.slug;

-- 3. Clear existing products to avoid duplicates during re-population (Optional but safer for sync)
-- DELETE FROM public.products WHERE category IN ('eggs', 'chicks', 'chickens');

-- 4. Insert Products for all categories
-- Eggs
INSERT INTO public.products (breed_id, family_id, category, name, name_en, slug, price, is_active, image_url)
SELECT 
  id as breed_id,
  family_id,
  'eggs' as category,
  name_ar,
  name_en,
  slug || '-eggs' as slug,
  150 as price,
  true as is_active,
  'https://res.cloudinary.com/dyi0jxi3g/image/upload/v1771339479/03-fertilized-eggs_kbgqer.jpg' as image_url
FROM public.breeds
ON CONFLICT (slug) DO UPDATE SET
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url;

-- Chicks
INSERT INTO public.products (breed_id, family_id, category, name, name_en, slug, price, is_active, image_url)
SELECT 
  id as breed_id,
  family_id,
  'chicks' as category,
  name_ar,
  name_en,
  slug || '-chicks' as slug,
  350 as price,
  true as is_active,
  'https://res.cloudinary.com/dyi0jxi3g/image/upload/v1771619701/Australorp_Chicks_n30igr.webp' as image_url
FROM public.breeds
ON CONFLICT (slug) DO UPDATE SET
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url;

-- Chickens
INSERT INTO public.products (breed_id, family_id, category, name, name_en, slug, price, is_active, image_url)
SELECT 
  id as breed_id,
  family_id,
  'chickens' as category,
  name_ar,
  name_en,
  slug || '-chickens' as slug,
  2500 as price,
  true as is_active,
  'https://res.cloudinary.com/dyi0jxi3g/image/upload/v1771619857/Plymouth-Rock-Barry-chiken-silver-abu-imran_gofobu.jpg' as image_url
FROM public.breeds
ON CONFLICT (slug) DO UPDATE SET
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url;
