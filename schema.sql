-- Core Database Schema for Clinic Management System

-- 1. Create tables
CREATE TABLE public.doctors (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  specialization text,
  qualifications text,
  experience_years integer,
  phone text,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE(user_id)
);

CREATE TABLE public.patients (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  name text NOT NULL,
  phone text NOT NULL,
  age integer NOT NULL,
  gender text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

CREATE TABLE public.appointments (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  doctor_id uuid REFERENCES public.doctors(id) ON DELETE CASCADE NOT NULL,
  patient_id uuid REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  -- Prevent double booking globally at the DB level
  UNIQUE(doctor_id, appointment_date, appointment_time)
);

CREATE SEQUENCE if not exists prescription_seq START 1;

CREATE TABLE public.prescriptions (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  prescription_id text NOT NULL DEFAULT ('RX-' || to_char(CURRENT_DATE, 'YYYY') || '-' || LPAD(nextval('prescription_seq')::text, 4, '0')),
  doctor_id uuid REFERENCES public.doctors(id) ON DELETE CASCADE NOT NULL,
  patient_id uuid REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE SET NULL,
  diagnosis text NOT NULL,
  treatment text,
  pdf_url text, -- Store Supabase Storage URL
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE(prescription_id)
);

CREATE TABLE public.medicines (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  prescription_id uuid REFERENCES public.prescriptions(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  dosage text NOT NULL,
  instructions text,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- 2. Setup Row Level Security (RLS)

ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;

-- Allow public read access to doctors (for portfolio site)
CREATE POLICY "Allow public read access to doctors" ON public.doctors
  FOR SELECT USING (true);

-- Doctors can update their own profile
CREATE POLICY "Doctors can update their own profile" ON public.doctors
  FOR UPDATE USING (auth.uid() = user_id);

-- Anyone can CREATE a patient (during booking), but only authenticated doctors can READ/UPDATE
CREATE POLICY "Anyone can insert patients" ON public.patients
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can read patients" ON public.patients
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update patients" ON public.patients
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Anyone can CREATE an appointment (booking form)
CREATE POLICY "Anyone can insert appointments" ON public.appointments
  FOR INSERT WITH CHECK (true);

-- Anyone can READ appointments (required to check available slots)
CREATE POLICY "Anyone can read appointments" ON public.appointments
  FOR SELECT USING (true);

-- Only authenticated doctors can UPDATE/DELETE appointments
CREATE POLICY "Doctors can manage appointments" ON public.appointments
  FOR ALL USING (auth.role() = 'authenticated');

-- Only doctors can manage prescriptions
CREATE POLICY "Doctors can manage prescriptions" ON public.prescriptions
  FOR ALL USING (auth.role() = 'authenticated');

-- Only doctors can manage medicines
CREATE POLICY "Doctors can manage medicines" ON public.medicines
  FOR ALL USING (auth.role() = 'authenticated');

-- 3. Enable Realtime
-- This is critical for the realtime dashboard

-- Drop existing publication just in case
DROP PUBLICATION IF EXISTS supabase_realtime;

-- Create publication for realtime
CREATE PUBLICATION supabase_realtime FOR TABLE appointments, patients;

-- Run this in the Supabase SQL Editor to add the missing columns for the medicines table

ALTER TABLE public.medicines
ADD COLUMN frequency text,
ADD COLUMN duration text;
