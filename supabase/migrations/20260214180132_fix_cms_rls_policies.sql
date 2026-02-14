/*
  # Fix CMS RLS Policies

  This migration fixes the RLS policy column reference issues in the cms_content table.
  The section_id column references need proper qualification in the subqueries.
*/

-- Drop existing problematic policies on cms_content
DROP POLICY IF EXISTS "Users can manage content of their own pages" ON cms_content;
DROP POLICY IF EXISTS "Users can update content of their own pages" ON cms_content;
DROP POLICY IF EXISTS "Users can delete content of their own pages" ON cms_content;

-- Drop existing problematic policies on cms_images
DROP POLICY IF EXISTS "Users can manage images of their own pages" ON cms_images;
DROP POLICY IF EXISTS "Users can update images of their own pages" ON cms_images;
DROP POLICY IF EXISTS "Users can delete images of their own pages" ON cms_images;

-- Recreate cms_content policies with proper column qualification
CREATE POLICY "Users can manage content of their own pages"
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

CREATE POLICY "Users can update content of their own pages"
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

CREATE POLICY "Users can delete content of their own pages"
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

-- Recreate cms_images policies with proper column qualification
CREATE POLICY "Users can manage images of their own pages"
  ON cms_images FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cms_pages
      WHERE cms_pages.id = cms_images.page_id
      AND cms_pages.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update images of their own pages"
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

CREATE POLICY "Users can delete images of their own pages"
  ON cms_images FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cms_pages
      WHERE cms_pages.id = cms_images.page_id
      AND cms_pages.created_by = auth.uid()
    )
  );