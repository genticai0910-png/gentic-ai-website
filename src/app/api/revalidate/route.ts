import { NextResponse, type NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get('x-revalidate-secret');
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ ok: false, error: 'Invalid secret' }, { status: 401 });
    }

    const { slug } = await request.json();
    if (slug) {
      revalidatePath(`/en/${slug}`);
      revalidatePath(`/es/${slug}`);
    } else {
      revalidatePath('/', 'layout');
    }

    return NextResponse.json({ ok: true, revalidated: true });
  } catch (err) {
    console.error('Revalidation error:', err);
    return NextResponse.json({ ok: false, error: 'Revalidation failed' }, { status: 500 });
  }
}
