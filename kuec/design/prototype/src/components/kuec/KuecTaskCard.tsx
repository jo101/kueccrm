'use client';

import { useState } from 'react';
import { Alert, Button, Card, Divider, Group, List, Modal, Stack, Text, Textarea, TextInput, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconBell } from '@tabler/icons-react';

import type { Task } from '@/data/model';
import { useLocale } from '@/i18n/LocaleContext';
import { formatShortDate } from '@/i18n/format';
import type { MessageKey } from '@/i18n/messages';
import { BackendWriteFailed, OPS_COORDINATOR_PERSONA_ID, useWorkbenchStore } from '@/store/WorkbenchStore';
import { TASK_ACTION, TASK_FORM_ACTIONS, type TaskAction, getDueLabel, getTaskActions, getTaskTone, isOutputLinkValid, isReasonValid } from '@/store/rules';

import { InfoLabel } from './InfoLabel';
import { KuecPersonPicker } from './KuecPersonPicker';
import { KuecStatus } from './KuecStatus';

type KuecTaskCardProps = {
  task: Task;
  fromNotification?: boolean;
};

const ACTION_LABEL_KEY: Record<TaskAction, MessageKey> = {
  ACCEPT: 'action.accept',
  DECLINE: 'action.decline',
  REQUEST_HELP: 'action.requestHelp',
  SUBMIT_FOR_REVIEW: 'action.submitForReview',
  MARK_COMPLETE: 'action.markComplete',
  APPROVE: 'action.approve',
  SEND_BACK: 'action.sendBack',
  REPORT_BLOCKER: 'action.reportBlocker',
  RESUME_WORK: 'action.resumeWork',
  REASSIGN: 'action.reassign',
};

type FormCopy = { title: MessageKey; hint: MessageKey; error: MessageKey; kind: 'text' | 'link' | 'person' };

const FORM_COPY: Partial<Record<TaskAction, FormCopy>> = {
  DECLINE: { title: 'task.declineReason', hint: 'task.declineHint', error: 'task.reasonRequired', kind: 'text' },
  REQUEST_HELP: { title: 'task.helpQuestion', hint: 'task.helpHint', error: 'task.reasonRequired', kind: 'text' },
  SUBMIT_FOR_REVIEW: { title: 'task.outputLink', hint: 'task.output', error: 'task.linkRequired', kind: 'link' },
  MARK_COMPLETE: { title: 'task.outputLink', hint: 'task.output', error: 'task.linkRequired', kind: 'link' },
  SEND_BACK: { title: 'task.sendBackNote', hint: 'task.done', error: 'task.reasonRequired', kind: 'text' },
  REPORT_BLOCKER: { title: 'task.blockerReason', hint: 'task.blockerHint', error: 'task.reasonRequired', kind: 'text' },
  REASSIGN: { title: 'task.reassignTo', hint: 'task.reassignHint', error: 'task.reasonRequired', kind: 'person' },
};

// The Task card (brief part 5): what, why, who, due, expected output, done
// criteria, status in plain words, only the actions the role and status allow.
// First on every surface; the action bar sticks to the bottom on a phone.
export const KuecTaskCard = ({ task, fromNotification = false }: KuecTaskCardProps) => {
  const { t, locale } = useLocale();
  const { viewer, nowIso, personas, getPersona, getOpportunity, getAccount, writeTask } = useWorkbenchStore();
  const [openForm, setOpenForm] = useState<TaskAction | null>(null);
  const [formText, setFormText] = useState('');
  const [reassignTo, setReassignTo] = useState<string | null>(OPS_COORDINATOR_PERSONA_ID);
  const [pending, setPending] = useState<TaskAction | null>(null);

  const owner = getPersona(task.ownerId);
  const reviewer = task.reviewerId ? getPersona(task.reviewerId) : null;
  const opportunity = getOpportunity(task.opportunityId);
  const account = opportunity ? getAccount(opportunity.accountId) : null;
  const actions = getTaskActions(task, viewer);
  const [primary, ...secondary] = actions;
  const tone = getTaskTone(task, nowIso);
  const due = getDueLabel(task.dueAt, nowIso);
  const isOwner = task.ownerId === viewer.id;
  const dueText =
    due.kind === 'today'
      ? t('date.today')
      : due.kind === 'tomorrow'
        ? t('date.tomorrow')
        : due.kind === 'late'
          ? t('date.lateSince', { date: formatShortDate(locale, task.dueAt) })
          : t('date.due', { date: formatShortDate(locale, task.dueAt) });

  const whatNow = (): string => {
    const isReviewer = task.reviewerId === viewer.id;
    const ownerName = owner?.firstName[locale] ?? '';
    switch (task.status) {
      case 'OFFERED':
        return isOwner ? t('task.whatNow.assigned') : t('task.whatNow.readOnly', { owner: ownerName });
      case 'ACCEPTED':
        return isOwner ? (task.reviewerId === null ? t('task.whatNow.inProgress.noReviewer') : t('task.whatNow.inProgress')) : t('task.whatNow.readOnly', { owner: ownerName });
      case 'SUBMITTED':
        return isReviewer ? t('task.whatNow.pendingReview.reviewer') : t('task.whatNow.pendingReview.owner', { reviewer: reviewer?.firstName[locale] ?? '' });
      case 'BLOCKED':
        return isOwner ? t('task.whatNow.blocked') : t('task.whatNow.readOnly', { owner: ownerName });
      case 'DONE':
        return t('task.whatNow.completed');
      default:
        return t('task.whatNow.readOnly', { owner: ownerName });
    }
  };

  const run = async (action: TaskAction) => {
    if (TASK_FORM_ACTIONS.includes(action) && openForm !== action) {
      setFormText('');
      setOpenForm(action);

      return;
    }
    setPending(action);
    try {
      const reviewerName = reviewer?.firstName[locale] ?? '';
      switch (action) {
        case TASK_ACTION.ACCEPT:
          await writeTask(task.id, { type: 'accept' });
          notifications.show({ color: 'success', message: t('task.toast.accepted') });
          break;
        case TASK_ACTION.DECLINE:
          await writeTask(task.id, { type: 'decline', reason: formText });
          notifications.show({ color: 'info', message: t('task.toast.declined') });
          break;
        case TASK_ACTION.REQUEST_HELP:
          await writeTask(task.id, { type: 'requestHelp', question: formText });
          notifications.show({ color: 'info', message: t('task.toast.help') });
          break;
        case TASK_ACTION.SUBMIT_FOR_REVIEW:
          await writeTask(task.id, { type: 'submit', outputLink: formText });
          notifications.show({ color: 'success', message: t('task.toast.submitted', { reviewer: reviewerName }) });
          break;
        case TASK_ACTION.MARK_COMPLETE:
          await writeTask(task.id, { type: 'complete', outputLink: formText });
          notifications.show({ color: 'success', message: t('task.toast.completed') });
          break;
        case TASK_ACTION.APPROVE:
          await writeTask(task.id, { type: 'approve' });
          notifications.show({ color: 'success', message: t('task.toast.approved') });
          break;
        case TASK_ACTION.SEND_BACK:
          await writeTask(task.id, { type: 'sendBack', note: formText });
          notifications.show({ color: 'info', message: t('task.toast.sentBack', { owner: owner?.firstName[locale] ?? '' }) });
          break;
        case TASK_ACTION.REPORT_BLOCKER:
          await writeTask(task.id, { type: 'block', reason: { en: formText, ar: formText } });
          notifications.show({ color: 'info', message: t('task.toast.blocked') });
          break;
        case TASK_ACTION.RESUME_WORK:
          await writeTask(task.id, { type: 'resume' });
          notifications.show({ color: 'success', message: t('task.toast.resumed') });
          break;
        case TASK_ACTION.REASSIGN: {
          const target = reassignTo ?? OPS_COORDINATOR_PERSONA_ID;
          await writeTask(task.id, { type: 'reassign', ownerId: target });
          notifications.show({ color: 'success', message: t('task.toast.reassigned', { owner: getPersona(target)?.firstName[locale] ?? '' }) });
          break;
        }
      }
      setOpenForm(null);
      setFormText('');
    } catch (error) {
      notifications.show({ color: 'error', autoClose: 8000, message: error instanceof BackendWriteFailed ? t('task.toast.failed') : String(error) });
    } finally {
      setPending(null);
    }
  };

  const form = openForm ? FORM_COPY[openForm] : undefined;
  const formValid = (): boolean => {
    if (form?.kind === 'link') {
      return isOutputLinkValid(formText);
    }
    if (form?.kind === 'person') {
      return reassignTo !== null && reassignTo !== task.ownerId;
    }

    return isReasonValid(formText);
  };

  return (
    <Card component="article" aria-label={task.title[locale]} w="100%" className="kuec-task-card">
      <Stack gap="md">
        {fromNotification ? (
          <Alert variant="light" color="info" icon={<IconBell size={16} />} py={6}>
            <Text size="sm">{t('task.fromNotification')}</Text>
          </Alert>
        ) : null}

        <Stack gap={4}>
          <Text size="xs" c="dimmed">
            {t('task.eyebrow')} · {t('task.step', { n: task.stepNumber, total: task.stepTotal })}
          </Text>
          <Title order={2}>
            <bdi>{task.title[locale]}</bdi>
          </Title>
          {opportunity ? (
            <Text size="sm" c="dimmed">
              {t('task.partOf')}{' '}
              <bdi>
                {opportunity.name[locale]}
                {account ? ` · ${account.name[locale]}` : ''}
              </bdi>
            </Text>
          ) : null}
        </Stack>

        <Group gap="lg" wrap="wrap" align="flex-start">
          <Stack gap={2}>
            <InfoLabel label={t('task.status')} tooltip={t('info.status')} />
            <KuecStatus tone={tone} label={t(`status.${task.status}` as MessageKey)} />
          </Stack>
          <Stack gap={2}>
            <InfoLabel label={t('task.due')} tooltip={t('info.due')} />
            <Text fw={600} size="sm" c={tone === 'blocked' && task.status !== 'BLOCKED' ? 'var(--mantine-color-error-6)' : undefined}>
              {dueText}
            </Text>
          </Stack>
          {!isOwner ? (
            <Stack gap={2}>
              <Text size="xs" c="dimmed">
                {t('task.owner')}
              </Text>
              <Text fw={600} size="sm">
                <bdi>{owner?.name[locale]}</bdi>
              </Text>
            </Stack>
          ) : null}
          {reviewer ? (
            <Stack gap={2}>
              <Text size="xs" c="dimmed">
                {t('task.reviewer')}
              </Text>
              <Text fw={600} size="sm">
                <bdi>{reviewer.name[locale]}</bdi>
              </Text>
            </Stack>
          ) : null}
        </Group>

        {task.blockedReason ? (
          <Alert variant="light" color="error" title={t('task.blockedReason')}>
            {task.blockedReason[locale]}
          </Alert>
        ) : null}

        <Divider />

        <Stack gap="sm">
          <Stack gap={2}>
            <Text size="xs" c="dimmed">
              {t('task.what')}
            </Text>
            <Text size="sm">{task.objective[locale]}</Text>
          </Stack>
          <Stack gap={2}>
            <Text size="xs" c="dimmed">
              {t('task.why')}
            </Text>
            <Text size="sm">{task.context[locale]}</Text>
          </Stack>
          <Stack gap={2}>
            <Text size="xs" c="dimmed">
              {t('task.output')}
            </Text>
            <Text size="sm">{task.expectedOutput[locale]}</Text>
          </Stack>
          <Stack gap={2}>
            <Text size="xs" c="dimmed">
              {t('task.done')}
            </Text>
            <List spacing={4} size="sm">
              {task.doneCriteria.map((criterion) => (
                <List.Item key={criterion.en}>{criterion[locale]}</List.Item>
              ))}
            </List>
          </Stack>
        </Stack>

        {actions.length > 0 ? (
          <div className="kuec-sticky-actions">
            <Divider mb="md" />
            <Group justify="flex-end" gap="xs" wrap="wrap" className="kuec-card-actions">
              {secondary.map((action) => (
                <Button key={action} variant="default" className="kuec-action" onClick={() => void run(action)} disabled={pending !== null} loading={pending === action}>
                  {t(ACTION_LABEL_KEY[action])}
                </Button>
              ))}
              {primary ? (
                <Button variant="filled" className="kuec-action kuec-primary" onClick={() => void run(primary)} disabled={pending !== null} loading={pending === primary} title={t('info.primary')}>
                  {t(ACTION_LABEL_KEY[primary])}
                </Button>
              ) : null}
            </Group>
          </div>
        ) : null}

        <Text size="sm" c="dimmed">
          {whatNow()}
        </Text>
      </Stack>

      <Modal opened={openForm !== null && form !== undefined} onClose={() => setOpenForm(null)} title={form ? t(form.title) : ''} trapFocus returnFocus>
        {openForm && form ? (
          <Stack gap="md">
            {form.kind === 'person' ? (
              <KuecPersonPicker label={t('task.reassignTo')} people={personas.filter((persona) => persona.role !== 'LEADERSHIP_VIEWER')} excludeIds={[task.ownerId]} value={reassignTo} onChange={setReassignTo} />
            ) : form.kind === 'link' ? (
              <TextInput value={formText} onChange={(event) => setFormText(event.currentTarget.value)} placeholder="https://" aria-label={t(form.title)} error={formText.length > 0 && !formValid() ? t(form.error) : undefined} data-autofocus />
            ) : (
              <Textarea value={formText} onChange={(event) => setFormText(event.currentTarget.value)} maxLength={200} autosize minRows={2} aria-label={t(form.title)} error={formText.length > 0 && !formValid() ? t(form.error) : undefined} data-autofocus />
            )}
            <Text size="sm" c="dimmed">
              {t(form.hint)}
            </Text>
            <Group justify="flex-end" gap="xs">
              <Button variant="default" onClick={() => setOpenForm(null)} className="kuec-action">
                {t('action.cancel')}
              </Button>
              <Button variant="filled" disabled={!formValid() || pending !== null} loading={pending === openForm} onClick={() => void run(openForm)} className="kuec-action">
                {t(ACTION_LABEL_KEY[openForm])}
              </Button>
            </Group>
          </Stack>
        ) : null}
      </Modal>
    </Card>
  );
};
