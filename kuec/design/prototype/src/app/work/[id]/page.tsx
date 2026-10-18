'use client';

import { use } from 'react';
import { Anchor, Breadcrumbs, Stack, Text } from '@mantine/core';
import { useSearchParams } from 'next/navigation';

import { HowThisWorks } from '@/components/kuec/HowThisWorks';
import { KuecEmptyState } from '@/components/kuec/KuecEmptyState';
import { KuecProgressSteps } from '@/components/kuec/KuecProgressSteps';
import { KuecWorkPackageCard } from '@/components/kuec/KuecWorkPackageCard';
import { useLocale } from '@/i18n/LocaleContext';
import { usePrototypeStore } from '@/store/PrototypeStore';
import { KUEC_CARD_MAX_WIDTH_PX } from '@/theme/kuec-theme';

type WorkPackagePageProps = { params: Promise<{ id: string }> };

export default function WorkPackagePage({ params }: WorkPackagePageProps) {
  const { id } = use(params);
  const { t, locale } = useLocale();
  const { workPackages, getOpportunity } = usePrototypeStore();
  const searchParams = useSearchParams();
  const query = new URLSearchParams(searchParams.toString());
  const fromNotification = query.get('from') === 'notification';
  query.delete('from');
  const suffix = query.toString() ? `?${query.toString()}` : '';
  const workPackage = workPackages.find((item) => item.id === id);

  if (workPackage === undefined) {
    return <KuecEmptyState title={t('nav.notBuilt')} nextStep={t('today.whatNow')} actionLabel={t('nav.today')} actionHref={`/${suffix}`} />;
  }

  const opportunity = getOpportunity(workPackage.caseId);

  return (
    <Stack gap="md" align="stretch" maw={KUEC_CARD_MAX_WIDTH_PX} mx="auto">
      <Breadcrumbs separatorMargin={6}>
        <Anchor href={`/${suffix}`} size="sm">
          {t('nav.today')}
        </Anchor>
        <Text size="sm" c="dimmed" component="span" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          {t('wp.eyebrow')}
          <HowThisWorks lineKeys={['wp.how.1', 'wp.how.2', 'wp.how.3', 'wp.how.4', 'wp.how.5']} />
        </Text>
      </Breadcrumbs>

      <KuecWorkPackageCard workPackage={workPackage} fromNotification={fromNotification} />

      {opportunity ? (
        <Stack gap="xs" px="xs">
          <Text size="sm" c="dimmed">
            {t('opp.whereItStands')}: <bdi>{opportunity.name[locale]}</bdi>
          </Text>
          <KuecProgressSteps stage={opportunity.stage} />
        </Stack>
      ) : null}
    </Stack>
  );
}
