-- Create services table
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expert_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL,
    price NUMERIC NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add index for faster querying
CREATE INDEX idx_services_expert_id ON public.services(expert_id);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Services are viewable by everyone" ON public.services FOR SELECT USING (true);
CREATE POLICY "Experts can insert their own services" ON public.services FOR INSERT WITH CHECK (auth.uid() = expert_id);
CREATE POLICY "Experts can update their own services" ON public.services FOR UPDATE USING (auth.uid() = expert_id);
CREATE POLICY "Experts can delete their own services" ON public.services FOR DELETE USING (auth.uid() = expert_id);

-- Add trigger for updated_at
CREATE TRIGGER update_services_modtime
    BEFORE UPDATE ON public.services
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
