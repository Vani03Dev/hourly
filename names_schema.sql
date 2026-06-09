-- Step 1: Add first_name and last_name columns to expert_profiles
ALTER TABLE public.expert_profiles 
ADD COLUMN IF NOT EXISTS first_name TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS last_name TEXT DEFAULT '';

-- Step 2: Reload the schema cache instantly
NOTIFY pgrst, 'reload schema';
