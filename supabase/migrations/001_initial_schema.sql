-- ====================================================================
-- VallPortofolio — Initial Supabase PostgreSQL Database Schema
-- Migration: 001_initial_schema.sql
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- 2. TABLE: coffee_counter
-- Stores persistent global coffee counts across all visitors and devices
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.coffee_counter (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL DEFAULT 'global',
  count BIGINT NOT NULL DEFAULT 65,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index on slug for rapid lookup
CREATE INDEX IF NOT EXISTS idx_coffee_counter_slug ON public.coffee_counter (slug);

-- Enable Row Level Security (RLS)
ALTER TABLE public.coffee_counter ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone (anon + authenticated) can read the coffee counter
CREATE POLICY "Public can view coffee counter"
ON public.coffee_counter
FOR SELECT
TO anon, authenticated
USING (true);

-- Atomic RPC function to increment coffee count without exposing direct UPDATE
CREATE OR REPLACE FUNCTION public.increment_coffee_count(counter_slug text DEFAULT 'global')
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_count bigint;
BEGIN
  INSERT INTO public.coffee_counter (slug, count, updated_at)
  VALUES (counter_slug, 66, now())
  ON CONFLICT (slug)
  DO UPDATE SET
    count = public.coffee_counter.count + 1,
    updated_at = now()
  RETURNING count INTO new_count;

  RETURN new_count;
END;
$$;

-- Grant execution to public
GRANT EXECUTE ON FUNCTION public.increment_coffee_count(text) TO anon, authenticated;

-- Seed initial counter row if not present
INSERT INTO public.coffee_counter (slug, count)
VALUES ('global', 65)
ON CONFLICT (slug) DO NOTHING;


-- ====================================================================
-- 3. TABLE: contact_messages
-- Stores contact form submissions from the portfolio modal
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for ordering by creation time
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages (created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can submit a contact message with basic validation
CREATE POLICY "Public can insert contact messages"
ON public.contact_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(trim(name)) > 0 AND
  length(trim(email)) > 3 AND
  position('@' in email) > 1 AND
  length(trim(message)) > 0
);

-- RLS Policy: Only authenticated users (portfolio owner) can view messages
CREATE POLICY "Only authenticated users can read contact messages"
ON public.contact_messages
FOR SELECT
TO authenticated
USING (true);

-- RLS Policy: Only authenticated users can update message status
CREATE POLICY "Only authenticated users can update contact messages"
ON public.contact_messages
FOR UPDATE
TO authenticated
USING (true);


-- ====================================================================
-- 4. TABLE: projects
-- Stores showcase projects with fallback to static content
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  detailed_description TEXT,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  github_url TEXT NOT NULL,
  live_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  metrics JSONB DEFAULT '[]'::jsonb,
  architecture_points TEXT[] DEFAULT '{}',
  banner_gradient TEXT DEFAULT 'from-emerald-950/40 via-slate-900/60 to-zinc-950/80',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index on sort_order and featured
CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON public.projects (sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects (featured);

-- Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can view portfolio projects
CREATE POLICY "Public can read projects"
ON public.projects
FOR SELECT
TO anon, authenticated
USING (true);

-- RLS Policy: Only authenticated owner can create/edit/delete projects
CREATE POLICY "Only authenticated users can modify projects"
ON public.projects
FOR ALL
TO authenticated
USING (true);

-- ====================================================================
-- 5. SEED DATA FOR PROJECTS (Matching src/data/projects.ts)
-- ====================================================================
INSERT INTO public.projects (
  id, number, title, category, description, detailed_description,
  technologies, github_url, live_url, featured, metrics, architecture_points,
  banner_gradient, sort_order
)
VALUES
  (
    'fintrack-pro',
    '01',
    'FinTrack Pro',
    'Full-Stack Web App & Finance Analytics',
    'Aplikasi web manajemen keuangan terpadu dan multi-user dengan analitik arus kas, target tabungan, dan audit trail.',
    'Aplikasi web manajemen finansial komprehensif yang dirancang untuk pelacakan transaksi multi-user, visualisasi chart arus kas real-time, manajemen anggaran bulanan, dan keamanan autentikasi JWT dengan enkripsi data.',
    ARRAY['React.js', 'Express.js', 'Tailwind CSS', 'MySQL', 'JWT Auth', 'Recharts'],
    'https://github.com/Neideav/fintrack-pro',
    'https://fintrack-pro-topaz.vercel.app',
    true,
    '[{"label": "Architecture", "value": "REST API + SPA"}, {"label": "Deployment", "value": "Vercel + Cloud DB"}, {"label": "Security", "value": "JWT + Bcrypt"}]'::jsonb,
    ARRAY[
      'Modular backend API handling multi-tenant transactional financial records',
      'Interactive data visualization with Recharts for monthly cashflow insights',
      'Secure token-based authentication with bcrypt password hashing',
      'Responsive UI styled with Tailwind CSS optimized across all viewports'
    ],
    'from-emerald-950/40 via-slate-900/60 to-zinc-950/80',
    1
  ),
  (
    'shopcart',
    '02',
    'Shopcart',
    'Full-Stack & E-Commerce Platform',
    'Aplikasi storefront e-commerce modern dengan product discovery dinamis, keranjang belanja real-time, dan filter kategori.',
    'Platform e-commerce modern yang dibangun dengan arsitektur berbasis komponen TypeScript/React, dilengkapi katalog produk interaktif, keranjang belanja terotomasi, dan filter pencarian instan.',
    ARRAY['TypeScript', 'React', 'Tailwind CSS', 'Vite', 'REST API'],
    'https://github.com/Neideav/shopcart',
    'https://github.com/Neideav/shopcart',
    true,
    '[{"label": "Language", "value": "TypeScript"}, {"label": "Frontend", "value": "React + Vite"}, {"label": "State", "value": "Reactive Store"}]'::jsonb,
    ARRAY[
      'Modular shopping cart state management with real-time price computations',
      'Responsive grid product catalog with instant search and category filtering',
      'Type-safe data modeling and interface contracts across components',
      'Clean UI styled with Tailwind CSS for optimal mobile and desktop experiences'
    ],
    'from-blue-950/40 via-slate-900/60 to-zinc-950/80',
    2
  ),
  (
    'kumo-ai',
    '03',
    'KumoAI',
    'AI Chatbot & Intelligent Systems',
    'ChatBot Project dengan integrasi model AI cerdas, streaming respons percakapan, dan arsitektur modular responsif.',
    'Sistem kecerdasan buatan berbasis ChatBot yang mengintegrasikan model AI untuk pemrosesan percakapan alami, streaming respons real-time, dan arsitektur kode terstruktur yang dapat diperluas.',
    ARRAY['JavaScript', 'Java', 'Tailwind CSS', 'Node.js', 'AI Integration'],
    'https://github.com/Neideav/KumoAI',
    'https://github.com/Neideav/KumoAI',
    true,
    '[{"label": "Integration", "value": "AI Chat Models"}, {"label": "Runtime", "value": "Node.js / Java"}, {"label": "Interaction", "value": "Real-Time Streaming"}]'::jsonb,
    ARRAY[
      'Natural language conversational interface with streaming token output',
      'Modular service layers connecting to modern intelligent AI endpoints',
      'Error resilient request handling and automated reconnection logic',
      'Sleek dark-mode aesthetic with accessible conversation history'
    ],
    'from-cyan-950/40 via-slate-900/60 to-zinc-950/80',
    3
  ),
  (
    'project-shyeund',
    '04',
    'ProjectShyeunD',
    'Native Android Mobile Development',
    'Aplikasi mobile Android native yang dikembangkan menggunakan Kotlin dengan arsitektur modern dan clean code.',
    'Aplikasi Android native yang dirancang menggunakan Kotlin dan Gradle, mengimplementasikan manajemen siklus hidup komponen modern, tata letak UI intuitif, dan pemisahan logika bisnis yang terstruktur.',
    ARRAY['Kotlin', 'Android SDK', 'Gradle', 'Mobile Architecture', 'Git'],
    'https://github.com/Neideav/ProjectShyeunD',
    'https://github.com/Neideav/ProjectShyeunD',
    false,
    '[{"label": "Platform", "value": "Android Native"}, {"label": "Language", "value": "Kotlin"}, {"label": "Build Tool", "value": "Gradle"}]'::jsonb,
    ARRAY[
      'Native Android architecture utilizing modern Kotlin language standards',
      'Robust lifecycle handling and memory efficient UI components',
      'Gradle dependency management and structured module separation',
      'Version controlled repository with clean git commits and documentation'
    ],
    'from-teal-950/40 via-slate-900/60 to-zinc-950/80',
    4
  )
ON CONFLICT (id) DO NOTHING;
