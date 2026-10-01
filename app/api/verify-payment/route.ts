import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          error: 'Razorpay secret key is not configured on the server.',
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          error:
            'Missing required payment verification fields (razorpay_order_id, razorpay_payment_id, razorpay_signature).',
        },
        { status: 400 }
      );
    }

    // Generate HMAC-SHA256 signature: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(payload)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          error: 'Signature verification failed. Payment cannot be marked as paid.',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      verified: true,
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Payment verification failed.';
    return NextResponse.json(
      { success: false, verified: false, error: message },
      { status: 500 }
    );
  }
}
