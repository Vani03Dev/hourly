-- Step 1: Add ALL the missing scheduling columns at once
ALTER TABLE public.expert_profiles 
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'asia_kolkata',
ADD COLUMN IF NOT EXISTS weekly_schedule JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS date_overrides JSONB DEFAULT '{}'::jsonb;

-- Step 2: Reload the cache instantly
NOTIFY pgrst, 'reload schema';
