import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export interface SavedRecord {
  id: string;
  bookingCode: string;
  type:
    | 'room'
    | 'bamboo'
    | 'wedding'
    | 'table'
    | 'delivery'
    | 'package'
    | 'appointment';
  title: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string;
  timeSlot?: string;
  guests?: number | string;
  amount?: number;
  paymentMethod?: string;
  paymentStatus: 'CONFIRMED' | 'PENDING_PAYMENT' | 'FREE_RESERVATION';
  notes?: string;
  details?: Record<string, unknown>;
  supabaseSynced?: boolean;
  supabaseTable?: string;
  createdAt: string;
}

const memoryStore: SavedRecord[] = [
  {
    id: 'init-1',
    bookingCode: 'TFC-2026-9412',
    type: 'bamboo',
    title: 'TFC Eco Bamboo Room (AC Eco-Cooling)',
    customerName: 'Manjeet Singh',
    customerPhone: '7379097909',
    customerEmail: 'manjeet789singh8@gmail.com',
    date: '30/09/2026',
    guests: 2,
    amount: 3999,
    paymentMethod: 'UPI Verified (7789060606@ptyes)',
    paymentStatus: 'CONFIRMED',
    notes: 'Evening lantern walk & complimentary morning breakfast included.',
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    const combined: SavedRecord[] = [];
    const seenCodes = new Set<string>();

    // 1. Fetch from Supabase `appointments` table
    const { data: apptRows, error: apptErr } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (!apptErr && Array.isArray(apptRows)) {
      for (const row of apptRows) {
        const code = row.booking_code || `TFC-APPT-${row.id}`;
        if (!seenCodes.has(code)) {
          seenCodes.add(code);
          combined.push({
            id: String(row.id),
            bookingCode: code,
            type: 'appointment',
            title: row.appointment_type || 'Resort Appointment',
            customerName: row.full_name || 'Guest',
            customerPhone: row.phone || '',
            customerEmail: row.email || '',
            date: row.preferred_date || '',
            timeSlot: row.preferred_time || '',
            guests: row.guests_count ?? 2,
            amount: 0,
            paymentMethod: 'Pay at Resort / Concierge Desk',
            paymentStatus: 'CONFIRMED',
            notes: row.special_requests || '',
            supabaseSynced: true,
            supabaseTable: 'appointments',
            createdAt: row.created_at || new Date().toISOString(),
          });
        }
      }
    }

    // 2. Fetch from Supabase `reservations` table
    const { data: resRows, error: resErr } = await supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (!resErr && Array.isArray(resRows)) {
      for (const row of resRows) {
        const code = row.booking_code || `TFC-RES-${row.id}`;
        if (!seenCodes.has(code)) {
          seenCodes.add(code);
          combined.push({
            id: String(row.id),
            bookingCode: code,
            type: row.type || 'appointment',
            title: row.title || 'TFC Garden Reservation',
            customerName: row.customer_name || 'Guest',
            customerPhone: row.customer_phone || '',
            customerEmail: row.customer_email || '',
            date: row.date || '',
            timeSlot: row.time_slot || '',
            guests: row.guests || 2,
            amount: Number(row.amount || 0),
            paymentMethod: row.payment_method || 'UPI / Pay at Resort',
            paymentStatus: row.payment_status || 'CONFIRMED',
            notes: row.notes || '',
            details: row.details || {},
            supabaseSynced: true,
            supabaseTable: 'reservations',
            createdAt: row.created_at || new Date().toISOString(),
          });
        }
      }
    }

    // 3. Merge in-memory records not already in Supabase response
    for (const mem of memoryStore) {
      if (!seenCodes.has(mem.bookingCode)) {
        seenCodes.add(mem.bookingCode);
        combined.push(mem);
      }
    }

    return NextResponse.json({
      records: combined,
      supabaseConnected: !apptErr || !resErr,
    });
  } catch {
    return NextResponse.json({ records: memoryStore });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const bookingCode = body.bookingCode || `TFC-2026-${randomDigits}`;
    const recordType = body.type || 'appointment';

    let supabaseSynced = false;
    let supabaseTable = '';
    let supabaseErrorHint = '';

    // 1. If this is an appointment booking form submission, insert into `appointments` table
    if (recordType === 'appointment') {
      const parsedGuests =
        typeof body.guests === 'number'
          ? body.guests
          : parseInt(String(body.guests || '2'), 10) || 2;

      const { error: apptInsertError } = await supabase
        .from('appointments')
        .insert([
          {
            booking_code: bookingCode,
            full_name: body.customerName || 'Guest',
            phone: body.customerPhone || '',
            email: body.customerEmail || '',
            appointment_type:
              body.title || 'Bamboo Room & Resort Stay Appointment',
            preferred_date: body.date || '2026-09-30',
            preferred_time: body.timeSlot || '02:00 PM Check-In / Visit',
            guests_count: parsedGuests,
            special_requests: body.notes || '',
            status: body.paymentStatus || 'CONFIRMED',
          },
        ]);

      if (!apptInsertError) {
        supabaseSynced = true;
        supabaseTable = 'public.appointments';
      } else {
        supabaseErrorHint = apptInsertError.message || 'Table not found';
      }
    }

    // 2. Also insert into `reservations` table in Supabase (stores all bookings & appointments)
    const { error: resInsertError } = await supabase
      .from('reservations')
      .insert([
        {
          booking_code: bookingCode,
          type: recordType,
          title: body.title || 'TFC Garden Reservation',
          customer_name: body.customerName || 'Manjeet Singh',
          customer_phone: body.customerPhone || '7379097909',
          customer_email: body.customerEmail || 'manjeet789singh8@gmail.com',
          date: body.date || '2026-09-30',
          time_slot: body.timeSlot || '',
          guests: String(body.guests || '2'),
          amount: typeof body.amount === 'number' ? body.amount : 0,
          payment_method: body.paymentMethod || 'UPI / Pay at Resort',
          payment_status: body.paymentStatus || 'CONFIRMED',
          notes: body.notes || '',
          details: body.details || {},
        },
      ]);

    if (!resInsertError && !supabaseSynced) {
      supabaseSynced = true;
      supabaseTable = 'public.reservations';
    } else if (resInsertError && !supabaseErrorHint) {
      supabaseErrorHint = resInsertError.message;
    }

    const newRecord: SavedRecord = {
      id: `rec-${Date.now()}`,
      bookingCode,
      type: recordType,
      title: body.title || 'TFC Garden Reservation',
      customerName: body.customerName || 'Manjeet Singh',
      customerPhone: body.customerPhone || '7379097909',
      customerEmail: body.customerEmail || 'manjeet789singh8@gmail.com',
      date: body.date || '2026-09-30',
      timeSlot: body.timeSlot || '',
      guests: body.guests || 2,
      amount: typeof body.amount === 'number' ? body.amount : 0,
      paymentMethod: body.paymentMethod || 'UPI / Pay at Resort',
      paymentStatus: body.paymentStatus || 'CONFIRMED',
      notes: body.notes || '',
      details: body.details || {},
      supabaseSynced,
      supabaseTable: supabaseTable || undefined,
      createdAt: new Date().toISOString(),
    };

    memoryStore.unshift(newRecord);

    return NextResponse.json({
      success: true,
      record: newRecord,
      supabaseSynced,
      supabaseTable,
      supabaseErrorHint: supabaseSynced ? undefined : supabaseErrorHint,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to process reservation request.' },
      { status: 400 }
    );
  }
}
