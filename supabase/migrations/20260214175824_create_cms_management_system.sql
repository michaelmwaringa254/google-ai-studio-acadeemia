/*
  # CMS Management System

  ## Overview
  This migration creates the complete database schema for managing website content through the CMS.
  It supports creating pages, organizing content into sections, and managing different types of content blocks.

  ## New Tables

  ### `cms_pages`
  - `id` (uuid, primary key) - Unique identifier for each page
  - `title` (text) - Page title displayed in CMS and frontend
  - `slug` (text, unique) - URL-friendly identifier (e.g., "about-us")
  - `description` (text) - Brief description of the page
  - `is_published` (boolean) - Whether the page is published or in draft state
  - `created_by` (uuid, foreign key) - Reference to auth.users who created the page
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record last update timestamp

  ### `cms_sections`
  - `id` (uuid, primary key) - Unique identifier for each section
  - `page_id` (uuid, foreign key) - Reference to cms_pages table
  - `title` (text) - Section title (e.g., "Hero", "Features", "Testimonials")
  - `order` (integer) - Display order within the page
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record last update timestamp

  ### `cms_content`
  - `id` (uuid, primary key) - Unique identifier for each content block
  - `section_id` (uuid, foreign key) - Reference to cms_sections table
  - `type` (text) - Content type: 'text', 'image', 'heading', 'paragraph'
  - `content` (jsonb) - Flexible JSON content based on type
  - `order` (integer) - Display order within the section
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record last update timestamp

  ### `cms_images`
  - `id` (uuid, primary key) - Unique identifier for each image
  - `page_id` (uuid, foreign key) - Reference to cms_pages table
  - `url` (text) - Image URL or path
  - `alt_text` (text) - Alt text for accessibility
  - `title` (text) - Image title/name
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record last update timestamp

  ## Security
  - Enable RLS on all tables
  - Users can only manage their own pages
  - Published pages are viewable by all authenticated users
  - Draft pages are private to the creator

  ## Important Notes
  1. Pages use slugs as unique identifiers for URL purposes
  2. Sections are ordered within a page for proper rendering
  3. Content blocks support flexible JSON for different types of content
  4. Images are associated with pages for organization
*/

-- Create cms_pages table
CREATE TABLE IF NOT EXISTS cms_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  is_published boolean DEFAULT false,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cms_sections table
CREATE TABLE IF NOT EXISTS cms_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES cms_pages(id) ON UPDATE CASCADE ON DELETE CASCADE,
  title text NOT NULL,
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cms_content table
CREATE TABLE IF NOT EXISTS cms_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES cms_sections(id) ON UPDATE CASCADE ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'text',
  content jsonb DEFAULT '{}',
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cms_images table
CREATE TABLE IF NOT EXISTS cms_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES cms_pages(id) ON UPDATE CASCADE ON DELETE CASCADE,
  url text NOT NULL,
  alt_text text DEFAULT '',
  title text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cms_pages_slug ON cms_pages(slug);
CREATE INDEX IF NOT EXISTS idx_cms_pages_created_by ON cms_pages(created_by);
CREATE INDEX IF NOT EXISTS idx_cms_pages_is_published ON cms_pages(is_published);
CREATE INDEX IF NOT EXISTS idx_cms_sections_page_id ON cms_sections(page_id);
CREATE INDEX IF NOT EXISTS idx_cms_sections_order ON cms_sections(page_id, "order");
CREATE INDEX IF NOT EXISTS idx_cms_content_section_id ON cms_content(section_id);
CREATE INDEX IF NOT EXISTS idx_cms_content_order ON cms_content(section_id, "order");
CREATE INDEX IF NOT EXISTS idx_cms_images_page_id ON cms_images(page_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_cms_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
DROP TRIGGER IF EXISTS update_cms_pages_updated_at ON cms_pages;
CREATE TRIGGER update_cms_pages_updated_at
  BEFORE UPDATE ON cms_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_cms_updated_at_column();

DROP TRIGGER IF EXISTS update_cms_sections_updated_at ON cms_sections;
CREATE TRIGGER update_cms_sections_updated_at
  BEFORE UPDATE ON cms_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_cms_updated_at_column();

DROP TRIGGER IF EXISTS update_cms_content_updated_at ON cms_content;
CREATE TRIGGER update_cms_content_updated_at
  BEFORE UPDATE ON cms_content
  FOR EACH ROW
  EXECUTE FUNCTION update_cms_updated_at_column();

DROP TRIGGER IF EXISTS update_cms_images_updated_at ON cms_images;
CREATE TRIGGER update_cms_images_updated_at
  BEFORE UPDATE ON cms_images
  FOR EACH ROW
  EXECUTE FUNCTION update_cms_updated_at_column();

-- Enable Row Level Security
ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cms_pages
CREATE POLICY "Users can view published pages"
  ON cms_pages FOR SELECT
  TO authenticated
  USING (is_published = true OR created_by = auth.uid());

CREATE POLICY "Users can create their own pages"
  ON cms_pages FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own pages"
  ON cms_pages FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can delete their own pages"
  ON cms_pages FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- RLS Policies for cms_sections (inherit access from page)
CREATE POLICY "Users can view sections of accessible pages"
  ON cms_sections FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cms_pages
      WHERE cms_pages.id = cms_sections.page_id
      AND (cms_pages.is_published = true OR cms_pages.created_by = auth.uid())
    )
  );

CREATE POLICY "Users can manage sections of their own pages"
  ON cms_sections FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cms_pages
      WHERE cms_pages.id = page_id
      AND cms_pages.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update sections of their own pages"
  ON cms_sections FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cms_pages
      WHERE cms_pages.id = page_id
      AND cms_pages.created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cms_pages
      WHERE cms_pages.id = page_id
      AND cms_pages.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete sections of their own pages"
  ON cms_sections FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cms_pages
      WHERE cms_pages.id = page_id
      AND cms_pages.created_by = auth.uid()
    )
  );

-- RLS Policies for cms_content (inherit access from section/page)
CREATE POLICY "Users can view content of accessible pages"
  ON cms_content FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cms_sections
      INNER JOIN cms_pages ON cms_pages.id = cms_sections.page_id
      WHERE cms_sections.id = cms_content.section_id
      AND (cms_pages.is_published = true OR cms_pages.created_by = auth.uid())
    )
  );

CREATE POLICY "Users can manage content of their own pages"
  ON cms_content FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cms_sections
      INNER JOIN cms_pages ON cms_pages.id = cms_sections.page_id
      WHERE cms_sections.id = section_id
      AND cms_pages.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update content of their own pages"
  ON cms_content FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cms_sections
      INNER JOIN cms_pages ON cms_pages.id = cms_sections.page_id
      WHERE cms_sections.id = section_id
      AND cms_pages.created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cms_sections
      INNER JOIN cms_pages ON cms_pages.id = cms_sections.page_id
      WHERE cms_sections.id = section_id
      AND cms_pages.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete content of their own pages"
  ON cms_content FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cms_sections
      INNER JOIN cms_pages ON cms_pages.id = cms_sections.page_id
      WHERE cms_sections.id = section_id
      AND cms_pages.created_by = auth.uid()
    )
  );

-- RLS Policies for cms_images (inherit access from page)
CREATE POLICY "Users can view images from accessible pages"
  ON cms_images FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cms_pages
      WHERE cms_pages.id = page_id
      AND (cms_pages.is_published = true OR cms_pages.created_by = auth.uid())
    )
  );

CREATE POLICY "Users can manage images of their own pages"
  ON cms_images FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cms_pages
      WHERE cms_pages.id = page_id
      AND cms_pages.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update images of their own pages"
  ON cms_images FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cms_pages
      WHERE cms_pages.id = page_id
      AND cms_pages.created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cms_pages
      WHERE cms_pages.id = page_id
      AND cms_pages.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete images of their own pages"
  ON cms_images FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cms_pages
      WHERE cms_pages.id = page_id
      AND cms_pages.created_by = auth.uid()
    )
  );