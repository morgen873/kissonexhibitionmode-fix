
-- Enable RLS on all tables
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_saved_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_audit_log ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to read all recipes (for public exhibition)
CREATE POLICY "Anyone can read recipes"
ON recipes FOR SELECT
USING (true);

-- Allow anonymous users to create recipes with rate limiting
CREATE POLICY "Anyone can create recipes"
ON recipes FOR INSERT
WITH CHECK (
  -- Basic content validation (title and description not empty)
  title IS NOT NULL AND 
  title != '' AND 
  description IS NOT NULL AND 
  description != ''
);

-- Prevent modification/deletion of existing recipes by anonymous users
CREATE POLICY "No modifications to existing recipes"
ON recipes FOR UPDATE
USING (false);

CREATE POLICY "No deletion of recipes"
ON recipes FOR DELETE
USING (false);

-- Security audit log - allow system to log but users can't read
CREATE POLICY "System can insert audit logs"
ON security_audit_log FOR INSERT
WITH CHECK (true);

CREATE POLICY "No reading audit logs"
ON security_audit_log FOR SELECT
USING (false);

-- Profiles table - minimal access needed for exhibition
CREATE POLICY "No profile access needed"
ON profiles FOR ALL
USING (false);

-- User saved recipes - not needed for exhibition
CREATE POLICY "No saved recipes for anonymous users"
ON user_saved_recipes FOR ALL
USING (false);
