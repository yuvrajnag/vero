-- =========================================================================
-- Supabase Database Schema: Vero Platform Onboarding
-- Maps to the WorkerOnboarding and CompanyOnboarding form fields.
-- Execute this script directly in the Supabase SQL Editor.
-- =========================================================================

-- ==========================================
-- 1. COMMON UTILITIES & TIME TRIGGER
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to automatically update the `updated_at` timestamp on row modification
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- 2. BASE PROFILE TABLE
-- ==========================================
-- Maps 1:1 with Supabase Auth (auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    user_type TEXT CHECK (user_type IN ('worker', 'company')),
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all base profiles" 
    ON public.profiles FOR SELECT 
    USING (true);

CREATE POLICY "Users can update their own base profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- ==========================================
-- 3. WORKER PROFILES TABLE (Stage 1 to 5)
-- ==========================================
-- Extends profiles with details collected during Worker Onboarding
CREATE TABLE public.worker_profiles (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Stage 1: Basic Information
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    location TEXT NOT NULL,
    address TEXT NOT NULL,
    profile_picture_url TEXT, -- Path in Supabase 'avatars' storage bucket

    -- Stage 2: Professional Profile
    role TEXT NOT NULL,
    industry TEXT NOT NULL,
    skills TEXT[] NOT NULL DEFAULT '{}', -- Native PostgreSQL array for search efficiency
    experience_years INTEGER NOT NULL DEFAULT 0,
    preferred_work_types TEXT[] NOT NULL DEFAULT '{}', -- array containing 'Full-time', 'Part-time', 'Contract', 'Freelance'
    languages TEXT[] NOT NULL DEFAULT '{}', -- languages spoken

    -- Stage 3: Work Preferences & Availability
    available_days TEXT[] NOT NULL DEFAULT '{}', -- array containing 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
    hours_start TIME NOT NULL, -- format: HH:MM:SS
    hours_end TIME NOT NULL,
    remote_pref TEXT NOT NULL CHECK (remote_pref IN ('Fully Remote', 'Hybrid', 'On-Site')),
    currency VARCHAR(10) NOT NULL DEFAULT 'USD ($)',
    rate_per_day NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    preferred_locations TEXT,
    emergency_availability TEXT CHECK (emergency_availability IN ('Yes', 'No', 'Maybe')),

    -- Stage 4: Experience & Background
    education TEXT NOT NULL,
    previous_companies TEXT,
    work_history TEXT NOT NULL,
    bio TEXT NOT NULL,
    resume_url TEXT, -- Path in Supabase 'documents' storage bucket
    linkedin_url TEXT,

    -- Stage 5: Verification & Links
    certificates_url TEXT,
    licenses_url TEXT,
    government_id_url TEXT NOT NULL, -- required
    links JSONB DEFAULT '[]'::jsonb, -- Store platform & url pairs securely

    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- GIN indexes for lightning-fast array queries (skills, days, work types)
CREATE INDEX idx_worker_skills ON public.worker_profiles USING GIN (skills);
CREATE INDEX idx_worker_pref_work_types ON public.worker_profiles USING GIN (preferred_work_types);
CREATE INDEX idx_worker_available_days ON public.worker_profiles USING GIN (available_days);

-- Standard indexes for roles and locations
CREATE INDEX idx_worker_role ON public.worker_profiles (role);
CREATE INDEX idx_worker_location ON public.worker_profiles (location);

-- Enable RLS for worker profiles
ALTER TABLE public.worker_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Worker profiles viewable by all authenticated users" 
    ON public.worker_profiles FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Workers can insert their own profile" 
    ON public.worker_profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Workers can update their own profile" 
    ON public.worker_profiles FOR UPDATE 
    USING (auth.uid() = id);

-- ==========================================
-- 4. COMPANY PROFILES TABLE (Stage 1 to 5)
-- ==========================================
-- Extends profiles with details collected during Company Onboarding
CREATE TABLE public.company_profiles (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Stage 1: Company Info
    company_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    hq_location TEXT NOT NULL,
    address TEXT NOT NULL,
    logo_url TEXT NOT NULL, -- Path in Supabase 'avatars' storage bucket

    -- Stage 2: Organization Profile
    industry TEXT NOT NULL,
    other_industry TEXT, -- If industry is 'Other'
    company_size TEXT NOT NULL CHECK (company_size IN ('1–10', '11–50', '51–200', '200+')),
    business_categories TEXT[] NOT NULL DEFAULT '{}',
    website_url TEXT NOT NULL,
    operating_regions TEXT[] NOT NULL DEFAULT '{}',
    about TEXT NOT NULL,

    -- Stage 3: Workforce Preferences
    preferred_workforce_types TEXT[] NOT NULL DEFAULT '{}', -- 'Freelancers', 'Full-Time', 'Contract-Based', 'Emergency Workforce'
    hiring_frequency TEXT NOT NULL CHECK (hiring_frequency IN ('Daily', 'Weekly', 'Project-Based', 'Permanent')),
    remote_pref TEXT NOT NULL CHECK (remote_pref IN ('Fully Remote', 'Hybrid', 'On-Site')),
    urgency_handling TEXT CHECK (urgency_handling IN ('Standard Notice', '24hr Emergency', 'Immediate Dispatch')),
    verification_requirements TEXT[] NOT NULL DEFAULT '{}', -- 'Background Check', 'License Verification', etc.
    currency VARCHAR(10) NOT NULL DEFAULT 'USD ($)',
    project_budget NUMERIC(12, 2) NOT NULL DEFAULT 0.00,

    -- Stage 4: Operations & Management
    current_team_size INTEGER NOT NULL DEFAULT 1,
    active_projects_count INTEGER NOT NULL DEFAULT 0,
    workforce_goals TEXT[] NOT NULL DEFAULT '{}',
    assignment_workflow TEXT NOT NULL CHECK (assignment_workflow IN ('Direct Hire', 'Bidding/Tender', 'Agency Sourced')),
    communication_preferences TEXT[] NOT NULL DEFAULT '{}', -- 'Email', 'SMS', 'In-App', 'Slack'
    notification_settings TEXT CHECK (notification_settings IN ('All Alerts', 'Critical Only', 'Muted')),

    -- Stage 5: Verification & Links
    registration_doc_url TEXT NOT NULL,
    tax_docs_url TEXT NOT NULL,
    identity_verification_url TEXT NOT NULL,
    portfolio_url TEXT,
    authorized_rep_name TEXT NOT NULL,
    links JSONB DEFAULT '[]'::jsonb, -- Store platform & url pairs securely

    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- GIN indexes for company array queries
CREATE INDEX idx_company_categories ON public.company_profiles USING GIN (business_categories);
CREATE INDEX idx_company_regions ON public.company_profiles USING GIN (operating_regions);

-- Standard indexes
CREATE INDEX idx_company_industry ON public.company_profiles (industry);

-- Enable RLS for company profiles
ALTER TABLE public.company_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company profiles viewable by all authenticated users" 
    ON public.company_profiles FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Companies can insert their own profile" 
    ON public.company_profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Companies can update their own profile" 
    ON public.company_profiles FOR UPDATE 
    USING (auth.uid() = id);

-- ==========================================
-- 5. AUTOMATED PUBLIC PROFILE HANDLER
-- ==========================================
-- Automatically creates a public profile row when a user signs up on Supabase Auth.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email)
    VALUES (new.id, new.email);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- 6. AUTO-TIMESTAMPS ATTACHMENT
-- ==========================================
CREATE TRIGGER trigger_update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_worker_profiles_updated_at
    BEFORE UPDATE ON public.worker_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_company_profiles_updated_at
    BEFORE UPDATE ON public.company_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
