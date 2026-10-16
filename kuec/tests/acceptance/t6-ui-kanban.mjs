// T6 (UI half): signed in as a user whose role makes Work package > Status
// read-only, try to change the status of someone else's work package on the
// record page, in the table and by dragging the card in the By status kanban.
// Each attempt is followed by an API read of the stored status. Screenshots go
// to EVIDENCE_DIR. Test instances only.
//
// Usage: node t6-ui-kanban.mjs   (run with @playwright/test resolvable)
// Env: API_URL, FRONT_URL, ADMIN_TOKEN (a signed-in admin), API_KEY,
//      ACTOR_EMAIL, ACTOR_PASSWORD, EVIDENCE_DIR, PLAYWRIGHT_CHROMIUM
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { chromium } from '@playwright/test';

const API_URL = process.env.API_URL ?? 'http://localhost:3000';
const FRONT_URL = process.env.FRONT_URL ?? 'http://localhost:3001';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
const API_KEY = process.env.API_KEY;
const ACTOR_EMAIL = process.env.ACTOR_EMAIL ?? 'phil.schiler@apple.dev';
const ACTOR_PASSWORD = process.env.ACTOR_PASSWORD ?? 'tim@apple.dev';
const EVIDENCE_DIR = process.env.EVIDENCE_DIR ?? '.';
const RUN_TAG = `t6ui-${Date.now()}`;

mkdirSync(EVIDENCE_DIR, { recursive: true });

const metadata = async (query, variables = {}) => {
  const response = await fetch(`${API_URL}/metadata`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ADMIN_TOKEN}` },
    body: JSON.stringify({ query, variables }),
  });
  const body = await response.json();

  if (body.errors) {
    throw new Error(`${query.slice(0, 60)}: ${JSON.stringify(body.errors)}`);
  }

  return body.data;
};

const rest = async (method, path, body) => {
  const response = await fetch(`${API_URL}/rest/${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  return response.json();
};

const storedStatus = async (id) => (await rest('GET', `workPackages/${id}`)).data.workPackage.status;

const outcomes = [];
const record = async (surface, attempt, workPackageId, detail) => {
  const status = await storedStatus(workPackageId);
  const outcome = { surface, attempt, storedStatusAfter: status, ...detail };

  outcomes.push(outcome);
  console.log(`[t6-ui] ${JSON.stringify(outcome)}`);
};

const { objects } = await metadata(
  '{ objects(paging: { first: 200 }) { edges { node { id nameSingular fieldsList { id name } } } } }',
);
const workPackageObject = objects.edges.find(({ node }) => node.nameSingular === 'workPackage').node;
const statusField = workPackageObject.fieldsList.find(({ name }) => name === 'status');
const { getRoles } = await metadata('{ getRoles { id label } }');
const memberRoleId = getRoles.find(({ label }) => label === 'Member').id;
const members = (await rest('GET', `workspaceMembers?filter=userEmail%5Bin%5D%3A%5B%22tim%40apple.dev%22%2C%22${encodeURIComponent(ACTOR_EMAIL)}%22%5D`)).data.workspaceMembers;
const ownerId = members.find(({ userEmail }) => userEmail === 'tim@apple.dev').id;
const actorId = members.find(({ userEmail }) => userEmail === ACTOR_EMAIL).id;

const { createOneRole } = await metadata(
  'mutation($input: CreateRoleInput!) { createOneRole(createRoleInput: $input) { id } }',
  {
    input: {
      label: `${RUN_TAG} BD staff`,
      description: 'T6 UI: Member rights with Work package > Status read-only',
      canUpdateAllSettings: false,
      canReadAllObjectRecords: true,
      canUpdateAllObjectRecords: true,
      canSoftDeleteAllObjectRecords: true,
      canDestroyAllObjectRecords: false,
      canBeAssignedToUsers: true,
    },
  },
);
const roleId = createOneRole.id;

await metadata(
  'mutation($input: UpsertFieldPermissionsInput!) { upsertFieldPermissions(upsertFieldPermissionsInput: $input) { id } }',
  {
    input: {
      roleId,
      fieldPermissions: [
        { objectMetadataId: workPackageObject.id, fieldMetadataId: statusField.id, canUpdateFieldValue: false },
      ],
    },
  },
);
await metadata(
  'mutation($workspaceMemberId: UUID!, $roleId: UUID!) { updateWorkspaceMemberRole(workspaceMemberId: $workspaceMemberId, roleId: $roleId) { id } }',
  { workspaceMemberId: actorId, roleId },
);

const others = (
  await rest('POST', 'workPackages', {
    name: `${RUN_TAG} Someone else's step`,
    status: 'OFFERED',
    ownerId,
    dueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    doneCriteria: 'T6 UI',
  })
).data.createWorkPackage;

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

// A dev front end compiles on first load.
page.setDefaultNavigationTimeout(300_000);
page.setDefaultTimeout(60_000);
const shot = (name) => page.screenshot({ path: join(EVIDENCE_DIR, `t6-${name}.png`) });
const toasts = async () =>
  (await page.locator('[role="alert"], [data-sonner-toast], .Toastify__toast').allInnerTexts()).join(' | ');

try {
  await page.goto(FRONT_URL, { waitUntil: 'domcontentloaded' });
  const emailField = page.getByPlaceholder('Email');

  await emailField.or(page.getByRole('button', { name: 'Continue with Email' })).first().waitFor();
  if (!(await emailField.isVisible())) {
    await page.getByRole('button', { name: 'Continue with Email' }).click();
  }
  await emailField.fill(ACTOR_EMAIL);
  await page.getByRole('button', { name: /^Continue(,|$)/ }).click();
  await page.getByPlaceholder('Password').fill(ACTOR_PASSWORD);
  await page.getByRole('button', { name: /^Sign in|^Continue(,|$)/ }).click();
  await page.waitForURL((url) => !url.pathname.includes('welcome') && !url.pathname.includes('verify'), { timeout: 60_000 });
  await page.waitForTimeout(5_000);
  await shot('0-signed-in');

  // Record page
  await page.goto(`${FRONT_URL}/object/workPackage/${others.id}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(8_000);
  await shot('1-record-page');
  const statusChip = page.getByText('Offered', { exact: true }).first();
  await statusChip.click({ timeout: 10_000 }).catch(() => undefined);
  await page.waitForTimeout(1_500);
  const doneOption = page.getByRole('option', { name: 'Done' }).or(page.getByText('Done', { exact: true }));
  const optionVisible = await doneOption.first().isVisible().catch(() => false);
  if (optionVisible) {
    await doneOption.first().click();
    await page.waitForTimeout(2_000);
  }
  await shot('2-record-page-after-click');
  await record('record page', 'click the Status value, pick Done', others.id, { dropdownOpened: optionVisible, toasts: await toasts() });
  await page.keyboard.press('Escape');

  // Kanban
  const { views } = await fetch(`${API_URL}/metadata`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ADMIN_TOKEN}` },
    body: JSON.stringify({ query: `{ getViews(objectMetadataId: "${workPackageObject.id}") { id name type } }` }),
  }).then((response) => response.json()).then((body) => ({ views: body.data?.getViews ?? [] }));
  const kanbanView = views.find(({ name, type }) => name === 'By status' && type === 'KANBAN');

  await page.goto(`${FRONT_URL}/objects/workPackages${kanbanView ? `?viewId=${kanbanView.id}` : ''}`, { waitUntil: 'domcontentloaded' });
  const card = page.getByText(others.name, { exact: true }).first();

  await card.waitFor({ timeout: 240_000 }).catch(() => undefined);
  await shot('3-kanban');
  const doneColumn = page.getByText('Done', { exact: true }).last();

  await doneColumn.waitFor({ timeout: 60_000 }).catch(() => undefined);
  const cardBox = await card.boundingBox().catch(() => null);
  const columnBox = await doneColumn.boundingBox().catch(() => null);

  if (cardBox && columnBox) {
    await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
    await page.mouse.down();
    for (let step = 1; step <= 20; step += 1) {
      await page.mouse.move(
        cardBox.x + ((columnBox.x + 40 - cardBox.x) * step) / 20,
        cardBox.y + ((columnBox.y + 120 - cardBox.y) * step) / 20,
      );
      await page.waitForTimeout(50);
    }
    await page.mouse.up();
    await page.waitForTimeout(3_000);
  }
  await shot('4-kanban-after-drag');
  await record('kanban By status', 'drag the card from Offered to Done', others.id, {
    kanbanViewFound: kanbanView !== undefined,
    cardFound: cardBox !== null,
    doneColumnFound: columnBox !== null,
    cardColumnOnScreenAfterDrag: await page.getByText(others.name, { exact: true }).first().boundingBox().then((box) => (box && columnBox && Math.abs(box.x - columnBox.x) < 200 ? 'Done' : 'not Done')).catch(() => 'unknown'),
    toasts: await toasts(),
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByText(others.name, { exact: true }).first().waitFor({ timeout: 240_000 }).catch(() => undefined);
  await page.waitForTimeout(2_000);
  await shot('4b-kanban-after-reload');
  outcomes.push({
    surface: 'kanban By status',
    attempt: 'reload after the refused drag',
    cardColumnOnScreen: await page.getByText(others.name, { exact: true }).first().boundingBox().then((box) => (box && columnBox && Math.abs(box.x - columnBox.x) < 200 ? 'Done' : 'not Done')).catch(() => 'unknown'),
  });

  // Table: the Everything view
  const tableView = views.find(({ name, type }) => name.startsWith('Everything') && type === 'TABLE');

  await page.goto(`${FRONT_URL}/objects/workPackages${tableView ? `?viewId=${tableView.id}` : ''}`, { waitUntil: 'domcontentloaded' });
  await page.getByText(others.name, { exact: true }).first().waitFor({ timeout: 240_000 }).catch(() => undefined);
  await page.waitForTimeout(2_000);
  await shot('5-table');
  // The view lists this work package only, so its Status cell is the one Offered chip.
  const rowStatus = page.getByText('Offered', { exact: true }).first();
  const rowVisible = await rowStatus.isVisible().catch(() => false);
  if (rowVisible) {
    await rowStatus.click();
    await page.waitForTimeout(1_500);
  }
  await shot('5b-table-after-cell-click');
  const tableOption = page.getByRole('option', { name: 'Done' })
    .or(page.getByRole('menuitem', { name: 'Done' }))
    .or(page.getByText('Done', { exact: true }));
  const tableOptionVisible = await tableOption.first().isVisible().catch(() => false);
  if (tableOptionVisible) {
    await tableOption.first().click();
    await page.waitForTimeout(2_000);
  }
  await shot('6-table-after-click');
  await record('table', 'click the Status cell, pick Done', others.id, { rowFound: rowVisible, dropdownOpened: tableOptionVisible, toasts: await toasts() });

} finally {
  writeFileSync(join(EVIDENCE_DIR, 't6-ui-outcomes.json'), JSON.stringify(outcomes, null, 2));
  await browser.close();
  await metadata(
    'mutation($workspaceMemberId: UUID!, $roleId: UUID!) { updateWorkspaceMemberRole(workspaceMemberId: $workspaceMemberId, roleId: $roleId) { id } }',
    { workspaceMemberId: actorId, roleId: memberRoleId },
  );
  await metadata('mutation($roleId: UUID!) { deleteOneRole(roleId: $roleId) }', { roleId });
  await rest('DELETE', `workPackages/${others.id}`);
}
