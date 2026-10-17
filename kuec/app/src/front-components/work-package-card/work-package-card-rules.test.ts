import { describe, expect, it } from 'vitest';

import {
  buildAcceptUpdate,
  buildDeclineUpdate,
  buildHelpTask,
  buildSubmitUpdate,
  CARD_ACTION,
  CARD_NEXT_STEP,
  getAvailableCardActions,
  getCardNextStep,
  isOneLineTextValid,
  toOneLine,
} from 'src/front-components/work-package-card/work-package-card-rules';
import {
  WORK_PACKAGE_STATUS,
  type WorkPackageStatus,
} from 'src/objects/work-package.object';

const SARA = { id: 'member-sara', firstName: 'Sara' };
const OMAR = { id: 'member-omar', firstName: 'Omar' };
// Sunday 19 October 2026, 10:00 in Asia/Dubai.
const NOW = new Date('2026-10-19T06:00:00.000Z');

const actionsFor = (status: WorkPackageStatus, viewerMemberId: string | null) =>
  getAvailableCardActions({ workPackage: { status, owner: SARA }, viewerMemberId });

describe('getAvailableCardActions', () => {
  it('offers Accept, Decline and Request help to the owner of an offered work package', () => {
    expect(actionsFor(WORK_PACKAGE_STATUS.OFFERED, SARA.id)).toEqual([
      CARD_ACTION.ACCEPT,
      CARD_ACTION.DECLINE,
      CARD_ACTION.REQUEST_HELP,
    ]);
  });

  it('offers Request help and Submit to the owner of accepted work', () => {
    expect(actionsFor(WORK_PACKAGE_STATUS.ACCEPTED, SARA.id)).toEqual([
      CARD_ACTION.REQUEST_HELP,
      CARD_ACTION.SUBMIT,
    ]);
  });

  it('keeps Request help for the owner on planned, submitted and blocked work', () => {
    for (const status of [
      WORK_PACKAGE_STATUS.PLANNED,
      WORK_PACKAGE_STATUS.SUBMITTED,
      WORK_PACKAGE_STATUS.BLOCKED,
    ]) {
      expect(actionsFor(status, SARA.id), status).toEqual([CARD_ACTION.REQUEST_HELP]);
    }
  });

  it('offers nothing once the work is finished', () => {
    for (const status of [
      WORK_PACKAGE_STATUS.DONE,
      WORK_PACKAGE_STATUS.DECLINED,
      WORK_PACKAGE_STATUS.CANCELLED,
    ]) {
      expect(actionsFor(status, SARA.id), status).toEqual([]);
    }
  });

  it('offers nothing to someone who is not the owner, or to an unknown viewer', () => {
    expect(actionsFor(WORK_PACKAGE_STATUS.OFFERED, OMAR.id)).toEqual([]);
    expect(actionsFor(WORK_PACKAGE_STATUS.ACCEPTED, null)).toEqual([]);
    expect(
      getAvailableCardActions({
        workPackage: { status: WORK_PACKAGE_STATUS.OFFERED, owner: null },
        viewerMemberId: SARA.id,
      }),
    ).toEqual([]);
  });
});

describe('getCardNextStep', () => {
  const nextStepFor = ({
    status,
    viewerMemberId,
    owner = SARA,
    reviewer = OMAR,
    openForm = null,
  }: {
    status: WorkPackageStatus;
    viewerMemberId: string | null;
    owner?: typeof SARA | null;
    reviewer?: typeof OMAR | null;
    openForm?: typeof CARD_ACTION.DECLINE | typeof CARD_ACTION.REQUEST_HELP | null;
  }) =>
    getCardNextStep({ workPackage: { status, owner, reviewer }, viewerMemberId, openForm });

  it('tells the owner what to do on every open status', () => {
    for (const status of [
      WORK_PACKAGE_STATUS.PLANNED,
      WORK_PACKAGE_STATUS.OFFERED,
      WORK_PACKAGE_STATUS.ACCEPTED,
      WORK_PACKAGE_STATUS.SUBMITTED,
      WORK_PACKAGE_STATUS.BLOCKED,
    ]) {
      expect(nextStepFor({ status, viewerMemberId: SARA.id }), status).toBe(CARD_NEXT_STEP.OWNER);
    }
  });

  it('says there is nothing left to do once the work is finished, whoever looks', () => {
    for (const status of [
      WORK_PACKAGE_STATUS.DONE,
      WORK_PACKAGE_STATUS.DECLINED,
      WORK_PACKAGE_STATUS.CANCELLED,
    ]) {
      expect(nextStepFor({ status, viewerMemberId: SARA.id }), status).toBe(CARD_NEXT_STEP.FINISHED);
      expect(nextStepFor({ status, viewerMemberId: OMAR.id }), status).toBe(CARD_NEXT_STEP.FINISHED);
    }
  });

  it('asks the reviewer to review submitted work, and tells anyone else whose work it is', () => {
    expect(nextStepFor({ status: WORK_PACKAGE_STATUS.SUBMITTED, viewerMemberId: OMAR.id })).toBe(
      CARD_NEXT_STEP.REVIEWER,
    );
    expect(nextStepFor({ status: WORK_PACKAGE_STATUS.ACCEPTED, viewerMemberId: OMAR.id })).toBe(
      CARD_NEXT_STEP.SOMEONE_ELSE,
    );
    expect(
      nextStepFor({ status: WORK_PACKAGE_STATUS.SUBMITTED, viewerMemberId: OMAR.id, reviewer: null }),
    ).toBe(CARD_NEXT_STEP.SOMEONE_ELSE);
    expect(
      nextStepFor({ status: WORK_PACKAGE_STATUS.OFFERED, viewerMemberId: OMAR.id, owner: null }),
    ).toBe(CARD_NEXT_STEP.NO_OWNER);
  });

  it('follows an open form', () => {
    expect(
      nextStepFor({
        status: WORK_PACKAGE_STATUS.OFFERED,
        viewerMemberId: SARA.id,
        openForm: CARD_ACTION.DECLINE,
      }),
    ).toBe(CARD_NEXT_STEP.DECLINE_FORM);
    expect(
      nextStepFor({
        status: WORK_PACKAGE_STATUS.BLOCKED,
        viewerMemberId: SARA.id,
        openForm: CARD_ACTION.REQUEST_HELP,
      }),
    ).toBe(CARD_NEXT_STEP.HELP_FORM);
  });
});

describe('one-line text', () => {
  it('collapses line breaks and runs of spaces, and caps the length', () => {
    expect(toOneLine('  On leave\n\nfrom   20 Oct  ')).toBe('On leave from 20 Oct');
    expect(toOneLine('x'.repeat(500))).toHaveLength(200);
  });

  it('needs at least one visible character', () => {
    expect(isOneLineTextValid(' \n ')).toBe(false);
    expect(isOneLineTextValid('On leave')).toBe(true);
  });
});

describe('writes', () => {
  it('Accept writes the status and acceptedAt, nothing else', () => {
    expect(buildAcceptUpdate(NOW)).toEqual({
      status: WORK_PACKAGE_STATUS.ACCEPTED,
      acceptedAt: NOW.toISOString(),
    });
  });

  it('Decline writes the status and the one-line reason, nothing else', () => {
    expect(buildDeclineUpdate('On leave\nfrom 20 Oct')).toEqual({
      status: WORK_PACKAGE_STATUS.DECLINED,
      declinedReason: 'On leave from 20 Oct',
    });
  });

  it('Submit writes the status only', () => {
    expect(buildSubmitUpdate()).toEqual({ status: WORK_PACKAGE_STATUS.SUBMITTED });
  });

  it('Request help builds a task for the helper, due today in Asia/Dubai, naming the owner', () => {
    const task = buildHelpTask({
      workPackage: { name: 'Scoping', caseName: 'ADNOC: corrosion testing' },
      requester: SARA,
      helper: OMAR,
      question: 'Which spectrometer\ncan we book?',
      now: NOW,
    });

    expect(task).toMatchObject({
      title: 'Help needed: Scoping',
      assigneeId: OMAR.id,
      status: 'TODO',
      dueAt: '2026-10-19T13:00:00.000Z',
    });
    expect(task.bodyV2.markdown).toContain('Sara asked for help on Scoping (ADNOC: corrosion testing).');
    expect(task.bodyV2.markdown).toContain('Question: Which spectrometer can we book?');
    expect(task.bodyV2.markdown).toContain('The owner stays Sara.');
  });
});
