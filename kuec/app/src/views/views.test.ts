import { readdirSync } from 'node:fs';
import { join } from 'node:path';

import {
  type defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewType,
} from 'twenty-sdk/define';
import { beforeAll, describe, expect, it } from 'vitest';

import { OWNER_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/owner-on-contract.field';
import { OWNER_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/owner-on-engagement.field';
import { OWNER_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/owner-on-milestone.field';
import { OWNER_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/owner-on-project.field';
import { OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/owner-on-work-package.field';
import {
  CONTRACT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  CONTRACT_UNIVERSAL_IDENTIFIER,
} from 'src/objects/contract.object';
import {
  ENGAGEMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_UNIVERSAL_IDENTIFIER,
} from 'src/objects/engagement.object';
import {
  MILESTONE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  MILESTONE_UNIVERSAL_IDENTIFIER,
} from 'src/objects/milestone.object';
import {
  PROJECT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  PROJECT_UNIVERSAL_IDENTIFIER,
} from 'src/objects/project.object';
import {
  WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
} from 'src/objects/work-package.object';

type ViewDefinition = ReturnType<typeof defineView>;

const EXPERT_VIEW_NAME = 'Everything (expert)';
const MAX_VISIBLE_COLUMNS = 6;
const ALLOWED_VIEW_TYPES: (ViewType | undefined)[] = [
  ViewType.TABLE,
  ViewType.KANBAN,
  ViewType.CALENDAR,
];

const opportunity = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity;
const company = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company;
const person = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person;

// People have no owner of their own, so their company stands in as the second column.
const LEADING_COLUMNS_BY_OBJECT: Record<string, { name: string; owner: string }> = {
  [WORK_PACKAGE_UNIVERSAL_IDENTIFIER]: {
    name: WORK_PACKAGE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
    owner: OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER,
  },
  [opportunity.universalIdentifier]: {
    name: opportunity.fields.name.universalIdentifier,
    owner: opportunity.fields.owner.universalIdentifier,
  },
  [PROJECT_UNIVERSAL_IDENTIFIER]: {
    name: PROJECT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
    owner: OWNER_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER,
  },
  [MILESTONE_UNIVERSAL_IDENTIFIER]: {
    name: MILESTONE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
    owner: OWNER_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER,
  },
  [ENGAGEMENT_UNIVERSAL_IDENTIFIER]: {
    name: ENGAGEMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
    owner: OWNER_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER,
  },
  [company.universalIdentifier]: {
    name: company.fields.name.universalIdentifier,
    owner: company.fields.accountOwner.universalIdentifier,
  },
  [person.universalIdentifier]: {
    name: person.fields.name.universalIdentifier,
    owner: person.fields.company.universalIdentifier,
  },
  [CONTRACT_UNIVERSAL_IDENTIFIER]: {
    name: CONTRACT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
    owner: OWNER_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER,
  },
};

const loadViews = async (): Promise<ViewDefinition[]> => {
  const viewFileNames = readdirSync(__dirname).filter((fileName) =>
    fileName.endsWith('.view.ts'),
  );

  const viewModules = await Promise.all(
    viewFileNames.map(
      (fileName) =>
        import(join(__dirname, fileName)) as Promise<{ default: ViewDefinition }>,
    ),
  );

  return viewModules.map((viewModule) => viewModule.default);
};

const getColumnsInOrder = (view: ViewDefinition) =>
  [...(view.config.fields ?? [])].sort(
    (left, right) => left.position - right.position,
  );

describe('views', () => {
  let views: ViewDefinition[] = [];

  beforeAll(async () => {
    views = await loadViews();
  });

  it('are valid manifest entities with a table, kanban or calendar layout', () => {
    expect(views.length).toBeGreaterThan(0);

    for (const view of views) {
      expect(view.errors, view.config.name).toEqual([]);
      expect(ALLOWED_VIEW_TYPES, view.config.name).toContain(view.config.type);
    }
  });

  it('show at most six columns, except the expert views', () => {
    for (const view of views.filter(
      (view) => view.config.name !== EXPERT_VIEW_NAME,
    )) {
      const visibleColumns = getColumnsInOrder(view).filter(
        (column) => column.isVisible !== false,
      );

      expect(visibleColumns.length, view.config.name).toBeLessThanOrEqual(
        MAX_VISIBLE_COLUMNS,
      );
    }
  });

  it('lead with the record name, then the owner', () => {
    for (const view of views) {
      const expected =
        LEADING_COLUMNS_BY_OBJECT[view.config.objectUniversalIdentifier];
      const [firstColumn, secondColumn] = getColumnsInOrder(view);

      expect(firstColumn?.fieldMetadataUniversalIdentifier, view.config.name).toBe(
        expected.name,
      );
      expect(secondColumn?.fieldMetadataUniversalIdentifier, view.config.name).toBe(
        expected.owner,
      );
    }
  });

  it('sort on the third column, the date that matters', () => {
    for (const view of views.filter(
      (view) => (view.config.sorts ?? []).length > 0,
    )) {
      const thirdColumn = getColumnsInOrder(view)[2];

      expect(
        view.config.sorts?.[0].fieldMetadataUniversalIdentifier,
        view.config.name,
      ).toBe(thirdColumn?.fieldMetadataUniversalIdentifier);
    }
  });

  it('give every object exactly one expert view, wider than the cap', () => {
    for (const objectUniversalIdentifier of Object.keys(
      LEADING_COLUMNS_BY_OBJECT,
    )) {
      const expertViews = views.filter(
        (view) =>
          view.config.objectUniversalIdentifier === objectUniversalIdentifier &&
          view.config.name === EXPERT_VIEW_NAME,
      );

      expect(expertViews).toHaveLength(1);
      expect(expertViews[0].config.fields?.length).toBeGreaterThan(
        MAX_VISIBLE_COLUMNS,
      );
    }
  });

  it('have names unique within their object', () => {
    const keys = views.map(
      (view) => `${view.config.objectUniversalIdentifier}:${view.config.name}`,
    );

    expect(new Set(keys).size).toBe(keys.length);
  });
});
