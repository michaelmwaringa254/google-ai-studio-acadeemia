/*
  # Seed Data for Class Teacher Assignment System

  ## Overview
  This migration populates the database with sample data for testing and demonstration purposes.

  ## Data Inserted
  
  ### Schools
  - Icon School & College
  - Oxford International

  ### Classes
  - Classes for each school (Six, Seven, Eight)

  ### Sections
  - Sections A, B, C for various classes

  ### Teachers
  - Sample teachers assigned to different schools

  ### Class Teacher Assignments
  - Sample assignments matching the UI mockup data

  ## Important Notes
  - This is seed data for development/testing purposes
  - All IDs are generated using gen_random_uuid()
  - Academic year is set to 2024-2025
  - All records are marked as active by default
*/

-- Insert Schools
INSERT INTO schools (name, code, address, phone, email, is_active)
VALUES 
  ('Icon School & College', 'ICON', '123 Education Street, City', '+1-234-567-8900', 'info@iconschool.edu', true),
  ('Oxford International', 'OXFORD', '456 Academic Avenue, Town', '+1-234-567-8901', 'contact@oxfordintl.edu', true)
ON CONFLICT (code) DO NOTHING;

-- Get school IDs and insert related data
DO $$
DECLARE
  icon_school_id uuid;
  oxford_school_id uuid;
  class_six_icon_id uuid;
  class_seven_icon_id uuid;
  class_eight_icon_id uuid;
  class_six_oxford_id uuid;
  class_seven_oxford_id uuid;
  section_a_six_icon_id uuid;
  section_a_seven_icon_id uuid;
  section_a_eight_icon_id uuid;
  section_a_six_oxford_id uuid;
  section_b_seven_oxford_id uuid;
  teacher_summer_id uuid;
  teacher_jose_id uuid;
  teacher_nannie_id uuid;
  teacher_shannon_id uuid;
  teacher_george_id uuid;
BEGIN
  -- Get school IDs
  SELECT id INTO icon_school_id FROM schools WHERE code = 'ICON' LIMIT 1;
  SELECT id INTO oxford_school_id FROM schools WHERE code = 'OXFORD' LIMIT 1;

  -- Insert Classes for Icon School & College
  INSERT INTO classes (school_id, name, grade_level, is_active)
  VALUES 
    (icon_school_id, 'Six', 6, true),
    (icon_school_id, 'Seven', 7, true),
    (icon_school_id, 'Eight', 8, true)
  ON CONFLICT (school_id, name) DO NOTHING;

  -- Get class IDs for Icon School
  SELECT id INTO class_six_icon_id FROM classes WHERE school_id = icon_school_id AND name = 'Six' LIMIT 1;
  SELECT id INTO class_seven_icon_id FROM classes WHERE school_id = icon_school_id AND name = 'Seven' LIMIT 1;
  SELECT id INTO class_eight_icon_id FROM classes WHERE school_id = icon_school_id AND name = 'Eight' LIMIT 1;

  -- Insert Classes for Oxford International
  INSERT INTO classes (school_id, name, grade_level, is_active)
  VALUES 
    (oxford_school_id, 'Six', 6, true),
    (oxford_school_id, 'Seven', 7, true)
  ON CONFLICT (school_id, name) DO NOTHING;

  -- Get class IDs for Oxford International
  SELECT id INTO class_six_oxford_id FROM classes WHERE school_id = oxford_school_id AND name = 'Six' LIMIT 1;
  SELECT id INTO class_seven_oxford_id FROM classes WHERE school_id = oxford_school_id AND name = 'Seven' LIMIT 1;

  -- Insert Sections for Icon School classes
  INSERT INTO sections (class_id, name, capacity, is_active)
  VALUES 
    (class_six_icon_id, 'A', 40, true),
    (class_seven_icon_id, 'A', 40, true),
    (class_eight_icon_id, 'A', 40, true)
  ON CONFLICT (class_id, name) DO NOTHING;

  -- Get section IDs for Icon School
  SELECT id INTO section_a_six_icon_id FROM sections WHERE class_id = class_six_icon_id AND name = 'A' LIMIT 1;
  SELECT id INTO section_a_seven_icon_id FROM sections WHERE class_id = class_seven_icon_id AND name = 'A' LIMIT 1;
  SELECT id INTO section_a_eight_icon_id FROM sections WHERE class_id = class_eight_icon_id AND name = 'A' LIMIT 1;

  -- Insert Sections for Oxford International classes
  INSERT INTO sections (class_id, name, capacity, is_active)
  VALUES 
    (class_six_oxford_id, 'A', 35, true),
    (class_seven_oxford_id, 'B', 35, true)
  ON CONFLICT (class_id, name) DO NOTHING;

  -- Get section IDs for Oxford International
  SELECT id INTO section_a_six_oxford_id FROM sections WHERE class_id = class_six_oxford_id AND name = 'A' LIMIT 1;
  SELECT id INTO section_b_seven_oxford_id FROM sections WHERE class_id = class_seven_oxford_id AND name = 'B' LIMIT 1;

  -- Insert Teachers for Icon School & College
  INSERT INTO teachers (school_id, first_name, last_name, email, phone, employee_id, department, designation, date_of_joining, is_active)
  VALUES 
    (icon_school_id, 'Summer', 'Simpson', 'summer.simpson@iconschool.edu', '+1-234-567-0001', 'EMP001', 'Mathematics', 'Senior Teacher', '2020-08-15', true),
    (icon_school_id, 'Jose', 'McKinley', 'jose.mckinley@iconschool.edu', '+1-234-567-0002', 'EMP002', 'Science', 'Lead Teacher', '2019-07-20', true),
    (icon_school_id, 'Nannie', 'Henriques', 'nannie.henriques@iconschool.edu', '+1-234-567-0003', 'EMP003', 'English', 'Teacher', '2021-06-10', true)
  ON CONFLICT (email) DO NOTHING;

  -- Get teacher IDs for Icon School
  SELECT id INTO teacher_summer_id FROM teachers WHERE email = 'summer.simpson@iconschool.edu' LIMIT 1;
  SELECT id INTO teacher_jose_id FROM teachers WHERE email = 'jose.mckinley@iconschool.edu' LIMIT 1;
  SELECT id INTO teacher_nannie_id FROM teachers WHERE email = 'nannie.henriques@iconschool.edu' LIMIT 1;

  -- Insert Teachers for Oxford International
  INSERT INTO teachers (school_id, first_name, last_name, email, phone, employee_id, department, designation, date_of_joining, is_active)
  VALUES 
    (oxford_school_id, 'Shannon', 'Ellis', 'shannon.ellis@oxfordintl.edu', '+1-234-567-0004', 'EMP101', 'Mathematics', 'Senior Teacher', '2018-09-01', true),
    (oxford_school_id, 'George', 'Foxall', 'george.foxall@oxfordintl.edu', '+1-234-567-0005', 'EMP102', 'History', 'Teacher', '2020-01-15', true)
  ON CONFLICT (email) DO NOTHING;

  -- Get teacher IDs for Oxford International
  SELECT id INTO teacher_shannon_id FROM teachers WHERE email = 'shannon.ellis@oxfordintl.edu' LIMIT 1;
  SELECT id INTO teacher_george_id FROM teachers WHERE email = 'george.foxall@oxfordintl.edu' LIMIT 1;

  -- Insert Class Teacher Assignments for Icon School & College
  IF teacher_summer_id IS NOT NULL AND section_a_six_icon_id IS NOT NULL THEN
    INSERT INTO class_teacher_assignments (school_id, class_id, section_id, teacher_id, academic_year, start_date, is_active)
    VALUES (icon_school_id, class_six_icon_id, section_a_six_icon_id, teacher_summer_id, '2024-2025', '2024-08-01', true)
    ON CONFLICT DO NOTHING;
  END IF;

  IF teacher_jose_id IS NOT NULL AND section_a_seven_icon_id IS NOT NULL THEN
    INSERT INTO class_teacher_assignments (school_id, class_id, section_id, teacher_id, academic_year, start_date, is_active)
    VALUES (icon_school_id, class_seven_icon_id, section_a_seven_icon_id, teacher_jose_id, '2024-2025', '2024-08-01', true)
    ON CONFLICT DO NOTHING;
  END IF;

  IF teacher_nannie_id IS NOT NULL AND section_a_eight_icon_id IS NOT NULL THEN
    INSERT INTO class_teacher_assignments (school_id, class_id, section_id, teacher_id, academic_year, start_date, is_active)
    VALUES (icon_school_id, class_eight_icon_id, section_a_eight_icon_id, teacher_nannie_id, '2024-2025', '2024-08-01', true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Insert Class Teacher Assignments for Oxford International
  IF teacher_shannon_id IS NOT NULL AND section_a_six_oxford_id IS NOT NULL THEN
    INSERT INTO class_teacher_assignments (school_id, class_id, section_id, teacher_id, academic_year, start_date, is_active)
    VALUES (oxford_school_id, class_six_oxford_id, section_a_six_oxford_id, teacher_shannon_id, '2024-2025', '2024-08-01', true)
    ON CONFLICT DO NOTHING;
  END IF;

  IF teacher_george_id IS NOT NULL AND section_b_seven_oxford_id IS NOT NULL THEN
    INSERT INTO class_teacher_assignments (school_id, class_id, section_id, teacher_id, academic_year, start_date, is_active)
    VALUES (oxford_school_id, class_seven_oxford_id, section_b_seven_oxford_id, teacher_george_id, '2024-2025', '2024-08-01', true)
    ON CONFLICT DO NOTHING;
  END IF;

END $$;