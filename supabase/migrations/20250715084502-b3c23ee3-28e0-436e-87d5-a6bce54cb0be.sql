-- Add video_url column to recipes table for video generation feature
ALTER TABLE public.recipes 
ADD COLUMN video_url text;

-- Add index for better performance when querying recipes with videos
CREATE INDEX idx_recipes_video_url ON public.recipes(video_url) WHERE video_url IS NOT NULL;