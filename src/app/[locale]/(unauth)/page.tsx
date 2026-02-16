import { getTranslations, setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'Index' });
  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function IndexPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  // Root page redirects to gentic-ai (primary vertical)
  redirect(`/${locale}/gentic-ai`);
}
