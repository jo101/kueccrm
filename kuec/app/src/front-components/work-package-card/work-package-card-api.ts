import { isDefined } from 'twenty-sdk/utils';
import { type CoreApiClient } from 'twenty-client-sdk/core';

import {
  buildAcceptUpdate,
  buildDeclineUpdate,
  buildHelpTask,
  buildSubmitUpdate,
  CARD_ACTION,
  type CardMember,
  type CardWorkPackage,
  getAvailableCardActions,
} from 'src/front-components/work-package-card/work-package-card-rules';
import { PLAYBOOK_ROLE } from 'src/objects/playbook-role-assignment.object';
import { type WorkPackageStatus } from 'src/objects/work-package.object';

export type CardClient = Pick<CoreApiClient, 'query' | 'mutation'>;

type MemberNode = {
  id: string;
  name?: { firstName?: string | null } | null;
} | null;

type WorkPackageNode = {
  id: string;
  name?: string | null;
  status: WorkPackageStatus;
  dueAt?: string | null;
  objective?: string | null;
  expectedOutput?: string | null;
  doneCriteria?: string | null;
  owner?: MemberNode;
  reviewer?: MemberNode;
  opportunity?: { name?: string | null } | null;
  project?: { name?: string | null } | null;
};

const MEMBER_SELECTION = { id: true, name: { firstName: true } } as const;

const toCardMember = (member: MemberNode | undefined): CardMember | null =>
  isDefined(member)
    ? { id: member.id, firstName: member.name?.firstName ?? '' }
    : null;

const toCardWorkPackage = (node: WorkPackageNode): CardWorkPackage => ({
  id: node.id,
  name: node.name ?? '',
  status: node.status,
  dueAt: node.dueAt ?? null,
  objective: node.objective ?? null,
  expectedOutput: node.expectedOutput ?? null,
  doneCriteria: node.doneCriteria ?? null,
  owner: toCardMember(node.owner),
  reviewer: toCardMember(node.reviewer),
  caseName: node.opportunity?.name ?? node.project?.name ?? null,
});

export const loadCardWorkPackage = async (
  client: CardClient,
  workPackageId: string,
): Promise<CardWorkPackage | null> => {
  const response: { workPackage?: WorkPackageNode | null } = await client.query({
    workPackage: {
      __args: { filter: { id: { eq: workPackageId } } },
      id: true,
      name: true,
      status: true,
      dueAt: true,
      objective: true,
      expectedOutput: true,
      doneCriteria: true,
      owner: MEMBER_SELECTION,
      reviewer: MEMBER_SELECTION,
      opportunity: { name: true },
      project: { name: true },
    },
  });

  return isDefined(response.workPackage)
    ? toCardWorkPackage(response.workPackage)
    : null;
};

// The front component knows the signed-in user; records point at workspace members.
export const loadViewerMember = async (
  client: CardClient,
  userId: string,
): Promise<CardMember | null> => {
  const response: {
    workspaceMembers?: { edges: { node: MemberNode }[] } | null;
  } = await client.query({
    workspaceMembers: {
      __args: { filter: { userId: { eq: userId } }, first: 1 },
      edges: { node: MEMBER_SELECTION },
    },
  });

  return toCardMember(response.workspaceMembers?.edges[0]?.node);
};

// Same rule as the automation: the first active ops coordinator assignment.
export const loadOpsCoordinator = async (
  client: CardClient,
): Promise<CardMember | null> => {
  const response: {
    playbookRoleAssignments?: {
      edges: { node: { member?: MemberNode } }[];
    } | null;
  } = await client.query({
    playbookRoleAssignments: {
      __args: {
        filter: {
          playbookRole: { eq: PLAYBOOK_ROLE.OPS_COORDINATOR },
          isActive: { eq: true },
        },
        orderBy: [{ createdAt: 'AscNullsLast' }],
        first: 20,
      },
      edges: { node: { member: MEMBER_SELECTION } },
    },
  });

  const firstAssigned = response.playbookRoleAssignments?.edges
    .map(({ node }) => node.member)
    .find(isDefined);

  return toCardMember(firstAssigned);
};

export type CardActionInput =
  | { action: typeof CARD_ACTION.ACCEPT }
  | { action: typeof CARD_ACTION.DECLINE; reason: string }
  | {
      action: typeof CARD_ACTION.REQUEST_HELP;
      question: string;
      helper: CardMember;
    }
  | { action: typeof CARD_ACTION.SUBMIT };

export type CardActionResult = {
  outcome: 'APPLIED' | 'CONFLICT';
  workPackage: CardWorkPackage | null;
};

const updateWorkPackage = (
  client: CardClient,
  workPackageId: string,
  data: Record<string, string>,
) =>
  client.mutation({
    updateWorkPackage: {
      __args: { id: workPackageId, data },
      id: true,
    },
  });

const createHelpTask = async (
  client: CardClient,
  workPackage: CardWorkPackage,
  requester: CardMember,
  helper: CardMember,
  question: string,
  now: Date,
) => {
  const response: { createTask?: { id: string } | null } =
    await client.mutation({
      createTask: {
        __args: {
          data: buildHelpTask({ workPackage, requester, helper, question, now }),
        },
        id: true,
      },
    });

  if (!isDefined(response.createTask)) {
    throw new Error('The help task was not created');
  }

  await client.mutation({
    createTaskTarget: {
      __args: {
        data: {
          taskId: response.createTask.id,
          targetWorkPackageId: workPackage.id,
        },
      },
      id: true,
    },
  });
};

// Re-reads the record first: the card only writes when the work package is
// still in the state the button was shown for, and still owned by the viewer.
export const applyCardAction = async ({
  client,
  workPackageId,
  viewer,
  input,
  now,
}: {
  client: CardClient;
  workPackageId: string;
  viewer: CardMember;
  input: CardActionInput;
  now: Date;
}): Promise<CardActionResult> => {
  const current = await loadCardWorkPackage(client, workPackageId);

  if (
    !isDefined(current) ||
    !getAvailableCardActions({
      workPackage: current,
      viewerMemberId: viewer.id,
    }).includes(input.action)
  ) {
    return { outcome: 'CONFLICT', workPackage: current };
  }

  switch (input.action) {
    case CARD_ACTION.ACCEPT:
      await updateWorkPackage(client, workPackageId, buildAcceptUpdate(now));
      break;
    case CARD_ACTION.DECLINE:
      await updateWorkPackage(
        client,
        workPackageId,
        buildDeclineUpdate(input.reason),
      );
      break;
    case CARD_ACTION.REQUEST_HELP:
      await createHelpTask(
        client,
        current,
        viewer,
        input.helper,
        input.question,
        now,
      );
      break;
    case CARD_ACTION.SUBMIT:
      await updateWorkPackage(client, workPackageId, buildSubmitUpdate());
      break;
  }

  return {
    outcome: 'APPLIED',
    workPackage: await loadCardWorkPackage(client, workPackageId),
  };
};
