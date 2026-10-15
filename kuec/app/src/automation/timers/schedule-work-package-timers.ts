import { type HolidaySet } from 'src/automation/dates/business-days';
import { enqueueTimerJob } from 'src/automation/timers/enqueue-timer-job';
import {
  derivePendingTimer,
  TIMER_KIND,
  type TimerKind,
  type TimerWorkPackage,
} from 'src/automation/timers/work-package-timers';
import { W02_ACCEPTANCE_TIMER_UNIVERSAL_IDENTIFIER } from 'src/logic-functions/w02-acceptance-timer';
import { W03_OVERDUE_TIMER_UNIVERSAL_IDENTIFIER } from 'src/logic-functions/w03-overdue-timer';

export const TIMER_FUNCTION_BY_KIND: Record<TimerKind, string> = {
  ACCEPT: W02_ACCEPTANCE_TIMER_UNIVERSAL_IDENTIFIER,
  DUE: W03_OVERDUE_TIMER_UNIVERSAL_IDENTIFIER,
};

export const scheduleWorkPackageTimers = async ({
  workPackage,
  kinds = [TIMER_KIND.ACCEPT, TIMER_KIND.DUE],
  holidays,
  now,
}: {
  workPackage: TimerWorkPackage;
  kinds?: TimerKind[];
  holidays: HolidaySet;
  now: Date;
}): Promise<string[]> => {
  const jobIds: string[] = [];

  for (const kind of kinds) {
    const timer = derivePendingTimer(workPackage, kind, holidays);

    if (timer !== null) {
      jobIds.push(
        await enqueueTimerJob({
          logicFunctionUniversalIdentifier: TIMER_FUNCTION_BY_KIND[kind],
          timer,
          now,
        }),
      );
    }
  }

  return jobIds;
};
