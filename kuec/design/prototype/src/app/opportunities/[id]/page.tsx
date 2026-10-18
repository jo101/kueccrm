'use client';

import { use, useState } from 'react';
import { Anchor, Breadcrumbs, Button, Group, SimpleGrid, Stack, Tabs, Text, TextInput, Textarea } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconChevronRight } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';

import { KuecComposer } from '@/components/kuec/KuecComposer';
import { KuecContextPanel } from '@/components/kuec/KuecContextPanel';
import { KuecDrawer } from '@/components/kuec/KuecDrawer';
import { KuecEmptyState } from '@/components/kuec/KuecEmptyState';
import { KuecListView } from '@/components/kuec/KuecListView';
import { KuecNextStep } from '@/components/kuec/KuecNextStep';
import { KuecPersonPicker } from '@/components/kuec/KuecPersonPicker';
import { KuecRecordHeader } from '@/components/kuec/KuecRecordHeader';
import { KuecSectionHeader } from '@/components/kuec/KuecSectionHeader';
import { KuecStagePath } from '@/components/kuec/KuecStagePath';
import { KuecStatus } from '@/components/kuec/KuecStatus';
import { KuecTimeline } from '@/components/kuec/KuecTimeline';
import type { Activity, Contact, Document, Task } from '@/data/model';
import { useLocale } from '@/i18n/LocaleContext';
import { formatAed, formatDate, formatDateTime, formatPercent, formatShortDate } from '@/i18n/format';
import type { MessageKey } from '@/i18n/messages';
import { BackendWriteFailed, useWorkbenchStore } from '@/store/WorkbenchStore';
import { getNextStage, getNextStepState, getTaskTone, isClosedStage, isReasonValid } from '@/store/rules';

type OpportunityPageProps = { params: Promise<{ id: string }> };

// The Opportunity record in the Lightning frame (brief part 5): header with
// Account, Amount, Close Date, Stage, Owner; chevron stage path with Mark stage
// complete; Activity, Details, Related; right rail with Next Step, key contacts
// and documents. One filled button: Set Next Step when it is missing or late,
// otherwise Mark stage complete.
export default function OpportunityPage({ params }: OpportunityPageProps) {
  const { id } = use(params);
  const { t, locale, direction } = useLocale();
  const { viewer, nowIso, personas, getOpportunity, getAccount, getPersona, getContact, tasks, activities, documents, writeOpportunity, createTask } = useWorkbenchStore();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const suffix = query ? `?${query}` : '';
  const href = (path: string) => `${path}${suffix}`;
  const [tab, setTab] = useState<string | null>('activity');
  const [stagePending, setStagePending] = useState(false);
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newOwner, setNewOwner] = useState<string | null>(null);
  const [newDue, setNewDue] = useState<string | null>(null);
  const [newDone, setNewDone] = useState('');
  const [newPending, setNewPending] = useState(false);

  const opportunity = getOpportunity(id);
  if (opportunity === null) {
    return <KuecEmptyState title={t('opp.notFound')} nextStep={t('nav.notBuilt.next')} actionLabel={t('nav.home')} actionHref={href('/')} />;
  }

  const account = getAccount(opportunity.accountId);
  const owner = getPersona(opportunity.ownerId);
  const isOwner = opportunity.ownerId === viewer.id;
  const canEdit = isOwner || viewer.role === 'ED' || viewer.role === 'OPS_COORDINATOR';
  const closed = isClosedStage(opportunity.stage);
  const nextStepState = getNextStepState(opportunity, nowIso);
  const nextStepIsPrimary = canEdit && (nextStepState === 'missing' || nextStepState === 'late');
  const stageIsPrimary = canEdit && !nextStepIsPrimary && !closed && getNextStage(opportunity.stage) !== null;
  const relatedTasks = tasks.filter((task) => task.opportunityId === opportunity.id).sort((left, right) => left.stepNumber - right.stepNumber);
  const relatedActivities = activities.filter((activity) => activity.opportunityId === opportunity.id);
  const relatedDocuments = documents.filter((document) => document.opportunityId === opportunity.id);
  const keyContacts = opportunity.keyContactIds.map(getContact).filter((contact): contact is Contact => contact !== null);

  const markStageComplete = () => {
    const next = getNextStage(opportunity.stage);
    if (next === null) {
      return;
    }
    modals.openConfirmModal({
      title: t('opp.markStage.title', { stage: t(`stage.${opportunity.stage}` as MessageKey) }),
      children: <Text size="sm">{t('opp.markStage.body', { next: t(`stage.${next}` as MessageKey) })}</Text>,
      labels: { confirm: t('action.markStageComplete'), cancel: t('action.cancel') },
      confirmProps: { variant: 'filled' },
      onConfirm: () => {
        setStagePending(true);
        void writeOpportunity(opportunity.id, { type: 'markStageComplete' })
          .then(() => notifications.show({ color: 'success', message: t('opp.toast.stageMoved', { stage: t(`stage.${next}` as MessageKey) }) }))
          .catch((error: unknown) => notifications.show({ color: 'error', autoClose: 8000, message: error instanceof BackendWriteFailed ? t('task.toast.failed') : String(error) }))
          .finally(() => setStagePending(false));
      },
    });
  };

  const saveNewTask = async () => {
    if (newOwner === null || newDue === null) {
      return;
    }
    setNewPending(true);
    try {
      await createTask({ opportunityId: opportunity.id, title: newTitle.trim(), ownerId: newOwner, dueAt: new Date(`${newDue}T17:00:00+04:00`).toISOString(), doneCriteria: newDone.trim() });
      notifications.show({ color: 'success', message: t('task.toast.reassigned', { owner: getPersona(newOwner)?.firstName[locale] ?? '' }) });
      setNewTaskOpen(false);
      setNewTitle('');
      setNewOwner(null);
      setNewDue(null);
      setNewDone('');
    } catch (error) {
      notifications.show({ color: 'error', autoClose: 8000, message: error instanceof BackendWriteFailed ? t('task.toast.failed') : String(error) });
    } finally {
      setNewPending(false);
    }
  };

  const whatNow = closed
    ? t('opp.whatNow.closed')
    : !canEdit
      ? t('opp.whatNow.readOnly', { owner: owner?.firstName[locale] ?? '' })
      : nextStepState === 'missing'
        ? t('opp.whatNow.noNext')
        : nextStepState === 'late'
          ? t('opp.whatNow.late')
          : t('opp.whatNow.ok');

  const detailRows: Array<{ label: MessageKey; value: React.ReactNode }> = [
    { label: 'opp.amount', value: formatAed(locale, opportunity.amountAed) },
    { label: 'opp.closeDate', value: formatDate(locale, opportunity.closeDate) },
    { label: 'opp.stage', value: t(`stage.${opportunity.stage}` as MessageKey) },
    { label: 'opp.probability', value: formatPercent(locale, opportunity.probability) },
    { label: 'opp.owner', value: <bdi>{owner?.name[locale]}</bdi> },
    { label: 'opp.nextStep', value: opportunity.nextStep ? <bdi>{opportunity.nextStep[locale]}</bdi> : t('date.noNext') },
    { label: 'opp.nextStepDate', value: opportunity.nextStepDate ? formatDate(locale, opportunity.nextStepDate) : '—' },
    { label: 'opp.leadSource', value: opportunity.leadSource[locale] },
    { label: 'opp.type', value: opportunity.type[locale] },
    { label: 'opp.forecastCategory', value: t(`forecast.${opportunity.forecastCategory}` as MessageKey) },
    { label: 'opp.capability', value: opportunity.capability ? opportunity.capability[locale] : '—' },
    { label: 'opp.description', value: opportunity.description[locale] },
  ];

  return (
    <Stack gap="md">
      <Breadcrumbs separator={<IconChevronRight size={14} style={{ transform: direction === 'rtl' ? 'scaleX(-1)' : undefined }} />} separatorMargin={6}>
        <Anchor href={href('/')} size="sm">
          {t('nav.home')}
        </Anchor>
        <Anchor href={href('/opportunities')} size="sm">
          {t('nav.opportunities')}
        </Anchor>
        <Text size="sm" c="dimmed">
          <bdi>{opportunity.name[locale]}</bdi>
        </Text>
      </Breadcrumbs>

      <KuecRecordHeader
        eyebrow={t('opp.eyebrow')}
        title={opportunity.name[locale]}
        howThisWorks={['opp.how.1', 'opp.how.2', 'opp.how.3', 'opp.how.4', 'opp.how.5']}
        facts={[
          { label: t('opp.account'), value: account ? <Anchor href={href(`/accounts/${account.id}`)} fw={600} size="sm"><bdi>{account.name[locale]}</bdi></Anchor> : '—' },
          { label: t('opp.amount'), value: formatAed(locale, opportunity.amountAed) },
          { label: t('opp.closeDate'), value: formatDate(locale, opportunity.closeDate) },
          { label: t('opp.stage'), value: t(`stage.${opportunity.stage}` as MessageKey) },
          { label: t('opp.owner'), value: <bdi>{isOwner ? viewer.firstName[locale] : owner?.name[locale]}</bdi> },
        ]}
      />

      <KuecStagePath stage={opportunity.stage} onMarkComplete={canEdit && !closed ? markStageComplete : undefined} markCompletePrimary={stageIsPrimary} markCompleteLoading={stagePending} />

      <div className="kuec-record">
        <div className="kuec-record-main">
          <Tabs value={tab} onChange={setTab} keepMounted={false}>
            <Tabs.List>
              <Tabs.Tab value="activity">{t('opp.tab.activity')}</Tabs.Tab>
              <Tabs.Tab value="details">{t('opp.tab.details')}</Tabs.Tab>
              <Tabs.Tab value="related">{t('opp.tab.related')}</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="activity" pt="md">
              <Stack gap="lg">
                {canEdit ? <KuecComposer opportunityId={opportunity.id} contacts={keyContacts} onNewTask={() => setNewTaskOpen(true)} /> : null}
                <KuecTimeline activities={relatedActivities} />
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="details" pt="md">
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" verticalSpacing="md">
                {detailRows.map((row) => (
                  <Stack key={row.label} gap={2} style={{ gridColumn: row.label === 'opp.description' ? '1 / -1' : undefined }}>
                    <Text size="xs" c="dimmed">
                      {t(row.label)}
                    </Text>
                    <Text size="sm" fw={row.label === 'opp.description' ? 400 : 600}>
                      {row.value}
                    </Text>
                  </Stack>
                ))}
              </SimpleGrid>
            </Tabs.Panel>

            <Tabs.Panel value="related" pt={0}>
              <KuecSectionHeader title={t('opp.related.tasks')} count={relatedTasks.length} listLabel={t('home.openList')} listHref={href(`/tasks?opportunity=${opportunity.id}`)} />
              <KuecListView<Task>
                ariaLabel={t('opp.related.tasks')}
                records={relatedTasks}
                onRowClick={(task) => {
                  window.location.href = href(`/tasks/${task.id}`);
                }}
                columns={[
                  { accessor: 'title', title: t('list.title'), render: (task) => <bdi>{task.title[locale]}</bdi> },
                  { accessor: 'status', title: t('list.status'), width: 160, render: (task) => <KuecStatus tone={getTaskTone(task, nowIso)} label={t(`status.${task.status}` as MessageKey)} size="xs" /> },
                  { accessor: 'ownerId', title: t('list.owner'), width: 180, render: (task) => <bdi>{getPersona(task.ownerId)?.name[locale]}</bdi> },
                  { accessor: 'dueAt', title: t('list.due'), width: 120, render: (task) => formatShortDate(locale, task.dueAt) },
                ]}
              />
              <KuecSectionHeader title={t('opp.related.contacts')} count={keyContacts.length} />
              <KuecListView<Contact>
                ariaLabel={t('opp.related.contacts')}
                records={keyContacts}
                columns={[
                  { accessor: 'name', title: t('list.name'), render: (contact) => <bdi>{contact.name[locale]}</bdi> },
                  { accessor: 'title', title: t('list.titleAtCompany'), render: (contact) => contact.title[locale] },
                  { accessor: 'decisionRole', title: t('list.role'), width: 160, render: (contact) => t(`contact.role.${contact.decisionRole}` as MessageKey) },
                ]}
              />
              <KuecSectionHeader title={t('opp.related.documents')} count={relatedDocuments.length} />
              <KuecListView<Document>
                ariaLabel={t('opp.related.documents')}
                records={relatedDocuments}
                columns={[
                  { accessor: 'name', title: t('list.name'), render: (document) => <Anchor href={document.link} target="_blank" rel="noreferrer" size="sm"><bdi>{document.name[locale]}</bdi></Anchor> },
                  { accessor: 'type', title: t('list.type'), width: 200, render: (document) => t(`doc.type.${document.type}` as MessageKey) },
                  { accessor: 'updatedAt', title: t('list.updated'), width: 140, render: (document) => formatShortDate(locale, document.updatedAt) },
                ]}
              />
              <KuecSectionHeader title={t('opp.related.activities')} count={relatedActivities.length} />
              <KuecListView<Activity>
                ariaLabel={t('opp.related.activities')}
                records={[...relatedActivities].sort((left, right) => right.at.localeCompare(left.at))}
                columns={[
                  { accessor: 'kind', title: t('list.type'), width: 120, render: (activity) => t(`activity.${activity.kind}` as MessageKey) },
                  { accessor: 'at', title: t('list.when'), width: 150, render: (activity) => formatDateTime(locale, activity.at) },
                  { accessor: 'summary', title: t('list.summary'), render: (activity) => <Text size="sm" lineClamp={1}><bdi>{activity.summary[locale]}</bdi></Text> },
                ]}
              />
            </Tabs.Panel>
          </Tabs>
        </div>

        <KuecContextPanel
          sections={[
            { title: t('opp.rail.nextStep'), info: t('info.nextStep'), content: <KuecNextStep opportunity={opportunity} canEdit={canEdit} primary={nextStepIsPrimary} labelled={false} /> },
            {
              title: t('opp.rail.contacts'),
              count: keyContacts.length,
              content: (
                <Stack gap={8}>
                  {keyContacts.map((contact) => (
                    <Stack key={contact.id} gap={0}>
                      <Anchor href={href(`/contacts/${contact.id}`)} size="sm" fw={600}>
                        <bdi>{contact.name[locale]}</bdi>
                      </Anchor>
                      <Text size="xs" c="dimmed">
                        {contact.title[locale]} · {t(`contact.role.${contact.decisionRole}` as MessageKey)}
                      </Text>
                    </Stack>
                  ))}
                </Stack>
              ),
            },
            {
              title: t('opp.rail.documents'),
              count: relatedDocuments.length,
              linkLabel: t('opp.rail.openInSharePoint'),
              linkHref: 'https://kuec.sharepoint.example/sites/BD',
              content: (
                <Stack gap={8}>
                  {relatedDocuments.map((document) => (
                    <Stack key={document.id} gap={0}>
                      <Anchor href={document.link} target="_blank" rel="noreferrer" size="sm" fw={600}>
                        <bdi>{document.name[locale]}</bdi>
                      </Anchor>
                      <Text size="xs" c="dimmed">
                        {t(`doc.type.${document.type}` as MessageKey)} · {t('doc.updated', { date: formatShortDate(locale, document.updatedAt) })}
                      </Text>
                    </Stack>
                  ))}
                  {relatedDocuments.length === 0 ? (
                    <Text size="sm" c="dimmed">
                      {t('list.empty')}
                    </Text>
                  ) : null}
                </Stack>
              ),
            },
          ]}
        />
      </div>

      <Text size="sm" c="dimmed">
        {whatNow}
      </Text>

      <KuecDrawer opened={newTaskOpen} onClose={() => setNewTaskOpen(false)} title={t('action.newTask')}>
        <Stack gap="md">
          <TextInput label={t('list.title')} value={newTitle} onChange={(event) => setNewTitle(event.currentTarget.value)} maxLength={120} data-autofocus />
          <KuecPersonPicker label={t('task.owner')} people={personas.filter((persona) => persona.role !== 'LEADERSHIP_VIEWER')} value={newOwner} onChange={setNewOwner} />
          <DateInput label={t('task.due')} value={newDue} onChange={setNewDue} minDate={new Date(nowIso)} valueFormat="ddd D MMM YYYY" />
          <Textarea label={t('task.done')} value={newDone} onChange={(event) => setNewDone(event.currentTarget.value)} autosize minRows={2} maxLength={200} />
          <Group justify="flex-end" gap="xs">
            <Button variant="default" onClick={() => setNewTaskOpen(false)}>
              {t('action.cancel')}
            </Button>
            <Button variant="filled" onClick={() => void saveNewTask()} disabled={newTitle.trim().length < 3 || newOwner === null || newDue === null || !isReasonValid(newDone)} loading={newPending}>
              {t('action.save')}
            </Button>
          </Group>
        </Stack>
      </KuecDrawer>
    </Stack>
  );
}
