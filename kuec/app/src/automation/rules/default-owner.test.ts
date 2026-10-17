import { describe, expect, it } from 'vitest';

import { computeDefaultOwnerId } from 'src/automation/rules/default-owner.rule';

const NOW = new Date('2026-10-18T06:00:00.000Z');

const createdInTheUi = {
  ownerId: null,
  createdAt: '2026-10-18T05:59:00.000Z',
  createdBy: { source: 'MANUAL', workspaceMemberId: 'member-aisha' },
};

describe('computeDefaultOwnerId', () => {
  it('gives an opportunity created in the UI without an owner to its creator', () => {
    expect(computeDefaultOwnerId(createdInTheUi, NOW)).toBe('member-aisha');
  });

  it('keeps an owner someone already set', () => {
    expect(
      computeDefaultOwnerId({ ...createdInTheUi, ownerId: 'member-omar' }, NOW),
    ).toBeNull();
  });

  it('leaves imported, API and automation records alone', () => {
    for (const source of ['IMPORT', 'API', 'APPLICATION', 'WORKFLOW', 'EMAIL']) {
      expect(
        computeDefaultOwnerId(
          {
            ...createdInTheUi,
            createdBy: { source, workspaceMemberId: 'member-aisha' },
          },
          NOW,
        ),
      ).toBeNull();
    }
  });

  it('needs a creator who is a workspace member', () => {
    expect(
      computeDefaultOwnerId(
        { ...createdInTheUi, createdBy: { source: 'MANUAL', workspaceMemberId: null } },
        NOW,
      ),
    ).toBeNull();
    expect(computeDefaultOwnerId({ ...createdInTheUi, createdBy: null }, NOW)).toBeNull();
  });

  it('applies for 24 hours after creation, then leaves the record to the next-action guard', () => {
    expect(
      computeDefaultOwnerId(
        { ...createdInTheUi, createdAt: '2026-10-17T06:00:00.000Z' },
        NOW,
      ),
    ).toBe('member-aisha');
    expect(
      computeDefaultOwnerId(
        { ...createdInTheUi, createdAt: '2026-10-17T05:59:59.000Z' },
        NOW,
      ),
    ).toBeNull();
  });
});
