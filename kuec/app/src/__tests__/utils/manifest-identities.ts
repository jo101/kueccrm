import { isArray, isObject, isString } from '@sniptt/guards';

export type ManifestIdentities = {
  // Every universalIdentifier in the manifest, keyed to the top-level section it sits under.
  sectionByUniversalIdentifier: Map<string, string>;
  selectOptionIds: Set<string>;
  // API name and type of every field, which an additive upgrade never changes.
  fieldSignatureByUniversalIdentifier: Map<string, string>;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  isObject(value) && !isArray(value);

export const collectManifestIdentities = (
  manifest: Record<string, unknown>,
): ManifestIdentities => {
  const identities: ManifestIdentities = {
    sectionByUniversalIdentifier: new Map(),
    selectOptionIds: new Set(),
    fieldSignatureByUniversalIdentifier: new Map(),
  };

  const visit = (value: unknown, section: string, parentKey: string) => {
    if (isArray(value)) {
      for (const item of value) {
        visit(item, section, parentKey);
      }

      return;
    }

    if (!isRecord(value)) {
      return;
    }

    if (parentKey === 'options' && isString(value.id)) {
      identities.selectOptionIds.add(value.id);
    }

    if (isString(value.universalIdentifier)) {
      identities.sectionByUniversalIdentifier.set(value.universalIdentifier, section);

      if (parentKey === 'fields' && isString(value.name)) {
        identities.fieldSignatureByUniversalIdentifier.set(
          value.universalIdentifier,
          `${value.name}:${String(value.type)}`,
        );
      }
    }

    for (const [key, child] of Object.entries(value)) {
      visit(child, section, key);
    }
  };

  for (const [section, value] of Object.entries(manifest)) {
    if (section === 'translations') {
      continue;
    }

    visit(value, section, section);
  }

  return identities;
};

// What the newer manifest lost or renamed; empty when the upgrade is additive.
export const findNonAdditiveChanges = (
  previous: ManifestIdentities,
  next: ManifestIdentities,
): string[] => [
  ...[...previous.sectionByUniversalIdentifier]
    .filter(([universalIdentifier]) => !next.sectionByUniversalIdentifier.has(universalIdentifier))
    .map(([universalIdentifier, section]) => `removed ${section} ${universalIdentifier}`),
  ...[...previous.selectOptionIds]
    .filter((optionId) => !next.selectOptionIds.has(optionId))
    .map((optionId) => `removed select option ${optionId}`),
  ...[...previous.fieldSignatureByUniversalIdentifier]
    .filter(
      ([universalIdentifier, signature]) =>
        next.fieldSignatureByUniversalIdentifier.has(universalIdentifier) &&
        next.fieldSignatureByUniversalIdentifier.get(universalIdentifier) !== signature,
    )
    .map(
      ([universalIdentifier, signature]) =>
        `changed field ${universalIdentifier} from ${signature} to ${next.fieldSignatureByUniversalIdentifier.get(universalIdentifier)}`,
    ),
];
