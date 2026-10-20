-- ====================================================================
-- VallPortofolio — Secure Admin Authorization & RLS Hardening
-- Migration: 005_secure_admin_policies.sql
-- ====================================================================

-- 1. SECURITY DEFINER HELPER: public.is_admin()
-- Verifies administrative privileges using trusted auth claims or owner email.
-- Evaluates false for arbitrary authenticated users who registered independently.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true OR
    lower(auth.jwt() ->> 'email') = lower('nvaldymaulana@gmail.com') OR
    lower(auth.jwt() ->> 'email') IN (
      SELECT lower(email) FROM public.personal_info WHERE id = 'default'
    ),
    false
  );
$$;

-- Grant execution to authenticated role
REVOKE ALL ON FUNCTION public.is_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;


-- ====================================================================
-- 2. DROP OVERLY PERMISSIVE POLICIES FROM PREVIOUS MIGRATIONS
-- ====================================================================

-- Drop blanket authenticated policies on contact_messages
DROP POLICY IF EXISTS "Only authenticated users can read contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Only authenticated users can update contact messages" ON public.contact_messages;

-- Drop blanket authenticated policies on projects
DROP POLICY IF EXISTS "Only authenticated users can modify projects" ON public.projects;

-- Drop blanket authenticated policies on personal_info
DROP POLICY IF EXISTS "Only authenticated users can modify personal_info" ON public.personal_info;

-- Drop blanket authenticated storage upload policy
DROP POLICY IF EXISTS "Authenticated Upload Portfolio Bucket" ON storage.objects;


-- ====================================================================
-- 3. APPLY RESTRICTIVE ADMIN-ONLY RLS POLICIES
-- ====================================================================

-- --------------------------------------------------------------------
-- A. TABLE: contact_messages
-- --------------------------------------------------------------------
-- Public cannot read or modify any messages. Only verified admin has access.
CREATE POLICY "Admin can read contact messages"
ON public.contact_messages
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admin can update contact messages"
ON public.contact_messages
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete contact messages"
ON public.contact_messages
FOR DELETE
TO authenticated
USING (public.is_admin());

-- Note: "Public can insert contact messages" policy from 001 remains active
-- to allow visitors to submit inquiries through the contact modal.


-- --------------------------------------------------------------------
-- B. TABLE: projects
-- --------------------------------------------------------------------
-- Public read is preserved via "Public can read projects".
-- Write operations are restricted strictly to verified admin.
CREATE POLICY "Admin can insert projects"
ON public.projects
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update projects"
ON public.projects
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete projects"
ON public.projects
FOR DELETE
TO authenticated
USING (public.is_admin());


-- --------------------------------------------------------------------
-- C. TABLE: personal_info
-- --------------------------------------------------------------------
-- Public read is preserved via "Public can read personal_info".
-- Modification is restricted strictly to verified admin.
CREATE POLICY "Admin can modify personal_info"
ON public.personal_info
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());


-- --------------------------------------------------------------------
-- D. STORAGE BUCKET: portfolio
-- --------------------------------------------------------------------
-- Only verified admin can upload, update, or remove portfolio assets.
CREATE POLICY "Admin can upload portfolio assets"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio' AND public.is_admin());

CREATE POLICY "Admin can update portfolio assets"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio' AND public.is_admin())
WITH CHECK (bucket_id = 'portfolio' AND public.is_admin());

CREATE POLICY "Admin can delete portfolio assets"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio' AND public.is_admin());
