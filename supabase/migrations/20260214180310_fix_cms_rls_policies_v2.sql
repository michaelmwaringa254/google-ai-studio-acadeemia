/*
  # Fix CMS RLS Policies - Proper Implementation

  This migration fixes the RLS policy column reference issues.
  Drops and recreates policies for all CMS tables with proper security checks.
*/

-- Drop existing policies on cms_pages
DROP POLICY IF EXISTS "Users can view published pages" ON cms_pages;
DROP POLICY IF EXISTS "Users can insert their own pages" ON cms_pages;
DROP POLICY IF EXISTS "Users can update their own pages" ON cms_pages;
DROP POLICY IF EXISTS "Users can delete their own pages" ON cms_pages;

-- Drop existing policies on cms_sections
DROP POLICY IF EXISTS "Users can view sections of published pages" ON cms_sections;
DROP POLICY IF EXISTS "Users can insert sections in their pages" ON cms_sections;
DROP POLICY IF EXISTS "Users can update sections of their pages" ON cms_sections;
DROP POLICY IF EXISTS "Users can delete sections of their pages" ON cms_sections;

-- Drop existing policies on cms_content
DROP POLICY IF EXISTS "Users can view content of published pages" ON cms_content;
DROP POLICY IF EXISTS "Users can insert content in their pages" ON cms_content;
DROP POLICY IF EXISTS "Users can update content of their pages" ON cms_content;
DROP POLICY IF EXISTS "Users can delete content of their pages" ON cms_content;
DROP POLICY IF EXISTS "Users can manage content of their own pages" ON cms_content;
DROP POLICY IF EXISTS "Users can update content of their own pages" ON cms_content;
DROP POLICY IF EXISTS "Users can delete content of their own pages" ON cms_content;

-- Drop existing policies on cms_images
DROP POLICY IF EXISTS "Users can view images of published pages" ON cms_images;
DROP POLICY IF EXISTS "Users can insert images in their pages" ON cms_images;
DROP POLICY IF EXISTS "Users can update images of their pages" ON cms_images;
DROP POLICY IF EXISTS "Users can delete images of their pages" ON cms_images;
DROP POLICY IF EXISTS "Users can manage images of their own pages" ON cms_images;
DROP POLICY IF EXISTS "Users can update images of their own pages" ON cms_images;
DROP POLICY IF EXISTS "Users can delete images of their own pages" ON cms_images;

-- Create RLS policies for cms_pages
CREATE POLICY "Users can view published pages"
  ON cms_pages FOR SELECT
  USING (is_published = true OR created_by = auth.uid());

CREATE POLICY "Users can insert their own pages"
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

-- Create RLS policies for cms_sections
CREATE POLICY "Users can view sections of published pages"
  ON cms_sections FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM cms_pages
      WHERE cms_pages.id = cms_sections.page_id
      AND (cms_pages.is_published = true OR cms_pages.created_by = auth.uid())
    )
  );

CREATE POLICY "Users can insert sections in their pages"
  ON cms_sections FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cms_pages
      WHERE cms_pages.id = cms_sections.page_id
      AND cms_pages.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update sections of their pages"
  ON cms_sections FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cms_pages
      WHERE cms_pages.id = cms_sections.page_id
      AND cms_pages.created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cms_pages
      WHERE cms_pages.id = cms_sections.page_id
      AND cms_pages.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete sections of their pages"
  ON cms_sections FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cms_pages
      WHERE cms_pages.id = cms_sections.page_id
      AND cms_pages.created_by = auth.uid()
    )
  );

-- Create RLS policies for cms_content
CREATE POLICY "Users can view content of published pages"
  ON cms_content FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM cms_sections
      INNER JOIN cms_pages ON cms_pages.id = cms_sections.page_id
      WHERE cms_sections.id = cms_content.section_id
      AND (cms_pages.is_published = true OR cms_pages.created_by = auth.uid())
    )
  );

CREATE POLICY "Users can insert content in their pages"
  ON cms_content FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cms_sections
      INNER JOIN cms_pages ON cms_pages.id = cms_sections.page_id
      WHERE cms_sections.id = cms_content.section_id
      AND cms_pages.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update content of their pages"
  ON cms_content FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cms_sections
      INNER JOIN cms_pages ON cms_pages.id = cms_sections.page_id
      WHERE cms_sections.id = cms_content.section_id
      AND cms_pages.created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cms_sections
      INNER JOIN cms_pages ON cms_pages.id = cms_sections.page_id
      WHERE cms_sections.id = cms_content.section_id
      AND cms_pages.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete content of their pages"
  ON cms_content FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cms_sections
      INNER JOIN cms_pages ON cms_pages.id = cms_sections.page_id
      WHERE cms_sections.id = cms_content.section_id
      AND cms_pages.created_by = auth.uid()
    )
  );

-- Create RLS policies for cms_images
CREATE POLICY "Users can view images of published pages"
  ON cms_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM cms_pages
      WHERE cms_pages.id = cms_images.page_id
      AND (cms_pages.is_published = true OR cms_pages.created_by = auth.uid())
    )
  );

CREATE POLICY "Users can insert images in their pages"
  ON cms_images FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cms_pages
      WHERE cms_pages.id = cms_images.page_id
      AND cms_pages.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update images of their pages"
  ON cms_images FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cms_pages
      WHERE cms_pages.id = cms_images.page_id
      AND cms_pages.created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cms_pages
      WHERE cms_pages.id = cms_images.page_id
      AND cms_pages.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete images of their pages"
  ON cms_images FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cms_pages
      WHERE cms_pages.id = cms_images.page_id
      AND cms_pages.created_by = auth.uid()
    )
  );