import { describe, expect, it } from 'vitest';

import {
  CLOSED_OPPORTUNITY_STAGES,
  OPPORTUNITY_STAGE,
} from 'src/constants/opportunity-stage';
import { DECISION_ROLE } from 'src/fields/decision-role-on-person.field';
import { OPPORTUNITY_PLAYBOOK_TYPE } from 'src/fields/playbook-type-on-opportunity.field';
import { OPPORTUNITY_PROBABILITY } from 'src/fields/probability-on-opportunity.field';
import { COMPANY_SECTOR } from 'src/fields/sector-on-company.field';
import { OPPORTUNITY_SOURCE } from 'src/fields/source-on-opportunity.field';
import { CONTRACT_KIND, CONTRACT_STATUS } from 'src/objects/contract.object';
import { MILESTONE_STATUS } from 'src/objects/milestone.object';
import { PROJECT_STATUS, PROJECT_TYPE } from 'src/objects/project.object';
import {
  CLOSED_STAGES,
  TARGET_SELECT_VALUES,
  VALUE_SYNONYMS,
} from '~/scripts/import/target-values';

// scripts/import runs without the app's dependencies, so it carries its own
// copy of the select values. This keeps the copy equal to the manifest.
describe('import target values', () => {
  it('match the select options of the manifest', () => {
    expect(TARGET_SELECT_VALUES).toEqual({
      sector: Object.values(COMPANY_SECTOR),
      decisionRole: Object.values(DECISION_ROLE),
      stage: Object.values(OPPORTUNITY_STAGE).filter(
        (stage) => stage !== OPPORTUNITY_STAGE.CUSTOMER,
      ),
      opportunityType: Object.values(OPPORTUNITY_PLAYBOOK_TYPE),
      opportunitySource: Object.values(OPPORTUNITY_SOURCE),
      probability: Object.values(OPPORTUNITY_PROBABILITY),
      projectType: Object.values(PROJECT_TYPE),
      projectStatus: Object.values(PROJECT_STATUS),
      milestoneStatus: Object.values(MILESTONE_STATUS),
      contractKind: Object.values(CONTRACT_KIND),
      contractStatus: Object.values(CONTRACT_STATUS),
    });
  });

  it('treat the same stages as closed as the automation does', () => {
    expect(CLOSED_STAGES).toEqual(CLOSED_OPPORTUNITY_STAGES);
  });

  it('only map synonyms to existing options', () => {
    for (const [field, synonyms] of Object.entries(VALUE_SYNONYMS)) {
      const allowedValues: readonly string[] =
        TARGET_SELECT_VALUES[field as keyof typeof TARGET_SELECT_VALUES];

      for (const value of Object.values(synonyms)) {
        expect(allowedValues).toContain(value);
      }
    }
  });
});
