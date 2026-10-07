-- ====================================================================
-- VallPortofolio — About Me & Portrait Image Expansion Migration
-- Migration: 003_add_about_fields.sql
-- ====================================================================

-- Add optional dedicated columns for My Approach and Portrait Avatar URL
ALTER TABLE public.personal_info
  ADD COLUMN IF NOT EXISTS my_approach TEXT DEFAULT 'Saya berkomitmen untuk memberikan solusi yang efisien, mudah dikelola, dan skalabel melalui praktik terbaik rekayasa perangkat lunak dan keandalan sistem cloud (best engineering practices & high availability).',
  ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT '/images/nauval-portrait.png';

-- Optional: Create storage bucket for uploaded assets (if Supabase Storage is preferred)
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy: Allow public read
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Public Access Portfolio Bucket'
  ) THEN
    CREATE POLICY "Public Access Portfolio Bucket"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'portfolio');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated Upload Portfolio Bucket'
  ) THEN
    CREATE POLICY "Authenticated Upload Portfolio Bucket"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'portfolio');
  END IF;
END $$;
