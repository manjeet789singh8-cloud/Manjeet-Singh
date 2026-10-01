-- ============================================================================
-- TFC GARDEN — SUPABASE BACKEND SCHEMA (Project ID: nnoqydcdyoenfvnuvlhf)
-- Run this script once in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/nnoqydcdyoenfvnuvlhf/sql/new
-- ============================================================================

-- 1. APPOINTMENTS TABLE (For the "Book an Appointment or Resort Reservation" form)
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_code TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT DEFAULT '',
  appointment_type TEXT NOT NULL,
  preferred_date TEXT NOT NULL,
  preferred_time TEXT NOT NULL,
  guests_count INTEGER DEFAULT 2,
  special_requests TEXT DEFAULT '',
  status TEXT DEFAULT 'CONFIRMED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Allow public/anon insert & select on appointments using publishable key
DROP POLICY IF EXISTS "Allow public insert on appointments" ON public.appointments;
CREATE POLICY "Allow public insert on appointments"
  ON public.appointments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select on appointments" ON public.appointments;
CREATE POLICY "Allow public select on appointments"
  ON public.appointments
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 2. RESERVATIONS TABLE (For all Resort Bookings, Rooms, Bamboo Huts, Weddings, Tables & Delivery)
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_code TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT DEFAULT '',
  date TEXT NOT NULL,
  time_slot TEXT DEFAULT '',
  guests TEXT DEFAULT '2',
  amount NUMERIC DEFAULT 0,
  payment_method TEXT DEFAULT '',
  payment_status TEXT DEFAULT 'CONFIRMED',
  notes TEXT DEFAULT '',
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for reservations
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Allow public/anon insert & select on reservations using publishable key
DROP POLICY IF EXISTS "Allow public insert on reservations" ON public.reservations;
CREATE POLICY "Allow public insert on reservations"
  ON public.reservations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select on reservations" ON public.reservations;
CREATE POLICY "Allow public select on reservations"
  ON public.reservations
  FOR SELECT
  TO anon, authenticated
  USING (true);
