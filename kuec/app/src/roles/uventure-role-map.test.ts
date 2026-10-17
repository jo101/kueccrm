import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { type defineRole } from 'twenty-sdk/define';
import { beforeAll, describe, expect, it } from 'vitest';

import { loadDefaultExports } from 'src/__tests__/utils/load-default-exports';
import { DEPARTMENT } from 'src/constants/taxonomy';

type RoleDefinition = ReturnType<typeof defineRole>;

type RoleMap = {
  joinKey: string;
  roles: {
    twentyRole: string;
    twentyRoleUniversalIdentifier: string;
    department: string | null;
    uventureRole: string;
    uventureRights: string;
  }[];
  serviceAccounts: { twentyRole: string; twentyRoleUniversalIdentifier: string }[];
};

const ROLE_MAP_PATH = join(__dirname, '..', '..', '..', 'config', 'roles', 'uventure-role-map.json');

describe('uVENTURE role map (kuec/config/roles/uventure-role-map.json)', () => {
  let roles: RoleDefinition['config'][] = [];
  const roleMap = JSON.parse(readFileSync(ROLE_MAP_PATH, 'utf8')) as RoleMap;

  beforeAll(async () => {
    roles = (await loadDefaultExports<RoleDefinition>(__dirname, '.role.ts')).map(
      (definition) => definition.config,
    );
  });

  it('mirrors every role a person can hold, once, under its current label', () => {
    const assignable = roles.filter((role) => role.canBeAssignedToUsers);

    expect(
      roleMap.roles.map((row) => row.twentyRoleUniversalIdentifier).sort(),
    ).toEqual(assignable.map((role) => role.universalIdentifier).sort());

    for (const row of roleMap.roles) {
      const role = assignable.find(
        (candidate) => candidate.universalIdentifier === row.twentyRoleUniversalIdentifier,
      );

      expect(row.twentyRole).toBe(role?.label);
      expect(row.uventureRole.length, row.twentyRole).toBeGreaterThan(0);
      expect(row.uventureRights.length, row.twentyRole).toBeGreaterThan(0);
    }
  });

  it('gives each department role its department value from lookups.json', () => {
    const departments: (string | null)[] = [...Object.values(DEPARTMENT), null];

    for (const row of roleMap.roles) {
      expect(departments, row.twentyRole).toContain(row.department);
    }
  });

  it('lists every API key role as a service account, never as a person', () => {
    const keyRoles = roles.filter((role) => role.canBeAssignedToApiKeys);

    expect(
      roleMap.serviceAccounts.map((row) => row.twentyRoleUniversalIdentifier).sort(),
    ).toEqual(keyRoles.map((role) => role.universalIdentifier).sort());
  });
});
