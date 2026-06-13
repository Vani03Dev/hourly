ALTER TABLE public.expert_profiles ADD COLUMN IF NOT EXISTS payment_details JSONB DEFAULT '{}'::jsonb;
