'use client';

import { Stack, Text } from '@mantine/core';
import { useSearchParams } from 'next/navigation';

import { KuecActionCard } from '@/components/kuec/KuecActionCard';
import { KuecDecisionCard } from '@/components/kuec/KuecDecisionCard';
import { KuecEmptyState } from '@/components/kuec/KuecEmptyState';
import { KuecMetricStrip } from '@/components/kuec/KuecMetricStrip';
import { KuecOpportunityCard } from '@/components/kuec/KuecOpportunityCard';
import { KuecPageHeader } from '@/components/kuec/KuecPageHeader';
import { KuecSectionHeader } from '@/components/kuec/KuecSectionHeader';
import { nextStepDueLabel } from '@/components/kuec/KuecNextStep';
import type { Opportunity, Task } from '@/data/model';
import { useLocale } from '@/i18n/LocaleContext';
import { formatAed, formatAedCompact, formatShortDate, gulfHour } from '@/i18n/format';
import type { MessageKey } from '@/i18n/messages';
import { useWorkbenchStore } from '@/store/WorkbenchStore';
import { getDueLabel, getExceptionKind, getNextStepState, getNextStepTone, getTaskTone, getWaitingWorkingDays, isOpenOpportunity, isOpenStatus, quarterBoundsInGulf } from '@/store/rules';
import { KUEC_LAYOUT } from '@/theme/kuec-tokens';

const MAX_CARDS_PER_SECTION = 5;

type SectionCard = { key: string; render: (primary: boolean) => React.ReactNode };

// Home (brief part 5): greeting, one compact performance strip, three sections
// of cards with counts, lists one tap away. The first card's button is the one
// filled button on the screen.
export default function HomePage() {
  const { t, locale } = useLocale();
  const { viewer, nowIso, tasks, opportunities, decisions, decisionOutcomes, getPersona, getAccount, leadInboxCount, quarterTargetAed } = useWorkbenchStore();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const href = (path: string) => `${path}${query ? `?${query}` : ''}`;

  const greeting = t(gulfHour(nowIso) < 12 ? 'home.greeting.morning' : 'home.greeting.day', { name: viewer.firstName[locale] });
  const isManager = viewer.role === 'ED' || viewer.role === 'OPS_COORDINATOR';

  const dueText = (task: Task): string => {
    const due = getDueLabel(task.dueAt, nowIso);
    if (due.kind === 'today') return t('date.today');
    if (due.kind === 'tomorrow') return t('date.tomorrow');
    if (due.kind === 'late') return t('date.lateSince', { date: formatShortDate(locale, task.dueAt) });
    if (due.kind === 'inDays') return t('date.inDays', { n: due.days });

    return t('date.due', { date: formatShortDate(locale, task.dueAt) });
  };

  const contextOf = (task: Task): string => {
    const opportunity = opportunities.find((item) => item.id === task.opportunityId);
    const account = opportunity ? getAccount(opportunity.accountId) : null;

    return opportunity ? `${t('task.partOf')} ${opportunity.name[locale]}${account ? ` · ${account.name[locale]}` : ''}` : task.objective[locale];
  };

  const taskCard = (task: Task, actionKey: MessageKey, statusKey?: MessageKey): SectionCard => ({
    key: task.id,
    render: (primary) => (
      <KuecActionCard
        key={task.id}
        title={task.title[locale]}
        context={contextOf(task)}
        owner={task.ownerId === viewer.id ? undefined : getPersona(task.ownerId)?.name[locale]}
        due={dueText(task)}
        statusTone={getTaskTone(task, nowIso)}
        statusLabel={t(statusKey ?? (`status.${task.status}` as MessageKey))}
        actionLabel={t(actionKey)}
        actionHref={href(`/tasks/${task.id}`)}
        primary={primary}
      />
    ),
  });

  const exceptionCard = (task: Task): SectionCard => {
    const kind = getExceptionKind(task, nowIso);
    const label = kind === 'blocked' ? t('exception.blocked') : kind === 'late' ? t('exception.late') : t('exception.notAccepted', { n: getWaitingWorkingDays(task, nowIso) });

    return {
      key: task.id,
      render: (primary) => (
        <KuecActionCard
          key={task.id}
          title={task.title[locale]}
          context={task.blockedReason ? task.blockedReason[locale] : contextOf(task)}
          owner={getPersona(task.ownerId)?.name[locale]}
          due={dueText(task)}
          statusTone={kind === 'notAccepted' ? 'attention' : 'blocked'}
          statusLabel={label}
          actionLabel={t('action.reassign')}
          actionHref={href(`/tasks/${task.id}`)}
          primary={primary}
        />
      ),
    };
  };

  const opportunityCard = (opportunity: Opportunity): SectionCard => {
    const state = getNextStepState(opportunity, nowIso);
    const account = getAccount(opportunity.accountId);

    return {
      key: opportunity.id,
      render: (primary) => (
        <KuecOpportunityCard
          key={opportunity.id}
          name={opportunity.name[locale]}
          account={account?.name[locale] ?? ''}
          amount={formatAed(locale, opportunity.amountAed)}
          stageLabel={t(`stage.${opportunity.stage}` as MessageKey)}
          nextStep={opportunity.nextStep ? opportunity.nextStep[locale] : t('date.noNext')}
          nextStepDue={nextStepDueLabel(t, locale, state, opportunity.nextStepDate)}
          nextStepTone={getNextStepTone(state)}
          owner={opportunity.ownerId === viewer.id ? undefined : getPersona(opportunity.ownerId)?.name[locale]}
          actionLabel={t(state === 'missing' ? 'action.setNextStep' : 'action.open')}
          actionHref={href(`/opportunities/${opportunity.id}`)}
          primary={primary}
        />
      ),
    };
  };

  const mine = tasks.filter((task) => task.ownerId === viewer.id);
  const toReview = tasks.filter((task) => task.reviewerId === viewer.id && task.status === 'SUBMITTED');
  const assignedToMe = mine.filter((task) => task.status === 'OFFERED');
  const blockedMine = mine.filter((task) => task.status === 'BLOCKED');
  const inProgressMine = mine.filter((task) => task.status === 'ACCEPTED');
  const myOpportunities = opportunities.filter((opportunity) => opportunity.ownerId === viewer.id && isOpenOpportunity(opportunity));
  const nextStepsDue = myOpportunities
    .filter((opportunity) => ['missing', 'late', 'today', 'tomorrow', 'soon'].includes(getNextStepState(opportunity, nowIso)))
    .sort((left, right) => (left.nextStepDate ?? '').localeCompare(right.nextStepDate ?? ''));
  const openDecisions = decisions.filter((decision) => decisionOutcomes[decision.id] === undefined);
  const teamExceptions = tasks.filter((task) => isOpenStatus(task.status) && getExceptionKind(task, nowIso) !== null && task.ownerId !== viewer.id);
  const teamInProgress = tasks.filter((task) => task.status === 'ACCEPTED' && task.ownerId !== viewer.id);

  const quarter = quarterBoundsInGulf(nowIso);
  const scopeOpportunities = isManager || viewer.role === 'LEADERSHIP_VIEWER' ? opportunities : opportunities.filter((opportunity) => opportunity.ownerId === viewer.id);
  const closedWon = scopeOpportunities.filter((opportunity) => opportunity.stage === 'SIGNED' && opportunity.closeDate >= quarter.start && opportunity.closeDate < quarter.end);
  const closedWonAed = closedWon.reduce((sum, opportunity) => sum + opportunity.amountAed, 0);
  const open = scopeOpportunities.filter(isOpenOpportunity);
  const openAed = open.reduce((sum, opportunity) => sum + opportunity.amountAed, 0);
  const target = isManager || viewer.role === 'LEADERSHIP_VIEWER' ? quarterTargetAed : quarterTargetAed / 4;

  const attention: SectionCard[] = [
    ...assignedToMe.map((task) => taskCard(task, 'action.accept')),
    ...toReview.map((task) => taskCard(task, 'action.review')),
    ...blockedMine.map((task) => taskCard(task, 'action.open')),
  ];
  if (viewer.role === 'OPS_COORDINATOR') {
    attention.unshift({
      key: 'lead-inbox',
      render: (primary) => (
        <KuecActionCard
          key="lead-inbox"
          title={t('home.leadInbox', { count: leadInboxCount })}
          context={t('home.leadInbox.context')}
          due={t('date.today')}
          statusTone="attention"
          statusLabel={t('status.OFFERED')}
          actionLabel={t('home.leadInbox.action')}
          actionHref={href('/leads')}
          primary={primary}
        />
      ),
    });
  }

  type Section = { key: string; title: string; cards: SectionCard[]; listHref: string };
  const sections: Section[] =
    viewer.role === 'ED'
      ? [
          { key: 'decisions', title: t('home.section.decisions'), cards: openDecisions.map((decision) => ({ key: decision.id, render: (primary) => <KuecDecisionCard key={decision.id} decision={decision} primary={primary} /> })), listHref: href('/tasks?view=decisions') },
          { key: 'escalations', title: t('home.section.escalations'), cards: teamExceptions.map(exceptionCard), listHref: href('/tasks?view=escalations') },
          { key: 'inProgress', title: t('home.section.inProgress'), cards: [...toReview.map((task) => taskCard(task, 'action.review')), ...teamInProgress.map((task) => taskCard(task, 'action.open'))], listHref: href('/tasks') },
        ]
      : viewer.role === 'OPS_COORDINATOR'
        ? [
            { key: 'attention', title: t('home.section.attention'), cards: attention, listHref: href('/tasks?view=mine') },
            { key: 'escalations', title: t('home.section.escalations'), cards: teamExceptions.map(exceptionCard), listHref: href('/tasks?view=escalations') },
            { key: 'inProgress', title: t('home.section.inProgress'), cards: teamInProgress.map((task) => taskCard(task, 'action.open')), listHref: href('/tasks') },
          ]
        : viewer.role === 'TECHNICAL_CONTRIBUTOR'
          ? [
              { key: 'attention', title: t('home.section.attention'), cards: attention, listHref: href('/tasks?view=mine') },
              { key: 'inProgress', title: t('home.section.inProgress'), cards: inProgressMine.map((task) => taskCard(task, 'action.open')), listHref: href('/tasks?view=mine') },
            ]
          : [
              { key: 'attention', title: t('home.section.attention'), cards: attention, listHref: href('/tasks?view=mine') },
              { key: 'nextSteps', title: t('home.section.nextSteps'), cards: nextStepsDue.map(opportunityCard), listHref: href('/opportunities?view=mine') },
              { key: 'inProgress', title: t('home.section.inProgress'), cards: inProgressMine.map((task) => taskCard(task, 'action.open')), listHref: href('/tasks?view=mine') },
            ];

  const nothingAtAll = sections.every((section) => section.cards.length === 0);
  let primaryGiven = false;

  return (
    <Stack gap={0} maw={KUEC_LAYOUT.cardColumnMaxWidthPx} mx="auto">
      <KuecPageHeader title={greeting} description={t(viewer.role === 'ED' ? 'home.subtitle.ed' : viewer.role === 'OPS_COORDINATOR' ? 'home.subtitle.ops' : viewer.role === 'TECHNICAL_CONTRIBUTOR' ? 'home.subtitle.tech' : 'home.subtitle.bd')} howThisWorks={['home.how.1', 'home.how.2', 'home.how.3', 'home.how.4', 'home.how.5']} />

      {viewer.role !== 'TECHNICAL_CONTRIBUTOR' ? (
        <KuecMetricStrip
          scopeLabel={isManager ? t('metric.team') : t('metric.mine')}
          metrics={[
            { label: t('metric.closedThisQuarter'), value: formatAedCompact(locale, closedWonAed), detail: t('metric.target', { target: formatAedCompact(locale, target) }), ratio: Math.min(closedWonAed / target, 1), href: href('/opportunities?view=closed-won') },
            { label: t('metric.openPipeline'), value: formatAedCompact(locale, openAed), detail: t('metric.openCount', { count: open.length }), href: href('/opportunities') },
          ]}
        />
      ) : null}

      {sections
        .filter((section) => section.cards.length > 0)
        .map((section) => (
          <Stack key={section.key} gap={0}>
            <KuecSectionHeader title={section.title} count={section.cards.length} listLabel={t('home.openList')} listHref={section.listHref} />
            <Stack gap="sm">
              {section.cards.slice(0, MAX_CARDS_PER_SECTION).map((card) => {
                const primary = !primaryGiven;
                primaryGiven = true;

                return card.render(primary);
              })}
            </Stack>
          </Stack>
        ))}

      {nothingAtAll ? (
        <Stack mt={32}>
          <KuecEmptyState title={t('home.empty.title')} nextStep={t('home.empty.next')} actionLabel={t('action.newLead')} actionHref={href('/leads/new')} />
        </Stack>
      ) : null}

      <Text size="sm" c="dimmed" mt={32}>
        {t('home.whatNow')}
      </Text>
    </Stack>
  );
}
