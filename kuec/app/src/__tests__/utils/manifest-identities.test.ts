import { describe, expect, it } from 'vitest';

import {
  collectManifestIdentities,
  findNonAdditiveChanges,
} from 'src/__tests__/utils/manifest-identities';

const V1 = {
  application: { universalIdentifier: 'app' },
  objects: [
    {
      universalIdentifier: 'object-work-package',
      fields: [
        {
          universalIdentifier: 'field-status',
          name: 'status',
          type: 'SELECT',
          options: [{ id: 'option-offered', value: 'OFFERED' }],
        },
      ],
    },
  ],
  views: [{ universalIdentifier: 'view-my-work', filters: [{ universalIdentifier: 'filter-owner' }] }],
};

describe('findNonAdditiveChanges', () => {
  it('accepts a manifest that only adds', () => {
    const v2 = {
      ...V1,
      objects: [
        {
          ...V1.objects[0],
          fields: [
            ...V1.objects[0].fields,
            { universalIdentifier: 'field-declined-reason', name: 'declinedReason', type: 'TEXT' },
          ],
        },
      ],
      pageLayouts: [{ universalIdentifier: 'page-home' }],
    };

    expect(
      findNonAdditiveChanges(collectManifestIdentities(V1), collectManifestIdentities(v2)),
    ).toEqual([]);
  });

  it('reports a removed entity, a removed select option and a renamed field', () => {
    const v2 = {
      application: V1.application,
      objects: [
        {
          universalIdentifier: 'object-work-package',
          fields: [
            { universalIdentifier: 'field-status', name: 'state', type: 'SELECT', options: [] },
          ],
        },
      ],
      views: [{ universalIdentifier: 'view-my-work', filters: [] }],
    };

    expect(
      findNonAdditiveChanges(collectManifestIdentities(V1), collectManifestIdentities(v2)),
    ).toEqual([
      'removed views filter-owner',
      'removed select option option-offered',
      'changed field field-status from status:SELECT to state:SELECT',
    ]);
  });
});
