'use client';

import { Stack, Text, Timeline } from '@mantine/core';
import { IconBolt, IconCalendarEvent, IconMail, IconMapPin, IconPhone, IconUsers } from '@tabler/icons-react';

import type { Activity, ActivityKind } from '@/data/model';
import { useLocale } from '@/i18n/LocaleContext';
import { formatDateTime } from '@/i18n/format';
import type { MessageKey } from '@/i18n/messages';
import { useWorkbenchStore } from '@/store/WorkbenchStore';

import { KuecEmptyState } from './KuecEmptyState';

type KuecTimelineProps = {
  activities: Activity[];
};

const KIND_ICON: Record<ActivityKind, typeof IconPhone> = {
  CALL: IconPhone,
  MEETING: IconUsers,
  SITE_VISIT: IconMapPin,
  EMAIL: IconMail,
  EVENT: IconCalendarEvent,
  SYSTEM: IconBolt,
};

// The Activity tab of the record template: newest first, one line of what
// happened, who was there and who logged it. System events read quieter.
export const KuecTimeline = ({ activities }: KuecTimelineProps) => {
  const { t, locale } = useLocale();
  const { getPersona, getContact } = useWorkbenchStore();
  const sorted = [...activities].sort((left, right) => right.at.localeCompare(left.at));

  if (sorted.length === 0) {
    return <KuecEmptyState title={t('opp.timeline.empty')} nextStep={t('opp.timeline.empty.next')} />;
  }

  return (
    <Timeline bulletSize={28} lineWidth={1} color="gray" active={-1}>
      {sorted.map((activity) => {
        const Icon = KIND_ICON[activity.kind];
        const by = activity.byId ? getPersona(activity.byId) : null;
        const withNames = activity.contactIds.map((id) => getContact(id)?.name[locale]).filter((name): name is string => name !== undefined);

        return (
          <Timeline.Item key={activity.id} bullet={<Icon size={14} />} title={t(`activity.${activity.kind}` as MessageKey)} styles={{ itemTitle: { fontSize: 'var(--mantine-font-size-sm)', fontWeight: 600 } }}>
            <Stack gap={2}>
              <Text size="sm" c={activity.kind === 'SYSTEM' ? 'dimmed' : undefined}>
                <bdi>{activity.summary[locale]}</bdi>
              </Text>
              <Text size="xs" c="dimmed">
                {formatDateTime(locale, activity.at)}
                {withNames.length > 0 ? (
                  <>
                    {' · '}
                    {t('opp.composer.with')} <bdi>{withNames.join(', ')}</bdi>
                  </>
                ) : null}
                {by ? (
                  <>
                    {' · '}
                    <bdi>{t('activity.by', { name: by.firstName[locale] })}</bdi>
                  </>
                ) : null}
              </Text>
            </Stack>
          </Timeline.Item>
        );
      })}
    </Timeline>
  );
};
