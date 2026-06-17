ALTER TABLE expert_profiles
ADD COLUMN IF NOT EXISTS page_theme TEXT DEFAULT 'teal';
