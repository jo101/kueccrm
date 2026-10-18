'use client';

import { useState } from 'react';
import { Alert, Badge, Button, Card, Group, Menu, Radio, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCalendarPause } from '@tabler/icons-react';

import type { Decision } from '@/data/model';
import { useLocale } from '@/i18n/LocaleContext';
import { formatShortDate } from '@/i18n/format';
import { BackendWriteFailed, usePrototypeStore } from '@/store/PrototypeStore';
import { KUEC_TOUCH_TARGET_PX } from '@/theme/kuec-theme';

type KuecDecisionCardProps = {
  decision: Decision;
};

const DEFER_OPTIONS_DAYS = [1, 3, 7];

// Context, options, a recommendation, a decide-by date, who else is affected,
// what happens if nobody decides, and Decide later with a date (principle 13).
export const KuecDecisionCard = ({ decision }: KuecDecisionCardProps) => {
  const { t, locale } = useLocale();
  const { getPersona, getOpportunity, writeDecision, nowIso } = usePrototypeStore();
  const [optionId, setOptionId] = useState(decision.recommendedOptionId);
  const [pending, setPending] = useState<'decide' | 'defer' | null>(null);
  const opportunity = getOpportunity(decision.caseId);
  const affected = decision.affectedPersonIds.map((id) => getPersona(id)?.firstName[locale] ?? id).join(', ');
  const owner = opportunity ? (getPersona(opportunity.ownerId)?.firstName[locale] ?? '') : '';

  const decide = async () => {
    setPending('decide');
    try {
      await writeDecision(decision.id, { kind: 'decided', optionId });
      notifications.show({ color: 'success', message: t('decision.toast.decided', { owner }) });
    } catch (error) {
      notifications.show({ color: 'error', message: error instanceof BackendWriteFailed ? t('wp.toast.failed') : String(error) });
    } finally {
      setPending(null);
    }
  };

  const defer = async (days: number) => {
    setPending('defer');
    const until = new Date(new Date(nowIso).getTime() + days * 86_400_000).toISOString();
    try {
      await writeDecision(decision.id, { kind: 'deferred', untilIso: until });
      notifications.show({ color: 'info', message: t('decision.toast.deferred', { date: formatShortDate(locale, until) }) });
    } catch (error) {
      notifications.show({ color: 'error', message: error instanceof BackendWriteFailed ? t('wp.toast.failed') : String(error) });
    } finally {
      setPending(null);
    }
  };

  return (
    <Card component="article" aria-label={decision.title[locale]} style={{ borderInlineStart: '4px solid var(--mantine-color-error-6)' }}>
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Stack gap={2}>
            <Group gap="xs">
              <Text size="xs" c="dimmed" tt="uppercase" fw={600} style={{ letterSpacing: '0.04em' }}>
                {t('decision.eyebrow')}
              </Text>
              <Badge variant="outline" color={decision.kind === 'material' ? 'error' : 'gray'} size="sm" styles={{ root: { textTransform: 'none' } }}>
                {decision.kind === 'material' ? t('decision.material') : t('decision.routine')}
              </Badge>
            </Group>
            <Text fw={600} size="lg" style={{ lineHeight: 1.3 }}>
              {decision.title[locale]}
            </Text>
            {opportunity ? (
              <Text size="sm" c="dimmed">
                <bdi>{opportunity.company[locale]}</bdi>
              </Text>
            ) : null}
          </Stack>
          <Text size="sm" fw={500} style={{ whiteSpace: 'nowrap' }}>
            {t('decision.decideBy', { date: formatShortDate(locale, decision.decideBy) })}
          </Text>
        </Group>

        <Alert variant="light" color="error" icon={<IconAlertTriangle size={18} />} title={t('decision.blocked')}>
          <Text size="sm">{decision.blocked[locale]}</Text>
          <Text size="sm" mt={4}>
            <Text component="span" fw={500}>
              {t('decision.consequence')}:
            </Text>{' '}
            {decision.consequence[locale]}
          </Text>
        </Alert>

        <Radio.Group value={optionId} onChange={setOptionId} label={t('decision.options')} aria-label={t('decision.options')}>
          <Stack gap="xs" mt={6}>
            {decision.options.map((option) => (
              <Radio
                key={option.id}
                value={option.id}
                label={
                  <Group gap="xs" wrap="nowrap">
                    <Text size="sm" fw={500}>
                      {option.label[locale]}
                    </Text>
                    {option.id === decision.recommendedOptionId ? (
                      <Badge size="xs" variant="light" color="success" styles={{ root: { textTransform: 'none' } }}>
                        {t('decision.recommended')}
                      </Badge>
                    ) : null}
                  </Group>
                }
                description={option.consequence[locale]}
              />
            ))}
          </Stack>
        </Radio.Group>

        <Group justify="space-between" align="center" wrap="wrap" gap="sm">
          <Text size="sm" c="dimmed">
            {t('decision.affected')}: <bdi>{affected}</bdi>
          </Text>
          <Group gap="xs" className="kuec-card-actions">
            <Menu position="top-end" withArrow>
              <Menu.Target>
                <Button variant="default" h={KUEC_TOUCH_TARGET_PX} className="kuec-action" leftSection={<IconCalendarPause size={16} />} loading={pending === 'defer'} disabled={pending !== null}>
                  {t('decision.later')}
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                {DEFER_OPTIONS_DAYS.map((days) => (
                  <Menu.Item key={days} onClick={() => void defer(days)}>
                    {formatShortDate(locale, new Date(new Date(nowIso).getTime() + days * 86_400_000).toISOString())}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
            <Button variant="filled" h={KUEC_TOUCH_TARGET_PX} className="kuec-action" onClick={() => void decide()} loading={pending === 'decide'} disabled={pending !== null}>
              {t('card.action.decide')}
            </Button>
          </Group>
        </Group>
      </Stack>
    </Card>
  );
};
