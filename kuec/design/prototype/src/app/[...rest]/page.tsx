'use client';

import { useSearchParams } from 'next/navigation';

import { KuecEmptyState } from '@/components/kuec/KuecEmptyState';
import { useLocale } from '@/i18n/LocaleContext';

// Pipeline, Accounts, Delivery, Insights, Log and Inbox are specified in
// design/ia.md but are outside this prototype's scope (Today and the card).
export default function NotBuiltPage() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  return <KuecEmptyState title={t('nav.notBuilt')} nextStep={t('proto.banner')} actionLabel={t('nav.today')} actionHref={`/${query ? `?${query}` : ''}`} />;
}
