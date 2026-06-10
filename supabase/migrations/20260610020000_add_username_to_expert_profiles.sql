-- Add username column to expert_profiles
ALTER TABLE public.expert_profiles 
ADD COLUMN username TEXT UNIQUE;

-- Create an index for faster lookups by username
CREATE INDEX idx_expert_profiles_username ON public.expert_profiles(username);
