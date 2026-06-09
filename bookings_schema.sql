-- Step 1: Create the bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mentee_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Enable RLS and add basic policies
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow public to read bookings (needed to block out times on the public calendar)
CREATE POLICY "Public can view bookings"
  ON public.bookings
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert bookings
CREATE POLICY "Authenticated users can insert bookings"
  ON public.bookings
  FOR INSERT
  WITH CHECK (auth.uid() = mentee_id);

-- Step 3: Reload the schema cache instantly
NOTIFY pgrst, 'reload schema';
