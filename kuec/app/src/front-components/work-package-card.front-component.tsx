import 'twenty-ui/style.css';
import 'src/front-components/shared/kuec-front-components.css';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { CoreApiClient } from 'twenty-client-sdk/core';
import { defineFrontComponent, PageLayoutType } from 'twenty-sdk/define';
import {
  AppPath,
  enqueueSnackbar,
  type MessageDescriptor,
  msg,
  navigate,
  openCommandConfirmationModal,
  type TranslationValues,
  useSelectedRecordIds,
  useTranslate,
  useUserId,
} from 'twenty-sdk/front-component';
import { isDefined } from 'twenty-sdk/utils';
import { Tag } from 'twenty-ui/primitives/data-display';
import { Button, Input } from 'twenty-ui/primitives/input';

import { CardSkeleton } from 'src/front-components/shared/card-skeleton';
import { FallbackLink } from 'src/front-components/shared/fallback-link';
import { InfoTooltip, WithInfo } from 'src/front-components/shared/info-tooltip';
import {
  clearUnsentDraft,
  readUnsentDraft,
  writeUnsentDraft,
} from 'src/front-components/shared/unsent-draft';
import {
  applyCardAction,
  type CardActionInput,
  loadCardWorkPackage,
  loadOpsCoordinator,
  loadViewerMember,
} from 'src/front-components/work-package-card/work-package-card-api';
import {
  getDueLabel,
  STATUS_BADGE_COLOR,
} from 'src/front-components/work-package-card/work-package-card-labels';
import {
  CARD_ACTION,
  CARD_NEXT_STEP,
  type CardAction,
  type CardMember,
  type CardNextStep,
  type CardWorkPackage,
  getAvailableCardActions,
  getCardNextStep,
  isOneLineTextValid,
  REASON_MAX_LENGTH,
} from 'src/front-components/work-package-card/work-package-card-rules';
import {
  WORK_PACKAGE_STATUS,
  WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
  type WorkPackageStatus,
} from 'src/objects/work-package.object';

export const WORK_PACKAGE_CARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER =
  '66553b44-6627-495a-b489-db239e558380';

type CardState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'missing' }
  | {
      status: 'ready';
      workPackage: CardWorkPackage;
      viewer: CardMember | null;
      opsCoordinator: CardMember | null;
    };

type OpenForm = typeof CARD_ACTION.DECLINE | typeof CARD_ACTION.REQUEST_HELP;

const SUCCESS_TOAST_DURATION_MS = 4000;
const ERROR_TOAST_DURATION_MS = 8000;

// The SDK extracts catalog strings from this file only, so every card text
// is declared here (src/i18n/interface.json holds the Arabic).

// Plain words for each status; a first-week employee never meets an API value.
const STATUS_LABEL: Record<WorkPackageStatus, MessageDescriptor> = {
  [WORK_PACKAGE_STATUS.PLANNED]: msg('Not started'),
  [WORK_PACKAGE_STATUS.OFFERED]: msg('Waiting to be accepted'),
  [WORK_PACKAGE_STATUS.ACCEPTED]: msg('In progress'),
  [WORK_PACKAGE_STATUS.SUBMITTED]: msg('Waiting for review'),
  [WORK_PACKAGE_STATUS.BLOCKED]: msg('Blocked'),
  [WORK_PACKAGE_STATUS.DONE]: msg('Done'),
  [WORK_PACKAGE_STATUS.DECLINED]: msg('Declined'),
  [WORK_PACKAGE_STATUS.CANCELLED]: msg('Stopped'),
};

// The record names these statuses differently, so the tooltip gives that name too.
const STATUS_TOOLTIP: Record<WorkPackageStatus, MessageDescriptor> = {
  [WORK_PACKAGE_STATUS.PLANNED]: msg('Status Planned: it is offered to its owner when the step before it is done.'),
  [WORK_PACKAGE_STATUS.OFFERED]: msg('Status Offered: the owner accepts or declines it within 2 working days.'),
  [WORK_PACKAGE_STATUS.ACCEPTED]: msg('Status Accepted: the owner has taken it on and delivers it by the due date.'),
  [WORK_PACKAGE_STATUS.SUBMITTED]: msg('Status Submitted: it waits for the reviewer to check it against the done criteria.'),
  [WORK_PACKAGE_STATUS.BLOCKED]: msg("Status Blocked: something outside the owner's control stops the work, and the ED has the reason."),
  [WORK_PACKAGE_STATUS.DONE]: msg('Status Done: the reviewer accepted it, and the next step went to its owner.'),
  [WORK_PACKAGE_STATUS.DECLINED]: msg('Status Declined: the owner could not take it, and the ED gives it to someone else.'),
  [WORK_PACKAGE_STATUS.CANCELLED]: msg('Status Cancelled: the work is no longer needed.'),
};

const OWNER_NEXT_STEP: Record<WorkPackageStatus, MessageDescriptor> = {
  [WORK_PACKAGE_STATUS.PLANNED]: msg('Nothing yet: it starts when the step before it is done, and Request help is here if you have a question now.'),
  [WORK_PACKAGE_STATUS.OFFERED]: msg('Accept it if it is yours to do, or decline it with a reason, within 2 working days.'),
  [WORK_PACKAGE_STATUS.ACCEPTED]: msg('Do the work and press Submit when every done criterion is met; if you are stuck, press Request help.'),
  [WORK_PACKAGE_STATUS.SUBMITTED]: msg('Wait for the review, and if it comes back to you, fix what is missing and submit again.'),
  [WORK_PACKAGE_STATUS.BLOCKED]: msg('Tell the ED what would clear the block, and when it clears, open the full record and set the status back to Accepted.'),
  [WORK_PACKAGE_STATUS.DONE]: msg('Nothing: this work is finished.'),
  [WORK_PACKAGE_STATUS.DECLINED]: msg('Nothing: the ED gives it to someone else.'),
  [WORK_PACKAGE_STATUS.CANCELLED]: msg('Nothing: this work was stopped.'),
};

const NEXT_STEP: Record<
  Exclude<CardNextStep, typeof CARD_NEXT_STEP.OWNER | typeof CARD_NEXT_STEP.FINISHED>,
  MessageDescriptor
> = {
  [CARD_NEXT_STEP.DECLINE_FORM]: msg("Type in one line why you can't take it, then press Decline."),
  [CARD_NEXT_STEP.HELP_FORM]: msg('Type your question in one line, then press Ask for help.'),
  [CARD_NEXT_STEP.NO_OWNER]: msg('Nothing for you yet: this work has no owner, and the ops coordinator gives it one.'),
  [CARD_NEXT_STEP.REVIEWER]: msg('Check it against the done criteria, then open the full record and set Done, or set Accepted and tell {firstName} what is missing.'),
  [CARD_NEXT_STEP.SOMEONE_ELSE]: msg("Nothing on this card is for you: it is {firstName}'s work, so ask them if you need something."),
};

const LOADING_NEXT_STEP = msg('Wait a moment while the work package loads.');
const ERROR_NEXT_STEP = msg('Press Try again, and if it still does not load, open the full record.');
const MISSING_NEXT_STEP = msg('Open the full record, or ask the ops coordinator if you expected to see this work.');

const CONTROL_TOOLTIP = {
  OPEN_FULL_RECORD: msg('Opens the full work package page, with every field and its history.'),
  ACCEPT: msg('Says the work is yours and you will deliver it by the due date, and the reminders stop.'),
  DECLINE: msg('Hands the work back with a one-line reason, and the ED gives it to someone else.'),
  SUBMIT: msg('Sends the finished work to the reviewer; press it only when every done criterion is met.'),
  REQUEST_HELP: msg('Sends your question to the ops coordinator as a task due today, while the work stays yours with the same due date.'),
  CANCEL: msg('Closes this form without sending anything, and what you typed stays here for later.'),
  CONFIRM_DECLINE: msg('Asks you to confirm, then declines the work with your reason.'),
  CONFIRM_HELP: msg('Asks you to confirm, then sends your question to the ops coordinator.'),
  TRY_AGAIN: msg('Loads the work package again without changing anything.'),
  DECLINE_REASON: msg('One line on why you cannot take this work, such as leave dates or a clash with other work.'),
  HELP_QUESTION: msg('One line on what you need, so the ops coordinator can answer quickly.'),
} as const;

const readInputValue = (event: { target: unknown }): string => {
  const target = event.target as { value?: unknown } | null;

  return typeof target?.value === 'string' ? target.value : '';
};

const WorkPackageCard = () => {
  const [workPackageId] = useSelectedRecordIds();
  const userId = useUserId();
  const { t, locale } = useTranslate();
  const client = useMemo(() => new CoreApiClient(), []);

  const [state, setState] = useState<CardState>({ status: 'loading' });
  const [openForm, setOpenForm] = useState<OpenForm | null>(null);
  const [pendingAction, setPendingAction] = useState<CardAction | null>(null);
  const [declineReason, setDeclineReason] = useState(() =>
    readUnsentDraft(`decline:${workPackageId}`),
  );
  const [helpQuestion, setHelpQuestion] = useState(() =>
    readUnsentDraft(`help:${workPackageId}`),
  );

  const sectionHeadings = [
    t('Objective'),
    t('Expected output'),
    t('Done criteria'),
  ];

  const nextStepLine = (descriptor: MessageDescriptor, values?: TranslationValues) => (
    <p className="kuec-card__next-step">
      <span className="kuec-card__next-step-label">{t('What do I do now?')}</span>{' '}
      {t(descriptor, values)}
    </p>
  );

  const load = useCallback(async () => {
    if (!isDefined(workPackageId) || !isDefined(userId)) {
      setState({ status: 'missing' });

      return;
    }

    setState({ status: 'loading' });

    try {
      const [workPackage, viewer, opsCoordinator] = await Promise.all([
        loadCardWorkPackage(client, workPackageId),
        loadViewerMember(client, userId),
        // A person who cannot read the role assignments still gets the card.
        loadOpsCoordinator(client).catch(() => null),
      ]);

      setState(
        isDefined(workPackage)
          ? { status: 'ready', workPackage, viewer, opsCoordinator }
          : { status: 'missing' },
      );
    } catch {
      setState({ status: 'error' });
    }
  }, [client, workPackageId, userId]);

  useEffect(() => {
    load();
  }, [load]);

  const openFullRecord = () =>
    isDefined(workPackageId)
      ? navigate(AppPath.RecordShowPage, {
          objectNameSingular: 'workPackage',
          objectRecordId: workPackageId,
        })
      : navigate(AppPath.RecordIndexPage, { objectNamePlural: 'workPackages' });

  const toast = (
    message: string,
    variant: 'success' | 'error' | 'warning',
    action: string,
  ) =>
    enqueueSnackbar({
      message,
      variant,
      duration:
        variant === 'success'
          ? SUCCESS_TOAST_DURATION_MS
          : ERROR_TOAST_DURATION_MS,
      dedupeKey: `${action}:${workPackageId}`,
    });

  const confirm = async (params: {
    title: string;
    subtitle: string;
    confirmButtonText: string;
    confirmButtonAccent: 'blue' | 'danger';
  }) => (await openCommandConfirmationModal(params)) === 'confirm';

  const runAction = async (
    input: CardActionInput,
    successMessage: string,
    draftScope?: string,
  ) => {
    if (
      state.status !== 'ready' ||
      !isDefined(state.viewer) ||
      !isDefined(workPackageId) ||
      pendingAction !== null
    ) {
      return;
    }

    setPendingAction(input.action);

    try {
      const result = await applyCardAction({
        client,
        workPackageId,
        viewer: state.viewer,
        input,
        now: new Date(),
      });

      if (result.outcome === 'CONFLICT') {
        await toast(
          t(
            'Someone changed this a moment ago. We have loaded the latest version. Check it and try again.',
          ),
          'warning',
          'conflict',
        );
      } else {
        if (isDefined(draftScope)) {
          clearUnsentDraft(draftScope);
        }

        setOpenForm(null);
        await toast(successMessage, 'success', input.action);
      }

      setState(
        isDefined(result.workPackage)
          ? { ...state, workPackage: result.workPackage }
          : { status: 'missing' },
      );
    } catch {
      await toast(
        t("That didn't save. Nothing was changed. Try again."),
        'error',
        input.action,
      );
    } finally {
      setPendingAction(null);
    }
  };

  const handleAccept = () =>
    runAction(
      { action: CARD_ACTION.ACCEPT },
      t("Accepted. It's on your list."),
    );

  const handleDecline = async () => {
    if (!isOneLineTextValid(declineReason)) {
      return;
    }

    const isConfirmed = await confirm({
      title: t('Decline this work?'),
      subtitle: t('The ED will see your reason and give it to someone else.'),
      confirmButtonText: t('Decline'),
      confirmButtonAccent: 'danger',
    });

    if (!isConfirmed) {
      return;
    }

    await runAction(
      { action: CARD_ACTION.DECLINE, reason: declineReason },
      t('Declined. The ED has your reason.'),
      `decline:${workPackageId}`,
    );
  };

  const handleRequestHelp = async (helper: CardMember) => {
    if (!isOneLineTextValid(helpQuestion)) {
      return;
    }

    const isConfirmed = await confirm({
      title: t('Ask {firstName} for help?', { firstName: helper.firstName }),
      subtitle: t(
        '{firstName} gets a task with your question. You stay the owner and your due date does not change.',
        { firstName: helper.firstName },
      ),
      confirmButtonText: t('Ask for help'),
      confirmButtonAccent: 'blue',
    });

    if (!isConfirmed) {
      return;
    }

    await runAction(
      { action: CARD_ACTION.REQUEST_HELP, question: helpQuestion, helper },
      t("Sent to {firstName}. They'll see it in their tasks.", {
        firstName: helper.firstName,
      }),
      `help:${workPackageId}`,
    );
  };

  const handleSubmit = async (reviewer: CardMember | null) => {
    const isConfirmed = await confirm({
      title: t('Submit this work?'),
      subtitle: isDefined(reviewer)
        ? t('It meets the done criteria. {firstName} will be asked to review it.', {
            firstName: reviewer.firstName,
          })
        : t('It meets the done criteria.'),
      confirmButtonText: t('Submit'),
      confirmButtonAccent: 'blue',
    });

    if (!isConfirmed) {
      return;
    }

    await runAction(
      { action: CARD_ACTION.SUBMIT },
      isDefined(reviewer)
        ? t('Sent to {firstName} for review.', { firstName: reviewer.firstName })
        : t('Submitted.'),
    );
  };

  const header = (
    <div className="kuec-card__header">
      <span className="kuec-card__eyebrow">{t('Work package')}</span>
      <WithInfo info={t(CONTROL_TOOLTIP.OPEN_FULL_RECORD)}>
        <FallbackLink label={t('Open full record')} onOpen={openFullRecord} />
      </WithInfo>
    </div>
  );

  // The sandbox forwards style but not dir; layout uses logical properties only.
  const direction = locale.startsWith('ar') ? 'rtl' : 'ltr';

  if (state.status === 'loading') {
    return (
      <div className="kuec-card" style={{ direction }}>
        {header}
        <CardSkeleton sectionHeadings={sectionHeadings} />
        {nextStepLine(LOADING_NEXT_STEP)}
      </div>
    );
  }

  if (state.status === 'error' || state.status === 'missing') {
    return (
      <div className="kuec-card" style={{ direction }}>
        {header}
        <div className="kuec-card__error">
          <p className="kuec-card__section-body">
            {state.status === 'error'
              ? t("We couldn't load this work package. Your data is safe.")
              : t(
                  "This work package isn't available. It may have been removed, or you may not have access.",
                )}
          </p>
          <div className="kuec-card__actions">
            {state.status === 'error' && (
              <WithInfo info={t(CONTROL_TOOLTIP.TRY_AGAIN)}>
                <Button variant="outline" color="neutral" size="sm" onClick={load}>
                  {t('Try again')}
                </Button>
              </WithInfo>
            )}
            <WithInfo info={t(CONTROL_TOOLTIP.OPEN_FULL_RECORD)}>
              <Button
                variant="outline"
                color="neutral"
                size="sm"
                onClick={openFullRecord}
              >
                {t('Open full record')}
              </Button>
            </WithInfo>
          </div>
        </div>
        {nextStepLine(state.status === 'error' ? ERROR_NEXT_STEP : MISSING_NEXT_STEP)}
      </div>
    );
  }

  const { workPackage, viewer, opsCoordinator } = state;
  const availableActions = getAvailableCardActions({
    workPackage,
    viewerMemberId: viewer?.id ?? null,
  });
  const nextStep = getCardNextStep({
    workPackage,
    viewerMemberId: viewer?.id ?? null,
    openForm,
  });
  const nextStepDescriptor =
    nextStep === CARD_NEXT_STEP.OWNER || nextStep === CARD_NEXT_STEP.FINISHED
      ? OWNER_NEXT_STEP[workPackage.status]
      : NEXT_STEP[nextStep];
  const dueLabel = getDueLabel({ dueAt: workPackage.dueAt, now: new Date(), locale });
  const isBusy = pendingAction !== null;
  const reviewerOrCaseOwnerPrompt = isDefined(workPackage.reviewer)
    ? t('No done criteria yet. Ask {firstName} what "done" looks like.', {
        firstName: workPackage.reviewer.firstName,
      })
    : t('No done criteria yet. Ask the ED what "done" looks like.');

  return (
    <div className="kuec-card" style={{ direction }}>
      {header}

      <h2 className="kuec-card__title">{workPackage.name}</h2>
      <div className="kuec-card__meta">
        <WithInfo info={t(STATUS_TOOLTIP[workPackage.status])}>
          <Tag color={STATUS_BADGE_COLOR[workPackage.status]}>
            {t(STATUS_LABEL[workPackage.status])}
          </Tag>
        </WithInfo>
        {isDefined(dueLabel) && (
          <span>
            {dueLabel.isLate
              ? t('Late since {date}', { date: dueLabel.date })
              : t('Due {date}', { date: dueLabel.date })}
          </span>
        )}
        {isDefined(workPackage.owner) && (
          <span>{t('Owner {firstName}', { firstName: workPackage.owner.firstName })}</span>
        )}
        {isDefined(workPackage.reviewer) && (
          <span>
            {t('Reviewer {firstName}', { firstName: workPackage.reviewer.firstName })}
          </span>
        )}
      </div>

      {isDefined(workPackage.caseName) && (
        <p className="kuec-card__muted">
          {t('Part of {caseName}.', { caseName: workPackage.caseName })}
        </p>
      )}

      {isDefined(workPackage.objective) && workPackage.objective !== '' && (
        <section className="kuec-card__section">
          <h3 className="kuec-card__section-heading">{t('Objective')}</h3>
          <p className="kuec-card__section-body">{workPackage.objective}</p>
        </section>
      )}

      {isDefined(workPackage.expectedOutput) && workPackage.expectedOutput !== '' && (
        <section className="kuec-card__section">
          <h3 className="kuec-card__section-heading">{t('Expected output')}</h3>
          <p className="kuec-card__section-body">{workPackage.expectedOutput}</p>
        </section>
      )}

      <section className="kuec-card__section">
        <h3 className="kuec-card__section-heading">{t('Done criteria')}</h3>
        <p className="kuec-card__section-body">
          {isDefined(workPackage.doneCriteria) && workPackage.doneCriteria !== ''
            ? workPackage.doneCriteria
            : reviewerOrCaseOwnerPrompt}
        </p>
      </section>

      {openForm === CARD_ACTION.DECLINE && (
        <div className="kuec-card__form">
          <span className="kuec-card__label-row">
            <label className="kuec-card__label" htmlFor="kuec-decline-reason">
              {t("Why can't you take this?")}
            </label>
            <InfoTooltip text={t(CONTROL_TOOLTIP.DECLINE_REASON)} />
          </span>
          <Input
            id="kuec-decline-reason"
            value={declineReason}
            maxLength={REASON_MAX_LENGTH}
            placeholder={t("For example: I'm on leave from 20 Oct.")}
            onChange={(event) => {
              const value = readInputValue(event);

              setDeclineReason(value);
              writeUnsentDraft(`decline:${workPackageId}`, value);
            }}
          />
          <p className="kuec-card__hint">
            {t('The ED will see your reason and give it to someone else.')}
          </p>
          <div className="kuec-card__actions">
            <WithInfo info={t(CONTROL_TOOLTIP.CANCEL)}>
              <Button
                variant="outline"
                color="neutral"
                size="sm"
                onClick={() => setOpenForm(null)}
              >
                {t('Cancel')}
              </Button>
            </WithInfo>
            <WithInfo info={t(CONTROL_TOOLTIP.CONFIRM_DECLINE)}>
              <Button
                variant="solid"
                color="danger"
                size="sm"
                disabled={isBusy || !isOneLineTextValid(declineReason)}
                onClick={handleDecline}
              >
                {t('Decline')}
              </Button>
            </WithInfo>
          </div>
        </div>
      )}

      {openForm === CARD_ACTION.REQUEST_HELP && (
        <div className="kuec-card__form">
          <span className="kuec-card__label-row">
            <label className="kuec-card__label" htmlFor="kuec-help-question">
              {t('What do you need?')}
            </label>
            <InfoTooltip text={t(CONTROL_TOOLTIP.HELP_QUESTION)} />
          </span>
          <Input
            id="kuec-help-question"
            value={helpQuestion}
            maxLength={REASON_MAX_LENGTH}
            placeholder={t('For example: Which spectrometer can we book in November?')}
            onChange={(event) => {
              const value = readInputValue(event);

              setHelpQuestion(value);
              writeUnsentDraft(`help:${workPackageId}`, value);
            }}
          />
          <p className="kuec-card__hint">
            {isDefined(opsCoordinator)
              ? t("We'll ask {firstName}. You stay the owner.", {
                  firstName: opsCoordinator.firstName,
                })
              : t('No ops coordinator is set up yet. Ask the ED to add one.')}
          </p>
          <div className="kuec-card__actions">
            <WithInfo info={t(CONTROL_TOOLTIP.CANCEL)}>
              <Button
                variant="outline"
                color="neutral"
                size="sm"
                onClick={() => setOpenForm(null)}
              >
                {t('Cancel')}
              </Button>
            </WithInfo>
            <WithInfo info={t(CONTROL_TOOLTIP.CONFIRM_HELP)}>
              <Button
                variant="solid"
                color="accent"
                size="sm"
                disabled={
                  isBusy ||
                  !isDefined(opsCoordinator) ||
                  !isOneLineTextValid(helpQuestion)
                }
                onClick={() =>
                  isDefined(opsCoordinator) && handleRequestHelp(opsCoordinator)
                }
              >
                {t('Ask for help')}
              </Button>
            </WithInfo>
          </div>
        </div>
      )}

      {openForm === null && availableActions.length > 0 && (
        <div className="kuec-card__actions">
          {availableActions.includes(CARD_ACTION.ACCEPT) && (
            <WithInfo info={t(CONTROL_TOOLTIP.ACCEPT)}>
              <Button
                variant="solid"
                color="accent"
                size="sm"
                loading={pendingAction === CARD_ACTION.ACCEPT}
                disabled={isBusy}
                onClick={handleAccept}
              >
                {t('Accept')}
              </Button>
            </WithInfo>
          )}
          {availableActions.includes(CARD_ACTION.DECLINE) && (
            <WithInfo info={t(CONTROL_TOOLTIP.DECLINE)}>
              <Button
                variant="outline"
                color="neutral"
                size="sm"
                disabled={isBusy}
                onClick={() => setOpenForm(CARD_ACTION.DECLINE)}
              >
                {t('Decline')}
              </Button>
            </WithInfo>
          )}
          {availableActions.includes(CARD_ACTION.SUBMIT) && (
            <WithInfo info={t(CONTROL_TOOLTIP.SUBMIT)}>
              <Button
                variant="solid"
                color="accent"
                size="sm"
                loading={pendingAction === CARD_ACTION.SUBMIT}
                disabled={isBusy}
                onClick={() => handleSubmit(workPackage.reviewer)}
              >
                {t('Submit')}
              </Button>
            </WithInfo>
          )}
          {availableActions.includes(CARD_ACTION.REQUEST_HELP) && (
            <WithInfo info={t(CONTROL_TOOLTIP.REQUEST_HELP)}>
              <Button
                variant="outline"
                color="neutral"
                size="sm"
                disabled={isBusy}
                onClick={() => setOpenForm(CARD_ACTION.REQUEST_HELP)}
              >
                {t('Request help')}
              </Button>
            </WithInfo>
          )}
        </div>
      )}

      {nextStepLine(nextStepDescriptor, {
        firstName: workPackage.owner?.firstName ?? '',
      })}
    </div>
  );
};

export default defineFrontComponent({
  universalIdentifier: WORK_PACKAGE_CARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'work-package-card',
  description:
    'The brief of one work package and the buttons that move it on: accept, decline, request help, submit',
  component: WorkPackageCard,
  widgetAvailability: {
    pageLayoutType: PageLayoutType.RECORD_PAGE,
    objectUniversalIdentifiers: [WORK_PACKAGE_UNIVERSAL_IDENTIFIER],
  },
});
