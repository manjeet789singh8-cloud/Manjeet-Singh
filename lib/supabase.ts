import { createClient } from '@supabase/supabase-js';

const supabaseProjectId =
  process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID || 'nnoqydcdyoenfvnuvlhf';

export const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  `https://${supabaseProjectId}.supabase.co`;

export const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_mgc9wn3RsDbmT8sSXc0tTw_oIbE6SwV';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface AuthUserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'guest' | 'admin';
  supabaseAuthId?: string;
}

export interface AppointmentRowInsert {
  booking_code: string;
  full_name: string;
  phone: string;
  email?: string;
  appointment_type: string;
  preferred_date: string;
  preferred_time: string;
  guests_count: number;
  special_requests?: string;
  status?: string;
}

export const SUPABASE_SETUP_SQL = `-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/nnoqydcdyoenfvnuvlhf/sql/new)

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

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert on appointments" ON public.appointments;
CREATE POLICY "Allow public insert on appointments"
  ON public.appointments FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select on appointments" ON public.appointments;
CREATE POLICY "Allow public select on appointments"
  ON public.appointments FOR SELECT TO anon, authenticated USING (true);

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

ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert on reservations" ON public.reservations;
CREATE POLICY "Allow public insert on reservations"
  ON public.reservations FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select on reservations" ON public.reservations;
CREATE POLICY "Allow public select on reservations"
  ON public.reservations FOR SELECT TO anon, authenticated USING (true);`;
