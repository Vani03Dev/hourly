-- Create the expert_profiles table
CREATE TABLE public.expert_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    bio TEXT NOT NULL,
    hourly_rate INTEGER NOT NULL,
    tags TEXT[] DEFAULT '{}',
    is_onboarded BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.expert_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone." ON public.expert_profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.expert_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON public.expert_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_expert_profiles_modtime
    BEFORE UPDATE ON public.expert_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
