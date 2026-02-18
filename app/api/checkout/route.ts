import { NextResponse, type NextRequest } from "next/server";

const PRICE_MAP: Record<string, string> = {
  growth: process.env.STRIPE_PRICE_GROWTH || "",
  lead_recovery: process.env.STRIPE_PRICE_LEAD_RECOVERY || "",
};

export async function POST(request: NextRequest) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { ok: false, error: "Stripe not configured" },
        { status: 500 }
      );
    }

    const { plan } = await request.json();
    const priceId = PRICE_MAP[plan];

    if (!priceId) {
      return NextResponse.json(
        { ok: false, error: "Invalid plan" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://gentic.pro";

    const body = [
      "mode=subscription",
      "payment_method_types[0]=card",
      `line_items[0][price]=${encodeURIComponent(priceId)}`,
      "line_items[0][quantity]=1",
      `success_url=${encodeURIComponent(`${baseUrl}?checkout=success`)}`,
      `cancel_url=${encodeURIComponent(`${baseUrl}?checkout=cancel`)}`,
      `metadata[plan]=${encodeURIComponent(plan)}`,
      "allow_promotion_codes=true",
    ].join("&");

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Stripe API error:", JSON.stringify(data));
      return NextResponse.json(
        { ok: false, error: data.error?.message ?? "Stripe error" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, url: data.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Checkout error:", message);
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
