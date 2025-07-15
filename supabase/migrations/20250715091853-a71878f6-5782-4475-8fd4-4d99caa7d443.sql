-- Create policies for kisson-video bucket to allow public access
CREATE POLICY "Allow public access to kisson-video videos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'kisson-video');

CREATE POLICY "Allow authenticated users to upload videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'kisson-video');

CREATE POLICY "Allow service role to manage videos" 
ON storage.objects 
FOR ALL 
USING (bucket_id = 'kisson-video');