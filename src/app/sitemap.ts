import type { MetadataRoute } from 'next';
import { getBaseUrl } from '@/utils/Helpers';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const verticals = ['gentic-ai', 'dealiq', 'voicescheduleai'];
  const locales = ['en', 'es'];

  const urls: MetadataRoute.Sitemap = [];

  for (const vertical of verticals) {
    for (const locale of locales) {
      urls.push({
        url: `${baseUrl}/${locale}/${vertical}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1.0,
      });
    }
  }

  return urls;
}
