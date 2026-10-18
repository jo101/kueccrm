'use client';

import { use } from 'react';
import { Anchor, Breadcrumbs, Group, Stack, Text } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';

import { HowThisWorks } from '@/components/kuec/HowThisWorks';
import { KuecEmptyState } from '@/components/kuec/KuecEmptyState';
import { KuecStagePath } from '@/components/kuec/KuecStagePath';
import { KuecTaskCard } from '@/components/kuec/KuecTaskCard';
import { useLocale } from '@/i18n/LocaleContext';
import { useWorkbenchStore } from '@/store/WorkbenchStore';
import { KUEC_LAYOUT } from '@/theme/kuec-tokens';

type TaskPageProps = { params: Promise<{ id: string }> };

// The Task card first on the page, on every width; the opportunity it belongs
// to is one line and a stage path underneath, never a field wall.
export default function TaskPage({ params }: TaskPageProps) {
  const { id } = use(params);
  const { t, locale, direction } = useLocale();
  const { getTask, getOpportunity, getAccount } = useWorkbenchStore();
  const searchParams = useSearchParams();
  const query = new URLSearchParams(searchParams.toString());
  const fromNotification = query.get('from') === 'notification';
  query.delete('from');
  const suffix = query.toString() ? `?${query.toString()}` : '';
  const task = getTask(id);

  if (task === null) {
    return <KuecEmptyState title={t('task.notFound')} nextStep={t('task.notFound.next')} actionLabel={t('nav.home')} actionHref={`/${suffix}`} />;
  }

  const opportunity = getOpportunity(task.opportunityId);
  const account = opportunity ? getAccount(opportunity.accountId) : null;

  return (
    <Stack gap="md" align="stretch" maw={KUEC_LAYOUT.cardColumnMaxWidthPx} mx="auto">
      <Group justify="space-between" wrap="nowrap">
        <Breadcrumbs separator={<IconChevronRight size={14} style={{ transform: direction === 'rtl' ? 'scaleX(-1)' : undefined }} />} separatorMargin={6}>
          <Anchor href={`/${suffix}`} size="sm">
            {t('nav.home')}
          </Anchor>
          <Anchor href={`/tasks${suffix}`} size="sm">
            {t('nav.tasks')}
          </Anchor>
          <Text size="sm" c="dimmed">
            {t('task.eyebrow')}
          </Text>
        </Breadcrumbs>
        <HowThisWorks lineKeys={['task.how.1', 'task.how.2', 'task.how.3', 'task.how.4', 'task.how.5']} />
      </Group>

      <KuecTaskCard task={task} fromNotification={fromNotification} />

      {opportunity ? (
        <Stack gap="xs" px="xs">
          <Text size="sm" c="dimmed">
            {t('task.partOf')}{' '}
            <Anchor href={`/opportunities/${opportunity.id}${suffix}`} size="sm" fw={600}>
              <bdi>
                {opportunity.name[locale]}
                {account ? ` · ${account.name[locale]}` : ''}
              </bdi>
            </Anchor>
          </Text>
          <KuecStagePath stage={opportunity.stage} />
        </Stack>
      ) : null}
    </Stack>
  );
}
