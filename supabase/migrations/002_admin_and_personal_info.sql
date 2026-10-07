-- ====================================================================
-- VallPortofolio — Admin & Dynamic Profile Info Migration
-- Migration: 002_admin_and_personal_info.sql
-- ====================================================================

-- 1. TABLE: personal_info
-- Stores portfolio profile details so the owner can update them via /admin
CREATE TABLE IF NOT EXISTS public.personal_info (
  id TEXT PRIMARY KEY DEFAULT 'default',
  name TEXT NOT NULL,
  nickname TEXT NOT NULL,
  title TEXT NOT NULL,
  roles TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT NOT NULL,
  short_bio TEXT NOT NULL,
  email TEXT NOT NULL,
  place_of_birth TEXT NOT NULL DEFAULT 'Batu, Indonesia',
  gpa TEXT NOT NULL DEFAULT 'N/A',
  education TEXT NOT NULL DEFAULT 'SMKS PGRI 3 Malang',
  github TEXT NOT NULL,
  linkedin TEXT NOT NULL,
  location TEXT NOT NULL,
  availability TEXT NOT NULL,
  status TEXT NOT NULL,
  resume_url TEXT NOT NULL,
  traits TEXT[] NOT NULL DEFAULT '{}',
  currently JSONB NOT NULL DEFAULT '{"building":"","exploring":"","learning":""}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.personal_info ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read personal_info
CREATE POLICY "Public can read personal_info"
ON public.personal_info
FOR SELECT
TO anon, authenticated
USING (true);

-- Policy: Only authenticated owner can update personal_info
CREATE POLICY "Only authenticated users can modify personal_info"
ON public.personal_info
FOR ALL
TO authenticated
USING (true);

-- Seed initial profile data matching src/data/personal.ts
INSERT INTO public.personal_info (
  id, name, nickname, title, roles, bio, short_bio, email,
  place_of_birth, gpa, education, github, linkedin, location,
  availability, status, resume_url, traits, currently
)
VALUES (
  'default',
  'Muhammad Bahruddin Nauvaldy Maulana',
  'Nauval',
  'Cloud Engineer · Backend Developer · DevOps Engineer',
  ARRAY['Cloud Engineer', 'Backend Developer', 'DevOps Engineer'],
  'Muhammad Bahruddin Nauvaldy Maulana is a developer focused on building scalable applications, cloud infrastructure, backend systems, and reliable deployment workflows. Dedicated to security best practices, high availability, and automated CI/CD delivery.',
  'I build reliable backend systems, cloud infrastructure, and automated delivery pipelines with a security-first mindset.',
  'nvaldymaulana@gmail.com',
  'Batu, Indonesia',
  'N/A',
  'SMKS PGRI 3 Malang',
  'https://github.com/Neideav',
  'https://linkedin.com/in/nvaldymaulana',
  'Indonesia (Available for Remote / Hybrid)',
  'Open to Opportunities & Collaborations',
  'System Active & Deploying',
  '#contact',
  ARRAY[
    'Security-First Mindset',
    'Infrastructure as Code',
    'Reliable Architecture',
    'Automation Enthusiast',
    'Problem Solver'
  ],
  '{
    "building": "Automated AWS Container Deployments",
    "exploring": "Distributed Microservices & Service Mesh",
    "learning": "Advanced Linux Kernel Security & K8s Orchestration"
  }'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  updated_at = now();
