import { isDefined } from 'twenty-sdk/utils';

export const DEFAULT_OWNER_WINDOW_HOURS = 24;

const HOUR_MS = 60 * 60 * 1000;

export type CreatedByActor = {
  source: string | null;
  workspaceMemberId: string | null;
};

export type DefaultOwnerCandidate = {
  ownerId: string | null;
  createdAt: string;
  createdBy: CreatedByActor | null;
};

// Twenty 2.48 cannot default a relation to the current user, so an opportunity
// a person creates in the UI without an owner gets that person. Only in its
// first day: after that an empty owner is left for W4 to flag to the ED.
export const computeDefaultOwnerId = (
  record: DefaultOwnerCandidate,
  now: Date,
): string | null => {
  const creatorMemberId = record.createdBy?.workspaceMemberId ?? null;

  if (
    isDefined(record.ownerId) ||
    record.createdBy?.source !== 'MANUAL' ||
    !isDefined(creatorMemberId)
  ) {
    return null;
  }

  const ageMs = now.getTime() - Date.parse(record.createdAt);

  return ageMs <= DEFAULT_OWNER_WINDOW_HOURS * HOUR_MS ? creatorMemberId : null;
};
