-- Create Notifications Table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can view their own notifications"
    ON public.notifications
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
    ON public.notifications
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Create Database Trigger for new bookings
CREATE OR REPLACE FUNCTION handle_new_booking_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify the Expert
  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (
    NEW.expert_id, 
    'New Session Booked!', 
    'A mentee has booked a 30-min session with you on ' || NEW.booking_date || ' at ' || NEW.start_time,
    'booking'
  );
  
  -- Notify the Mentee
  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (
    NEW.mentee_id, 
    'Session Confirmed', 
    'Your session on ' || NEW.booking_date || ' at ' || NEW.start_time || ' is confirmed.',
    'booking'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_booking_created
  AFTER INSERT ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION handle_new_booking_notification();
