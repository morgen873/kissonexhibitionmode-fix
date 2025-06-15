
-- Allow recipes to be created without a user for now.
-- We can add authentication later to associate recipes with users.
ALTER TABLE public.recipes ALTER COLUMN user_id DROP NOT NULL;
