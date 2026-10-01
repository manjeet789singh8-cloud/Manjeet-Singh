import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
  try {
    const keyId =
      process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: 'Razorpay authentication credentials are not configured.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const amount = Number(body.amount);
    const currency = body.currency || 'INR';
    const receipt =
      body.receipt || `rcpt_tfc_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // Validate minimum amount >= 100 paise (₹1.00)
    if (!Number.isFinite(amount) || amount < 100) {
      return NextResponse.json(
        { error: 'Invalid amount. Minimum order amount is 100 paise (₹1).' },
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
    });

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err: unknown) {
    const errorObj = err as { statusCode?: number; error?: { description?: string }; message?: string };
    if (errorObj?.statusCode === 401) {
      return NextResponse.json(
        {
          error:
            errorObj?.error?.description ||
            'Razorpay authentication failed (401). Please verify API keys.',
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
