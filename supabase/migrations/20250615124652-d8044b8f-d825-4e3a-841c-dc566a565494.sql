
-- Create a public bucket for recipe images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('recipe_images', 'recipe_images', true)
ON CONFLICT (id) DO NOTHING;
