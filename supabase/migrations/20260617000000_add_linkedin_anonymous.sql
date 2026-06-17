ALTER TABLE expert_profiles
ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS linkedin_data JSONB DEFAULT '{}'::jsonb;
