-- Gemini Evolution Database Schema
-- Run this migration to set up all required tables

-- Members table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.members (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  email TEXT UNIQUE NOT NULL,
  member_number SERIAL,
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES public.members(id),
  referral_count INTEGER DEFAULT 0,
  genre_preferences TEXT[] DEFAULT '{}',
  songs_played INTEGER DEFAULT 0,
  songs_downloaded INTEGER DEFAULT 0,
  city TEXT,
  is_donor BOOLEAN DEFAULT FALSE,
  donor_tier TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Songs table
CREATE TABLE IF NOT EXISTS public.songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  genre TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL, -- in seconds
  artwork_url TEXT,
  audio_url TEXT NOT NULL,
  play_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  release_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Donations table
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES public.members(id),
  amount INTEGER NOT NULL, -- in cents
  type TEXT NOT NULL CHECK (type IN ('one-time', 'monthly')),
  tier TEXT NOT NULL CHECK (tier IN ('bronze', 'silver', 'gold')),
  stripe_session_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table (for analytics)
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES public.members(id),
  event_type TEXT NOT NULL,
  song_id UUID REFERENCES public.songs(id),
  genre TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fan submissions table
CREATE TABLE IF NOT EXISTS public.fan_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES public.members(id),
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fan_submissions ENABLE ROW LEVEL SECURITY;

-- Members policies
CREATE POLICY "Members can view their own profile" ON public.members
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Members can update their own profile" ON public.members
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Members can insert their own profile" ON public.members
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Songs policies (public read)
CREATE POLICY "Anyone can view songs" ON public.songs
  FOR SELECT USING (true);

-- Donations policies
CREATE POLICY "Members can view their own donations" ON public.donations
  FOR SELECT USING (auth.uid() = member_id);

CREATE POLICY "Members can insert their own donations" ON public.donations
  FOR INSERT WITH CHECK (auth.uid() = member_id);

-- Events policies
CREATE POLICY "Members can insert their own events" ON public.events
  FOR INSERT WITH CHECK (auth.uid() = member_id OR member_id IS NULL);

CREATE POLICY "Anyone can insert anonymous events" ON public.events
  FOR INSERT WITH CHECK (member_id IS NULL);

-- Fan submissions policies
CREATE POLICY "Anyone can view approved submissions" ON public.fan_submissions
  FOR SELECT USING (approved = true);

CREATE POLICY "Members can insert submissions" ON public.fan_submissions
  FOR INSERT WITH CHECK (auth.uid() = member_id OR member_id IS NULL);

CREATE POLICY "Members can view their own submissions" ON public.fan_submissions
  FOR SELECT USING (auth.uid() = member_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_songs_slug ON public.songs(slug);
CREATE INDEX IF NOT EXISTS idx_songs_genre ON public.songs(genre);
CREATE INDEX IF NOT EXISTS idx_songs_featured ON public.songs(featured);
CREATE INDEX IF NOT EXISTS idx_events_member_id ON public.events(member_id);
CREATE INDEX IF NOT EXISTS idx_events_event_type ON public.events(event_type);
CREATE INDEX IF NOT EXISTS idx_members_referral_code ON public.members(referral_code);

-- Function to generate referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
BEGIN
  RETURN SUBSTRING(gen_random_uuid()::text, 1, 8);
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-create member profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.members (id, email, first_name, referral_code)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', NULL),
    generate_referral_code()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to get site stats
CREATE OR REPLACE FUNCTION get_site_stats()
RETURNS TABLE (
  total_members BIGINT,
  total_songs BIGINT,
  total_downloads BIGINT,
  total_donors BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM public.members)::BIGINT as total_members,
    (SELECT COUNT(*) FROM public.songs)::BIGINT as total_songs,
    (SELECT COALESCE(SUM(download_count), 0) FROM public.songs)::BIGINT as total_downloads,
    (SELECT COUNT(*) FROM public.donations WHERE status = 'completed')::BIGINT as total_donors;
END;
$$ LANGUAGE plpgsql;
