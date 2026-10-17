// Preloaded into a Twenty worker (node --require) to move what `new Date()`
// returns by KUEC_FAKE_CLOCK_OFFSET_MS, so a daily cron can be driven to its
// next run without waiting for it. Test instances only.
//
// Date.now() is left on the real clock on purpose: BullMQ schedules its
// repeating jobs with Date.now() and stops ticking when that moves, while the
// cron dispatcher decides what is due from `new Date()`.
const offsetMs = Number(process.env.KUEC_FAKE_CLOCK_OFFSET_MS);

if (Number.isFinite(offsetMs) && offsetMs !== 0) {
  const RealDate = Date;

  class OffsetDate extends RealDate {
    constructor(...args) {
      if (args.length === 0) {
        super(RealDate.now() + offsetMs);
      } else {
        super(...args);
      }
    }
  }

  globalThis.Date = OffsetDate;
}
