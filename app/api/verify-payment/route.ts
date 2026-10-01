import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json(
        { verified: false, error: 'Razorpay key secret is missing on server.' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        {
          verified: false,
          error:
            'Missing required fields: razorpay_order_id, razorpay_payment_id, or razorpay_signature.',
        },
        { status: 400 }
      );
    }

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(payload)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        {
          verified: false,
          error: 'Payment signature verification failed. Signature mismatch.',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      verified: true,
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Payment verification error.';
    return NextResponse.json({ verified: false, error: message }, { status: 500 });
  }
}
