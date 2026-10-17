import { readdirSync } from 'node:fs';
import { join } from 'node:path';

import { isObject } from '@sniptt/guards';
import {
  type defineField,
  type defineObject,
  type defineRole,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  SystemPermissionFlag,
} from 'twenty-sdk/define';
import { beforeAll, describe, expect, it } from 'vitest';

import { CONTRACT_UNIVERSAL_IDENTIFIER } from 'src/objects/contract.object';
import { DOCUMENT_UNIVERSAL_IDENTIFIER } from 'src/objects/document.object';
import { ENGAGEMENT_UNIVERSAL_IDENTIFIER } from 'src/objects/engagement.object';
import { LEAD_UNIVERSAL_IDENTIFIER } from 'src/objects/lead.object';
import { MILESTONE_UNIVERSAL_IDENTIFIER } from 'src/objects/milestone.object';
import { PROJECT_UNIVERSAL_IDENTIFIER } from 'src/objects/project.object';
import {
  WORK_PACKAGE_ACCEPTED_AT_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_BLOCKED_REASON_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_DECLINED_REASON_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
} from 'src/objects/work-package.object';
import { AUTOMATION_ROLE_UNIVERSAL_IDENTIFIER } from 'src/roles/automation.role';
import { BD_OFFICER_ROLE_UNIVERSAL_IDENTIFIER } from 'src/roles/bd-officer.role';
import { DEFAULT_FUNCTION_ROLE_UNIVERSAL_IDENTIFIER } from 'src/roles/default-function.role';
import { ED_ROLE_UNIVERSAL_IDENTIFIER } from 'src/roles/ed.role';
import { ENGINEER_ROLE_UNIVERSAL_IDENTIFIER } from 'src/roles/engineer.role';
import { IP_OFFICE_ROLE_UNIVERSAL_IDENTIFIER } from 'src/roles/ip-office.role';
import { LAB_ACCESS_ROLE_UNIVERSAL_IDENTIFIER } from 'src/roles/lab-access.role';
import { LEADERSHIP_VIEWER_ROLE_UNIVERSAL_IDENTIFIER } from 'src/roles/leadership-viewer.role';
import { LEASING_ROLE_UNIVERSAL_IDENTIFIER } from 'src/roles/leasing.role';
import { OPS_COORDINATOR_ROLE_UNIVERSAL_IDENTIFIER } from 'src/roles/ops-coordinator.role';
import { STARTUPS_AND_INVESTMENT_ROLE_UNIVERSAL_IDENTIFIER } from 'src/roles/startups-and-investment.role';
import {
  LOCKED_FIELD_NAMES,
  LOCKED_FIELDS,
} from 'src/roles/utils/field-locks';
import {
  HISTORY_OBJECT_UNIVERSAL_IDENTIFIERS,
  RECORD_LINK_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'src/roles/utils/system-objects';

type RoleDefinition = ReturnType<typeof defineRole>;
type RoleConfig = RoleDefinition['config'];
type ObjectDefinition = ReturnType<typeof defineObject>;
type FieldDefinition = ReturnType<typeof defineField>;

const {
  opportunity,
  company,
  person,
  task,
  note,
  dashboard,
  taskTarget,
  workspaceMember,
} = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS;

const DEPARTMENT_ROLE_UNIVERSAL_IDENTIFIERS = [
  IP_OFFICE_ROLE_UNIVERSAL_IDENTIFIER,
  LEASING_ROLE_UNIVERSAL_IDENTIFIER,
  LAB_ACCESS_ROLE_UNIVERSAL_IDENTIFIER,
  STARTUPS_AND_INVESTMENT_ROLE_UNIVERSAL_IDENTIFIER,
];

// The function role is the app itself: it stamps the locked fields.
const FIELD_LOCK_EXEMPT_ROLE_UNIVERSAL_IDENTIFIERS = [
  ED_ROLE_UNIVERSAL_IDENTIFIER,
  OPS_COORDINATOR_ROLE_UNIVERSAL_IDENTIFIER,
  AUTOMATION_ROLE_UNIVERSAL_IDENTIFIER,
  DEFAULT_FUNCTION_ROLE_UNIVERSAL_IDENTIFIER,
];

const HUMAN_ROLE_UNIVERSAL_IDENTIFIERS = [
  ED_ROLE_UNIVERSAL_IDENTIFIER,
  OPS_COORDINATOR_ROLE_UNIVERSAL_IDENTIFIER,
  BD_OFFICER_ROLE_UNIVERSAL_IDENTIFIER,
  ENGINEER_ROLE_UNIVERSAL_IDENTIFIER,
  LEADERSHIP_VIEWER_ROLE_UNIVERSAL_IDENTIFIER,
  ...DEPARTMENT_ROLE_UNIVERSAL_IDENTIFIERS,
];

const SYSTEM_OBJECT_UNIVERSAL_IDENTIFIERS = new Set<string>([
  ...RECORD_LINK_OBJECT_UNIVERSAL_IDENTIFIERS,
  ...HISTORY_OBJECT_UNIVERSAL_IDENTIFIERS,
  workspaceMember.universalIdentifier,
]);

const BUSINESS_OBJECT_UNIVERSAL_IDENTIFIERS = [
  opportunity.universalIdentifier,
  company.universalIdentifier,
  person.universalIdentifier,
  task.universalIdentifier,
  note.universalIdentifier,
  ENGAGEMENT_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
  PROJECT_UNIVERSAL_IDENTIFIER,
  MILESTONE_UNIVERSAL_IDENTIFIER,
  CONTRACT_UNIVERSAL_IDENTIFIER,
  LEAD_UNIVERSAL_IDENTIFIER,
  DOCUMENT_UNIVERSAL_IDENTIFIER,
];

// Objects whose changes start automation that creates notification tasks as
// the person who made the change (runbooks/04-automation.md section 2).
const TRIGGERING_OBJECT_UNIVERSAL_IDENTIFIERS = [
  opportunity.universalIdentifier,
  ENGAGEMENT_UNIVERSAL_IDENTIFIER,
  WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
  PROJECT_UNIVERSAL_IDENTIFIER,
  MILESTONE_UNIVERSAL_IDENTIFIER,
  LEAD_UNIVERSAL_IDENTIFIER,
];

const SETTINGS_FLAGS = [
  SystemPermissionFlag.API_KEYS_AND_WEBHOOKS,
  SystemPermissionFlag.WORKSPACE,
  SystemPermissionFlag.WORKSPACE_MEMBERS,
  SystemPermissionFlag.ROLES,
  SystemPermissionFlag.DATA_MODEL,
  SystemPermissionFlag.SECURITY,
  SystemPermissionFlag.WORKFLOWS,
  SystemPermissionFlag.IMPERSONATE,
  SystemPermissionFlag.SSO_BYPASS,
  SystemPermissionFlag.APPLICATIONS,
  SystemPermissionFlag.MARKETPLACE_APPS,
  SystemPermissionFlag.LAYOUTS,
  SystemPermissionFlag.BILLING,
  SystemPermissionFlag.AI_SETTINGS,
];

type ObjectAction = 'read' | 'update' | 'softDelete' | 'destroy';

const hasFlag = (role: RoleConfig, flag: string): boolean =>
  (role.permissionFlagUniversalIdentifiers ?? []).includes(flag);

const isManyToOneRelation = (field: FieldDefinition['config']): boolean =>
  field.type === FieldType.RELATION &&
  isObject(field.universalSettings) &&
  'relationType' in field.universalSettings &&
  field.universalSettings.relationType === RelationType.MANY_TO_ONE;

const OBJECT_PERMISSION_KEY_BY_ACTION = {
  read: 'canReadObjectRecords',
  update: 'canUpdateObjectRecords',
  softDelete: 'canSoftDeleteObjectRecords',
  destroy: 'canDestroyObjectRecords',
} as const;

const ROLE_LEVEL_KEY_BY_ACTION = {
  read: 'canReadAllObjectRecords',
  update: 'canUpdateAllObjectRecords',
  softDelete: 'canSoftDeleteAllObjectRecords',
  destroy: 'canDestroyAllObjectRecords',
} as const;

// Mirrors Twenty 2.48: members are always readable and changed only with the
// Members setting, an object permission wins, system objects default to
// allowed, everything else follows the role-wide flag.
const can = (
  role: RoleConfig,
  action: ObjectAction,
  objectUniversalIdentifier: string,
): boolean => {
  if (objectUniversalIdentifier === workspaceMember.universalIdentifier) {
    return action === 'read' || hasFlag(role, SystemPermissionFlag.WORKSPACE_MEMBERS);
  }

  const override = role.objectPermissions?.find(
    (permission) =>
      permission.objectUniversalIdentifier === objectUniversalIdentifier,
  )?.[OBJECT_PERMISSION_KEY_BY_ACTION[action]];

  if (override !== undefined) {
    return override;
  }

  return SYSTEM_OBJECT_UNIVERSAL_IDENTIFIERS.has(objectUniversalIdentifier)
    ? true
    : (role[ROLE_LEVEL_KEY_BY_ACTION[action]] ?? false);
};

const canUpdateField = (
  role: RoleConfig,
  objectUniversalIdentifier: string,
  fieldUniversalIdentifier: string,
): boolean =>
  can(role, 'update', objectUniversalIdentifier) &&
  !role.fieldPermissions?.some(
    (permission) =>
      permission.objectUniversalIdentifier === objectUniversalIdentifier &&
      permission.fieldUniversalIdentifier === fieldUniversalIdentifier &&
      permission.canUpdateFieldValue === false,
  );

const loadDefaults = async <TDefinition>(
  directory: string,
  suffix: string,
): Promise<TDefinition[]> => {
  const fileNames = readdirSync(directory).filter((fileName) =>
    fileName.endsWith(suffix),
  );

  const modules = await Promise.all(
    fileNames.map(
      (fileName) =>
        import(join(directory, fileName)) as Promise<{ default: TDefinition }>,
    ),
  );

  return modules.map((module) => module.default);
};

describe('roles', () => {
  let roles: RoleConfig[] = [];
  let roleDefinitions: RoleDefinition[] = [];
  let objects: ObjectDefinition[] = [];
  let fields: FieldDefinition[] = [];

  const getRole = (universalIdentifier: string): RoleConfig => {
    const role = roles.find(
      (candidate) => candidate.universalIdentifier === universalIdentifier,
    );

    if (role === undefined) {
      throw new Error(`no role ${universalIdentifier}`);
    }

    return role;
  };

  beforeAll(async () => {
    roleDefinitions = await loadDefaults<RoleDefinition>(__dirname, '.role.ts');
    roles = roleDefinitions.map((definition) => definition.config);
    objects = await loadDefaults<ObjectDefinition>(
      join(__dirname, '..', 'objects'),
      '.object.ts',
    );
    fields = await loadDefaults<FieldDefinition>(
      join(__dirname, '..', 'fields'),
      '.field.ts',
    );
  });

  it('are valid manifest entities with unique identifiers and labels', () => {
    for (const definition of roleDefinitions) {
      expect(definition.errors, definition.config.label).toEqual([]);
    }

    expect(new Set(roles.map((role) => role.universalIdentifier)).size).toBe(
      roles.length,
    );
    expect(new Set(roles.map((role) => role.label)).size).toBe(roles.length);
    expect(roles.map((role) => role.label).sort()).toEqual([
      'Automation',
      'BD officer',
      'ED',
      'Engineer',
      'IP office',
      'KUEC BD Ops function role',
      'Lab access',
      'Leadership viewer',
      'Leasing',
      'Ops coordinator',
      'Startups and investment',
    ]);
  });

  it('give people the human roles, the API key the Automation role, and nobody the function role', () => {
    for (const role of roles) {
      const isHuman = HUMAN_ROLE_UNIVERSAL_IDENTIFIERS.includes(
        role.universalIdentifier,
      );

      expect(role.canBeAssignedToUsers, role.label).toBe(isHuman);
      expect(role.canBeAssignedToAgents, role.label).toBe(false);
      expect(role.canBeAssignedToApiKeys, role.label).toBe(
        role.universalIdentifier === AUTOMATION_ROLE_UNIVERSAL_IDENTIFIER,
      );
    }
  });

  it('never grant settings or tools wholesale', () => {
    for (const role of roles) {
      expect(role.canUpdateAllSettings, role.label).toBe(false);
      expect(role.canAccessAllTools ?? false, role.label).toBe(false);
    }
  });

  it('keep workflow management, and with it Code actions, to the ED and engineers', () => {
    const holders = roles
      .filter((role) => hasFlag(role, SystemPermissionFlag.WORKFLOWS))
      .map((role) => role.label);

    expect(holders.sort()).toEqual(['ED', 'Engineer']);
  });

  it('give BD, department, ops and leadership roles no settings at all', () => {
    for (const universalIdentifier of [
      BD_OFFICER_ROLE_UNIVERSAL_IDENTIFIER,
      OPS_COORDINATOR_ROLE_UNIVERSAL_IDENTIFIER,
      LEADERSHIP_VIEWER_ROLE_UNIVERSAL_IDENTIFIER,
      AUTOMATION_ROLE_UNIVERSAL_IDENTIFIER,
      ...DEPARTMENT_ROLE_UNIVERSAL_IDENTIFIERS,
    ]) {
      const role = getRole(universalIdentifier);

      for (const flag of [...SETTINGS_FLAGS, SystemPermissionFlag.VIEWS]) {
        expect(hasFlag(role, flag), `${role.label} ${flag}`).toBe(false);
      }
    }
  });

  it('give no role impersonation, marketplace apps, AI or code tools', () => {
    for (const role of roles) {
      for (const flag of [
        SystemPermissionFlag.IMPERSONATE,
        SystemPermissionFlag.SSO_BYPASS,
        SystemPermissionFlag.BILLING,
        SystemPermissionFlag.MARKETPLACE_APPS,
        SystemPermissionFlag.AI_SETTINGS,
        SystemPermissionFlag.AI,
        SystemPermissionFlag.CODE_INTERPRETER_TOOL,
        SystemPermissionFlag.HTTP_REQUEST_TOOL,
      ]) {
        expect(hasFlag(role, flag), `${role.label} ${flag}`).toBe(false);
      }
    }
  });

  it('keep the paths around "engineers do not write business data" closed', () => {
    const engineer = getRole(ENGINEER_ROLE_UNIVERSAL_IDENTIFIER);

    for (const flag of [
      SystemPermissionFlag.ROLES,
      SystemPermissionFlag.WORKSPACE_MEMBERS,
      SystemPermissionFlag.API_KEYS_AND_WEBHOOKS,
      SystemPermissionFlag.SECURITY,
      SystemPermissionFlag.EXPORT_CSV,
      SystemPermissionFlag.IMPORT_CSV,
    ]) {
      expect(hasFlag(engineer, flag), flag).toBe(false);
    }

    for (const objectUniversalIdentifier of [
      ...BUSINESS_OBJECT_UNIVERSAL_IDENTIFIERS,
      ...SYSTEM_OBJECT_UNIVERSAL_IDENTIFIERS,
    ]) {
      expect(can(engineer, 'read', objectUniversalIdentifier)).toBe(true);
      expect(
        can(engineer, 'update', objectUniversalIdentifier),
        objectUniversalIdentifier,
      ).toBe(false);
    }
  });

  it('let only the ED and the ops coordinator delete or merge records', () => {
    const deleters = [
      ED_ROLE_UNIVERSAL_IDENTIFIER,
      OPS_COORDINATOR_ROLE_UNIVERSAL_IDENTIFIER,
    ];

    for (const role of roles) {
      const mayDelete = deleters.includes(role.universalIdentifier);

      for (const objectUniversalIdentifier of BUSINESS_OBJECT_UNIVERSAL_IDENTIFIERS) {
        for (const action of ['softDelete', 'destroy'] as const) {
          expect(
            can(role, action, objectUniversalIdentifier),
            `${role.label} ${action} ${objectUniversalIdentifier}`,
          ).toBe(mayDelete);
        }
      }

      // The function role keeps Twenty's default here: the app writes timeline rows.
      if (mayDelete || role.universalIdentifier === DEFAULT_FUNCTION_ROLE_UNIVERSAL_IDENTIFIER) {
        continue;
      }

      for (const objectUniversalIdentifier of HISTORY_OBJECT_UNIVERSAL_IDENTIFIERS) {
        expect(
          can(role, 'destroy', objectUniversalIdentifier),
          `${role.label} destroy ${objectUniversalIdentifier}`,
        ).toBe(false);
      }
    }
  });

  it('give export to the working roles, import to the ops coordinator, upload to engineers only', () => {
    const holdersOf = (flag: string) =>
      roles
        .filter((role) => hasFlag(role, flag))
        .map((role) => role.label)
        .sort();

    expect(holdersOf(SystemPermissionFlag.EXPORT_CSV)).toEqual([
      'BD officer',
      'ED',
      'IP office',
      'Lab access',
      'Leasing',
      'Ops coordinator',
      'Startups and investment',
    ]);
    expect(holdersOf(SystemPermissionFlag.IMPORT_CSV)).toEqual([
      'Ops coordinator',
    ]);
    expect(holdersOf(SystemPermissionFlag.UPLOAD_FILE)).toEqual(['Engineer']);
  });

  it('lock every field named in the lock list, wherever the manifest defines one', () => {
    const lockedFieldUniversalIdentifiers = new Set(
      LOCKED_FIELDS.map((field) => field.fieldUniversalIdentifier),
    );
    const lockedNames: readonly string[] = LOCKED_FIELD_NAMES;
    const definedLockableFields = [
      ...objects.flatMap((object) =>
        (object.config.fields ?? []).map((field) => ({
          name: field.name,
          universalIdentifier: field.universalIdentifier,
        })),
      ),
      ...fields.map((field) => ({
        name: field.config.name,
        universalIdentifier: field.config.universalIdentifier,
      })),
    ].filter((field) => lockedNames.includes(field.name));

    expect(definedLockableFields.length).toBeGreaterThan(0);

    for (const field of definedLockableFields) {
      expect(
        lockedFieldUniversalIdentifiers.has(field.universalIdentifier),
        `${field.name} ${field.universalIdentifier}`,
      ).toBe(true);
    }
  });

  it('let no role change a locked field except the ED, the ops coordinator and automation', () => {
    for (const role of roles) {
      const isExempt = FIELD_LOCK_EXEMPT_ROLE_UNIVERSAL_IDENTIFIERS.includes(
        role.universalIdentifier,
      );

      for (const field of LOCKED_FIELDS) {
        const lockedOnRole = (role.fieldPermissions ?? []).some(
          (permission) =>
            permission.fieldUniversalIdentifier === field.fieldUniversalIdentifier &&
            permission.canUpdateFieldValue === false,
        );

        expect(lockedOnRole, `${role.label} ${field.fieldUniversalIdentifier}`).toBe(
          !isExempt,
        );
      }
    }
  });

  it('let a BD officer change only status, its reasons and Accepted at on a work package', () => {
    const bdOfficer = getRole(BD_OFFICER_ROLE_UNIVERSAL_IDENTIFIER);
    const ownFields = (
      objects.find(
        (object) =>
          object.config.universalIdentifier === WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
      )?.config.fields ?? []
    ).map((field) => field.universalIdentifier);
    const manyToOneRelations = fields
      .filter(
        (field) =>
          field.config.objectUniversalIdentifier === WORK_PACKAGE_UNIVERSAL_IDENTIFIER &&
          isManyToOneRelation(field.config),
      )
      .map((field) => field.config.universalIdentifier);
    const writable = [...ownFields, ...manyToOneRelations].filter(
      (fieldUniversalIdentifier) =>
        canUpdateField(bdOfficer, WORK_PACKAGE_UNIVERSAL_IDENTIFIER, fieldUniversalIdentifier),
    );

    expect(manyToOneRelations.length).toBeGreaterThan(0);
    expect(writable.sort()).toEqual(
      [
        WORK_PACKAGE_STATUS_FIELD_UNIVERSAL_IDENTIFIER,
        WORK_PACKAGE_ACCEPTED_AT_FIELD_UNIVERSAL_IDENTIFIER,
        WORK_PACKAGE_BLOCKED_REASON_FIELD_UNIVERSAL_IDENTIFIER,
        WORK_PACKAGE_DECLINED_REASON_FIELD_UNIVERSAL_IDENTIFIER,
      ].sort(),
    );
  });

  it('give BD officers and the departments exactly the objects they write', () => {
    const writableBusinessObjects = (role: RoleConfig) =>
      BUSINESS_OBJECT_UNIVERSAL_IDENTIFIERS.filter((objectUniversalIdentifier) =>
        can(role, 'update', objectUniversalIdentifier),
      ).sort();

    expect(writableBusinessObjects(getRole(BD_OFFICER_ROLE_UNIVERSAL_IDENTIFIER))).toEqual(
      [
        opportunity.universalIdentifier,
        company.universalIdentifier,
        person.universalIdentifier,
        task.universalIdentifier,
        note.universalIdentifier,
        ENGAGEMENT_UNIVERSAL_IDENTIFIER,
        WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
        LEAD_UNIVERSAL_IDENTIFIER,
        DOCUMENT_UNIVERSAL_IDENTIFIER,
      ].sort(),
    );

    for (const universalIdentifier of DEPARTMENT_ROLE_UNIVERSAL_IDENTIFIERS) {
      const role = getRole(universalIdentifier);

      expect(role.canReadAllObjectRecords, role.label).toBe(true);
      expect(writableBusinessObjects(role), role.label).toEqual(
        [
          opportunity.universalIdentifier,
          task.universalIdentifier,
          note.universalIdentifier,
          ENGAGEMENT_UNIVERSAL_IDENTIFIER,
          LEAD_UNIVERSAL_IDENTIFIER,
          DOCUMENT_UNIVERSAL_IDENTIFIER,
        ].sort(),
      );
    }
  });

  it('let every role that can start automation also create the notification tasks it runs as', () => {
    for (const role of roles) {
      const canTrigger = TRIGGERING_OBJECT_UNIVERSAL_IDENTIFIERS.some(
        (objectUniversalIdentifier) => can(role, 'update', objectUniversalIdentifier),
      );

      if (canTrigger) {
        expect(can(role, 'update', task.universalIdentifier), role.label).toBe(true);
        expect(can(role, 'update', taskTarget.universalIdentifier), role.label).toBe(true);
      }
    }
  });

  it('show the leadership viewer the pipeline, projects, contracts and dashboards and nothing about people', () => {
    const leadership = getRole(LEADERSHIP_VIEWER_ROLE_UNIVERSAL_IDENTIFIER);
    const readable = [
      ...BUSINESS_OBJECT_UNIVERSAL_IDENTIFIERS,
      ...SYSTEM_OBJECT_UNIVERSAL_IDENTIFIERS,
      dashboard.universalIdentifier,
    ].filter((objectUniversalIdentifier) =>
      can(leadership, 'read', objectUniversalIdentifier),
    );

    expect(readable.sort()).toEqual(
      [
        opportunity.universalIdentifier,
        company.universalIdentifier,
        PROJECT_UNIVERSAL_IDENTIFIER,
        MILESTONE_UNIVERSAL_IDENTIFIER,
        CONTRACT_UNIVERSAL_IDENTIFIER,
        dashboard.universalIdentifier,
        // always readable in Twenty: owners and assignees are members
        workspaceMember.universalIdentifier,
      ].sort(),
    );
    expect(
      [...BUSINESS_OBJECT_UNIVERSAL_IDENTIFIERS, dashboard.universalIdentifier].some(
        (objectUniversalIdentifier) => can(leadership, 'update', objectUniversalIdentifier),
      ),
    ).toBe(false);
    expect(leadership.permissionFlagUniversalIdentifiers).toEqual([
      SystemPermissionFlag.PROFILE_INFORMATION,
    ]);
  });
});
