// Asia/Dubai is UTC+4 all year (no daylight saving), so a fixed offset is exact.
const DUBAI_OFFSET_MS = 4 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const SATURDAY = 6;
const SUNDAY = 0;

export const DUE_TIME_LOCAL_HOUR = 17;

export type HolidaySet = ReadonlySet<string>;

const toLocalDate = (instant: Date): Date =>
  new Date(instant.getTime() + DUBAI_OFFSET_MS);

export const toDubaiDateString = (instant: Date): string =>
  toLocalDate(instant).toISOString().slice(0, 10);

const shiftDateString = (dateString: string, days: number): string =>
  new Date(Date.parse(`${dateString}T00:00:00Z`) + days * DAY_MS)
    .toISOString()
    .slice(0, 10);

export const isBusinessDay = (
  dateString: string,
  holidays: HolidaySet,
): boolean => {
  const weekday = new Date(`${dateString}T00:00:00Z`).getUTCDay();

  return weekday !== SATURDAY && weekday !== SUNDAY && !holidays.has(dateString);
};

export const addBusinessDaysToDate = (
  dateString: string,
  businessDays: number,
  holidays: HolidaySet,
): string => {
  const step = businessDays >= 0 ? 1 : -1;
  let remaining = Math.abs(businessDays);
  let current = dateString;

  while (remaining > 0) {
    current = shiftDateString(current, step);

    if (isBusinessDay(current, holidays)) {
      remaining -= 1;
    }
  }

  return current;
};

export const dubaiDateTimeToInstant = (
  dateString: string,
  localHour: number,
): Date =>
  new Date(
    Date.parse(`${dateString}T00:00:00Z`) +
      localHour * 60 * 60 * 1000 -
      DUBAI_OFFSET_MS,
  );

// Keeps the local time of day: offered Thursday 10:00 plus 2 is Monday 10:00.
export const addBusinessDays = (
  instant: Date,
  businessDays: number,
  holidays: HolidaySet,
): Date => {
  const localDate = toDubaiDateString(instant);
  const localTimeOfDayMs = toLocalDate(instant).getTime() % DAY_MS;
  const targetDate = addBusinessDaysToDate(localDate, businessDays, holidays);

  return new Date(
    Date.parse(`${targetDate}T00:00:00Z`) + localTimeOfDayMs - DUBAI_OFFSET_MS,
  );
};

export const dueAtAfterBusinessDays = (
  start: Date,
  businessDays: number,
  holidays: HolidaySet,
): Date =>
  dubaiDateTimeToInstant(
    addBusinessDaysToDate(toDubaiDateString(start), businessDays, holidays),
    DUE_TIME_LOCAL_HOUR,
  );

export const dueAtOnDate = (dateString: string): Date =>
  dubaiDateTimeToInstant(dateString, DUE_TIME_LOCAL_HOUR);
