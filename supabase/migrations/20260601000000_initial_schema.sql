-- Create the update_modified_column function
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create expert_profiles table
CREATE TABLE public.expert_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    linkedin_url TEXT NOT NULL,
    first_name TEXT DEFAULT '',
    last_name TEXT DEFAULT '',
    title TEXT NOT NULL,
    bio TEXT NOT NULL,
    hourly_rate INTEGER NOT NULL,
    tags TEXT[] DEFAULT '{}',
    avatar_url TEXT,
    timezone TEXT DEFAULT 'asia_kolkata',
    weekly_schedule JSONB DEFAULT '{}'::jsonb,
    date_overrides JSONB DEFAULT '{}'::jsonb,
    is_onboarded BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for expert_profiles
CREATE INDEX idx_expert_profiles_username ON public.expert_profiles(username);

ALTER TABLE public.expert_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." ON public.expert_profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.expert_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.expert_profiles FOR UPDATE USING (auth.uid() = id);

CREATE TRIGGER update_expert_profiles_modtime
    BEFORE UPDATE ON public.expert_profiles
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Create client_profiles table
CREATE TABLE public.client_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    gstin TEXT,
    company_size TEXT,
    role TEXT,
    is_onboarded BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own client profile." ON public.client_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own client profile." ON public.client_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own client profile." ON public.client_profiles FOR UPDATE USING (auth.uid() = id);

CREATE TRIGGER update_client_profiles_modtime
    BEFORE UPDATE ON public.client_profiles
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mentee_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  status TEXT DEFAULT 'confirmed',
  payment_status TEXT DEFAULT 'pending',
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  amount_paid NUMERIC DEFAULT 0,
  platform_fee NUMERIC DEFAULT 0,
  meeting_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = mentee_id);

-- Create notifications table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION handle_new_booking_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (NEW.expert_id, 'New Session Booked!', 'A mentee has booked a 30-min session with you on ' || NEW.booking_date || ' at ' || NEW.start_time, 'booking');
  
  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (NEW.mentee_id, 'Session Confirmed', 'Your session on ' || NEW.booking_date || ' at ' || NEW.start_time || ' is confirmed.', 'booking');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_booking_created
  AFTER INSERT ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION handle_new_booking_notification();

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

ALTER TABLE public.google_integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Experts can read own google integration" ON public.google_integrations FOR SELECT USING (auth.uid() = expert_id);
CREATE POLICY "Experts can insert own google integration" ON public.google_integrations FOR INSERT WITH CHECK (auth.uid() = expert_id);
CREATE POLICY "Experts can update own google integration" ON public.google_integrations FOR UPDATE USING (auth.uid() = expert_id);
CREATE POLICY "Experts can delete own google integration" ON public.google_integrations FOR DELETE USING (auth.uid() = expert_id);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own messages" ON public.messages FOR SELECT USING (auth.uid() IN (SELECT expert_id FROM public.bookings WHERE id = booking_id UNION SELECT mentee_id FROM public.bookings WHERE id = booking_id));
CREATE POLICY "Users can insert messages to their bookings" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id AND auth.uid() IN (SELECT expert_id FROM public.bookings WHERE id = booking_id UNION SELECT mentee_id FROM public.bookings WHERE id = booking_id));
CREATE POLICY "Users can update their messages" ON public.messages FOR UPDATE USING (auth.uid() IN (SELECT expert_id FROM public.bookings WHERE id = booking_id UNION SELECT mentee_id FROM public.bookings WHERE id = booking_id));

ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Create Storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Avatar images are publicly accessible." ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload their own avatar." ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own avatar." ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Reload cache
NOTIFY pgrst, 'reload schema';
