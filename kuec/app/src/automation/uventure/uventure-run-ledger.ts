import { kv } from 'twenty-sdk/logic-function';
import { isDefined } from 'twenty-sdk/utils';

import { type UventureRun } from 'src/automation/uventure/uventure-payload';

export const LAST_COMPLETE_RUN_KEY = 'uventure:run:last-complete';
export const FEED_SILENT_AFTER_HOURS = 26;

export type CompleteRun = { runId: string; completedAt: string };

const pageKey = (runId: string, page: number): string => `uventure:run:${runId}:page:${page}`;

// The nightly snapshot is complete when every page of the run has been applied,
// whichever order the jobs finished in.
export const recordRunPage = async (run: UventureRun, now: Date): Promise<boolean> => {
  await kv.set(pageKey(run.runId, run.page), now.toISOString());

  for (let page = 1; page <= run.pageCount; page++) {
    if (!isDefined(await kv.get<string>(pageKey(run.runId, page)))) {
      return false;
    }
  }

  await kv.set<CompleteRun>(LAST_COMPLETE_RUN_KEY, {
    runId: run.runId,
    completedAt: now.toISOString(),
  });

  return true;
};

export const readLastCompleteRun = (): Promise<CompleteRun | null> =>
  kv.get<CompleteRun>(LAST_COMPLETE_RUN_KEY);

export const isFeedSilent = (lastComplete: CompleteRun | null, now: Date): boolean =>
  !isDefined(lastComplete) ||
  now.getTime() - Date.parse(lastComplete.completedAt) > FEED_SILENT_AFTER_HOURS * 3600 * 1000;
