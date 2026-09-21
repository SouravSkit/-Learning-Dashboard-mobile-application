-- ========================================
-- Supabase SQL Schema for News Feed App
-- ========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- Tables
-- ========================================

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  username TEXT UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  gender TEXT,
  location TEXT,
  profession TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- News table
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  video_url TEXT,
  source_name TEXT,
  source_url TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  news_id UUID REFERENCES news(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- Indexes
-- ========================================

CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_news_id ON comments(news_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- ========================================
-- Row Level Security (RLS)
-- ========================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- ========================================
-- Profiles Policies
-- ========================================

-- Anyone can read profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (for signup)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ========================================
-- News Policies
-- ========================================

-- Authenticated users can read news
CREATE POLICY "News are viewable by authenticated users"
  ON news FOR SELECT
  TO authenticated
  USING (true);

-- News is read-only from client (no insert/update/delete policies)
-- News should be managed via server-side or Supabase dashboard

-- ========================================
-- Comments Policies
-- ========================================

-- Authenticated users can read comments
CREATE POLICY "Comments are viewable by authenticated users"
  ON comments FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can create comments with their own user_id
CREATE POLICY "Users can create own comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update only their own comments
CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete only their own comments
CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ========================================
-- Storage (for avatars)
-- ========================================

-- Create avatars bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: Allow authenticated users to upload avatars
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Anyone can upload an avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = (storage.foldername(name))[1]);

-- ========================================
-- Functions
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- Sample Data (Optional - for testing)
-- ========================================

-- Uncomment to insert sample news data
/*
INSERT INTO news (title, description, image_url, source_name, published_at) VALUES
('Breaking: Major Tech Company Announces Revolutionary AI Product',
 'A leading technology company has unveiled its latest artificial intelligence innovation that promises to transform how we interact with technology.',
 'https://picsum.photos/800/400?random=1',
 'Tech News Daily',
 NOW() - INTERVAL '2 hours'),

('Climate Summit Reaches Historic Agreement',
 'World leaders have agreed on a comprehensive plan to combat climate change, marking a significant milestone in environmental policy.',
 'https://picsum.photos/800/400?random=2',
 'Global News Network',
 NOW() - INTERVAL '5 hours'),

('Space Exploration: New Mars Mission Announced',
 'Space agencies from multiple countries have jointly announced a new ambitious mission to explore Mars and search for signs of ancient life.',
 'https://picsum.photos/800/400?random=3',
 'Science Today',
 NOW() - INTERVAL '1 day');
*/

-- ========================================
-- Setup Instructions
-- ========================================
/*
1. Run this SQL in your Supabase SQL Editor
2. Create a Storage bucket named 'avatars' (done above)
3. Set up your .env file with Supabase credentials
4. Run the app with: npx expo start
*/
