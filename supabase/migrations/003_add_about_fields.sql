-- ====================================================================
-- VallPortofolio — About Me & Portrait Image Expansion Migration
-- Migration: 003_add_about_fields.sql
-- ====================================================================

-- Add optional dedicated columns for My Approach and Portrait Avatar URL
ALTER TABLE public.personal_info
  ADD COLUMN IF NOT EXISTS my_approach TEXT DEFAULT 'Saya berkomitmen untuk memberikan solusi yang efisien, mudah dikelola, dan skalabel melalui praktik terbaik rekayasa perangkat lunak dan keandalan sistem cloud (best engineering practices & high availability).',
  ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT '/images/nauval-portrait.png';

-- Note: The application also supports storing and retrieving these inside the existing
-- `currently` JSONB column as a backward-compatible fallback with zero manual migrations required.
