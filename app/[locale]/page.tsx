import { redirect } from 'next/navigation';
import ClientWrapper from '@/components/client-wrapper';
import type { Language } from '@/lib/i18n';

const SUPPORTED_LOCALES: Language[] = [
  'zh-cn',
  'zh-hant',
  'zh-hk',
  'zh-tw',
  'en-us',
  'en-gb',
  'ja',
  'fr',
  'ru',
  'hi',
];

export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const normalized = locale.toLowerCase() as Language;

  if (!SUPPORTED_LOCALES.includes(normalized)) {
    redirect('/zh-cn');
  }

  return <ClientWrapper initialLanguage={normalized} />;
}
