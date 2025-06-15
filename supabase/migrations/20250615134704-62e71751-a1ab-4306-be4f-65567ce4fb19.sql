
-- Drop policies if they exist to avoid errors
DROP POLICY IF EXISTS "Public read access for recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload to recipe_images" ON storage.objects;

-- Set up RLS policies for the recipe_images bucket to allow public access
CREATE POLICY "Public read access for recipe images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'recipe_images' );

CREATE POLICY "Anyone can upload to recipe_images"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'recipe_images' );
