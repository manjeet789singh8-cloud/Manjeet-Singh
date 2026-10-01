import { NextRequest, NextResponse } from 'next/server';

export interface SavedRecord {
  id: string;
  bookingCode: string;
  type: 'room' | 'bamboo' | 'wedding' | 'table' | 'delivery' | 'package' | 'appointment';
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
  return NextResponse.json({ records: memoryStore });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const bookingCode = `TFC-2026-${randomDigits}`;
    const newRecord: SavedRecord = {
      id: `rec-${Date.now()}`,
      bookingCode,
      type: body.type || 'appointment',
      title: body.title || 'TFC Garden Reservation',
      customerName: body.customerName || 'Manjeet Singh',
      customerPhone: body.customerPhone || '7379097909',
      customerEmail: body.customerEmail || 'manjeet789singh8@gmail.com',
      date: body.date || '30/09/2026',
      timeSlot: body.timeSlot || '',
      guests: body.guests || 2,
      amount: typeof body.amount === 'number' ? body.amount : 0,
      paymentMethod: body.paymentMethod || 'UPI / Pay at Resort',
      paymentStatus: body.paymentStatus || 'CONFIRMED',
      notes: body.notes || '',
      details: body.details || {},
      createdAt: new Date().toISOString(),
    };
    memoryStore.unshift(newRecord);
    return NextResponse.json({ success: true, record: newRecord });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to process reservation request.' },
      { status: 400 }
    );
  }
}
