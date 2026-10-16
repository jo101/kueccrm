import 'twenty-ui/style.css';
import 'src/front-components/shared/kuec-front-components.css';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { CoreApiClient } from 'twenty-client-sdk/core';
import { defineFrontComponent, PageLayoutType } from 'twenty-sdk/define';
import {
  AppPath,
  enqueueSnackbar,
  navigate,
  openCommandConfirmationModal,
  useSelectedRecordIds,
  useTranslate,
  useUserId,
} from 'twenty-sdk/front-component';
import { isDefined } from 'twenty-sdk/utils';
import { Tag } from 'twenty-ui/primitives/data-display';
import { Button, Input } from 'twenty-ui/primitives/input';

import { CardSkeleton } from 'src/front-components/shared/card-skeleton';
import { FallbackLink } from 'src/front-components/shared/fallback-link';
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
  STATUS_BADGE,
  STATUS_INFO,
} from 'src/front-components/work-package-card/work-package-card-labels';
import {
  CARD_ACTION,
  type CardAction,
  type CardMember,
  type CardWorkPackage,
  getAvailableCardActions,
  isOneLineTextValid,
  REASON_MAX_LENGTH,
} from 'src/front-components/work-package-card/work-package-card-rules';
import { WORK_PACKAGE_UNIVERSAL_IDENTIFIER } from 'src/objects/work-package.object';

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
      <FallbackLink label={t('Open full record')} onOpen={openFullRecord} />
    </div>
  );

  // The sandbox forwards style but not dir; layout uses logical properties only.
  const direction = locale.startsWith('ar') ? 'rtl' : 'ltr';

  if (state.status === 'loading') {
    return (
      <div className="kuec-card" style={{ direction }}>
        {header}
        <CardSkeleton sectionHeadings={sectionHeadings} />
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
              <Button variant="outline" color="neutral" size="sm" onClick={load}>
                {t('Try again')}
              </Button>
            )}
            <Button
              variant="outline"
              color="neutral"
              size="sm"
              onClick={openFullRecord}
            >
              {t('Open full record')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { workPackage, viewer, opsCoordinator } = state;
  const availableActions = getAvailableCardActions({
    workPackage,
    viewerMemberId: viewer?.id ?? null,
  });
  const badge = STATUS_BADGE[workPackage.status];
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
        <Tag color={badge.color}>{t(badge.label)}</Tag>
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

      {availableActions.length === 0 && (
        <p className="kuec-card__muted">
          {t(STATUS_INFO[workPackage.status], {
            firstName: workPackage.owner?.firstName ?? '',
          })}
        </p>
      )}

      {openForm === CARD_ACTION.DECLINE && (
        <div className="kuec-card__form">
          <label className="kuec-card__label" htmlFor="kuec-decline-reason">
            {t("Why can't you take this?")}
          </label>
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
            <Button
              variant="outline"
              color="neutral"
              size="sm"
              onClick={() => setOpenForm(null)}
            >
              {t('Cancel')}
            </Button>
            <Button
              variant="solid"
              color="danger"
              size="sm"
              disabled={isBusy || !isOneLineTextValid(declineReason)}
              onClick={handleDecline}
            >
              {t('Decline')}
            </Button>
          </div>
        </div>
      )}

      {openForm === CARD_ACTION.REQUEST_HELP && (
        <div className="kuec-card__form">
          <label className="kuec-card__label" htmlFor="kuec-help-question">
            {t('What do you need?')}
          </label>
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
            <Button
              variant="outline"
              color="neutral"
              size="sm"
              onClick={() => setOpenForm(null)}
            >
              {t('Cancel')}
            </Button>
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
          </div>
        </div>
      )}

      {openForm === null && availableActions.length > 0 && (
        <div className="kuec-card__actions">
          {availableActions.includes(CARD_ACTION.ACCEPT) && (
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
          )}
          {availableActions.includes(CARD_ACTION.DECLINE) && (
            <Button
              variant="outline"
              color="neutral"
              size="sm"
              disabled={isBusy}
              onClick={() => setOpenForm(CARD_ACTION.DECLINE)}
            >
              {t('Decline')}
            </Button>
          )}
          {availableActions.includes(CARD_ACTION.SUBMIT) && (
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
          )}
          {availableActions.includes(CARD_ACTION.REQUEST_HELP) && (
            <Button
              variant="outline"
              color="neutral"
              size="sm"
              disabled={isBusy}
              onClick={() => setOpenForm(CARD_ACTION.REQUEST_HELP)}
            >
              {t('Request help')}
            </Button>
          )}
        </div>
      )}
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
