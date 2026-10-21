-- ==============================================================================
-- CINEVAULT / YOUTUBE VIDEO EDITING PORTFOLIO - DATABASE SCHEMA
-- Compatible with Supabase & PostgreSQL (Developer / Free Tier friendly)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  display_name TEXT NOT NULL,
  handle TEXT NOT NULL,
  professional_title TEXT NOT NULL,
  avatar_url TEXT,
  banner_url TEXT,
  short_bio TEXT,
  full_bio TEXT,
  experience_years INTEGER DEFAULT 5,
  projects_completed INTEGER DEFAULT 100,
  skills TEXT[] DEFAULT '{}',
  tools JSONB DEFAULT '[]'::jsonb,
  email TEXT NOT NULL,
  whatsapp TEXT,
  location TEXT,
  availability_status TEXT DEFAULT 'available',
  availability_text TEXT,
  preferred_project_types TEXT[] DEFAULT '{}',
  social_links JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. VIDEOS TABLE
CREATE TABLE IF NOT EXISTS videos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  video_type TEXT NOT NULL CHECK (video_type IN ('short', 'long', 'featured_project')),
  video_source_type TEXT NOT NULL DEFAULT 'direct',
  video_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  poster_url TEXT,
  duration TEXT NOT NULL,
  views BIGINT DEFAULT 0,
  likes BIGINT DEFAULT 0,
  published BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  category_ids TEXT[] DEFAULT '{}',
  client_name TEXT,
  client_contribution TEXT,
  techniques_used TEXT[] DEFAULT '{}',
  before_after_grade JSONB,
  published_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. PROJECT INQUIRIES TABLE (Protected, Admin Only)
CREATE TABLE IF NOT EXISTS project_inquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  project_type TEXT NOT NULL,
  budget_range TEXT NOT NULL,
  message TEXT NOT NULL,
  reference_url TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'contacted', 'completed', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. COMMENTS TABLE
CREATE TABLE IF NOT EXISTS video_comments (
  id TEXT PRIMARY KEY,
  video_id TEXT NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_avatar TEXT NOT NULL,
  author_handle TEXT NOT NULL,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_comments ENABLE ROW LEVEL SECURITY;

-- Public can read published videos, categories, profiles, and comments
CREATE POLICY "Public can view profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can view published videos" ON videos FOR SELECT USING (published = true);
CREATE POLICY "Public can view comments" ON video_comments FOR SELECT USING (true);

-- Public can submit project inquiries (Insert only)
CREATE POLICY "Public can submit inquiries" ON project_inquiries FOR INSERT WITH CHECK (true);

-- Public can post comments on videos (Insert only)
CREATE POLICY "Public can post comments" ON video_comments FOR INSERT WITH CHECK (true);

-- Admin has full access (controlled via service role or auth UID)
CREATE POLICY "Admin full access videos" ON videos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access inquiries" ON project_inquiries FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access profiles" ON profiles FOR ALL USING (auth.role() = 'authenticated');
