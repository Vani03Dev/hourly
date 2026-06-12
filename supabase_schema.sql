-- Create the expert_profiles table
CREATE TABLE public.expert_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    linkedin_url TEXT NOT NULL,
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

-- Create the client_profiles table
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

CREATE POLICY "Users can view own client profile." ON public.client_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own client profile." ON public.client_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own client profile." ON public.client_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE TRIGGER update_client_profiles_modtime
    BEFORE UPDATE ON public.client_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
