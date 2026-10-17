export const READ_ONLY = {
  canReadObjectRecords: true,
  canUpdateObjectRecords: false,
  canSoftDeleteObjectRecords: false,
  canDestroyObjectRecords: false,
} as const;

export const READ_WRITE_NO_DELETE = {
  canReadObjectRecords: true,
  canUpdateObjectRecords: true,
  canSoftDeleteObjectRecords: false,
  canDestroyObjectRecords: false,
} as const;

export const READ_WRITE_DELETE = {
  canReadObjectRecords: true,
  canUpdateObjectRecords: true,
  canSoftDeleteObjectRecords: true,
  canDestroyObjectRecords: true,
} as const;

export const NO_ACCESS = {
  canReadObjectRecords: false,
  canUpdateObjectRecords: false,
  canSoftDeleteObjectRecords: false,
  canDestroyObjectRecords: false,
} as const;

type ObjectPermissionPreset =
  | typeof READ_ONLY
  | typeof READ_WRITE_NO_DELETE
  | typeof READ_WRITE_DELETE
  | typeof NO_ACCESS;

export const withPreset = (
  objectUniversalIdentifiers: string[],
  preset: ObjectPermissionPreset,
) =>
  objectUniversalIdentifiers.map((objectUniversalIdentifier) => ({
    objectUniversalIdentifier,
    ...preset,
  }));
