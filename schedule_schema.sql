-- Add timezone and weekly_schedule columns to expert_profiles if they don't exist
ALTER TABLE public.expert_profiles 
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'asia_kolkata',
ADD COLUMN IF NOT EXISTS weekly_schedule JSONB DEFAULT '{}'::jsonb;
