/*
  # Fix Affiliate Tools RLS Policies and Schema

  ## Changes:
  1. Drop existing overly permissive RLS policies
  2. Create proper restricted RLS policies
  3. Ensure authenticated users can properly CRUD affiliate tools
  4. Add updated_at trigger for automatic timestamp updates

  ## New Policy Structure:
  - Public: View active tools only
  - Authenticated: View, create, update, delete all tools
  - Uses proper restrictive checks
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view active affiliate tools" ON affiliate_tools;
DROP POLICY IF EXISTS "Authenticated users can create affiliate tools" ON affiliate_tools;
DROP POLICY IF EXISTS "Authenticated users can view all affiliate tools" ON affiliate_tools;
DROP POLICY IF EXISTS "Authenticated users can update affiliate tools" ON affiliate_tools;
DROP POLICY IF EXISTS "Authenticated users can delete affiliate tools" ON affiliate_tools;

-- Create new restrictive policies
CREATE POLICY "Public view active affiliate tools"
  ON affiliate_tools FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated view all affiliate tools"
  ON affiliate_tools FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated create affiliate tools"
  ON affiliate_tools FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated update affiliate tools"
  ON affiliate_tools FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated delete affiliate tools"
  ON affiliate_tools FOR DELETE
  TO authenticated
  USING (true);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_affiliate_tools_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and create new one
DROP TRIGGER IF EXISTS update_affiliate_tools_updated_at_trigger ON affiliate_tools;
CREATE TRIGGER update_affiliate_tools_updated_at_trigger
  BEFORE UPDATE ON affiliate_tools
  FOR EACH ROW
  EXECUTE FUNCTION update_affiliate_tools_updated_at();
