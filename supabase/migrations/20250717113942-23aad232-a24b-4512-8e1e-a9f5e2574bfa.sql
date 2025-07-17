-- Clean up conflicting storage buckets and policies
-- Remove the bucket with dashes and keep the one with underscores
DELETE FROM storage.buckets WHERE id = 'recipe-images';

-- Ensure the recipe_images bucket exists and is public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('recipe_images', 'recipe_images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Remove all conflicting policies for storage.objects
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload recipe images" ON storage.objects;

-- Create a single, comprehensive policy for recipe_images bucket
CREATE POLICY "Full public access to recipe_images" ON storage.objects
FOR ALL USING (bucket_id = 'recipe_images');

-- Ensure RLS is enabled on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;