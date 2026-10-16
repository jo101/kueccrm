import { describe, expect, it } from 'vitest';

import {
  buildAcceptUpdate,
  buildDeclineUpdate,
  buildHelpTask,
  buildSubmitUpdate,
  CARD_ACTION,
  getAvailableCardActions,
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
  it('offers Accept and Decline to the owner of an offered work package', () => {
    expect(actionsFor(WORK_PACKAGE_STATUS.OFFERED, SARA.id)).toEqual([
      CARD_ACTION.ACCEPT,
      CARD_ACTION.DECLINE,
    ]);
  });

  it('offers Request help and Submit to the owner of accepted work', () => {
    expect(actionsFor(WORK_PACKAGE_STATUS.ACCEPTED, SARA.id)).toEqual([
      CARD_ACTION.REQUEST_HELP,
      CARD_ACTION.SUBMIT,
    ]);
  });

  it('offers nothing on any other status', () => {
    for (const status of [
      WORK_PACKAGE_STATUS.PLANNED,
      WORK_PACKAGE_STATUS.SUBMITTED,
      WORK_PACKAGE_STATUS.BLOCKED,
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
