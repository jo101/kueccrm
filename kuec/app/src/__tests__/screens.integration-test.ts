import { CoreApiClient } from 'twenty-client-sdk/core';
import { MetadataApiClient } from 'twenty-client-sdk/metadata';
import { isDefined } from 'twenty-sdk/utils';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  create,
  getOne,
  list,
  remove,
  type SignedInPerson,
  signInForFrontComponent,
} from 'src/__tests__/utils/test-api';
import openWorkPackageCardCommand from 'src/command-menu-items/open-work-package-card.command-menu-item';
import {
  applyCardAction,
  type CardActionInput,
  type CardActionResult,
  loadViewerMember,
} from 'src/front-components/work-package-card/work-package-card-api';
import { CARD_ACTION } from 'src/front-components/work-package-card/work-package-card-rules';
import { WORK_PACKAGE_CARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from 'src/front-components/work-package-card.front-component';
import exceptionsNavigationMenuItem from 'src/navigation-menu-items/exceptions.navigation-menu-item';
import homeNavigationMenuItem from 'src/navigation-menu-items/home.navigation-menu-item';
import { WORK_PACKAGE_STATUS } from 'src/objects/work-package.object';
import { EXCEPTIONS_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER } from 'src/page-layouts/exceptions.page-layout';
import { HOME_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER } from 'src/page-layouts/home.page-layout';
import { WORK_PACKAGE_CARD_WIDGET_UNIVERSAL_IDENTIFIER } from 'src/page-layout-widgets/work-package-card.page-layout-widget';
import { HOME_NEEDS_YOUR_DECISION_VIEW_UNIVERSAL_IDENTIFIER } from 'src/views/home/home-needs-your-decision.view';

// Runs against a disposable instance with the app installed by global-setup.
// The card's own data module is driven with the generated CoreApiClient and the
// token Twenty issues to the card for a signed-in person, so the writes checked
// here are the writes the component sends, with the permissions it has.

type IdRecord = { id: string };
type WorkPackage = IdRecord & {
  status: string;
  ownerId: string | null;
  acceptedAt: string | null;
  declinedReason: string | null;
};
type Task = IdRecord & { title: string; assigneeId: string | null };
type TaskTarget = IdRecord & { taskId: string; targetWorkPackageId: string | null };
type Member = IdRecord & { name: { firstName: string } };

const RUN_TAG = `screens-${Date.now()}`;
const createdRecords: { namePlural: string; id: string }[] = [];

const track = <TRecord extends IdRecord>(namePlural: string, record: TRecord) => {
  createdRecords.push({ namePlural, id: record.id });

  return record;
};

afterAll(async () => {
  for (const { namePlural, id } of createdRecords.reverse()) {
    await remove(namePlural, id);
  }
});

describe('installed surfaces', () => {
  const metadataClient = new MetadataApiClient();

  const loadStandalonePages = async () => {
    const { getPageLayouts } = await metadataClient.query({
      getPageLayouts: {
        __args: { pageLayoutType: 'STANDALONE_PAGE' },
        id: true,
        universalIdentifier: true,
        tabs: {
          title: true,
          layoutMode: true,
          widgets: {
            title: true,
            type: true,
            configuration: {
              on_RecordTableConfiguration: { viewId: true, isUIEditable: true },
            },
          },
        },
      },
    });

    return getPageLayouts;
  };

  it('opens Home and Exceptions from the sidebar, each with three native tables', async () => {
    const pages = await loadStandalonePages();
    const { navigationMenuItems } = await metadataClient.query({
      navigationMenuItems: { name: true, type: true, pageLayoutId: true },
    });

    for (const [pageUniversalIdentifier, itemName, isEditable] of [
      [HOME_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER, homeNavigationMenuItem.config.name, false],
      [EXCEPTIONS_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER, exceptionsNavigationMenuItem.config.name, true],
    ] as const) {
      const page = pages.find(
        ({ universalIdentifier }) => universalIdentifier === pageUniversalIdentifier,
      );

      expect(page, pageUniversalIdentifier).toBeDefined();
      expect(
        navigationMenuItems.find(({ pageLayoutId }) => pageLayoutId === page?.id),
      ).toMatchObject({ name: itemName, type: 'PAGE_LAYOUT' });

      const widgets = page?.tabs?.flatMap((tab) => tab.widgets ?? []) ?? [];

      expect(widgets.map(({ type }) => type)).toEqual([
        'RECORD_TABLE',
        'RECORD_TABLE',
        'RECORD_TABLE',
      ]);

      for (const widget of widgets) {
        expect(widget.configuration, widget.title).toMatchObject({
          isUIEditable: isEditable,
        });
      }
    }
  });

  it('keeps the two filter groups of Needs your decision after install', async () => {
    const pages = await loadStandalonePages();
    const home = pages.find(
      ({ universalIdentifier }) => universalIdentifier === HOME_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
    );
    const decisionsWidget = home?.tabs
      ?.flatMap((tab) => tab.widgets ?? [])
      .find(({ title }) => title === 'Needs your decision');
    const viewId =
      decisionsWidget?.configuration && 'viewId' in decisionsWidget.configuration
        ? decisionsWidget.configuration.viewId
        : undefined;

    expect(viewId).toBeDefined();

    const { getView } = await metadataClient.query({
      getView: {
        __args: { id: String(viewId) },
        universalIdentifier: true,
        viewFilterGroups: { logicalOperator: true, parentViewFilterGroupId: true },
        viewFilters: { operand: true },
      },
    });

    expect(getView?.universalIdentifier).toBe(HOME_NEEDS_YOUR_DECISION_VIEW_UNIVERSAL_IDENTIFIER);
    expect(
      (getView?.viewFilterGroups ?? []).map(({ logicalOperator }) => logicalOperator).sort(),
    ).toEqual(['AND', 'AND', 'OR']);
    expect(getView?.viewFilters).toHaveLength(3);
  });

  it('offers the card on work package record pages and as a record-selection command', async () => {
    const { frontComponents, commandMenuItems } = await metadataClient.query({
      frontComponents: {
        id: true,
        universalIdentifier: true,
        isHeadless: true,
        widgetAvailability: { pageLayoutType: true, objectMetadataId: true },
      },
      commandMenuItems: {
        label: true,
        availabilityType: true,
        frontComponentId: true,
      },
    });
    const card = frontComponents.find(
      ({ universalIdentifier }) =>
        universalIdentifier === WORK_PACKAGE_CARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
    );

    expect(card?.isHeadless).toBe(false);
    expect(card?.widgetAvailability).toHaveLength(1);
    expect(card?.widgetAvailability[0]).toMatchObject({ pageLayoutType: 'RECORD_PAGE' });
    // The metadata API does not expose a command's universalIdentifier.
    expect(
      commandMenuItems.filter(({ frontComponentId }) => frontComponentId === card?.id),
    ).toEqual([
      {
        label: openWorkPackageCardCommand.config.label,
        availabilityType: 'RECORD_SELECTION',
        frontComponentId: card?.id,
      },
    ]);

    const { getPageLayouts } = await metadataClient.query({
      getPageLayouts: {
        __args: { pageLayoutType: 'RECORD_PAGE' },
        tabs: {
          title: true,
          widgets: {
            universalIdentifier: true,
            configuration: {
              on_FrontComponentConfiguration: { frontComponentId: true },
            },
          },
        },
      },
    });
    const cardWidget = getPageLayouts
      .flatMap((layout) => layout.tabs ?? [])
      .flatMap((tab) => (tab.widgets ?? []).map((widget) => ({ tab: tab.title, widget })))
      .find(
        ({ widget }) => widget.universalIdentifier === WORK_PACKAGE_CARD_WIDGET_UNIVERSAL_IDENTIFIER,
      );

    expect(cardWidget?.tab).toBe('Home');
    expect(cardWidget?.widget.configuration).toMatchObject({ frontComponentId: card?.id });
  });
});

describe('work package card writes', () => {
  let person: SignedInPerson;
  let client: CoreApiClient;
  let owner: { id: string; firstName: string };
  let opsCoordinator: { id: string; firstName: string };

  beforeAll(async () => {
    person = await signInForFrontComponent(WORK_PACKAGE_CARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER);
    client = new CoreApiClient({
      headers: { Authorization: `Bearer ${person.frontComponentAccessToken}` },
    });
    owner = person.member;

    const helper = (await list<Member>('workspaceMembers', 'id[is]:NOT_NULL')).find(
      ({ id }) => id !== owner.id,
    );

    if (!isDefined(helper)) {
      throw new Error('The test workspace needs a second member to act as ops coordinator');
    }

    opsCoordinator = { id: helper.id, firstName: helper.name.firstName };

    track(
      'playbookRoleAssignments',
      await create<IdRecord>('playbookRoleAssignments', 'playbookRoleAssignment', {
        name: `${RUN_TAG} OPS_COORDINATOR`,
        playbookRole: 'OPS_COORDINATOR',
        memberId: opsCoordinator.id,
        isActive: true,
      }),
    );
  });

  it('finds the signed-in person behind the user id the host gives the card', async () => {
    expect(await loadViewerMember(client, person.userId)).toEqual(owner);
  });

  const createWorkPackage = async (status: string) =>
    track(
      'workPackages',
      await create<WorkPackage>('workPackages', 'workPackage', {
        name: `${RUN_TAG} Scoping`,
        status,
        ownerId: owner.id,
        dueAt: new Date(Date.now() + 3 * 86_400_000).toISOString(),
        doneCriteria: 'Scope covers every RFQ requirement.',
      }),
    );

  const apply = (workPackageId: string, input: CardActionInput): Promise<CardActionResult> =>
    applyCardAction({ client, workPackageId, viewer: owner, input, now: new Date() });

  it('Accept sets status Accepted and acceptedAt', async () => {
    const workPackage = await createWorkPackage(WORK_PACKAGE_STATUS.OFFERED);

    expect((await apply(workPackage.id, { action: CARD_ACTION.ACCEPT })).outcome).toBe('APPLIED');

    const after = await getOne<WorkPackage>('workPackages', workPackage.id);

    expect(after.status).toBe(WORK_PACKAGE_STATUS.ACCEPTED);
    expect(after.acceptedAt).not.toBeNull();
    expect(after.ownerId).toBe(owner.id);
  });

  it('Decline sets status Declined with the typed reason', async () => {
    const workPackage = await createWorkPackage(WORK_PACKAGE_STATUS.OFFERED);

    await apply(workPackage.id, {
      action: CARD_ACTION.DECLINE,
      reason: 'On leave from 20 Oct',
    });

    expect(await getOne<WorkPackage>('workPackages', workPackage.id)).toMatchObject({
      status: WORK_PACKAGE_STATUS.DECLINED,
      declinedReason: 'On leave from 20 Oct',
      ownerId: owner.id,
    });
  });

  it('Request help creates one task for the ops coordinator, linked to the work package, and keeps the owner', async () => {
    const workPackage = await createWorkPackage(WORK_PACKAGE_STATUS.ACCEPTED);

    await apply(workPackage.id, {
      action: CARD_ACTION.REQUEST_HELP,
      question: 'Which spectrometer can we book in November?',
      helper: opsCoordinator,
    });

    const targets = await list<TaskTarget>(
      'taskTargets',
      `targetWorkPackageId[eq]:"${workPackage.id}"`,
    );

    expect(targets).toHaveLength(1);

    const task = track('tasks', await getOne<Task>('tasks', targets[0]!.taskId));

    expect(task).toMatchObject({
      title: `Help needed: ${RUN_TAG} Scoping`,
      assigneeId: opsCoordinator.id,
    });
    expect(await getOne<WorkPackage>('workPackages', workPackage.id)).toMatchObject({
      status: WORK_PACKAGE_STATUS.ACCEPTED,
      ownerId: owner.id,
    });
  });

  it('Submit sets status Submitted', async () => {
    const workPackage = await createWorkPackage(WORK_PACKAGE_STATUS.ACCEPTED);

    await apply(workPackage.id, { action: CARD_ACTION.SUBMIT });

    expect((await getOne<WorkPackage>('workPackages', workPackage.id)).status).toBe(
      WORK_PACKAGE_STATUS.SUBMITTED,
    );
  });

  it('writes nothing when the work package moved on since the card was shown', async () => {
    const workPackage = await createWorkPackage(WORK_PACKAGE_STATUS.DONE);

    const result = await apply(workPackage.id, { action: CARD_ACTION.ACCEPT });
    const after = await getOne<WorkPackage>('workPackages', workPackage.id);

    expect(result.outcome).toBe('CONFLICT');
    expect(after.status).toBe(WORK_PACKAGE_STATUS.DONE);
    expect(isDefined(after.acceptedAt)).toBe(false);
  });
});
