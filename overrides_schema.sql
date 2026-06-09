-- Add date_overrides column to expert_profiles if it doesn't exist
ALTER TABLE public.expert_profiles 
ADD COLUMN IF NOT EXISTS date_overrides JSONB DEFAULT '{}'::jsonb;
