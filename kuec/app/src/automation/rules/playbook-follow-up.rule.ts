import { isDefined } from 'twenty-sdk/utils';

import { toDubaiDateString } from 'src/automation/dates/business-days';
import {
  type OpportunityRecord,
  type WorkPackageRecord,
} from 'src/automation/records/record-types';
import { OPPORTUNITY_PLAYBOOK_TYPE } from 'src/fields/playbook-type-on-opportunity.field';
import { WORK_PACKAGE_STATUS } from 'src/objects/work-package.object';

type PlaybookWorkPackage = Pick<
  WorkPackageRecord,
  'id' | 'name' | 'status' | 'dueAt' | 'offeredAt'
>;

export type OfferedTransition<TWorkPackage> = {
  workPackage: TWorkPackage;
  happenedAt: string;
};

export type OpportunityPlaybookFollowUp = {
  nextActionPatch: { nextAction: string; nextActionDate: string | null } | null;
  confirmPlanTask: { title: string; body: string } | null;
};

// Each step a playbook created as Offered gets one Offered row on the timeline,
// dated when it was offered. A retried run re-offers nothing, so the date is
// the stamp from the first run when there is one.
export const planOfferedTransitions = <TWorkPackage extends PlaybookWorkPackage>(
  workPackages: TWorkPackage[],
  now: Date,
): OfferedTransition<TWorkPackage>[] =>
  workPackages
    .filter(({ status }) => status === WORK_PACKAGE_STATUS.OFFERED)
    .map((workPackage) => ({
      workPackage,
      happenedAt: workPackage.offeredAt ?? now.toISOString(),
    }));

// W1, after the work packages exist: an opportunity without a next action
// takes the first step and its due day (Asia/Dubai), and a licensing playbook
// asks the ED to confirm the plan.
export const planOpportunityPlaybookFollowUp = ({
  opportunity,
  workPackages,
  caseName,
  link,
}: {
  opportunity: Pick<
    OpportunityRecord,
    'playbookType' | 'nextAction' | 'nextActionDate'
  >;
  workPackages: PlaybookWorkPackage[];
  caseName: string;
  link: string;
}): OpportunityPlaybookFollowUp => {
  const firstWorkPackage = workPackages[0];
  const hasNextAction =
    (opportunity.nextAction ?? '').trim().length > 0 &&
    isDefined(opportunity.nextActionDate);

  const nextActionPatch =
    !hasNextAction && isDefined(firstWorkPackage)
      ? {
          nextAction: opportunity.nextAction || (firstWorkPackage.name ?? ''),
          nextActionDate:
            opportunity.nextActionDate ??
            (isDefined(firstWorkPackage.dueAt)
              ? toDubaiDateString(new Date(firstWorkPackage.dueAt))
              : null),
        }
      : null;

  const confirmPlanTask =
    opportunity.playbookType === OPPORTUNITY_PLAYBOOK_TYPE.TECHNOLOGY_LICENSING
      ? {
          title: `Confirm plan: ${caseName}`,
          body: `Confirm the licensing plan and its ${workPackages.length} work packages. ${link}`,
        }
      : null;

  return { nextActionPatch, confirmPlanTask };
};
