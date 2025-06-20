
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Public read access for recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload to recipe_images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update recipe_images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete from recipe_images" ON storage.objects;

-- Create completely public policies that don't require authentication
CREATE POLICY "Public access to recipe images"
ON storage.objects FOR ALL
USING (bucket_id = 'recipe_images');

-- Ensure the bucket is public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'recipe_images';
