-- Add Razorpay payment fields to the bookings table
ALTER TABLE public.bookings
ADD COLUMN payment_status TEXT DEFAULT 'pending',
ADD COLUMN razorpay_order_id TEXT,
ADD COLUMN razorpay_payment_id TEXT,
ADD COLUMN amount_paid NUMERIC DEFAULT 0,
ADD COLUMN platform_fee NUMERIC DEFAULT 0;

-- Optionally, add an index to order_id for faster webhook lookups
CREATE INDEX IF NOT EXISTS idx_bookings_razorpay_order_id ON public.bookings(razorpay_order_id);

-- Update RLS if necessary to allow webhooks to update these fields
-- Assuming webhooks use a service role key, they bypass RLS, so no changes needed for them.

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
