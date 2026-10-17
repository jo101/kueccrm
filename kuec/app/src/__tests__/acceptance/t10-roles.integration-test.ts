import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  assignPlaybookRoles,
  createTracker,
  listMemberIds,
  type IdRecord,
  type WorkPackage,
} from 'src/__tests__/acceptance/acceptance-helpers';
import { create, getOne, list, waitFor } from 'src/__tests__/utils/test-api';
import { OPPORTUNITY_STAGE } from 'src/constants/opportunity-stage';
import { OPPORTUNITY_PLAYBOOK_TYPE } from 'src/fields/playbook-type-on-opportunity.field';
import { AUTOMATION_ROLE_UNIVERSAL_IDENTIFIER } from 'src/roles/automation.role';
import { BD_OFFICER_ROLE_UNIVERSAL_IDENTIFIER } from 'src/roles/bd-officer.role';
import { ED_ROLE_UNIVERSAL_IDENTIFIER } from 'src/roles/ed.role';
import { ENGINEER_ROLE_UNIVERSAL_IDENTIFIER } from 'src/roles/engineer.role';
import { IP_OFFICE_ROLE_UNIVERSAL_IDENTIFIER } from 'src/roles/ip-office.role';
import { LEADERSHIP_VIEWER_ROLE_UNIVERSAL_IDENTIFIER } from 'src/roles/leadership-viewer.role';
import { OPS_COORDINATOR_ROLE_UNIVERSAL_IDENTIFIER } from 'src/roles/ops-coordinator.role';
import templates from 'src/playbooks/templates.json';

// T10: the roles of runbooks/13-roles.md on a live instance. Seeded members
// get a KUEC role each, then try what the role allows and refuses through the
// API with their own token. W1, W6 and W7 are started by the BD officer, the
// most restricted role that can start them. Every member gets its old role
// back afterwards, before the global teardown uninstalls the app.

const API_URL = process.env.TWENTY_API_URL ?? '';
// A member holding the Admin role: assigning roles and creating keys need it.
const ADMIN_TOKEN = process.env.T10_ADMIN_TOKEN ?? '';
const MEMBER_PASSWORD = process.env.T10_MEMBER_PASSWORD ?? 'tim@apple.dev';
const ORIGIN = process.env.T10_ORIGIN ?? 'http://localhost:3001';
const RUN_TAG = `t10-${Date.now()}`;
const tracker = createTracker();

const licenceTemplate = templates.playbooks.find(
  ({ key }) => key === OPPORTUNITY_PLAYBOOK_TYPE.TECHNOLOGY_LICENSING,
);

type Outcome = { allowed: boolean; status: number; detail: string; body?: unknown };

type RoleSummary = {
  id: string;
  label: string;
  universalIdentifier: string | null;
  workspaceMembers: { id: string; userEmail: string }[] | null;
};

type Actor = { memberId: string; email: string; previousRoleId: string; token: string };

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
      ...(token.length > 0 ? { Authorization: `Bearer ${token}` } : {}),
      Origin: ORIGIN,
    },
    body: JSON.stringify({ query, variables }),
  });

  return response.json();
};

const signIn = async (email: string): Promise<string> => {
  const login = await graphql<{
    getLoginTokenFromCredentials: { loginToken: { token: string } };
  }>(
    'metadata',
    '',
    `mutation($email: String!, $password: String!, $origin: String!) {
      getLoginTokenFromCredentials(email: $email, password: $password, origin: $origin) { loginToken { token } }
    }`,
    { email, password: MEMBER_PASSWORD, origin: ORIGIN },
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
  const token = tokens.data?.getAuthTokensFromLoginToken.tokens.accessOrWorkspaceAgnosticToken.token;

  if (token === undefined) {
    throw new Error(`sign-in failed for ${email}: ${JSON.stringify(tokens.errors)}`);
  }

  return token;
};

const rest = async (
  token: string,
  method: 'GET' | 'PATCH' | 'POST' | 'DELETE',
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

  // A GraphQL-style error inside a 200 also counts as refused.
  const hasErrors =
    typeof parsed === 'object' && parsed !== null && 'errors' in parsed;

  return {
    allowed: response.ok && !hasErrors,
    status: response.status,
    detail: text.slice(0, 200),
    body: parsed,
  };
};

const log = (label: string, outcome: Outcome) => {
  console.log(`[t10] ${label}: ${outcome.allowed ? 'ALLOWED' : 'REFUSED'} (${outcome.status}) ${outcome.detail}`);

  return outcome;
};

const assignRole = async (memberId: string, roleId: string) => {
  const result = await graphql(
    'metadata',
    ADMIN_TOKEN,
    `mutation($workspaceMemberId: UUID!, $roleId: UUID!) {
      updateWorkspaceMemberRole(workspaceMemberId: $workspaceMemberId, roleId: $roleId) { id }
    }`,
    { workspaceMemberId: memberId, roleId },
  );

  if (result.errors !== undefined) {
    throw new Error(`role assignment failed: ${JSON.stringify(result.errors)}`);
  }
};

let roles: RoleSummary[] = [];
const actors: Record<string, Actor> = {};
let automationKeyId: string | undefined;
let automationKey = '';
let companyId: string;
let opportunityId: string;
let workPackageId: string;
let projectId: string;
let restorePlaybookRoles: () => Promise<void>;

const roleId = (universalIdentifier: string): string => {
  const role = roles.find((candidate) => candidate.universalIdentifier === universalIdentifier);

  if (role === undefined) {
    throw new Error(`role ${universalIdentifier} is not installed`);
  }

  return role.id;
};

const actor = (universalIdentifier: string): Actor => {
  const found = actors[universalIdentifier];

  if (found === undefined) {
    throw new Error(`no actor for ${universalIdentifier}`);
  }

  return found;
};

const ACTOR_ROLES = [
  ED_ROLE_UNIVERSAL_IDENTIFIER,
  OPS_COORDINATOR_ROLE_UNIVERSAL_IDENTIFIER,
  BD_OFFICER_ROLE_UNIVERSAL_IDENTIFIER,
  ENGINEER_ROLE_UNIVERSAL_IDENTIFIER,
  LEADERSHIP_VIEWER_ROLE_UNIVERSAL_IDENTIFIER,
  IP_OFFICE_ROLE_UNIVERSAL_IDENTIFIER,
];

beforeAll(async () => {
  if (ADMIN_TOKEN.length === 0) {
    throw new Error('Set T10_ADMIN_TOKEN to the access token of a member holding Admin');
  }

  const rolesResult = await graphql<{ getRoles: RoleSummary[] }>(
    'metadata',
    ADMIN_TOKEN,
    `{ getRoles { id label universalIdentifier workspaceMembers { id userEmail } } }`,
  );

  roles = rolesResult.data?.getRoles ?? [];

  const memberRole = roles.find((role) => role.label === 'Member');
  const candidates = (memberRole?.workspaceMembers ?? []).slice(0, ACTOR_ROLES.length);

  if (memberRole === undefined || candidates.length < ACTOR_ROLES.length) {
    throw new Error(`T10 needs ${ACTOR_ROLES.length} members on the Member role`);
  }

  for (const [index, universalIdentifier] of ACTOR_ROLES.entries()) {
    const candidate = candidates[index]!;

    await assignRole(candidate.id, roleId(universalIdentifier));
    actors[universalIdentifier] = {
      memberId: candidate.id,
      email: candidate.userEmail,
      previousRoleId: memberRole.id,
      token: await signIn(candidate.userEmail),
    };
  }

  const bdOfficer = actor(BD_OFFICER_ROLE_UNIVERSAL_IDENTIFIER);

  companyId = tracker.track(
    'companies',
    await create<IdRecord>('companies', 'company', { name: `${RUN_TAG} Gulf Thermal` }),
  ).id;
  opportunityId = tracker.track(
    'opportunities',
    await create<IdRecord>('opportunities', 'opportunity', {
      name: `${RUN_TAG} Licence thermal storage`,
      companyId,
      ownerId: bdOfficer.memberId,
    }),
  ).id;
  workPackageId = tracker.track(
    'workPackages',
    await create<IdRecord>('workPackages', 'workPackage', {
      name: `${RUN_TAG} Draft term sheet`,
      status: 'OFFERED',
      ownerId: bdOfficer.memberId,
      dueAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      doneCriteria: 'Term sheet sent',
    }),
  ).id;
  projectId = tracker.track(
    'projects',
    await create<IdRecord>('projects', 'project', { name: `${RUN_TAG} Workshop` }),
  ).id;

  const members = await listMemberIds();

  restorePlaybookRoles = await assignPlaybookRoles(RUN_TAG, {
    ED: members[0]!,
    OPS_COORDINATOR: members[1]!,
    BD_OFFICER: members[2]!,
    DEVELOPER: members[3]!,
    DATA_ANALYST: members[4]!,
    LEGAL: members[5]!,
  });
});

afterAll(async () => {
  for (const objectNamePlural of ['workPackages', 'contracts'] as const) {
    for (const record of await list<IdRecord>(
      objectNamePlural,
      `opportunityId[eq]:"${opportunityId}"`,
    )) {
      tracker.track(objectNamePlural, record);
    }
  }

  await tracker.removeAll();
  await restorePlaybookRoles?.();

  if (automationKeyId !== undefined) {
    await graphql(
      'metadata',
      ADMIN_TOKEN,
      `mutation($input: RevokeApiKeyInput!) { revokeApiKey(input: $input) { id } }`,
      { input: { id: automationKeyId } },
    );
  }

  for (const { memberId, previousRoleId } of Object.values(actors)) {
    await assignRole(memberId, previousRoleId);
  }
});

describe('T10 roles', () => {
  it('BD officer: works the pipeline and a work package status, nothing else', async () => {
    const { token } = actor(BD_OFFICER_ROLE_UNIVERSAL_IDENTIFIER);

    expect(log('bd accepts own work package', await rest(token, 'PATCH', `workPackages/${workPackageId}`, { status: 'ACCEPTED' })).allowed).toBe(true);
    expect(log('bd sets blocked reason', await rest(token, 'PATCH', `workPackages/${workPackageId}`, { blockedReason: 'Waiting for the client' })).allowed).toBe(true);
    expect(log('bd moves a due date', await rest(token, 'PATCH', `workPackages/${workPackageId}`, { dueAt: new Date().toISOString() })).allowed).toBe(false);
    expect(log('bd reassigns a work package', await rest(token, 'PATCH', `workPackages/${workPackageId}`, { ownerId: actor(IP_OFFICE_ROLE_UNIVERSAL_IDENTIFIER).memberId })).allowed).toBe(false);
    expect(log('bd edits an opportunity', await rest(token, 'PATCH', `opportunities/${opportunityId}`, { nextAction: 'Call the CTO' })).allowed).toBe(true);
    expect(log('bd edits a company', await rest(token, 'PATCH', `companies/${companyId}`, { tagline: 'Thermal storage' })).allowed).toBe(true);
    expect(log('bd edits a project', await rest(token, 'PATCH', `projects/${projectId}`, { name: `${RUN_TAG} renamed` })).allowed).toBe(false);
    expect(log('bd deletes an opportunity', await rest(token, 'DELETE', `opportunities/${opportunityId}`)).allowed).toBe(false);

    const task = log('bd creates a task', await rest(token, 'POST', 'tasks', { title: `${RUN_TAG} follow up` }));

    expect(task.allowed).toBe(true);

    const taskId = (task.body as { data: { createTask: IdRecord } }).data.createTask.id;

    tracker.track('tasks', { id: taskId });
    expect(log('bd links the task', await rest(token, 'POST', 'taskTargets', { taskId, targetOpportunityId: opportunityId })).allowed).toBe(true);

    const [timelineRow] = await list<IdRecord>('timelineActivities', 'id[is]:NOT_NULL');

    expect(log('bd destroys a timeline row', await rest(token, 'DELETE', `timelineActivities/${timelineRow!.id}`)).allowed).toBe(false);
  });

  it('IP office: writes opportunities, not companies or work packages', async () => {
    const { token } = actor(IP_OFFICE_ROLE_UNIVERSAL_IDENTIFIER);

    expect(log('dept edits an opportunity', await rest(token, 'PATCH', `opportunities/${opportunityId}`, { nextAction: 'Send the IP summary' })).allowed).toBe(true);
    expect(log('dept edits a company', await rest(token, 'PATCH', `companies/${companyId}`, { tagline: 'x' })).allowed).toBe(false);
    expect(log('dept changes a work package status', await rest(token, 'PATCH', `workPackages/${workPackageId}`, { status: 'SUBMITTED' })).allowed).toBe(false);
    expect(log('dept reads people', await rest(token, 'GET', 'people?limit=1')).allowed).toBe(true);
  });

  it('Engineer: reads everything, writes no business data, cannot mint keys', async () => {
    const { token } = actor(ENGINEER_ROLE_UNIVERSAL_IDENTIFIER);

    expect(log('engineer reads people', await rest(token, 'GET', 'people?limit=1')).allowed).toBe(true);
    expect(log('engineer edits a company', await rest(token, 'PATCH', `companies/${companyId}`, { tagline: 'x' })).allowed).toBe(false);
    expect(log('engineer creates a note', await rest(token, 'POST', 'notes', { title: `${RUN_TAG} note` })).allowed).toBe(false);

    const keyAttempt = await graphql(
      'metadata',
      token,
      `mutation($input: CreateApiKeyInput!) { createApiKey(input: $input) { id } }`,
      {
        input: {
          name: `${RUN_TAG} engineer key`,
          expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
          roleId: roleId(AUTOMATION_ROLE_UNIVERSAL_IDENTIFIER),
        },
      },
    );

    console.log(`[t10] engineer creates an API key: ${JSON.stringify(keyAttempt.errors ?? keyAttempt.data).slice(0, 200)}`);
    expect(keyAttempt.errors).toBeDefined();
  });

  it('Leadership viewer: pipeline, projects, contracts and dashboards only', async () => {
    const { token } = actor(LEADERSHIP_VIEWER_ROLE_UNIVERSAL_IDENTIFIER);

    expect(log('leadership reads opportunities', await rest(token, 'GET', 'opportunities?limit=1')).allowed).toBe(true);
    expect(log('leadership reads projects', await rest(token, 'GET', 'projects?limit=1')).allowed).toBe(true);
    expect(log('leadership reads contracts', await rest(token, 'GET', 'contracts?limit=1')).allowed).toBe(true);
    expect(log('leadership reads dashboards', await rest(token, 'GET', 'dashboards?limit=1')).allowed).toBe(true);
    expect(log('leadership reads people', await rest(token, 'GET', 'people?limit=1')).allowed).toBe(false);
    expect(log('leadership reads engagements', await rest(token, 'GET', 'engagements?limit=1')).allowed).toBe(false);
    expect(log('leadership reads the timeline', await rest(token, 'GET', 'timelineActivities?limit=1')).allowed).toBe(false);
    expect(log('leadership edits an opportunity', await rest(token, 'PATCH', `opportunities/${opportunityId}`, { nextAction: 'x' })).allowed).toBe(false);
  });

  it('Ops coordinator: changes plans and deletes; ED creates the automation key', async () => {
    const ops = actor(OPS_COORDINATOR_ROLE_UNIVERSAL_IDENTIFIER);

    expect(log('ops moves a due date', await rest(ops.token, 'PATCH', `workPackages/${workPackageId}`, { dueAt: new Date(Date.now() + 86_400_000).toISOString() })).allowed).toBe(true);

    const throwaway = await create<IdRecord>('opportunities', 'opportunity', { name: `${RUN_TAG} duplicate` });

    expect(log('ops deletes an opportunity', await rest(ops.token, 'DELETE', `opportunities/${throwaway.id}`)).allowed).toBe(true);

    const ed = actor(ED_ROLE_UNIVERSAL_IDENTIFIER);
    const created = await graphql<{ createApiKey: IdRecord }>(
      'metadata',
      ed.token,
      `mutation($input: CreateApiKeyInput!) { createApiKey(input: $input) { id } }`,
      {
        input: {
          name: `${RUN_TAG} automation`,
          expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
          roleId: roleId(AUTOMATION_ROLE_UNIVERSAL_IDENTIFIER),
        },
      },
    );

    console.log(`[t10] ED creates the automation key: ${JSON.stringify(created.errors ?? created.data).slice(0, 200)}`);
    automationKeyId = created.data?.createApiKey.id;
    expect(automationKeyId).toBeDefined();

    const generated = await graphql<{ generateApiKeyToken: { token: string } }>(
      'metadata',
      ed.token,
      `mutation($apiKeyId: UUID!, $expiresAt: String!) { generateApiKeyToken(apiKeyId: $apiKeyId, expiresAt: $expiresAt) { token } }`,
      { apiKeyId: automationKeyId, expiresAt: new Date(Date.now() + 86_400_000).toISOString() },
    );

    automationKey = generated.data?.generateApiKeyToken.token ?? '';
    expect(automationKey.length).toBeGreaterThan(0);
  });

  it('Automation key: reads and writes BD records, deletes nothing', async () => {
    expect(automationKey.length).toBeGreaterThan(0);
    expect(log('key edits an opportunity', await rest(automationKey, 'PATCH', `opportunities/${opportunityId}`, { nextAction: 'Synced' })).allowed).toBe(true);
    expect(log('key deletes an opportunity', await rest(automationKey, 'DELETE', `opportunities/${opportunityId}`)).allowed).toBe(false);

    const [timelineRow] = await list<IdRecord>('timelineActivities', 'id[is]:NOT_NULL');

    expect(log('key destroys a timeline row', await rest(automationKey, 'DELETE', `timelineActivities/${timelineRow!.id}`)).allowed).toBe(false);
  });

  it('a BD officer starts the licence playbook, completes a step and signs; the app writes what the role cannot', async () => {
    const { token } = actor(BD_OFFICER_ROLE_UNIVERSAL_IDENTIFIER);

    expect(log('bd sets the playbook type', await rest(token, 'PATCH', `opportunities/${opportunityId}`, { playbookType: OPPORTUNITY_PLAYBOOK_TYPE.TECHNOLOGY_LICENSING })).allowed).toBe(true);

    const created = await waitFor(
      'W1 work packages',
      () => list<WorkPackage>('workPackages', `opportunityId[eq]:"${opportunityId}"`),
      (workPackages) => workPackages.length === licenceTemplate?.workPackages.length,
    );
    const firstStep = created.find(({ status }) => status === 'OFFERED');

    expect(firstStep).toBeDefined();
    expect(log('bd marks step 1 done', await rest(token, 'PATCH', `workPackages/${firstStep!.id}`, { status: 'DONE' })).allowed).toBe(true);

    const released = await waitFor(
      'W6 releases step 2',
      () => list<WorkPackage>('workPackages', `and(opportunityId[eq]:"${opportunityId}",dependsOnId[eq]:"${firstStep!.id}")`),
      (dependents) => dependents.length > 0 && dependents.every(({ status }) => status === 'OFFERED'),
    );

    expect(released.length).toBeGreaterThan(0);
    expect(log('bd signs the opportunity', await rest(token, 'PATCH', `opportunities/${opportunityId}`, { stage: OPPORTUNITY_STAGE.SIGNED })).allowed).toBe(true);

    const contracts = await waitFor(
      'W7 licence contract',
      () => list<IdRecord>('contracts', `opportunityId[eq]:"${opportunityId}"`),
      (found) => found.length === 1,
    );

    expect(contracts).toHaveLength(1);
    expect((await getOne<{ stageEnteredAt: string | null }>('opportunities', opportunityId)).stageEnteredAt).not.toBeNull();
  });
});
