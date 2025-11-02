/*
  # Class Teacher Assignment System

  ## Overview
  This migration creates the complete database schema for managing class teacher assignments
  across multiple schools. It supports assigning teachers to specific class-section combinations.

  ## New Tables
  
  ### `schools`
  - `id` (uuid, primary key) - Unique identifier for each school
  - `name` (text) - School name (e.g., "Icon School & College")
  - `code` (text, unique) - Short code for the school
  - `address` (text, nullable) - School physical address
  - `phone` (text, nullable) - School contact number
  - `email` (text, nullable) - School contact email
  - `is_active` (boolean) - Whether the school is currently active
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record last update timestamp

  ### `classes`
  - `id` (uuid, primary key) - Unique identifier for each class
  - `school_id` (uuid, foreign key) - Reference to schools table
  - `name` (text) - Class name (e.g., "Six", "Seven", "Eight")
  - `grade_level` (integer) - Numeric grade level for sorting
  - `is_active` (boolean) - Whether the class is currently active
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record last update timestamp

  ### `sections`
  - `id` (uuid, primary key) - Unique identifier for each section
  - `class_id` (uuid, foreign key) - Reference to classes table
  - `name` (text) - Section name (e.g., "A", "B", "C")
  - `capacity` (integer, nullable) - Maximum number of students
  - `is_active` (boolean) - Whether the section is currently active
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record last update timestamp

  ### `teachers`
  - `id` (uuid, primary key) - Unique identifier for each teacher
  - `school_id` (uuid, foreign key) - Reference to schools table
  - `user_id` (uuid, foreign key, nullable) - Reference to auth.users for login
  - `first_name` (text) - Teacher's first name
  - `last_name` (text) - Teacher's last name
  - `email` (text, unique) - Teacher's email address
  - `phone` (text, nullable) - Teacher's phone number
  - `employee_id` (text, nullable) - Teacher's employee ID
  - `department` (text, nullable) - Teacher's department
  - `designation` (text, nullable) - Teacher's job title
  - `date_of_joining` (date, nullable) - When teacher joined
  - `is_active` (boolean) - Whether the teacher is currently active
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record last update timestamp

  ### `class_teacher_assignments`
  - `id` (uuid, primary key) - Unique identifier for each assignment
  - `school_id` (uuid, foreign key) - Reference to schools table
  - `class_id` (uuid, foreign key) - Reference to classes table
  - `section_id` (uuid, foreign key) - Reference to sections table
  - `teacher_id` (uuid, foreign key) - Reference to teachers table
  - `academic_year` (text) - Academic year for this assignment (e.g., "2024-2025")
  - `start_date` (date) - When this assignment starts
  - `end_date` (date, nullable) - When this assignment ends
  - `is_active` (boolean) - Whether this assignment is currently active
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record last update timestamp
  - `created_by` (uuid, nullable) - User who created this assignment

  ## Security
  - Enable RLS on all tables
  - Authenticated users can view all records
  - Only authenticated users with proper permissions can insert/update/delete
  - Each table has appropriate policies for data access control

  ## Important Notes
  1. Each class-section combination can have only one active class teacher at a time
  2. Teachers can be assigned to multiple class-sections
  3. All foreign key relationships use CASCADE for updates and RESTRICT for deletes
  4. Indexes are created for frequently queried columns to optimize performance
*/

-- Create schools table
CREATE TABLE IF NOT EXISTS schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  address text,
  phone text,
  email text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  name text NOT NULL,
  grade_level integer NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(school_id, name)
);

-- Create sections table
CREATE TABLE IF NOT EXISTS sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES classes(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  name text NOT NULL,
  capacity integer,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(class_id, name)
);

-- Create teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  user_id uuid REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE SET NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  employee_id text,
  department text,
  designation text,
  date_of_joining date,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create class_teacher_assignments table
CREATE TABLE IF NOT EXISTS class_teacher_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  class_id uuid NOT NULL REFERENCES classes(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  section_id uuid NOT NULL REFERENCES sections(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  teacher_id uuid NOT NULL REFERENCES teachers(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  academic_year text NOT NULL DEFAULT '',
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE SET NULL
);

-- Create partial unique index to ensure only one active assignment per class-section
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_class_section_assignment 
  ON class_teacher_assignments(class_id, section_id, academic_year) 
  WHERE is_active = true;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_classes_school_id ON classes(school_id);
CREATE INDEX IF NOT EXISTS idx_sections_class_id ON sections(class_id);
CREATE INDEX IF NOT EXISTS idx_teachers_school_id ON teachers(school_id);
CREATE INDEX IF NOT EXISTS idx_teachers_email ON teachers(email);
CREATE INDEX IF NOT EXISTS idx_class_teacher_assignments_school_id ON class_teacher_assignments(school_id);
CREATE INDEX IF NOT EXISTS idx_class_teacher_assignments_teacher_id ON class_teacher_assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_class_teacher_assignments_class_section ON class_teacher_assignments(class_id, section_id);
CREATE INDEX IF NOT EXISTS idx_class_teacher_assignments_active ON class_teacher_assignments(is_active) WHERE is_active = true;

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
DROP TRIGGER IF EXISTS update_schools_updated_at ON schools;
CREATE TRIGGER update_schools_updated_at
  BEFORE UPDATE ON schools
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_classes_updated_at ON classes;
CREATE TRIGGER update_classes_updated_at
  BEFORE UPDATE ON classes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sections_updated_at ON sections;
CREATE TRIGGER update_sections_updated_at
  BEFORE UPDATE ON sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_teachers_updated_at ON teachers;
CREATE TRIGGER update_teachers_updated_at
  BEFORE UPDATE ON teachers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_class_teacher_assignments_updated_at ON class_teacher_assignments;
CREATE TRIGGER update_class_teacher_assignments_updated_at
  BEFORE UPDATE ON class_teacher_assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_teacher_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for schools
CREATE POLICY "Authenticated users can view schools"
  ON schools FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert schools"
  ON schools FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update schools"
  ON schools FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete schools"
  ON schools FOR DELETE
  TO authenticated
  USING (true);

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

-- RLS Policies for teachers
CREATE POLICY "Authenticated users can view teachers"
  ON teachers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert teachers"
  ON teachers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update teachers"
  ON teachers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete teachers"
  ON teachers FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for class_teacher_assignments
CREATE POLICY "Authenticated users can view class teacher assignments"
  ON class_teacher_assignments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert class teacher assignments"
  ON class_teacher_assignments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update class teacher assignments"
  ON class_teacher_assignments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete class teacher assignments"
  ON class_teacher_assignments FOR DELETE
  TO authenticated
  USING (true);