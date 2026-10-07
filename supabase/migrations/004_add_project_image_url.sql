-- ====================================================================
-- VallPortofolio — Project Image & Work Gallery Expansion
-- Migration: 004_add_project_image_url.sql
-- ====================================================================

-- Add image_url column to public.projects table
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT NULL;

-- Seed default image URLs for initial projects if currently null
UPDATE public.projects
SET image_url = CASE
  WHEN id = 'fintrack-pro' THEN '/images/projects/fintrack-pro.png'
  WHEN id = 'shopcart' THEN '/images/projects/shopcart.png'
  WHEN id = 'kumo-ai' THEN '/images/projects/kumo-ai.png'
  WHEN id = 'project-shyeund' THEN '/images/projects/cloudops.png'
  WHEN id = 'vallonation' THEN '/images/projects/ctf.png'
  ELSE image_url
END
WHERE image_url IS NULL;
