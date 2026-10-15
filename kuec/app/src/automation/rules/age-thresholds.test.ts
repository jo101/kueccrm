import { describe, expect, it } from 'vitest';

import {
  computeEngagementLapsesAt,
  computeStaleFrom,
  isSameInstant,
} from 'src/automation/rules/age-thresholds.rule';

describe('age thresholds', () => {
  it('marks an opportunity stale 30 days after it entered its stage', () => {
    expect(computeStaleFrom('2026-09-15T06:30:00.000Z')).toBe(
      '2026-10-15T06:30:00.000Z',
    );
  });

  it('lapses a company 60 days after its last engagement', () => {
    expect(computeEngagementLapsesAt('2026-08-16T20:00:00.000Z')).toBe(
      '2026-10-15T20:00:00.000Z',
    );
  });

  it('keeps an empty source empty', () => {
    expect(computeStaleFrom(null)).toBeNull();
    expect(computeEngagementLapsesAt(null)).toBeNull();
  });

  it('compares instants regardless of their string form', () => {
    expect(isSameInstant('2026-10-15T06:30:00Z', '2026-10-15T06:30:00.000Z')).toBe(true);
    expect(isSameInstant('2026-10-15T06:30:00Z', '2026-10-15T06:31:00Z')).toBe(false);
    expect(isSameInstant(null, null)).toBe(true);
    expect(isSameInstant(null, '2026-10-15T06:30:00Z')).toBe(false);
  });
});
