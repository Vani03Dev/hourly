-- Add meeting_url to expert_profiles
ALTER TABLE public.expert_profiles
ADD COLUMN IF NOT EXISTS meeting_url TEXT;

-- Add meeting_link to bookings
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS meeting_link TEXT;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
