import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ ok: false, error: 'Stripe not configured' }, { status: 500 });
    }

    const { priceId, verticalSlug } = await request.json();

    if (!priceId) {
      return NextResponse.json({ ok: false, error: 'priceId required' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://gentic.pro';

    // Use Stripe REST API directly — manual form encoding to preserve literal brackets
    const successUrl = `${baseUrl}/${verticalSlug ?? ''}?checkout=success`;
    const cancelUrl = `${baseUrl}/${verticalSlug ?? ''}?checkout=cancel`;
    const body = [
      'mode=subscription',
      'payment_method_types[0]=card',
      `line_items[0][price]=${encodeURIComponent(priceId)}`,
      'line_items[0][quantity]=1',
      `success_url=${encodeURIComponent(successUrl)}`,
      `cancel_url=${encodeURIComponent(cancelUrl)}`,
      `metadata[verticalSlug]=${encodeURIComponent(verticalSlug ?? '')}`,
    ].join('&');

    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Stripe API error:', data);
      return NextResponse.json({ ok: false, error: data.error?.message ?? 'Stripe error' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, url: data.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Checkout error:', message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
