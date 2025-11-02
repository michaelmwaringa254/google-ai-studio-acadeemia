/*
  # Create Classes and Sections Management System

  ## Overview
  This migration creates the academic class and section management system for schools.
  It creates classes and sections tables that reference the existing schools table.

  ## New Tables

  ### 1. `classes`
  Stores class information
  - `id` (uuid, primary key) - Unique class identifier
  - `school_id` (uuid, not null) - Foreign key to schools
  - `name` (text, not null) - Class name (e.g., "Six", "Seven")
  - `class_numeric` (integer, not null) - Numeric value for sorting
  - `section` (text, not null) - Section name (e.g., "A", "B")
  - `created_at` (timestamptz, default now()) - Creation timestamp
  - `updated_at` (timestamptz, default now()) - Last update timestamp

  ### 2. `sections`
  Stores section information with capacity
  - `id` (uuid, primary key) - Unique section identifier
  - `school_id` (uuid, not null) - Foreign key to schools
  - `name` (text, not null) - Section name (e.g., "A", "B")
  - `capacity` (integer, default 0) - Maximum students allowed
  - `created_at` (timestamptz, default now()) - Creation timestamp
  - `updated_at` (timestamptz, default now()) - Last update timestamp

  ## Security
  - RLS enabled on all tables
  - Authenticated users can manage all records
  - Public read access disabled

  ## Indexes
  - Index on school_id for foreign key relationships
  - Index on class_numeric for sorting
*/

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name text NOT NULL,
  class_numeric integer NOT NULL,
  section text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sections table
CREATE TABLE IF NOT EXISTS sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name text NOT NULL,
  capacity integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_classes_school_id ON classes(school_id);
CREATE INDEX IF NOT EXISTS idx_classes_numeric ON classes(class_numeric);
CREATE INDEX IF NOT EXISTS idx_sections_school_id ON sections(school_id);

-- Enable Row Level Security
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for classes
CREATE POLICY "Authenticated users can view classes"
  ON classes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert classes"
  ON classes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update classes"
  ON classes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete classes"
  ON classes FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for sections
CREATE POLICY "Authenticated users can view sections"
  ON sections FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert sections"
  ON sections FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update sections"
  ON sections FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete sections"
  ON sections FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample schools (only if they don't exist)
INSERT INTO schools (name, address)
SELECT 'Icon School & College', '123 Education Street, City Center'
WHERE NOT EXISTS (SELECT 1 FROM schools WHERE name = 'Icon School & College');

INSERT INTO schools (name, address)
SELECT 'Oxford International', '456 Academic Avenue, Downtown'
WHERE NOT EXISTS (SELECT 1 FROM schools WHERE name = 'Oxford International');

-- Insert sample sections
INSERT INTO sections (school_id, name, capacity)
SELECT s.id, 'A', 100 FROM schools s WHERE s.name = 'Icon School & College'
UNION ALL
SELECT s.id, 'B', 100 FROM schools s WHERE s.name = 'Icon School & College'
UNION ALL
SELECT s.id, 'A', 35 FROM schools s WHERE s.name = 'Oxford International'
UNION ALL
SELECT s.id, 'B', 30 FROM schools s WHERE s.name = 'Oxford International';

-- Insert sample classes
INSERT INTO classes (school_id, name, class_numeric, section)
SELECT s.id, 'Six', 6, 'A' FROM schools s WHERE s.name = 'Icon School & College'
UNION ALL
SELECT s.id, 'Six', 6, 'B' FROM schools s WHERE s.name = 'Icon School & College'
UNION ALL
SELECT s.id, 'Seven', 7, 'A' FROM schools s WHERE s.name = 'Icon School & College'
UNION ALL
SELECT s.id, 'Seven', 7, 'B' FROM schools s WHERE s.name = 'Icon School & College'
UNION ALL
SELECT s.id, 'Eight', 8, 'A' FROM schools s WHERE s.name = 'Icon School & College'
UNION ALL
SELECT s.id, 'Eight', 8, 'B' FROM schools s WHERE s.name = 'Icon School & College'
UNION ALL
SELECT s.id, 'Nine', 9, 'A' FROM schools s WHERE s.name = 'Icon School & College'
UNION ALL
SELECT s.id, 'Nine', 9, 'B' FROM schools s WHERE s.name = 'Icon School & College'
UNION ALL
SELECT s.id, 'Ten', 10, 'A' FROM schools s WHERE s.name = 'Icon School & College'
UNION ALL
SELECT s.id, 'Ten', 10, 'B' FROM schools s WHERE s.name = 'Icon School & College'
UNION ALL
SELECT s.id, 'Six', 6, 'A' FROM schools s WHERE s.name = 'Oxford International'
UNION ALL
SELECT s.id, 'Six', 6, 'B' FROM schools s WHERE s.name = 'Oxford International'
UNION ALL
SELECT s.id, 'Seven', 7, 'A' FROM schools s WHERE s.name = 'Oxford International'
UNION ALL
SELECT s.id, 'Seven', 7, 'B' FROM schools s WHERE s.name = 'Oxford International'
UNION ALL
SELECT s.id, 'Eight', 8, 'A' FROM schools s WHERE s.name = 'Icon School & College';
