import { describe, expect, it } from 'vitest';

import {
  computeEngagementLapsesAt,
  computeOutcomeDueAt,
  computeParkedLapsesAt,
  computeStaleFrom,
  isSameInstant,
} from 'src/automation/rules/age-thresholds.rule';
import { OPPORTUNITY_STAGE } from 'src/constants/opportunity-stage';

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

  it('lapses a parked opportunity 90 days after it was parked', () => {
    expect(computeParkedLapsesAt(OPPORTUNITY_STAGE.PARKED, '2026-07-19T05:00:00.000Z')).toBe(
      '2026-10-17T05:00:00.000Z',
    );
  });

  it('never lapses an opportunity in any other stage', () => {
    for (const stage of Object.values(OPPORTUNITY_STAGE).filter(
      (stage) => stage !== OPPORTUNITY_STAGE.PARKED,
    )) {
      expect(computeParkedLapsesAt(stage, '2026-07-19T05:00:00.000Z'), stage).toBeNull();
    }
  });

  it('makes an outcome due 2 days after the engagement', () => {
    expect(computeOutcomeDueAt('2026-10-15T07:30:00.000Z')).toBe('2026-10-17T07:30:00.000Z');
  });

  it('keeps an empty source empty', () => {
    expect(computeStaleFrom(null)).toBeNull();
    expect(computeEngagementLapsesAt(null)).toBeNull();
    expect(computeParkedLapsesAt(OPPORTUNITY_STAGE.PARKED, null)).toBeNull();
    expect(computeOutcomeDueAt(null)).toBeNull();
  });

  it('compares instants regardless of their string form', () => {
    expect(isSameInstant('2026-10-15T06:30:00Z', '2026-10-15T06:30:00.000Z')).toBe(true);
    expect(isSameInstant('2026-10-15T06:30:00Z', '2026-10-15T06:31:00Z')).toBe(false);
    expect(isSameInstant(null, null)).toBe(true);
    expect(isSameInstant(null, '2026-10-15T06:30:00Z')).toBe(false);
  });
});
