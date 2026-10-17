import {
  cpSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { appDevOnce } from 'twenty-sdk/cli';

export const TEST_BUSINESS_DAY_MS = 20_000;

const TIMERS_MODULE = join('src', 'automation', 'timers', 'work-package-timers.ts');
// A string literal survives bundling and minification, a constant name does not.
const SHORTENED_MARKER = 'kuec-acceptance-shortened-timers';

const stripAnsi = (text: string) => text.replace(/\u001b\[[0-9;]*m/g, '');

export const syncApp = async (appPath: string): Promise<string> => {
  let plan = '';
  const result = await appDevOnce({
    appPath,
    onProgress: (message: string) => console.log(`[sync ${appPath}] ${message}`),
    onPlan: (text) => {
      plan = stripAnsi(text);
    },
  });

  if (!result.success) {
    throw new Error(`Sync of ${appPath} failed: ${result.error.message}`);
  }

  return plan;
};

// The escalation timers count business days through addBusinessDays. The copy
// replaces those three calls so that one business day lasts TEST_BUSINESS_DAY_MS;
// every other rule, the job ids and the handlers are the shipped code.
export const buildShortenedTimersCopy = (appPath: string) => {
  const copyRoot = mkdtempSync(join(tmpdir(), 'kuec-short-timers-'));
  const copyPath = join(copyRoot, 'app');

  cpSync(appPath, copyPath, {
    recursive: true,
    filter: (source) => !/[/\\](node_modules|\.twenty)([/\\]|$)/.test(source),
  });
  symlinkSync(realpathSync(join(appPath, 'node_modules')), join(copyPath, 'node_modules'));

  const modulePath = join(copyPath, TIMERS_MODULE);
  const original = readFileSync(modulePath, 'utf8');
  const callCount = original.split('addBusinessDays(').length - 1;

  if (callCount !== 3) {
    throw new Error(`Expected 3 addBusinessDays calls in ${TIMERS_MODULE}, found ${callCount}`);
  }

  writeFileSync(
    modulePath,
    `${original.split('addBusinessDays(').join('shortenedBusinessDays(')}
const shortenedBusinessDays = (instant: Date, businessDays: number, holidays: HolidaySet): Date =>
  new Date(
    instant.getTime() +
      businessDays * (holidays.has('${SHORTENED_MARKER}') ? 0 : ${TEST_BUSINESS_DAY_MS}),
  );
`,
  );

  return {
    copyPath,
    remove: () => rmSync(copyRoot, { recursive: true, force: true }),
  };
};

// The built logic functions are what the server runs, so restoring is proven
// on them rather than on the source.
export const builtFunctionsContainShortenedTimers = (appPath: string): boolean => {
  const outputDir = join(appPath, '.twenty', 'output');
  const builtFiles = readdirSync(outputDir, { recursive: true, encoding: 'utf8' }).filter(
    (file) => /\.(c|m)?js$/.test(file),
  );

  if (builtFiles.length === 0) {
    throw new Error(`No built functions in ${outputDir}`);
  }

  return builtFiles.some((file) =>
    readFileSync(join(outputDir, file), 'utf8').includes(SHORTENED_MARKER),
  );
};
