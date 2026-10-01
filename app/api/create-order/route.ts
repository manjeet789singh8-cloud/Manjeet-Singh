import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
  try {
    const keyId =
      process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: 'Razorpay credentials are not configured on the server.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const amount = Number(body.amount);
    const currency = body.currency || 'INR';
    const receipt = body.receipt || `rcpt_${Date.now()}`;

    // Validate minimum amount >= 100 paise (₹1.00)
    if (!Number.isFinite(amount) || amount < 100) {
      return NextResponse.json(
        {
          error:
            'Invalid amount. Minimum order amount must be at least 100 paise (₹1).',
        },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await razorpay.orders.create({
      amount: Math.round(amount),
      currency,
      receipt,
      notes: body.notes || {},
    });

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || keyId,
    });
  } catch (err: unknown) {
    const errorObj = err as {
      statusCode?: number;
      error?: { description?: string; code?: string };
      message?: string;
    };

    if (
      errorObj?.statusCode === 401 ||
      errorObj?.error?.code === 'BAD_REQUEST_ERROR' &&
        errorObj?.error?.description?.toLowerCase().includes('authentication')
    ) {
      return NextResponse.json(
        {
          error:
            errorObj?.error?.description ||
            'Razorpay authentication failed. Check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.',
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error:
          errorObj?.error?.description ||
          errorObj?.message ||
          'Failed to create Razorpay order.',
      },
      { status: 500 }
    );
  }
}
