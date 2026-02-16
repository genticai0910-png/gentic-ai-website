import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';

import { AllLocales, AppConfig } from './utils/AppConfig';

const DOMAIN_MAP: Record<string, string> = {
  'gentic.pro': 'gentic-ai',
  'www.gentic.pro': 'gentic-ai',
  'dealiq.click': 'dealiq',
  'www.dealiq.click': 'dealiq',
  'voicescheduleai.com': 'voicescheduleai',
  'www.voicescheduleai.com': 'voicescheduleai',
};

const intlMiddleware = createMiddleware({
  locales: AllLocales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
});

export default function middleware(request: NextRequest) {
  const hostname = request.headers.get('host')?.split(':')[0] ?? '';
  const verticalSlug = DOMAIN_MAP[hostname];

  if (verticalSlug) {
    const { pathname } = request.nextUrl;
    // If already targeting a vertical route, pass through
    const verticalSlugs = Object.values(DOMAIN_MAP);
    const isVerticalPath = verticalSlugs.some(
      slug => pathname === `/${slug}` || pathname.startsWith(`/${slug}/`)
        || AllLocales.some(l => pathname === `/${l}/${slug}` || pathname.startsWith(`/${l}/${slug}/`)),
    );

    if (!isVerticalPath && pathname === '/') {
      // Rewrite root to the vertical's page
      const url = request.nextUrl.clone();
      url.pathname = `/${verticalSlug}`;
      return NextResponse.rewrite(url);
    }

    if (!isVerticalPath) {
      // For locale-prefixed paths like /es, rewrite to /es/vertical-slug
      const localeMatch = pathname.match(/^\/([a-z]{2})\/?$/);
      if (localeMatch) {
        const url = request.nextUrl.clone();
        url.pathname = `/${localeMatch[1]}/${verticalSlug}`;
        return NextResponse.rewrite(url);
      }
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next|monitoring|api).*)', '/', '/(api)(.*)'],
};
