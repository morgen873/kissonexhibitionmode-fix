
-- Ensure the recipe_images bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('recipe_images', 'recipe_images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public read access for recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload to recipe_images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update recipe_images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete from recipe_images" ON storage.objects;

-- Create comprehensive policies for the recipe images bucket
CREATE POLICY "Public read access for recipe images"
ON storage.objects FOR SELECT
USING (bucket_id = 'recipe_images');

CREATE POLICY "Anyone can upload to recipe_images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'recipe_images');

CREATE POLICY "Anyone can update recipe_images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'recipe_images');

CREATE POLICY "Anyone can delete from recipe_images"
ON storage.objects FOR DELETE
USING (bucket_id = 'recipe_images');
