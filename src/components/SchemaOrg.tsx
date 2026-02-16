import type { Vertical } from '@/types/Vertical';

interface SchemaOrgProps {
  vertical: Vertical;
}

export function SchemaOrg({ vertical }: SchemaOrgProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: vertical.brandName,
    url: vertical.domain ? `https://${vertical.domain}` : undefined,
    description: vertical.metaDescription ?? vertical.tagline,
    contactPoint: vertical.contactEmail ? {
      '@type': 'ContactPoint',
      email: vertical.contactEmail,
      contactType: 'sales',
    } : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
