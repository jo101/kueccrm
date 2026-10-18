'use client';

import { useState } from 'react';
import { Button, Card, Group, Popover, Radio, Stack, Text } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';

import type { Decision } from '@/data/model';
import { useLocale } from '@/i18n/LocaleContext';
import { formatShortDate } from '@/i18n/format';
import { BackendWriteFailed, useWorkbenchStore } from '@/store/WorkbenchStore';
import { kuecStatusCssColor } from '@/theme/kuec-tokens';

import { KuecStatus } from './KuecStatus';

type KuecDecisionCardProps = {
  decision: Decision;
  primary?: boolean;
};

// What is blocked, the consequence, options with a recommendation, decide-by
// date, who else is affected, Decide later with a date. A commercial decision
// is told from a routine one on sight: its label and edge carry the blocked tone.
export const KuecDecisionCard = ({ decision, primary = false }: KuecDecisionCardProps) => {
  const { t, locale } = useLocale();
  const { getPersona, getOpportunity, getAccount, writeDecision, nowIso } = useWorkbenchStore();
  const [optionId, setOptionId] = useState(decision.recommendedOptionId);
  const [pending, setPending] = useState<'decide' | 'defer' | null>(null);
  const [laterOpened, setLaterOpened] = useState(false);
  const [laterDate, setLaterDate] = useState<string | null>(null);
  const opportunity = getOpportunity(decision.opportunityId);
  const account = opportunity ? getAccount(opportunity.accountId) : null;
  const affected = decision.affectedPersonIds.map((id) => getPersona(id)?.firstName[locale] ?? id).join(', ');
  const owner = opportunity ? (getPersona(opportunity.ownerId)?.firstName[locale] ?? '') : '';
  const isMaterial = decision.kind === 'material';

  const decide = async () => {
    setPending('decide');
    try {
      await writeDecision(decision.id, { kind: 'decided', optionId });
      notifications.show({ color: 'success', message: t('decision.toast.decided', { owner }) });
    } catch (error) {
      notifications.show({ color: 'error', message: error instanceof BackendWriteFailed ? t('task.toast.failed') : String(error) });
    } finally {
      setPending(null);
    }
  };

  const defer = async () => {
    if (laterDate === null) {
      return;
    }
    setPending('defer');
    const until = new Date(`${laterDate}T08:00:00+04:00`).toISOString();
    try {
      await writeDecision(decision.id, { kind: 'deferred', untilIso: until });
      setLaterOpened(false);
      notifications.show({ color: 'info', message: t('decision.toast.deferred', { date: formatShortDate(locale, until) }) });
    } catch (error) {
      notifications.show({ color: 'error', message: error instanceof BackendWriteFailed ? t('task.toast.failed') : String(error) });
    } finally {
      setPending(null);
    }
  };

  return (
    <Card component="article" aria-label={decision.title[locale]} style={{ borderInlineStart: `4px solid ${isMaterial ? kuecStatusCssColor('blocked') : 'var(--uv-surface-neutral-border)'}` }}>
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start" wrap="wrap" gap="xs">
          <Stack gap={2} style={{ minWidth: 0, flex: '1 1 240px' }}>
            <KuecStatus tone={isMaterial ? 'blocked' : 'neutral'} label={isMaterial ? t('decision.material') : t('decision.routine')} size="xs" />
            <Text fw={600} size="md" component="h3" style={{ margin: 0, lineHeight: 1.35 }}>
              <bdi>{decision.title[locale]}</bdi>
            </Text>
            {account ? (
              <Text size="sm" c="dimmed">
                <bdi>{account.name[locale]}</bdi>
              </Text>
            ) : null}
          </Stack>
          <Text size="xs" fw={600} style={{ whiteSpace: 'nowrap' }}>
            {t('decision.decideBy', { date: formatShortDate(locale, decision.decideBy) })}
          </Text>
        </Group>

        <Stack gap={2}>
          <Text size="xs" c="dimmed">
            {t('decision.blocked')}
          </Text>
          <Text size="sm">{decision.blocked[locale]}</Text>
        </Stack>
        <Stack gap={2}>
          <Text size="xs" c="dimmed">
            {t('decision.consequence')}
          </Text>
          <Text size="sm">{decision.consequence[locale]}</Text>
        </Stack>

        <Radio.Group value={optionId} onChange={setOptionId} label={t('decision.options')} aria-label={t('decision.options')} styles={{ label: { fontSize: 'var(--mantine-font-size-xs)', color: 'var(--mantine-color-dimmed)', fontWeight: 400 } }}>
          <Stack gap="xs" mt={6}>
            {decision.options.map((option) => (
              <Radio
                key={option.id}
                value={option.id}
                size="sm"
                label={
                  <Group gap="xs" wrap="nowrap">
                    <Text size="sm" fw={600}>
                      {option.label[locale]}
                    </Text>
                    {option.id === decision.recommendedOptionId ? <KuecStatus tone="ok" label={t('decision.recommended')} size="xs" /> : null}
                  </Group>
                }
                description={option.consequence[locale]}
              />
            ))}
          </Stack>
        </Radio.Group>

        <Group justify="space-between" align="center" wrap="wrap" gap="sm">
          <Text size="xs" c="dimmed">
            {t('decision.affected')}: <bdi>{affected}</bdi>
          </Text>
          <Group gap="xs" className="kuec-card-actions">
            <Popover opened={laterOpened} onChange={setLaterOpened} position="top-end" withArrow trapFocus>
              <Popover.Target>
                <Button variant="default" className="kuec-action" onClick={() => setLaterOpened((value) => !value)} disabled={pending !== null} loading={pending === 'defer'}>
                  {t('action.decideLater')}
                </Button>
              </Popover.Target>
              <Popover.Dropdown>
                <Stack gap="sm">
                  <DateInput label={t('decision.laterOn')} value={laterDate} onChange={setLaterDate} minDate={new Date(nowIso)} valueFormat="ddd D MMM YYYY" popoverProps={{ withinPortal: false }} />
                  <Button variant="default" onClick={() => void defer()} disabled={laterDate === null} className="kuec-action">
                    {t('action.decideLater')}
                  </Button>
                </Stack>
              </Popover.Dropdown>
            </Popover>
            <Button variant={primary ? 'filled' : 'default'} className="kuec-action" onClick={() => void decide()} loading={pending === 'decide'} disabled={pending !== null}>
              {t('action.decide')}
            </Button>
          </Group>
        </Group>
      </Stack>
    </Card>
  );
};
