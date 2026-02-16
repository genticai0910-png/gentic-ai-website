import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { supabase } from '@/libs/Supabase';
import { VerticalPage } from '@/components/VerticalPage';
import { SchemaOrg } from '@/components/SchemaOrg';
import { Analytics } from '@/components/Analytics';

export async function generateStaticParams() {
  try {
    const { data: verticals } = await supabase.from('verticals').select('slug');
    if (!verticals?.length) throw new Error('No verticals');
    const locales = ['en', 'es'];
    return verticals.flatMap(v => locales.map(locale => ({ locale, vertical: v.slug })));
  } catch {
    return [
      { locale: 'en', vertical: 'gentic-ai' },
      { locale: 'en', vertical: 'dealiq' },
      { locale: 'en', vertical: 'voicescheduleai' },
      { locale: 'es', vertical: 'gentic-ai' },
      { locale: 'es', vertical: 'dealiq' },
      { locale: 'es', vertical: 'voicescheduleai' },
    ];
  }
}

export async function generateMetadata(props: { params: Promise<{ locale: string; vertical: string }> }) {
  const { vertical: slug } = await props.params;
  try {
    const { data: vertical } = await supabase
      .from('verticals')
      .select('*')
      .eq('slug', slug)
      .single();
    if (!vertical) return {};
    return {
      title: vertical.meta_title ?? `${vertical.brand_name} — ${vertical.tagline}`,
      description: vertical.meta_description ?? vertical.tagline,
      openGraph: {
        title: vertical.meta_title ?? vertical.brand_name,
        description: vertical.meta_description ?? vertical.tagline ?? '',
        type: 'website',
      },
    };
  } catch {
    return {};
  }
}

export default async function VerticalPageRoute(props: { params: Promise<{ locale: string; vertical: string }> }) {
  const { locale, vertical: slug } = await props.params;
  setRequestLocale(locale);

  const { data: vertical } = await supabase
    .from('verticals')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  if (!vertical) notFound();

  const { data: sections } = await supabase
    .from('sections')
    .select('*')
    .eq('vertical_id', vertical.id)
    .eq('visible', true)
    .order('sort_order', { ascending: true });

  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*')
    .eq('vertical_id', vertical.id)
    .order('sort_order', { ascending: true });

  // Transform snake_case DB columns to camelCase for components
  const verticalData = {
    id: vertical.id,
    slug: vertical.slug,
    brandName: vertical.brand_name,
    tagline: vertical.tagline,
    domain: vertical.domain,
    theme: vertical.theme,
    metaTitle: vertical.meta_title,
    metaDescription: vertical.meta_description,
    features: vertical.features,
    gaId: vertical.ga_id,
    contactEmail: vertical.contact_email,
    status: vertical.status,
    updatedAt: new Date(vertical.updated_at),
    createdAt: new Date(vertical.created_at),
    deletedAt: vertical.deleted_at ? new Date(vertical.deleted_at) : null,
  };

  const sectionsData = (sections ?? []).map(s => ({
    id: s.id,
    verticalId: s.vertical_id,
    sectionType: s.section_type,
    sortOrder: s.sort_order,
    content: s.content,
    visible: s.visible,
    updatedAt: new Date(s.updated_at),
    createdAt: new Date(s.created_at),
  }));

  const testimonialsData = (testimonials ?? []).map(t => ({
    id: t.id,
    verticalId: t.vertical_id,
    name: t.name,
    role: t.role,
    quote: t.quote,
    rating: t.rating,
    resultMetric: t.result_metric,
    sortOrder: t.sort_order,
    updatedAt: new Date(t.updated_at),
    createdAt: new Date(t.created_at),
  }));

  return (
    <>
      <SchemaOrg vertical={verticalData} />
      <Analytics gaId={verticalData.gaId} />
      <VerticalPage
        vertical={verticalData}
        sections={sectionsData as any}
        testimonials={testimonialsData}
      />
    </>
  );
}
