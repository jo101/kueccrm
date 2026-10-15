import { describe, expect, it } from 'vitest';

import {
  addBusinessDays,
  addBusinessDaysToDate,
  dueAtAfterBusinessDays,
  isBusinessDay,
  toDubaiDateString,
} from 'src/automation/dates/business-days';

const NO_HOLIDAYS = new Set<string>();

describe('business days in Asia/Dubai', () => {
  it('treats Saturday and Sunday as the weekend', () => {
    expect(isBusinessDay('2026-10-16', NO_HOLIDAYS)).toBe(true);
    expect(isBusinessDay('2026-10-17', NO_HOLIDAYS)).toBe(false);
    expect(isBusinessDay('2026-10-18', NO_HOLIDAYS)).toBe(false);
  });

  it('skips holidays from the list', () => {
    const holidays = new Set(['2026-12-02', '2026-12-03']);

    expect(addBusinessDaysToDate('2026-12-01', 1, holidays)).toBe('2026-12-04');
  });

  it('computes the local day from the UTC instant', () => {
    expect(toDubaiDateString(new Date('2026-10-15T20:30:00Z'))).toBe(
      '2026-10-16',
    );
  });

  it('keeps the local time of day across a weekend', () => {
    const thursdayTenLocal = new Date('2026-10-15T06:00:00Z');

    expect(addBusinessDays(thursdayTenLocal, 2, NO_HOLIDAYS).toISOString()).toBe(
      '2026-10-19T06:00:00.000Z',
    );
  });

  it('counts back from a date', () => {
    expect(addBusinessDaysToDate('2026-10-19', -2, NO_HOLIDAYS)).toBe(
      '2026-10-15',
    );
  });

  it('puts due dates at 17:00 Asia/Dubai', () => {
    expect(
      dueAtAfterBusinessDays(
        new Date('2026-10-15T06:00:00Z'),
        5,
        NO_HOLIDAYS,
      ).toISOString(),
    ).toBe('2026-10-22T13:00:00.000Z');
  });
});
