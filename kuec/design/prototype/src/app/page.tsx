'use client';

import { Stack, Text } from '@mantine/core';
import { useSearchParams } from 'next/navigation';

import { KuecActionCard } from '@/components/kuec/KuecActionCard';
import { KuecDecisionCard } from '@/components/kuec/KuecDecisionCard';
import { KuecEmptyState } from '@/components/kuec/KuecEmptyState';
import { KuecPageHeader } from '@/components/kuec/KuecPageHeader';
import { KuecSectionHeader } from '@/components/kuec/KuecSectionHeader';
import type { Opportunity, WorkPackage } from '@/data/model';
import { useLocale } from '@/i18n/LocaleContext';
import { daysBetweenInGulf, formatAed, formatShortDate } from '@/i18n/format';
import type { MessageKey } from '@/i18n/messages';
import { usePrototypeStore } from '@/store/PrototypeStore';
import { getDueLabel, getExceptionKind, getStatusTone, getWaitingWorkingDays, isOpenStatus } from '@/store/rules';

const MAX_DECISIONS = 5;
const MAX_NEXT_ACTIONS = 7;
const NEXT_ACTION_HORIZON_DAYS = 7;

export default function TodayPage() {
  const { t, locale } = useLocale();
  const { viewer, nowIso, workPackages, opportunities, decisions, decisionOutcomes, getPersona, getOpportunity, leadInboxCount } = usePrototypeStore();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const href = (path: string) => `${path}${query ? `?${query}` : ''}`;

  const hour = Number(new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Asia/Dubai' }).format(new Date(nowIso)));
  const greeting = t(hour < 12 ? 'today.greeting.morning' : 'today.greeting.day', { name: viewer.firstName[locale] });

  const dueText = (workPackage: WorkPackage): string => {
    const due = getDueLabel(workPackage.dueAt, nowIso);
    if (due.kind === 'today') return t('date.today');
    if (due.kind === 'tomorrow') return t('date.tomorrow');
    if (due.kind === 'late') return t('date.lateSince', { date: formatShortDate(locale, workPackage.dueAt) });
    if (due.kind === 'inDays') return t('date.inDays', { n: due.days });

    return t('date.due', { date: formatShortDate(locale, workPackage.dueAt) });
  };

  const caseName = (workPackage: WorkPackage): string => {
    const opportunity = getOpportunity(workPackage.caseId);

    return opportunity ? `${opportunity.name[locale]} · ${opportunity.company[locale]}` : '';
  };

  const workPackageCard = (workPackage: WorkPackage, primaryKey: MessageKey, eyebrowKey: MessageKey) => (
    <KuecActionCard
      key={workPackage.id}
      eyebrow={t(eyebrowKey)}
      title={workPackage.title[locale]}
      caseName={caseName(workPackage)}
      context={workPackage.objective[locale]}
      owner={getPersona(workPackage.ownerId)?.name[locale] ?? ''}
      deadline={dueText(workPackage)}
      statusTone={getStatusTone(workPackage.status, workPackage.dueAt, nowIso)}
      statusLabel={t(`status.${workPackage.status}` as MessageKey)}
      primaryLabel={t(primaryKey)}
      primaryHref={href(`/work/${workPackage.id}`)}
    />
  );

  const opportunityCard = (opportunity: Opportunity) => {
    const days = opportunity.nextActionDate ? daysBetweenInGulf(nowIso, opportunity.nextActionDate) : null;
    const deadline =
      days === null
        ? t('date.noNext')
        : days < 0
          ? t('date.lateSince', { date: formatShortDate(locale, opportunity.nextActionDate ?? nowIso) })
          : days === 0
            ? t('date.today')
            : days === 1
              ? t('date.tomorrow')
              : t('date.due', { date: formatShortDate(locale, opportunity.nextActionDate ?? nowIso) });

    return (
      <KuecActionCard
        key={opportunity.id}
        eyebrow={t(`stage.${opportunity.stage}` as MessageKey)}
        title={opportunity.nextAction ? opportunity.nextAction[locale] : t('date.noNext')}
        caseName={`${opportunity.name[locale]} · ${opportunity.company[locale]}`}
        context={`${t('opp.value')}: ${formatAed(locale, opportunity.valueAed)}`}
        owner={getPersona(opportunity.ownerId)?.name[locale] ?? ''}
        deadline={deadline}
        statusTone={days === null || days < 0 ? 'late' : 'onTrack'}
        statusLabel={days === null ? t('exception.noNext') : days < 0 ? t('exception.late') : t('opp.nextAction')}
        primaryLabel={opportunity.nextAction ? t('card.action.open') : t('card.action.setNext')}
        primaryHref={href(`/opportunities/${opportunity.id}`)}
      />
    );
  };

  const mine = workPackages.filter((workPackage) => workPackage.ownerId === viewer.id);
  const toReview = workPackages.filter((workPackage) => workPackage.reviewerId === viewer.id && workPackage.status === 'SUBMITTED');
  const offeredToMe = mine.filter((workPackage) => workPackage.status === 'OFFERED');
  const blockedMine = mine.filter((workPackage) => workPackage.status === 'BLOCKED');
  const inProgress = mine.filter((workPackage) => workPackage.status === 'ACCEPTED');
  const myOpportunities = opportunities.filter((opportunity) => opportunity.ownerId === viewer.id);
  const nextActions = myOpportunities
    .filter((opportunity) => opportunity.nextActionDate === null || daysBetweenInGulf(nowIso, opportunity.nextActionDate) <= NEXT_ACTION_HORIZON_DAYS)
    .sort((left, right) => (left.nextActionDate ?? '').localeCompare(right.nextActionDate ?? ''))
    .slice(0, MAX_NEXT_ACTIONS);
  const openDecisions = decisions.filter((decision) => decisionOutcomes[decision.id] === undefined).slice(0, MAX_DECISIONS);
  const teamExceptions = workPackages.filter((workPackage) => isOpenStatus(workPackage.status) && getExceptionKind(workPackage, nowIso) !== null && workPackage.ownerId !== viewer.id);
  const othersProgressing = workPackages.filter((workPackage) => workPackage.ownerId !== viewer.id && workPackage.reviewerId !== viewer.id && isOpenStatus(workPackage.status) && getExceptionKind(workPackage, nowIso) === null);

  const subtitleKey: MessageKey =
    viewer.role === 'ED' ? 'today.subtitle.ed' : viewer.role === 'OPS_COORDINATOR' ? 'today.subtitle.ops' : viewer.role === 'TECHNICAL_CONTRIBUTOR' ? 'today.subtitle.tech' : 'today.subtitle.bd';

  const exceptionCard = (workPackage: WorkPackage) => {
    const kind = getExceptionKind(workPackage, nowIso);
    const label =
      kind === 'blocked' ? t('exception.blocked') : kind === 'late' ? t('exception.late') : t('exception.notAccepted', { n: getWaitingWorkingDays(workPackage, nowIso) });

    return (
      <KuecActionCard
        key={workPackage.id}
        eyebrow={t('today.section.exceptions')}
        title={workPackage.title[locale]}
        caseName={caseName(workPackage)}
        context={workPackage.blockedReason ? workPackage.blockedReason[locale] : workPackage.objective[locale]}
        owner={getPersona(workPackage.ownerId)?.name[locale] ?? ''}
        deadline={dueText(workPackage)}
        statusTone={kind === 'blocked' ? 'blocked' : kind === 'late' ? 'late' : 'waiting'}
        statusLabel={label}
        primaryLabel={t('card.action.reassign')}
        primaryHref={href(`/work/${workPackage.id}`)}
        secondaryLabel={t('card.action.open')}
        secondaryHref={href(`/work/${workPackage.id}`)}
      />
    );
  };

  const needsYou = [
    ...offeredToMe.map((workPackage) => workPackageCard(workPackage, 'card.action.accept', 'status.OFFERED')),
    ...toReview.map((workPackage) => workPackageCard(workPackage, 'card.action.review', 'status.SUBMITTED')),
    ...blockedMine.map((workPackage) => workPackageCard(workPackage, 'card.action.resolve', 'status.BLOCKED')),
  ];

  const isManager = viewer.role === 'ED' || viewer.role === 'OPS_COORDINATOR';
  const nothingAtAll = needsYou.length === 0 && nextActions.length === 0 && inProgress.length === 0 && (!isManager || (openDecisions.length === 0 && teamExceptions.length === 0));

  return (
    <Stack gap={0}>
      <KuecPageHeader title={greeting} description={t(subtitleKey)} howThisWorks={['today.how.1', 'today.how.2', 'today.how.3', 'today.how.4', 'today.how.5']} />

      {viewer.role === 'ED' && openDecisions.length > 0 ? (
        <>
          <KuecSectionHeader title={t('today.section.decisions')} count={openDecisions.length} />
          <Stack gap="md">
            {openDecisions.map((decision) => (
              <KuecDecisionCard key={decision.id} decision={decision} />
            ))}
          </Stack>
        </>
      ) : null}

      {viewer.role === 'OPS_COORDINATOR' ? (
        <>
          <KuecSectionHeader title={t('nav.pipeline')} />
          <KuecActionCard
            eyebrow={t('nav.pipeline')}
            title={t('today.leadInbox', { count: leadInboxCount })}
            caseName=""
            context={t('today.how.3')}
            owner={viewer.name[locale]}
            deadline={t('date.today')}
            statusTone="waiting"
            statusLabel={t('status.OFFERED')}
            primaryLabel={t('today.leadInbox.action')}
            primaryHref={href('/pipeline/leads')}
          />
        </>
      ) : null}

      {isManager && teamExceptions.length > 0 ? (
        <>
          <KuecSectionHeader title={t('today.section.exceptions')} count={teamExceptions.length} listLabel={t('today.openAsList')} listHref={href('/delivery?tab=blocked')} />
          <Stack gap="md">{teamExceptions.map(exceptionCard)}</Stack>
        </>
      ) : null}

      {needsYou.length > 0 ? (
        <>
          <KuecSectionHeader title={viewer.role === 'TECHNICAL_CONTRIBUTOR' ? t('today.section.assignments') : t('today.section.needsYou')} count={needsYou.length} />
          <Stack gap="md">{needsYou}</Stack>
        </>
      ) : null}

      {nextActions.length > 0 ? (
        <>
          <KuecSectionHeader title={t('today.section.next')} count={nextActions.length} listLabel={t('today.openAsList')} listHref={href('/pipeline')} />
          <Stack gap="md">{nextActions.map(opportunityCard)}</Stack>
        </>
      ) : null}

      {inProgress.length > 0 ? (
        <>
          <KuecSectionHeader title={viewer.role === 'TECHNICAL_CONTRIBUTOR' ? t('status.ACCEPTED') : t('today.section.progressing')} count={inProgress.length} />
          <Stack gap="md">{inProgress.map((workPackage) => workPackageCard(workPackage, 'card.action.open', 'status.ACCEPTED'))}</Stack>
        </>
      ) : null}

      {isManager && othersProgressing.length > 0 && viewer.role === 'ED' ? (
        <>
          <KuecSectionHeader title={t('today.section.progressing')} count={othersProgressing.length} listLabel={t('today.openAsList')} listHref={href('/delivery')} />
          <Stack gap="md">{othersProgressing.slice(0, 3).map((workPackage) => workPackageCard(workPackage, 'card.action.open', `status.${workPackage.status}` as MessageKey))}</Stack>
        </>
      ) : null}

      {nothingAtAll ? <KuecEmptyState title={t('today.empty.title')} nextStep={t('today.empty.next')} actionLabel={t('nav.log')} actionHref={href('/log')} /> : null}

      <Text size="sm" c="dimmed" mt="xl">
        {t('today.whatNow')}
      </Text>
    </Stack>
  );
}
