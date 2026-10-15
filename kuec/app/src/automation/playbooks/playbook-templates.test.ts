import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  findOpportunityPlaybook,
  findProjectTemplate,
  listCaseTemplateKeys,
} from 'src/automation/playbooks/playbook-templates';
import { PROJECT_TYPE } from 'src/objects/project.object';
import { PLAYBOOK_ROLE } from 'src/objects/playbook-role-assignment.object';
import { OPPORTUNITY_PLAYBOOK_TYPE } from 'src/fields/playbook-type-on-opportunity.field';

const SOURCE_DIRECTORY = join(process.cwd(), '..', 'playbooks');
const BUNDLED_DIRECTORY = join(process.cwd(), 'src', 'playbooks');

describe('bundled playbooks', () => {
  it('match kuec/playbooks byte for byte (run yarn playbooks:sync)', () => {
    const sourceFiles = readdirSync(SOURCE_DIRECTORY).filter((fileName) =>
      fileName.endsWith('.json'),
    );

    expect(sourceFiles.length).toBeGreaterThan(0);

    for (const fileName of sourceFiles) {
      expect(readFileSync(join(BUNDLED_DIRECTORY, fileName), 'utf8')).toBe(
        readFileSync(join(SOURCE_DIRECTORY, fileName), 'utf8'),
      );
    }
  });

  it('have a template for every opportunity and project type', () => {
    for (const key of Object.values(OPPORTUNITY_PLAYBOOK_TYPE)) {
      expect(findOpportunityPlaybook(key)).not.toBeNull();
    }

    for (const key of Object.values(PROJECT_TYPE)) {
      expect(findProjectTemplate(key)?.workPackages.length).toBeGreaterThan(0);
    }
  });

  it('only use known roles and close milestones with existing steps', () => {
    const knownRoles: string[] = Object.values(PLAYBOOK_ROLE);

    for (const key of listCaseTemplateKeys()) {
      const template = findOpportunityPlaybook(key) ?? findProjectTemplate(key);

      for (const workPackage of template?.workPackages ?? []) {
        expect(knownRoles).toContain(workPackage.ownerRole);
      }

      for (const milestone of template?.milestones ?? []) {
        expect(
          template?.workPackages.map((workPackage) => workPackage.key),
        ).toContain(milestone.closedByWorkPackage);
      }
    }
  });
});

describe('runtime constants', () => {
  it('match the standard object identifiers the manifest uses', async () => {
    const { STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS } = await import('twenty-sdk/define');
    const { OPPORTUNITY_OBJECT_UNIVERSAL_IDENTIFIER } = await import(
      'src/constants/standard-object-universal-identifiers'
    );

    expect(OPPORTUNITY_OBJECT_UNIVERSAL_IDENTIFIER).toBe(
      STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity.universalIdentifier,
    );
  });
});
