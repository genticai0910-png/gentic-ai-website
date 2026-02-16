import { NextResponse, type NextRequest } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ ok: false, error: 'Stripe not configured' }, { status: 500 });
    }

    const stripe = new Stripe(secretKey);
    const { priceId, verticalSlug } = await request.json();

    if (!priceId) {
      return NextResponse.json({ ok: false, error: 'priceId required' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/en/${verticalSlug ?? ''}?checkout=success`,
      cancel_url: `${baseUrl}/en/${verticalSlug ?? ''}?checkout=cancel`,
      metadata: { verticalSlug: verticalSlug ?? '' },
    });

    return NextResponse.json({ ok: true, url: session.url });
  } catch (err) {
    console.error('Checkout error:', err);
    return NextResponse.json({ ok: false, error: 'Checkout failed' }, { status: 500 });
  }
}
