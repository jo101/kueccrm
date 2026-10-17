import {
  type defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewType,
} from 'twenty-sdk/define';
import { beforeAll, describe, expect, it } from 'vitest';

import { loadDefaultExports } from 'src/__tests__/utils/load-default-exports';
import { OPPORTUNITY_STAGE } from 'src/constants/opportunity-stage';
import { OWNER_ON_CONTRACT_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/owner-on-contract.field';
import { OWNER_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/owner-on-document.field';
import { OWNER_ON_ENGAGEMENT_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/owner-on-engagement.field';
import { OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/owner-on-lead.field';
import { OWNER_ON_MILESTONE_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/owner-on-milestone.field';
import { OWNER_ON_PROJECT_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/owner-on-project.field';
import { OWNER_ON_WORK_PACKAGE_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/owner-on-work-package.field';
import { CAMPAIGN_ON_CAMPAIGN_TARGET_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/campaign-on-campaign-target.field';
import {
  CAMPAIGN_TARGET_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  CAMPAIGN_TARGET_UNIVERSAL_IDENTIFIER,
} from 'src/objects/campaign-target.object';
import {
  CAPABILITY_KIND_FIELD_UNIVERSAL_IDENTIFIER,
  CAPABILITY_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  CAPABILITY_UNIVERSAL_IDENTIFIER,
} from 'src/objects/capability.object';
import {
  CONTRACT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  CONTRACT_UNIVERSAL_IDENTIFIER,
} from 'src/objects/contract.object';
import {
  DOCUMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  DOCUMENT_UNIVERSAL_IDENTIFIER,
} from 'src/objects/document.object';
import {
  ENGAGEMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  ENGAGEMENT_UNIVERSAL_IDENTIFIER,
} from 'src/objects/engagement.object';
import {
  LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  LEAD_UNIVERSAL_IDENTIFIER,
} from 'src/objects/lead.object';
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
const task = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.task;

// Twenty's own Tasks page lists tasks; the app adds only a hygiene view.
const OBJECTS_WITHOUT_EXPERT_VIEW: string[] = [task.universalIdentifier];

// Lost and Parked opportunities are kept, never deleted, and stay out of every
// opportunity view except the ones that exist to list them (runbooks/14-hygiene.md).
const RETAINED_STAGES: string[] = [OPPORTUNITY_STAGE.LOST, OPPORTUNITY_STAGE.PARKED];
const VIEWS_LISTING_RETAINED_STAGES = [
  'Lost with reasons',
  'Parked',
  'Hygiene: Parked over 90 days',
  EXPERT_VIEW_NAME,
];

// People have no owner of their own, so their company stands in as the second
// column; tasks have an assignee instead. Capabilities are uVENTURE's, so their
// kind stands in; a campaign target is worked by its campaign's owner.
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
  [task.universalIdentifier]: {
    name: task.fields.title.universalIdentifier,
    owner: task.fields.assignee.universalIdentifier,
  },
  [LEAD_UNIVERSAL_IDENTIFIER]: {
    name: LEAD_NAME_FIELD_UNIVERSAL_IDENTIFIER,
    owner: OWNER_ON_LEAD_FIELD_UNIVERSAL_IDENTIFIER,
  },
  [DOCUMENT_UNIVERSAL_IDENTIFIER]: {
    name: DOCUMENT_NAME_FIELD_UNIVERSAL_IDENTIFIER,
    owner: OWNER_ON_DOCUMENT_FIELD_UNIVERSAL_IDENTIFIER,
  },
  [CAPABILITY_UNIVERSAL_IDENTIFIER]: {
    name: CAPABILITY_NAME_FIELD_UNIVERSAL_IDENTIFIER,
    owner: CAPABILITY_KIND_FIELD_UNIVERSAL_IDENTIFIER,
  },
  [CAMPAIGN_TARGET_UNIVERSAL_IDENTIFIER]: {
    name: CAMPAIGN_TARGET_NAME_FIELD_UNIVERSAL_IDENTIFIER,
    owner: CAMPAIGN_ON_CAMPAIGN_TARGET_FIELD_UNIVERSAL_IDENTIFIER,
  },
};

const loadViews = async (): Promise<ViewDefinition[]> => {
  return loadDefaultExports<ViewDefinition>(__dirname, '.view.ts');
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
    ).filter((key) => !OBJECTS_WITHOUT_EXPERT_VIEW.includes(key))) {
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

  it('keep Lost and Parked opportunities out, except the views that list them', () => {
    const stageField = opportunity.fields.stage.universalIdentifier;
    const opportunityViews = views.filter(
      (view) =>
        view.config.objectUniversalIdentifier === opportunity.universalIdentifier &&
        !VIEWS_LISTING_RETAINED_STAGES.includes(view.config.name),
    );

    expect(opportunityViews.length).toBeGreaterThan(0);

    for (const view of opportunityViews) {
      const excludedByFilter = (view.config.filters ?? []).some((filter) => {
        if (
          filter.fieldMetadataUniversalIdentifier !== stageField ||
          filter.viewFilterGroupUniversalIdentifier !== undefined ||
          !Array.isArray(filter.value)
        ) {
          return false;
        }

        const stages: string[] = filter.value;

        return filter.operand === 'IS_NOT'
          ? RETAINED_STAGES.every((stage) => stages.includes(stage))
          : filter.operand === 'IS' &&
              RETAINED_STAGES.every((stage) => !stages.includes(stage));
      });
      const hiddenColumns = (view.config.groups ?? [])
        .filter((group) => !group.isVisible)
        .map((group) => group.fieldValue);
      const excludedByHiddenColumns =
        view.config.mainGroupByFieldMetadataUniversalIdentifier === stageField &&
        RETAINED_STAGES.every((stage) => hiddenColumns.includes(stage));

      expect(excludedByFilter || excludedByHiddenColumns, view.config.name).toBe(true);
    }
  });

  it('have names unique within their object', () => {
    const keys = views.map(
      (view) => `${view.config.objectUniversalIdentifier}:${view.config.name}`,
    );

    expect(new Set(keys).size).toBe(keys.length);
  });
});
