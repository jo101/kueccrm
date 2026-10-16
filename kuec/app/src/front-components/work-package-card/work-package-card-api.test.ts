import { describe, expect, it } from 'vitest';

import {
  applyCardAction,
  type CardActionInput,
  type CardClient,
  loadOpsCoordinator,
  loadViewerMember,
} from 'src/front-components/work-package-card/work-package-card-api';
import { CARD_ACTION } from 'src/front-components/work-package-card/work-package-card-rules';
import {
  WORK_PACKAGE_STATUS,
  type WorkPackageStatus,
} from 'src/objects/work-package.object';

type Selection = Record<string, { __args?: Record<string, unknown> }>;
type Call = { operation: string; args: Record<string, unknown> | undefined };

const SARA = { id: 'member-sara', firstName: 'Sara' };
const OMAR = { id: 'member-omar', firstName: 'Omar' };
const NOW = new Date('2026-10-19T06:00:00.000Z');

// Stands in for the generated CoreApiClient: answers the card's queries from
// one in-memory work package and records every mutation it receives.
const createFakeClient = (status: WorkPackageStatus, ownerId = SARA.id) => {
  const workPackage = {
    id: 'wp-1',
    name: 'Scoping',
    status,
    dueAt: '2026-10-22T13:00:00.000Z',
    objective: 'Define the technical work the client needs.',
    expectedOutput: null,
    doneCriteria: 'Scope covers every RFQ requirement.',
    owner: { id: ownerId, name: { firstName: ownerId === SARA.id ? 'Sara' : 'Omar' } },
    reviewer: null,
    opportunity: { name: 'ADNOC: corrosion testing' },
    project: null,
  };
  const mutations: Call[] = [];

  const client = {
    query: async (selection: Selection) => {
      const [operation] = Object.keys(selection);

      switch (operation) {
        case 'workPackage':
          return { workPackage: { ...workPackage } };
        case 'workspaceMembers':
          return { workspaceMembers: { edges: [{ node: { id: SARA.id, name: { firstName: 'Sara' } } }] } };
        case 'playbookRoleAssignments':
          return {
            playbookRoleAssignments: {
              edges: [
                { node: { member: null } },
                { node: { member: { id: OMAR.id, name: { firstName: 'Omar' } } } },
              ],
            },
          };
        default:
          throw new Error(`unexpected query ${operation}`);
      }
    },
    mutation: async (selection: Selection) => {
      const [operation] = Object.keys(selection);
      const args = selection[operation].__args;

      mutations.push({ operation, args });

      if (operation === 'updateWorkPackage') {
        Object.assign(workPackage, (args as { data: Record<string, string> }).data);
      }

      return { [operation]: { id: `${operation}-id` } };
    },
  } as unknown as CardClient;

  return { client, mutations, workPackage };
};

const apply = (client: CardClient, input: CardActionInput) =>
  applyCardAction({ client, workPackageId: 'wp-1', viewer: SARA, input, now: NOW });

describe('applyCardAction', () => {
  it('Accept writes status Accepted and acceptedAt on the work package only', async () => {
    const { client, mutations } = createFakeClient(WORK_PACKAGE_STATUS.OFFERED);

    const result = await apply(client, { action: CARD_ACTION.ACCEPT });

    expect(result.outcome).toBe('APPLIED');
    expect(result.workPackage?.status).toBe(WORK_PACKAGE_STATUS.ACCEPTED);
    expect(mutations).toEqual([
      {
        operation: 'updateWorkPackage',
        args: {
          id: 'wp-1',
          data: { status: WORK_PACKAGE_STATUS.ACCEPTED, acceptedAt: NOW.toISOString() },
        },
      },
    ]);
  });

  it('Decline writes status Declined and the reason only', async () => {
    const { client, mutations } = createFakeClient(WORK_PACKAGE_STATUS.OFFERED);

    await apply(client, { action: CARD_ACTION.DECLINE, reason: 'On leave from 20 Oct' });

    expect(mutations).toEqual([
      {
        operation: 'updateWorkPackage',
        args: {
          id: 'wp-1',
          data: { status: WORK_PACKAGE_STATUS.DECLINED, declinedReason: 'On leave from 20 Oct' },
        },
      },
    ]);
  });

  it('Submit writes status Submitted only', async () => {
    const { client, mutations } = createFakeClient(WORK_PACKAGE_STATUS.ACCEPTED);

    await apply(client, { action: CARD_ACTION.SUBMIT });

    expect(mutations).toEqual([
      {
        operation: 'updateWorkPackage',
        args: { id: 'wp-1', data: { status: WORK_PACKAGE_STATUS.SUBMITTED } },
      },
    ]);
  });

  it('Request help creates a task for the helper linked to the work package, and leaves the work package alone', async () => {
    const { client, mutations, workPackage } = createFakeClient(WORK_PACKAGE_STATUS.ACCEPTED);

    await apply(client, {
      action: CARD_ACTION.REQUEST_HELP,
      question: 'Which spectrometer can we book?',
      helper: OMAR,
    });

    expect(mutations.map(({ operation }) => operation)).toEqual([
      'createTask',
      'createTaskTarget',
    ]);
    expect(mutations[0].args).toMatchObject({
      data: { assigneeId: OMAR.id, title: 'Help needed: Scoping' },
    });
    expect(mutations[1].args).toEqual({
      data: { taskId: 'createTask-id', targetWorkPackageId: 'wp-1' },
    });
    expect(workPackage.owner.id).toBe(SARA.id);
    expect(workPackage.status).toBe(WORK_PACKAGE_STATUS.ACCEPTED);
  });

  it('writes nothing when the status moved on since the card was shown', async () => {
    const { client, mutations } = createFakeClient(WORK_PACKAGE_STATUS.SUBMITTED);

    const result = await apply(client, { action: CARD_ACTION.ACCEPT });

    expect(result.outcome).toBe('CONFLICT');
    expect(result.workPackage?.status).toBe(WORK_PACKAGE_STATUS.SUBMITTED);
    expect(mutations).toEqual([]);
  });

  it('writes nothing when the work package was given to someone else', async () => {
    const { client, mutations } = createFakeClient(WORK_PACKAGE_STATUS.OFFERED, OMAR.id);

    const result = await apply(client, { action: CARD_ACTION.ACCEPT });

    expect(result.outcome).toBe('CONFLICT');
    expect(mutations).toEqual([]);
  });
});

describe('lookups', () => {
  it('maps the signed-in user to their workspace member', async () => {
    const { client } = createFakeClient(WORK_PACKAGE_STATUS.OFFERED);

    expect(await loadViewerMember(client, 'user-sara')).toEqual(SARA);
  });

  it('takes the first active ops coordinator that has a member', async () => {
    const { client } = createFakeClient(WORK_PACKAGE_STATUS.OFFERED);

    expect(await loadOpsCoordinator(client)).toEqual(OMAR);
  });
});
