'use client';

import { useState } from 'react';
import { Button, Group, Modal, Stack, Text, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { IconArrowRight } from '@tabler/icons-react';

import type { Opportunity } from '@/data/model';
import { useLocale } from '@/i18n/LocaleContext';
import { formatShortDate } from '@/i18n/format';
import { BackendWriteFailed, useWorkbenchStore } from '@/store/WorkbenchStore';
import { getNextStepState, getNextStepTone, isNextStepValid, type NextStepState } from '@/store/rules';

import { InfoLabel } from './InfoLabel';
import { KuecStatus } from './KuecStatus';

type KuecNextStepProps = {
  opportunity: Opportunity;
  canEdit: boolean;
  // The screen decides whether Set Next Step is its one filled button.
  primary?: boolean;
  // Off when the surrounding section already carries the label and the info icon.
  labelled?: boolean;
};

export const nextStepDueLabel = (t: (key: 'date.today' | 'date.tomorrow' | 'date.lateSince' | 'date.due' | 'date.noNext', values?: Record<string, string>) => string, locale: 'en' | 'ar', state: NextStepState, dateIso: string | null): string => {
  switch (state) {
    case 'missing':
      return t('date.noNext');
    case 'late':
      return t('date.lateSince', { date: formatShortDate(locale, dateIso ?? '') });
    case 'today':
      return t('date.today');
    case 'tomorrow':
      return t('date.tomorrow');
    case 'closed':
      return '';
    default:
      return t('date.due', { date: formatShortDate(locale, dateIso ?? '') });
  }
};

// The one line every open opportunity must answer: what happens next, and
// when. Setting it is one text line and one date; saving is reversible with Undo.
export const KuecNextStep = ({ opportunity, canEdit, primary = false, labelled = true }: KuecNextStepProps) => {
  const { t, locale, direction } = useLocale();
  const { nowIso, writeOpportunity } = useWorkbenchStore();
  const [opened, setOpened] = useState(false);
  const [text, setText] = useState(opportunity.nextStep?.[locale] ?? '');
  const [date, setDate] = useState<string | null>(opportunity.nextStepDate ? opportunity.nextStepDate.slice(0, 10) : null);
  const [pending, setPending] = useState(false);
  const state = getNextStepState(opportunity, nowIso);
  const tone = getNextStepTone(state);

  const open = () => {
    setText(opportunity.nextStep?.[locale] ?? '');
    setDate(opportunity.nextStepDate ? opportunity.nextStepDate.slice(0, 10) : null);
    setOpened(true);
  };

  const save = async () => {
    if (date === null) {
      return;
    }
    const previous = { nextStep: opportunity.nextStep, nextStepDate: opportunity.nextStepDate };
    const nextStepDate = new Date(`${date}T17:00:00+04:00`).toISOString();
    setPending(true);
    try {
      await writeOpportunity(opportunity.id, { type: 'setNextStep', nextStep: { en: text.trim(), ar: text.trim() }, nextStepDate });
      setOpened(false);
      const id = notifications.show({
        color: 'success',
        message: (
          <Group justify="space-between" wrap="nowrap">
            <span>{t('opp.toast.nextStepSaved')}</span>
            {previous.nextStep && previous.nextStepDate ? (
              <Button
                size="compact-xs"
                variant="subtle"
                onClick={() => {
                  notifications.hide(id);
                  void writeOpportunity(opportunity.id, { type: 'setNextStep', nextStep: previous.nextStep as { en: string; ar: string }, nextStepDate: previous.nextStepDate as string });
                }}
              >
                {t('action.undo')}
              </Button>
            ) : null}
          </Group>
        ),
      });
    } catch (error) {
      notifications.show({ color: 'error', autoClose: 8000, message: error instanceof BackendWriteFailed ? t('task.toast.failed') : String(error) });
    } finally {
      setPending(false);
    }
  };

  return (
    <Stack gap={8} className="kuec-next-step">
      {labelled ? <InfoLabel label={t('opp.nextStep')} tooltip={t('info.nextStep')} /> : null}
      <Group gap={8} wrap="nowrap" align="flex-start">
        <IconArrowRight size={18} style={{ flexShrink: 0, marginTop: 1, transform: direction === 'rtl' ? 'scaleX(-1)' : undefined, color: 'var(--mantine-color-dimmed)' }} aria-hidden />
        <Stack gap={4} style={{ minWidth: 0, flex: 1 }}>
          <Text fw={600} size="sm" c={state === 'missing' ? 'dimmed' : undefined}>
            {opportunity.nextStep ? <bdi>{opportunity.nextStep[locale]}</bdi> : t('date.noNext')}
          </Text>
          {state !== 'closed' ? <KuecStatus tone={tone} label={nextStepDueLabel(t, locale, state, opportunity.nextStepDate)} size="xs" /> : null}
        </Stack>
      </Group>
      {canEdit && state !== 'closed' ? (
        <Button variant={primary ? 'filled' : 'default'} onClick={open} className="kuec-action" fullWidth>
          {t('action.setNextStep')}
        </Button>
      ) : null}

      <Modal opened={opened} onClose={() => setOpened(false)} title={t('action.setNextStep')} trapFocus returnFocus>
        <Stack gap="md">
          <TextInput label={t('opp.setNextStep.what')} description={t('opp.setNextStep.hint')} value={text} onChange={(event) => setText(event.currentTarget.value)} maxLength={120} data-autofocus />
          <DateInput label={t('opp.setNextStep.when')} value={date} onChange={setDate} valueFormat="ddd D MMM YYYY" minDate={new Date(nowIso)} />
          <Group justify="flex-end" gap="xs">
            <Button variant="default" onClick={() => setOpened(false)} className="kuec-action">
              {t('action.cancel')}
            </Button>
            <Button variant="filled" onClick={() => void save()} disabled={!isNextStepValid(text, date ? new Date(`${date}T17:00:00+04:00`).toISOString() : null, nowIso)} loading={pending} className="kuec-action">
              {t('action.save')}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
};
