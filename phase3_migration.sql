-- Phase 3 Migration: Add image_url and notable_drops columns to the tasks table

ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS notable_drops TEXT;

-- (Optional) Update Zulrah as an example so you can see how it looks!
UPDATE public.tasks 
SET 
  image_url = 'https://oldschool.runescape.wiki/images/Zulrah_%28serpentine%29.png',
  notable_drops = 'Tanzanite fang, Magic fang, Serpentine visage, Zul-andra teleport'
WHERE name = 'Zulrah';
