import { execFileSync } from 'node:child_process';
import {
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { MetadataApiClient } from 'twenty-client-sdk/metadata';
import { appDevOnce, appUninstall } from 'twenty-sdk/cli';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  create,
  getOne,
  list,
  remove,
  update,
} from 'src/__tests__/utils/test-api';
import {
  collectManifestIdentities,
  findNonAdditiveChanges,
} from 'src/__tests__/utils/manifest-identities';
import exceptionsNavigationMenuItem from 'src/navigation-menu-items/exceptions.navigation-menu-item';
import homeNavigationMenuItem from 'src/navigation-menu-items/home.navigation-menu-item';
import myWorkNavigationMenuItem from 'src/navigation-menu-items/my-work.navigation-menu-item';

// v1 is kuec-bd-ops 0.3.0 as merged on main, before the front components.
// The test installs it, writes data with it, then syncs this checkout over it
// the way an upgrade does, and checks nothing was removed or lost.
const V1_GIT_REF = '0ac8b13d746a000dfb415c7de6afa5ebde6bfd4b';

const V2_APP_PATH = process.cwd();
const REPOSITORY_ROOT = resolve(V2_APP_PATH, '..', '..');
const V1_CHECKOUT_PATH = mkdtempSync(join(tmpdir(), 'kuec-v1-'));
const V1_APP_PATH = join(V1_CHECKOUT_PATH, 'kuec', 'app');
const RUN_TAG = `upgrade-${Date.now()}`;
// Two full builds and syncs plus a checkout.
const SETUP_TIMEOUT_MS = 900_000;

type IdRecord = { id: string };
type WorkPackage = IdRecord & {
  name: string;
  status: string;
  ownerId: string | null;
  dueAt: string | null;
  doneCriteria: string | null;
  declinedReason?: string | null;
};
type Opportunity = IdRecord & {
  name: string;
  playbookType: string | null;
  nextAction: string | null;
  nextActionDate: string | null;
  source: string | null;
};

const readManifest = (appPath: string): Record<string, unknown> =>
  JSON.parse(readFileSync(join(appPath, '.twenty', 'output', 'manifest.json'), 'utf8'));

const sync = async (appPath: string, onPlan?: (plan: string) => void) => {
  const result = await appDevOnce({
    appPath,
    onProgress: (message: string) => console.log(`[upgrade] ${message}`),
    onPlan,
  });

  if (!result.success) {
    throw new Error(`Sync of ${appPath} failed: ${result.error.message}`);
  }
};

const createdRecords: { namePlural: string; id: string }[] = [];
let workPackageBefore: WorkPackage;
let opportunityBefore: Opportunity;
let upgradePlan = '';

beforeAll(async () => {
  const archivePath = join(V1_CHECKOUT_PATH, 'v1.tar');

  execFileSync('git', ['-C', REPOSITORY_ROOT, 'archive', '--output', archivePath, V1_GIT_REF, 'kuec']);
  execFileSync('tar', ['-xf', archivePath, '-C', V1_CHECKOUT_PATH]);
  // v1 pins the same SDK version, so it builds with this checkout's dependencies.
  symlinkSync(realpathSync(join(V2_APP_PATH, 'node_modules')), join(V1_APP_PATH, 'node_modules'));

  await appUninstall({ appPath: V2_APP_PATH }).catch(() => undefined);
  await sync(V1_APP_PATH);

  const [member] = await list<IdRecord>('workspaceMembers', 'id[is]:NOT_NULL');

  opportunityBefore = await create<Opportunity>('opportunities', 'opportunity', {
    name: `${RUN_TAG} Masdar: battery thermal test`,
    source: 'INBOUND',
    nextAction: 'Send the quote to Dr. Hamad',
    nextActionDate: '2026-11-02',
  });
  createdRecords.push({ namePlural: 'opportunities', id: opportunityBefore.id });

  workPackageBefore = await create<WorkPackage>('workPackages', 'workPackage', {
    name: `${RUN_TAG} Scoping`,
    status: 'OFFERED',
    ownerId: member?.id ?? null,
    dueAt: '2026-11-05T13:00:00.000Z',
    doneCriteria: 'Scope covers every RFQ requirement.',
    opportunityId: opportunityBefore.id,
  });
  createdRecords.push({ namePlural: 'workPackages', id: workPackageBefore.id });

  // No confirmApply: appDevOnce refuses a plan with any destructive action.
  await sync(V2_APP_PATH, (plan) => {
    upgradePlan = plan;
  });
}, SETUP_TIMEOUT_MS);

afterAll(async () => {
  for (const { namePlural, id } of createdRecords.reverse()) {
    await remove(namePlural, id);
  }

  rmSync(V1_CHECKOUT_PATH, { recursive: true, force: true });
});

describe('v1 to v2 upgrade', () => {
  it('keeps every v1 entity, select option, field name and field type in the v2 manifest', () => {
    const changes = findNonAdditiveChanges(
      collectManifestIdentities(readManifest(V1_APP_PATH)),
      collectManifestIdentities(readManifest(V2_APP_PATH)),
    );

    expect(changes).toEqual([]);
  });

  it('planned additions and changes only, nothing to destroy', () => {
    const plan = upgradePlan.replace(/\u001b\[[0-9;]*m/g, '');

    console.log(`[upgrade] plan:\n${plan}`);

    expect(plan).toMatch(/Plan: [1-9]\d* to add, \d+ to change, 0 to destroy\./);
  });

  it('keeps the data written with v1', async () => {
    expect(await getOne<WorkPackage>('workPackages', workPackageBefore.id)).toMatchObject({
      name: workPackageBefore.name,
      status: workPackageBefore.status,
      ownerId: workPackageBefore.ownerId,
      dueAt: workPackageBefore.dueAt,
      doneCriteria: workPackageBefore.doneCriteria,
    });
    expect(await getOne<Opportunity>('opportunities', opportunityBefore.id)).toMatchObject({
      name: opportunityBefore.name,
      source: opportunityBefore.source,
      nextAction: opportunityBefore.nextAction,
      nextActionDate: opportunityBefore.nextActionDate,
    });
  });

  it('adds the v2 field to records that existed before', async () => {
    await update('workPackages', workPackageBefore.id, {
      declinedReason: 'On leave from 20 Oct',
    });

    expect(
      (await getOne<WorkPackage>('workPackages', workPackageBefore.id)).declinedReason,
    ).toBe('On leave from 20 Oct');
  });

  it('keeps the v1 sidebar and adds Home and Exceptions', async () => {
    const { navigationMenuItems } = await new MetadataApiClient().query({
      navigationMenuItems: { name: true },
    });

    expect(navigationMenuItems.map(({ name }) => name)).toEqual(
      expect.arrayContaining([
        myWorkNavigationMenuItem.config.name,
        homeNavigationMenuItem.config.name,
        exceptionsNavigationMenuItem.config.name,
      ]),
    );
  });
});
