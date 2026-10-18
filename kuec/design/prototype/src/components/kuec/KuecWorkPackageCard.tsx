'use client';

import { useState } from 'react';
import { Alert, Button, Card, Divider, Group, List, Modal, Select, Stack, Text, Textarea, TextInput, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle, IconBell } from '@tabler/icons-react';

import type { WorkPackage } from '@/data/model';
import { useLocale } from '@/i18n/LocaleContext';
import { formatShortDate } from '@/i18n/format';
import type { MessageKey } from '@/i18n/messages';
import { BackendWriteFailed, OPS_COORDINATOR_PERSONA_ID, usePrototypeStore } from '@/store/PrototypeStore';
import { CARD_ACTION, type CardAction, getAvailableActions, getDueLabel, getStatusTone, isOutputLinkValid, isReasonValid } from '@/store/rules';
import { KUEC_CARD_MAX_WIDTH_PX, KUEC_TOUCH_TARGET_PX } from '@/theme/kuec-theme';

import { InfoLabel } from './InfoLabel';
import { KuecStatusIndicator } from './KuecStatusIndicator';

type KuecWorkPackageCardProps = {
  workPackage: WorkPackage;
  fromNotification?: boolean;
};

type OpenForm = typeof CARD_ACTION.DECLINE | typeof CARD_ACTION.REQUEST_HELP | typeof CARD_ACTION.SUBMIT | typeof CARD_ACTION.SEND_BACK | typeof CARD_ACTION.REASSIGN;

const ACTION_LABEL_KEY: Record<CardAction, MessageKey> = {
  ACCEPT: 'card.action.accept',
  DECLINE: 'card.action.decline',
  REQUEST_HELP: 'card.action.help',
  SUBMIT: 'card.action.submit',
  APPROVE: 'card.action.approve',
  SEND_BACK: 'card.action.sendBack',
  RESOLVE_BLOCKER: 'card.action.resolve',
  REASSIGN: 'card.action.reassign',
};

const FORM_ACTIONS: CardAction[] = [CARD_ACTION.DECLINE, CARD_ACTION.REQUEST_HELP, CARD_ACTION.SUBMIT, CARD_ACTION.SEND_BACK, CARD_ACTION.REASSIGN];

// What, why, who, due, expected output, done criteria, status in plain words,
// and only the actions the role and status allow. First on every surface.
export const KuecWorkPackageCard = ({ workPackage, fromNotification = false }: KuecWorkPackageCardProps) => {
  const { t, locale } = useLocale();
  const { viewer, nowIso, getPersona, getOpportunity, personas, writeWorkPackage } = usePrototypeStore();
  const [openForm, setOpenForm] = useState<OpenForm | null>(null);
  const [formText, setFormText] = useState('');
  const [reassignTo, setReassignTo] = useState<string | null>(OPS_COORDINATOR_PERSONA_ID);
  const [pending, setPending] = useState<CardAction | null>(null);

  const owner = getPersona(workPackage.ownerId);
  const reviewer = workPackage.reviewerId ? getPersona(workPackage.reviewerId) : null;
  const opportunity = getOpportunity(workPackage.caseId);
  const actions = getAvailableActions(workPackage, viewer);
  const [primary, ...secondary] = actions;
  const tone = getStatusTone(workPackage.status, workPackage.dueAt, nowIso);
  const due = getDueLabel(workPackage.dueAt, nowIso);
  const dueText =
    due.kind === 'today'
      ? t('date.today')
      : due.kind === 'tomorrow'
        ? t('date.tomorrow')
        : due.kind === 'late'
          ? t('date.lateSince', { date: formatShortDate(locale, workPackage.dueAt) })
          : t('date.due', { date: formatShortDate(locale, workPackage.dueAt) });

  const whatNow = (): string => {
    const isOwner = workPackage.ownerId === viewer.id;
    const isReviewer = workPackage.reviewerId === viewer.id;
    switch (workPackage.status) {
      case 'OFFERED':
        return isOwner ? t('wp.whatNow.offered') : t('wp.whatNow.readOnly', { owner: owner?.firstName[locale] ?? '' });
      case 'ACCEPTED':
        return isOwner ? t('wp.whatNow.accepted') : t('wp.whatNow.readOnly', { owner: owner?.firstName[locale] ?? '' });
      case 'SUBMITTED':
        return isReviewer ? t('wp.whatNow.submitted.reviewer') : t('wp.whatNow.submitted.owner', { reviewer: reviewer?.firstName[locale] ?? '' });
      case 'BLOCKED':
        return isOwner ? t('wp.whatNow.blocked') : t('wp.whatNow.readOnly', { owner: owner?.firstName[locale] ?? '' });
      case 'DONE':
        return t('wp.whatNow.done');
      default:
        return t('wp.whatNow.readOnly', { owner: owner?.firstName[locale] ?? '' });
    }
  };

  const run = async (action: CardAction) => {
    if (FORM_ACTIONS.includes(action) && openForm !== action) {
      setFormText('');
      setOpenForm(action as OpenForm);

      return;
    }
    setPending(action);
    try {
      const reviewerName = reviewer?.firstName[locale] ?? '';
      switch (action) {
        case CARD_ACTION.ACCEPT:
          await writeWorkPackage(workPackage.id, { type: 'accept' });
          notifications.show({ color: 'success', message: t('wp.toast.accepted') });
          break;
        case CARD_ACTION.DECLINE:
          await writeWorkPackage(workPackage.id, { type: 'decline', reason: formText });
          notifications.show({ color: 'info', message: t('wp.toast.declined') });
          break;
        case CARD_ACTION.REQUEST_HELP:
          await writeWorkPackage(workPackage.id, { type: 'requestHelp', question: formText });
          notifications.show({ color: 'info', message: t('wp.toast.help') });
          break;
        case CARD_ACTION.SUBMIT:
          await writeWorkPackage(workPackage.id, { type: 'submit', outputLink: formText });
          notifications.show({ color: 'success', message: t('wp.toast.submitted', { reviewer: reviewerName }) });
          break;
        case CARD_ACTION.APPROVE:
          await writeWorkPackage(workPackage.id, { type: 'approve' });
          notifications.show({ color: 'success', message: t('wp.toast.approved') });
          break;
        case CARD_ACTION.SEND_BACK:
          await writeWorkPackage(workPackage.id, { type: 'sendBack', note: formText });
          notifications.show({ color: 'info', message: t('wp.toast.sentBack', { owner: owner?.firstName[locale] ?? '' }) });
          break;
        case CARD_ACTION.RESOLVE_BLOCKER:
          await writeWorkPackage(workPackage.id, { type: 'resolveBlocker' });
          notifications.show({ color: 'success', message: t('wp.toast.resolved') });
          break;
        case CARD_ACTION.REASSIGN: {
          const target = reassignTo ?? OPS_COORDINATOR_PERSONA_ID;
          await writeWorkPackage(workPackage.id, { type: 'reassign', ownerId: target });
          notifications.show({ color: 'success', message: t('wp.toast.reassigned', { owner: getPersona(target)?.firstName[locale] ?? '' }) });
          break;
        }
      }
      setOpenForm(null);
      setFormText('');
    } catch (error) {
      notifications.show({ color: 'error', autoClose: 8000, message: error instanceof BackendWriteFailed ? t('wp.toast.failed') : String(error) });
    } finally {
      setPending(null);
    }
  };

  const formValid = (): boolean => {
    if (openForm === CARD_ACTION.SUBMIT) {
      return isOutputLinkValid(formText);
    }
    if (openForm === CARD_ACTION.REASSIGN) {
      return reassignTo !== null && reassignTo !== workPackage.ownerId;
    }

    return isReasonValid(formText);
  };

  const formCopy: Record<OpenForm, { title: MessageKey; hint: MessageKey; error: MessageKey }> = {
    DECLINE: { title: 'wp.declineReason', hint: 'wp.declineHint', error: 'wp.reasonRequired' },
    REQUEST_HELP: { title: 'wp.helpQuestion', hint: 'wp.helpHint', error: 'wp.reasonRequired' },
    SUBMIT: { title: 'wp.outputLink', hint: 'wp.output', error: 'wp.linkRequired' },
    SEND_BACK: { title: 'wp.sendBackNote', hint: 'wp.done', error: 'wp.reasonRequired' },
    REASSIGN: { title: 'wp.reassignTo', hint: 'wp.how.4', error: 'wp.reasonRequired' },
  };

  return (
    <Card component="article" aria-label={workPackage.title[locale]} maw={KUEC_CARD_MAX_WIDTH_PX} w="100%">
      <Stack gap="md">
        {fromNotification ? (
          <Alert variant="light" color="info" icon={<IconBell size={16} />} py={6}>
            <Text size="sm">{t('proto.fromNotification')}</Text>
          </Alert>
        ) : null}

        <Stack gap={4}>
          <Text size="xs" c="dimmed" tt="uppercase" fw={600} style={{ letterSpacing: '0.04em' }}>
            {t('wp.eyebrow')} · {t('wp.step', { n: workPackage.stepNumber, total: workPackage.stepTotal })}
          </Text>
          <Title order={3} style={{ lineHeight: 1.25 }}>
            {workPackage.title[locale]}
          </Title>
          {opportunity ? (
            <Text size="sm" c="dimmed">
              {t('wp.partOf', { caseName: '' })}
              <bdi>
                {opportunity.name[locale]} · {opportunity.company[locale]}
              </bdi>
            </Text>
          ) : null}
        </Stack>

        <Group gap="lg" wrap="wrap" align="center">
          <Stack gap={2}>
            <InfoLabel label={t('wp.status')} tooltip={t('info.status')} />
            <KuecStatusIndicator tone={tone} label={t(`status.${workPackage.status}` as MessageKey)} />
          </Stack>
          <Stack gap={2}>
            <InfoLabel label={t('wp.due')} tooltip={t('info.due')} />
            <Text fw={600} c={tone === 'late' ? 'error' : undefined}>
              {dueText}
            </Text>
          </Stack>
          <Stack gap={2}>
            <Text size="sm" c="dimmed">
              {t('wp.owner')}
            </Text>
            <Text fw={500}>
              <bdi>{owner?.name[locale]}</bdi>
            </Text>
          </Stack>
          {reviewer ? (
            <Stack gap={2}>
              <Text size="sm" c="dimmed">
                {t('wp.reviewer')}
              </Text>
              <Text fw={500}>
                <bdi>{reviewer.name[locale]}</bdi>
              </Text>
            </Stack>
          ) : null}
        </Group>

        {workPackage.blockedReason ? (
          <Alert variant="light" color="error" icon={<IconAlertTriangle size={18} />} title={t('wp.blockedReason')}>
            {workPackage.blockedReason[locale]}
          </Alert>
        ) : null}

        <Divider />

        <Stack gap="sm">
          <Stack gap={2}>
            <Text size="sm" c="dimmed">
              {t('wp.what')}
            </Text>
            <Text>{workPackage.objective[locale]}</Text>
          </Stack>
          <Stack gap={2}>
            <Text size="sm" c="dimmed">
              {t('wp.why')}
            </Text>
            <Text>{workPackage.context[locale]}</Text>
          </Stack>
          <Stack gap={2}>
            <Text size="sm" c="dimmed">
              {t('wp.output')}
            </Text>
            <Text>{workPackage.expectedOutput[locale]}</Text>
          </Stack>
          <Stack gap={2}>
            <Text size="sm" c="dimmed">
              {t('wp.done')}
            </Text>
            <List spacing={4} size="sm">
              {workPackage.doneCriteria.map((criterion) => (
                <List.Item key={criterion.en}>{criterion[locale]}</List.Item>
              ))}
            </List>
          </Stack>
        </Stack>

        {actions.length > 0 ? (
          <>
            <Divider />
            <Group justify="flex-end" gap="xs" wrap="wrap" className="kuec-card-actions">
              {secondary.map((action) => (
                <Button key={action} variant="default" h={KUEC_TOUCH_TARGET_PX} className="kuec-action" onClick={() => void run(action)} disabled={pending !== null} loading={pending === action}>
                  {t(ACTION_LABEL_KEY[action])}
                </Button>
              ))}
              {primary ? (
                <Button variant="filled" h={KUEC_TOUCH_TARGET_PX} className="kuec-action" onClick={() => void run(primary)} disabled={pending !== null} loading={pending === primary} title={t('info.primary')}>
                  {t(ACTION_LABEL_KEY[primary])}
                </Button>
              ) : null}
            </Group>
          </>
        ) : null}

        <Text size="sm" c="dimmed">
          {whatNow()}
        </Text>
      </Stack>

      <Modal opened={openForm !== null} onClose={() => setOpenForm(null)} title={openForm ? t(formCopy[openForm].title) : ''} trapFocus returnFocus>
        {openForm ? (
          <Stack gap="md">
            {openForm === CARD_ACTION.REASSIGN ? (
              <Select
                data={personas.filter((persona) => persona.id !== workPackage.ownerId).map((persona) => ({ value: persona.id, label: `${persona.name[locale]} · ${persona.roleLabel[locale]}` }))}
                value={reassignTo}
                onChange={setReassignTo}
                searchable
                allowDeselect={false}
                aria-label={t('wp.reassignTo')}
              />
            ) : openForm === CARD_ACTION.SUBMIT ? (
              <TextInput value={formText} onChange={(event) => setFormText(event.currentTarget.value)} placeholder="https://" aria-label={t('wp.outputLink')} error={formText.length > 0 && !formValid() ? t(formCopy[openForm].error) : undefined} data-autofocus />
            ) : (
              <Textarea value={formText} onChange={(event) => setFormText(event.currentTarget.value)} maxLength={200} autosize minRows={2} aria-label={t(formCopy[openForm].title)} error={formText.length > 0 && !formValid() ? t(formCopy[openForm].error) : undefined} data-autofocus />
            )}
            <Text size="sm" c="dimmed">
              {t(formCopy[openForm].hint)}
            </Text>
            <Group justify="flex-end" gap="xs">
              <Button variant="default" h={KUEC_TOUCH_TARGET_PX} onClick={() => setOpenForm(null)}>
                {t('card.action.cancel')}
              </Button>
              <Button variant="filled" h={KUEC_TOUCH_TARGET_PX} disabled={!formValid() || pending !== null} loading={pending === openForm} onClick={() => void run(openForm)}>
                {t(ACTION_LABEL_KEY[openForm])}
              </Button>
            </Group>
          </Stack>
        ) : null}
      </Modal>
    </Card>
  );
};
