import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  createTracker,
  type IdRecord,
  type WorkPackage,
} from 'src/__tests__/acceptance/acceptance-helpers';
import { create, getOne, list } from 'src/__tests__/utils/test-api';

// T6 (API half): a user without the Automation role changes the status of
// someone else's work package. First on the role a member gets today (the app
// ships no BD roles), then on a role whose Work package > Status field is
// read-only, the strongest restriction field permissions can express. Every
// outcome is logged so the report can quote it. The UI and kanban half is a
// browser session recorded in kuec/tests/report.md.

const API_URL = process.env.TWENTY_API_URL ?? '';
// A member holding the Admin role: role and field-permission changes need it.
const ADMIN_TOKEN = process.env.T6_ADMIN_TOKEN ?? '';
const ACTOR_EMAIL = process.env.T6_ACTOR_EMAIL ?? 'phil.schiler@apple.dev';
const ACTOR_PASSWORD = process.env.T6_ACTOR_PASSWORD ?? 'tim@apple.dev';
const ORIGIN = process.env.T6_ORIGIN ?? 'http://localhost:3001';
const RUN_TAG = `t6-${Date.now()}`;
const tracker = createTracker();

type Outcome = { allowed: boolean; status: number; detail: string; body?: unknown };

const graphql = async <TData>(
  path: 'graphql' | 'metadata',
  token: string,
  query: string,
  variables: Record<string, unknown> = {},
): Promise<{ data?: TData; errors?: { message: string }[] }> => {
  const response = await fetch(`${API_URL}/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      Origin: ORIGIN,
    },
    body: JSON.stringify({ query, variables }),
  });

  return response.json();
};

const signIn = async (email: string, password: string): Promise<string> => {
  const login = await graphql<{
    getLoginTokenFromCredentials: { loginToken: { token: string } };
  }>(
    'metadata',
    '',
    `mutation($email: String!, $password: String!, $origin: String!) {
      getLoginTokenFromCredentials(email: $email, password: $password, origin: $origin) { loginToken { token } }
    }`,
    { email, password, origin: ORIGIN },
  );
  const tokens = await graphql<{
    getAuthTokensFromLoginToken: {
      tokens: { accessOrWorkspaceAgnosticToken: { token: string } };
    };
  }>(
    'metadata',
    '',
    `mutation($loginToken: String!, $origin: String!) {
      getAuthTokensFromLoginToken(loginToken: $loginToken, origin: $origin) {
        tokens { accessOrWorkspaceAgnosticToken { token } }
      }
    }`,
    { loginToken: login.data?.getLoginTokenFromCredentials.loginToken.token, origin: ORIGIN },
  );

  return tokens.data!.getAuthTokensFromLoginToken.tokens.accessOrWorkspaceAgnosticToken.token;
};

const rest = async (
  token: string,
  method: 'PATCH' | 'POST' | 'DELETE',
  path: string,
  body?: Record<string, unknown>,
): Promise<Outcome> => {
  const response = await fetch(`${API_URL}/rest/${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();

  let parsed: unknown;

  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = undefined;
  }

  return { allowed: response.ok, status: response.status, detail: text.slice(0, 300), body: parsed };
};

const graphqlOutcome = async (token: string, query: string, variables: Record<string, unknown>): Promise<Outcome> => {
  const result = await graphql('graphql', token, query, variables);

  return {
    allowed: result.errors === undefined,
    status: 200,
    detail: JSON.stringify(result.errors ?? result.data).slice(0, 300),
  };
};

const report: Record<string, Outcome> = {};
const record = (label: string, outcome: Outcome) => {
  report[label] = outcome;
  console.log(`[t6] ${label}: ${outcome.allowed ? 'ALLOWED' : 'BLOCKED'} (${outcome.status}) ${outcome.detail}`);

  return outcome;
};

let actorToken: string;
let actorMemberId: string;
let ownerMemberId: string;
let memberRoleId: string;
let restrictedRoleId: string;

const othersWorkPackage = async (title: string) =>
  tracker.track(
    'workPackages',
    await create<WorkPackage>('workPackages', 'workPackage', {
      name: `${RUN_TAG} ${title}`,
      status: 'OFFERED',
      ownerId: ownerMemberId,
      dueAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      doneCriteria: 'Acceptance test criteria',
    }),
  );

beforeAll(async () => {
  actorToken = await signIn(ACTOR_EMAIL, ACTOR_PASSWORD);

  const actor = await graphql<{ currentUser: { workspaceMember: { id: string } } }>(
    'metadata',
    actorToken,
    '{ currentUser { workspaceMember { id } } }',
  );

  actorMemberId = actor.data!.currentUser.workspaceMember.id;
  ownerMemberId = (
    await list<IdRecord & { userEmail: string }>('workspaceMembers', 'userEmail[eq]:"tim@apple.dev"')
  )[0]!.id;

  const roles = await graphql<{ getRoles: { id: string; label: string }[] }>(
    'metadata',
    ADMIN_TOKEN,
    '{ getRoles { id label } }',
  );

  memberRoleId = roles.data!.getRoles.find(({ label }) => label === 'Member')!.id;
});

afterAll(async () => {
  await graphql('metadata', ADMIN_TOKEN, `mutation($workspaceMemberId: UUID!, $roleId: UUID!) {
    updateWorkspaceMemberRole(workspaceMemberId: $workspaceMemberId, roleId: $roleId) { id }
  }`, { workspaceMemberId: actorMemberId, roleId: memberRoleId });

  if (restrictedRoleId !== undefined) {
    await graphql('metadata', ADMIN_TOKEN, 'mutation($roleId: UUID!) { deleteOneRole(roleId: $roleId) }', {
      roleId: restrictedRoleId,
    });
  }

  await tracker.removeAll();
  console.log(`[t6] summary ${JSON.stringify(Object.fromEntries(Object.entries(report).map(([label, { allowed }]) => [label, allowed ? 'ALLOWED' : 'BLOCKED'])), null, 2)}`);
});

describe('T6 baseline: the Member role a BD user holds today', () => {
  it('lets the user change the status of a work package owned by someone else', async () => {
    const workPackage = await othersWorkPackage('Baseline');
    const outcome = record(
      'member: REST status of another owner',
      await rest(actorToken, 'PATCH', `workPackages/${workPackage.id}`, { status: 'DONE' }),
    );

    expect(outcome.allowed).toBe(true);
    expect((await getOne<WorkPackage>('workPackages', workPackage.id)).status).toBe('DONE');
  });
});

describe('T6 with Work package > Status read-only on the role', () => {
  let othersId: string;
  let ownId: string;

  beforeAll(async () => {
    const { data: objectData } = await graphql<{
      objects: { edges: { node: { id: string; nameSingular: string; fieldsList: { id: string; name: string }[] } }[] };
    }>('metadata', ADMIN_TOKEN, `{ objects(paging: { first: 200 }) { edges { node { id nameSingular fieldsList { id name } } } } }`);
    const workPackageObject = objectData!.objects.edges.find(({ node }) => node.nameSingular === 'workPackage')!.node;
    const statusField = workPackageObject.fieldsList.find(({ name }) => name === 'status')!;

    const created = await graphql<{ createOneRole: { id: string } }>('metadata', ADMIN_TOKEN, `mutation($input: CreateRoleInput!) {
      createOneRole(createRoleInput: $input) { id }
    }`, {
      input: {
        label: `${RUN_TAG} BD staff`,
        description: 'T6: Member rights with Work package > Status read-only',
        canUpdateAllSettings: false,
        canAccessAllTools: false,
        canReadAllObjectRecords: true,
        canUpdateAllObjectRecords: true,
        canSoftDeleteAllObjectRecords: true,
        canDestroyAllObjectRecords: false,
        canBeAssignedToUsers: true,
      },
    });

    restrictedRoleId = created.data!.createOneRole.id;

    const upserted = await graphql('metadata', ADMIN_TOKEN, `mutation($input: UpsertFieldPermissionsInput!) {
      upsertFieldPermissions(upsertFieldPermissionsInput: $input) { id }
    }`, {
      input: {
        roleId: restrictedRoleId,
        fieldPermissions: [{
          objectMetadataId: workPackageObject.id,
          fieldMetadataId: statusField.id,
          canUpdateFieldValue: false,
        }],
      },
    });

    expect(upserted.errors).toBeUndefined();

    const assigned = await graphql('metadata', ADMIN_TOKEN, `mutation($workspaceMemberId: UUID!, $roleId: UUID!) {
      updateWorkspaceMemberRole(workspaceMemberId: $workspaceMemberId, roleId: $roleId) { id }
    }`, { workspaceMemberId: actorMemberId, roleId: restrictedRoleId });

    expect(assigned.errors).toBeUndefined();
    actorToken = await signIn(ACTOR_EMAIL, ACTOR_PASSWORD);

    othersId = (await othersWorkPackage('Restricted other')).id;
    ownId = tracker.track(
      'workPackages',
      await create<WorkPackage>('workPackages', 'workPackage', {
        name: `${RUN_TAG} Restricted own`,
        status: 'OFFERED',
        ownerId: actorMemberId,
        doneCriteria: 'Acceptance test criteria',
      }),
    ).id;
  });

  it('blocks a status change on someone else’s work package (REST and GraphQL)', async () => {
    const restOutcome = record('restricted: REST status of another owner', await rest(actorToken, 'PATCH', `workPackages/${othersId}`, { status: 'DONE' }));
    const graphqlResult = record(
      'restricted: GraphQL status of another owner',
      await graphqlOutcome(actorToken, `mutation($id: UUID!) { updateWorkPackage(id: $id, data: { status: DONE }) { id status } }`, { id: othersId }),
    );
    const bulk = record(
      'restricted: REST bulk status by filter',
      await rest(actorToken, 'PATCH', `workPackages?filter=id%5Beq%5D%3A%22${othersId}%22`, { status: 'DONE' }),
    );

    expect(restOutcome.allowed).toBe(false);
    expect(graphqlResult.allowed).toBe(false);
    expect(bulk.allowed).toBe(false);
    expect((await getOne<WorkPackage>('workPackages', othersId)).status).toBe('OFFERED');
  });

  it('also blocks the status of the user’s own work package: no row-level rule', async () => {
    const outcome = record('restricted: REST status of own work package', await rest(actorToken, 'PATCH', `workPackages/${ownId}`, { status: 'ACCEPTED' }));

    expect(outcome.allowed).toBe(false);
  });

  it('does not block the other ways to take or end someone else’s work', async () => {
    const takeOver = record('restricted: REST owner of another owner -> self', await rest(actorToken, 'PATCH', `workPackages/${othersId}`, { ownerId: actorMemberId }));
    const otherFields = record(
      'restricted: REST due date, done criteria, blocked reason of another owner',
      await rest(actorToken, 'PATCH', `workPackages/${othersId}`, {
        dueAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        doneCriteria: 'Changed by someone else',
        blockedReason: 'Set by someone else',
      }),
    );
    const createDone = record(
      'restricted: REST create a work package already Done',
      await rest(actorToken, 'POST', 'workPackages', { name: `${RUN_TAG} Created done`, status: 'DONE', ownerId: ownerMemberId }),
    );

    const created = (createDone.body as { data?: { createWorkPackage?: IdRecord } } | undefined)
      ?.data?.createWorkPackage;

    if (created !== undefined) {
      tracker.track('workPackages', created);
    }

    const softDelete = record('restricted: REST delete another owner’s work package', await rest(actorToken, 'DELETE', `workPackages/${othersId}`));

    expect(takeOver.allowed).toBe(true);
    expect(otherFields.allowed).toBe(true);
    // Recorded, not asserted: on 2.48.0 a role made with createOneRole was
    // refused the soft delete with or without the field restriction, while
    // Member was allowed; the field permission is not what decides it.
    expect(softDelete.status).toBeGreaterThan(0);
  });
});
