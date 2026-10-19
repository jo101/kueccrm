import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { createTimelineActivity, kvStore } = vi.hoisted(() => ({
  createTimelineActivity: vi.fn(),
  kvStore: new Map<string, string>(),
}));

vi.mock('twenty-sdk/logic-function', () => ({
  createTimelineActivity,
  kv: {
    get: async (key: string) => kvStore.get(key),
    set: async (key: string, value: string) => {
      kvStore.set(key, value);
    },
  },
}));

import {
  caseTimelineTargetFor,
  publishWorkPackageTransition,
  publishWorkPackageTransitions,
  WORK_PACKAGE_TRANSITION,
} from 'src/automation/timeline/publish-work-package-transition';
import { OPPORTUNITY_OBJECT_UNIVERSAL_IDENTIFIER } from 'src/constants/standard-objects';
import { PROJECT_UNIVERSAL_IDENTIFIER } from 'src/objects/project.object';
import { WORK_PACKAGE_UNIVERSAL_IDENTIFIER } from 'src/objects/work-package.object';

const HAPPENED_AT = '2026-10-17T20:08:17.206Z';

const licenceStep = {
  id: '2e5b6a39-facb-4a4d-8bc3-d7370e8b3f88',
  name: 'Technical assessment',
  opportunityId: '6d5930e3-a8e7-4c45-9123-44f75d891e12',
  projectId: null,
};

beforeEach(() => {
  createTimelineActivity.mockResolvedValue({ id: 'row' });
});

afterEach(() => {
  createTimelineActivity.mockReset();
  kvStore.clear();
  vi.restoreAllMocks();
});

describe('caseTimelineTargetFor', () => {
  it('targets the opportunity by its standard identifier, a plain string', () => {
    const target = caseTimelineTargetFor(licenceStep);

    expect(target).toEqual({
      targetObjectUniversalIdentifier: OPPORTUNITY_OBJECT_UNIVERSAL_IDENTIFIER,
      targetRecordId: licenceStep.opportunityId,
    });
    expect(typeof target?.targetObjectUniversalIdentifier).toBe('string');
  });

  it('targets the project when the step belongs to one', () => {
    expect(
      caseTimelineTargetFor({ opportunityId: null, projectId: 'project-1' }),
    ).toEqual({
      targetObjectUniversalIdentifier: PROJECT_UNIVERSAL_IDENTIFIER,
      targetRecordId: 'project-1',
    });
  });

  it('has no case row for a step without a case', () => {
    expect(caseTimelineTargetFor({ opportunityId: null, projectId: null })).toBeNull();
  });
});

describe('publishWorkPackageTransition', () => {
  it('writes the work package row, then the opportunity row linked back to it', async () => {
    await publishWorkPackageTransition({
      workPackage: licenceStep,
      transition: WORK_PACKAGE_TRANSITION.OFFERED,
      happenedAt: HAPPENED_AT,
    });

    expect(createTimelineActivity).toHaveBeenCalledTimes(2);
    expect(createTimelineActivity.mock.calls[0][0]).toMatchObject({
      targetObjectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
      targetRecordId: licenceStep.id,
      happensAt: HAPPENED_AT,
    });
    expect(createTimelineActivity.mock.calls[1][0]).toMatchObject({
      targetObjectUniversalIdentifier: OPPORTUNITY_OBJECT_UNIVERSAL_IDENTIFIER,
      targetRecordId: licenceStep.opportunityId,
      linkedObjectMetadataUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
      linkedRecordId: licenceStep.id,
    });
  });

  it('writes each row once across retries', async () => {
    const input = {
      workPackage: licenceStep,
      transition: WORK_PACKAGE_TRANSITION.OFFERED,
      happenedAt: HAPPENED_AT,
    };

    await publishWorkPackageTransition(input);
    await publishWorkPackageTransition(input);

    expect(createTimelineActivity).toHaveBeenCalledTimes(2);
  });

  it('names a record id that is not a string instead of sending it as null', async () => {
    await expect(
      publishWorkPackageTransition({
        workPackage: {
          ...licenceStep,
          opportunityId: (() => undefined) as unknown as string,
        },
        transition: WORK_PACKAGE_TRANSITION.OFFERED,
        happenedAt: HAPPENED_AT,
      }),
    ).rejects.toThrow('targetRecordId must be a non-empty string, got function');
  });
});

describe('publishWorkPackageTransitions', () => {
  it('logs a failed row, reports it and still writes the other steps', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    createTimelineActivity
      .mockResolvedValueOnce({ id: 'row' })
      .mockRejectedValueOnce(new Error('Expected non-nullable type "UUID!" not to be null.'));

    const failures = await publishWorkPackageTransitions([
      { workPackage: licenceStep, transition: WORK_PACKAGE_TRANSITION.OFFERED, happenedAt: HAPPENED_AT },
      {
        workPackage: { ...licenceStep, id: 'wp-2', opportunityId: null },
        transition: WORK_PACKAGE_TRANSITION.OFFERED,
        happenedAt: HAPPENED_AT,
      },
    ]);

    expect(failures).toEqual([
      {
        workPackageId: licenceStep.id,
        transition: 'OFFERED',
        message: 'Expected non-nullable type "UUID!" not to be null.',
      },
    ]);
    expect(createTimelineActivity).toHaveBeenCalledTimes(3);
    expect(consoleError).toHaveBeenCalledWith(
      `timeline OFFERED for work package ${licenceStep.id} failed: Expected non-nullable type "UUID!" not to be null.`,
    );
  });
});
