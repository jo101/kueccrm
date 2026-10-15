import { isDefined } from 'twenty-sdk/utils';

import { type HolidaySet } from 'src/automation/dates/business-days';
import { listRecords, type TwentyApi } from 'src/automation/api/twenty-api';
import { OBJECT_NAMES } from 'src/automation/records/object-names';
import {
  type PlaybookRoleAssignmentRecord,
  type PublicHolidayRecord,
} from 'src/automation/records/record-types';
import {
  PLAYBOOK_ROLE,
  type PlaybookRole,
} from 'src/objects/playbook-role-assignment.object';

export type AutomationContext = {
  holidays: HolidaySet;
  membersByRole: Partial<Record<PlaybookRole, string[]>>;
  edMemberId: string | null;
  opsCoordinatorMemberId: string | null;
};

// Configuration is read as the application: it is the app's reference data,
// whoever triggered the run.
export const loadAutomationContext = async (
  api: TwentyApi,
): Promise<AutomationContext> => {
  const [assignments, holidays] = await Promise.all([
    listRecords<PlaybookRoleAssignmentRecord>(
      api.asApplication,
      OBJECT_NAMES.playbookRoleAssignment,
      'isActive[eq]:true',
    ),
    listRecords<PublicHolidayRecord>(
      api.asApplication,
      OBJECT_NAMES.publicHoliday,
    ),
  ]);

  const membersByRole: Partial<Record<PlaybookRole, string[]>> = {};

  for (const assignment of [...assignments].sort((first, second) =>
    first.createdAt.localeCompare(second.createdAt),
  )) {
    if (!isDefined(assignment.playbookRole) || !isDefined(assignment.memberId)) {
      continue;
    }

    const members = membersByRole[assignment.playbookRole] ?? [];

    if (!members.includes(assignment.memberId)) {
      members.push(assignment.memberId);
    }

    membersByRole[assignment.playbookRole] = members;
  }

  return {
    holidays: new Set(
      holidays.map(({ date }) => date?.slice(0, 10)).filter(isDefined),
    ),
    membersByRole,
    edMemberId: membersByRole[PLAYBOOK_ROLE.ED]?.[0] ?? null,
    opsCoordinatorMemberId:
      membersByRole[PLAYBOOK_ROLE.OPS_COORDINATOR]?.[0] ?? null,
  };
};
