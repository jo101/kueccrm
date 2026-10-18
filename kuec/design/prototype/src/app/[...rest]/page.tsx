'use client';

import { useSearchParams } from 'next/navigation';

import { KuecEmptyState } from '@/components/kuec/KuecEmptyState';
import { useLocale } from '@/i18n/LocaleContext';

// Leads, Accounts, Contacts, Activities, Projects, Dashboards and the rest are
// specified in design/flows.md and arrive in weeks 3 to 5.
export default function NotBuiltPage() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  return <KuecEmptyState title={t('nav.notBuilt')} nextStep={t('nav.notBuilt.next')} actionLabel={t('nav.home')} actionHref={`/${query ? `?${query}` : ''}`} />;
}
