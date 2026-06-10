-- Create google_integrations table
CREATE TABLE IF NOT EXISTS public.google_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_expiry TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.google_integrations ENABLE ROW LEVEL SECURITY;

-- Allow experts to read their own tokens
CREATE POLICY "Experts can read own google integration"
  ON public.google_integrations
  FOR SELECT
  USING (auth.uid() = expert_id);

-- Allow experts to insert/update their own tokens
CREATE POLICY "Experts can insert own google integration"
  ON public.google_integrations
  FOR INSERT
  WITH CHECK (auth.uid() = expert_id);

CREATE POLICY "Experts can update own google integration"
  ON public.google_integrations
  FOR UPDATE
  USING (auth.uid() = expert_id);

CREATE POLICY "Experts can delete own google integration"
  ON public.google_integrations
  FOR DELETE
  USING (auth.uid() = expert_id);

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
