'use client';

import { useState } from 'react';
import { Button, Group, MultiSelect, Stack, Text, Textarea } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCalendarEvent, IconMail, IconPhone, IconPlus } from '@tabler/icons-react';

import type { ActivityKind, Contact } from '@/data/model';
import { useLocale } from '@/i18n/LocaleContext';
import type { MessageKey } from '@/i18n/messages';
import { BackendWriteFailed, useWorkbenchStore } from '@/store/WorkbenchStore';
import { isReasonValid } from '@/store/rules';

type KuecComposerProps = {
  opportunityId: string;
  contacts: Contact[];
  onNewTask: () => void;
};

type ComposerKind = Extract<ActivityKind, 'CALL' | 'EVENT' | 'EMAIL'>;

const KIND_LABEL: Record<ComposerKind, MessageKey> = { CALL: 'action.logCall', EVENT: 'action.newEvent', EMAIL: 'action.email' };
const KIND_ICON: Record<ComposerKind, typeof IconPhone> = { CALL: IconPhone, EVENT: IconCalendarEvent, EMAIL: IconMail };

// The composer at the top of the Activity tab: Log a call, New task, New
// event, Email. One text box, who was there, Save; the entry lands on the timeline.
export const KuecComposer = ({ opportunityId, contacts, onNewTask }: KuecComposerProps) => {
  const { t, locale } = useLocale();
  const { writeOpportunity } = useWorkbenchStore();
  const [kind, setKind] = useState<ComposerKind | null>(null);
  const [text, setText] = useState('');
  const [withIds, setWithIds] = useState<string[]>([]);
  const [pending, setPending] = useState(false);

  const save = async () => {
    if (kind === null) {
      return;
    }
    setPending(true);
    try {
      await writeOpportunity(opportunityId, { type: 'logActivity', kind, summary: { en: text.trim(), ar: text.trim() }, contactIds: withIds });
      notifications.show({ color: 'success', message: t('opp.toast.activityLogged') });
      setKind(null);
      setText('');
      setWithIds([]);
    } catch (error) {
      notifications.show({ color: 'error', autoClose: 8000, message: error instanceof BackendWriteFailed ? t('task.toast.failed') : String(error) });
    } finally {
      setPending(false);
    }
  };

  return (
    <Stack gap="sm" className="kuec-composer">
      <Group gap="xs" wrap="wrap">
        {(Object.keys(KIND_LABEL) as ComposerKind[]).map((item) => {
          const Icon = KIND_ICON[item];

          return (
            <Button key={item} variant={kind === item ? 'light' : 'default'} leftSection={<Icon size={16} />} onClick={() => setKind(kind === item ? null : item)} aria-pressed={kind === item}>
              {t(KIND_LABEL[item])}
            </Button>
          );
        })}
        <Button variant="default" leftSection={<IconPlus size={16} />} onClick={onNewTask}>
          {t('action.newTask')}
        </Button>
      </Group>
      {kind !== null ? (
        <Stack gap="sm">
          <Textarea value={text} onChange={(event) => setText(event.currentTarget.value)} placeholder={t('opp.composer.placeholder')} autosize minRows={2} maxLength={400} aria-label={t(KIND_LABEL[kind])} data-autofocus />
          <MultiSelect label={t('opp.composer.with')} data={contacts.map((contact) => ({ value: contact.id, label: contact.name[locale] }))} value={withIds} onChange={setWithIds} searchable clearable size="sm" />
          <Group justify="flex-end" gap="xs">
            <Button variant="default" onClick={() => setKind(null)}>
              {t('action.cancel')}
            </Button>
            <Button variant="default" onClick={() => void save()} disabled={!isReasonValid(text)} loading={pending}>
              {t('action.save')}
            </Button>
          </Group>
          <Text size="xs" c="dimmed">
            {t('opp.how.3')}
          </Text>
        </Stack>
      ) : null}
    </Stack>
  );
};
