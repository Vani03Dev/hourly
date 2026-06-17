-- Add presence tracking columns
ALTER TABLE public.expert_profiles
ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Create RPC to safely and quickly update presence without needing full row access
CREATE OR REPLACE FUNCTION update_presence(user_id UUID, online_status BOOLEAN)
RETURNS void AS $$
BEGIN
  UPDATE public.expert_profiles
  SET 
    is_online = online_status,
    last_active_at = timezone('utc'::text, now())
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
