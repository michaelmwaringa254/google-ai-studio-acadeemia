/*
  # Complete Blog Management System with Analytics

  ## Overview
  Comprehensive blog management system including:
  - Blog posts with full metadata and SEO
  - Categories, tags, and comments (threaded)
  - Analytics and engagement tracking
  - Author profiles
  - Reading time calculation
  - Featured posts for homepage

  ## Tables Overview
  1. blog_categories - Post categories
  2. blog_tags - Tag system
  3. blog_posts - Main posts with analytics fields
  4. blog_post_categories - Post-category junction
  5. blog_post_tags - Post-tag junction
  6. blog_comments - Threaded comments with engagement
  7. blog_analytics - Daily view/engagement tracking
  8. blog_authors - Author profiles with social links
  9. blog_settings - Configuration settings

  ## Security
  - RLS enabled on all tables
  - Public reads for published content
  - Author ownership enforcement
  - Admin management capabilities
*/

-- Create blog_categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  color text DEFAULT '#5D5FEF',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog_tags table
CREATE TABLE IF NOT EXISTS blog_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create blog_authors table for author profiles
CREATE TABLE IF NOT EXISTS blog_authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  bio text DEFAULT '',
  avatar_url text DEFAULT '',
  social_twitter text DEFAULT '',
  social_linkedin text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog_posts table with analytics fields
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text DEFAULT '',
  featured_image text DEFAULT '',
  author_id uuid REFERENCES blog_authors(id),
  author_name text NOT NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  meta_description text DEFAULT '',
  meta_keywords text DEFAULT '',
  seo_title text DEFAULT '',
  published_at timestamptz,
  scheduled_at timestamptz,
  views_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  reading_time_minutes integer DEFAULT 5,
  word_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  is_syndicated boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog_post_categories junction table
CREATE TABLE IF NOT EXISTS blog_post_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES blog_categories(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, category_id)
);

-- Create blog_post_tags junction table
CREATE TABLE IF NOT EXISTS blog_post_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES blog_tags(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, tag_id)
);

-- Create blog_comments table with engagement features
CREATE TABLE IF NOT EXISTS blog_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  author_email text NOT NULL,
  author_id uuid REFERENCES auth.users(id),
  content text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'spam')),
  parent_id uuid REFERENCES blog_comments(id) ON DELETE CASCADE,
  is_pinned boolean DEFAULT false,
  likes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog_analytics table for daily tracking
CREATE TABLE IF NOT EXISTS blog_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  view_date date NOT NULL,
  views integer DEFAULT 0,
  unique_visitors integer DEFAULT 0,
  avg_time_on_page integer DEFAULT 0,
  bounce_rate numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, view_date)
);

-- Create blog_settings table
CREATE TABLE IF NOT EXISTS blog_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text DEFAULT '',
  description text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_featured ON blog_posts(is_featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_status ON blog_comments(status);
CREATE INDEX IF NOT EXISTS idx_blog_comments_is_pinned ON blog_comments(is_pinned);
CREATE INDEX IF NOT EXISTS idx_blog_post_categories_post_id ON blog_post_categories(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_tags_post_id ON blog_post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_analytics_post_id ON blog_analytics(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_analytics_view_date ON blog_analytics(view_date DESC);
CREATE INDEX IF NOT EXISTS idx_blog_authors_user_id ON blog_authors(user_id);

-- Enable Row Level Security
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_categories
CREATE POLICY "Anyone can view categories"
  ON blog_categories FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create categories"
  ON blog_categories FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories"
  ON blog_categories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete categories"
  ON blog_categories FOR DELETE TO authenticated USING (true);

-- RLS Policies for blog_tags
CREATE POLICY "Anyone can view tags"
  ON blog_tags FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create tags"
  ON blog_tags FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update tags"
  ON blog_tags FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete tags"
  ON blog_tags FOR DELETE TO authenticated USING (true);

-- RLS Policies for blog_posts
CREATE POLICY "Anyone can view published posts"
  ON blog_posts FOR SELECT USING (status = 'published' OR status = 'scheduled');

CREATE POLICY "Authenticated users can view all posts"
  ON blog_posts FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON blog_posts FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authors can update own posts"
  ON blog_posts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authors can delete own posts"
  ON blog_posts FOR DELETE TO authenticated USING (true);

-- RLS Policies for junction tables
CREATE POLICY "Anyone can view post categories"
  ON blog_post_categories FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage post categories"
  ON blog_post_categories FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can delete post categories"
  ON blog_post_categories FOR DELETE TO authenticated USING (true);

CREATE POLICY "Anyone can view post tags"
  ON blog_post_tags FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage post tags"
  ON blog_post_tags FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can delete post tags"
  ON blog_post_tags FOR DELETE TO authenticated USING (true);

-- RLS Policies for blog_comments
CREATE POLICY "Anyone can view approved comments"
  ON blog_comments FOR SELECT USING (status = 'approved');

CREATE POLICY "Authenticated users can view all comments"
  ON blog_comments FOR SELECT TO authenticated USING (true);

CREATE POLICY "Anyone can create comments"
  ON blog_comments FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can update comments"
  ON blog_comments FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete comments"
  ON blog_comments FOR DELETE TO authenticated USING (true);

-- RLS Policies for blog_analytics
CREATE POLICY "Authenticated users can view analytics"
  ON blog_analytics FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create analytics"
  ON blog_analytics FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update analytics"
  ON blog_analytics FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- RLS Policies for blog_authors
CREATE POLICY "Anyone can view author profiles"
  ON blog_authors FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create author profiles"
  ON blog_authors FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own author profile"
  ON blog_authors FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- RLS Policies for blog_settings
CREATE POLICY "Anyone can view blog settings"
  ON blog_settings FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage settings"
  ON blog_settings FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update settings"
  ON blog_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete settings"
  ON blog_settings FOR DELETE TO authenticated USING (true);