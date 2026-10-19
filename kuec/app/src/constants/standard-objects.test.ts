import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

import * as twentySdkDefine from 'twenty-sdk/define';
import { describe, expect, it } from 'vitest';

import { OPPORTUNITY_OBJECT_UNIVERSAL_IDENTIFIER } from 'src/constants/standard-objects';

// Code that runs inside a logic function. Manifest files (objects, fields,
// views...) may read any twenty-sdk/define export, since only the manifest
// build evaluates them.
const RUNTIME_DIRECTORIES = ['src/automation', 'src/logic-functions', 'src/constants'];

const isPrimitive = (value: unknown): boolean =>
  ['string', 'number', 'boolean'].includes(typeof value);

// Mirrors the SDK's logic-function build (stub-twenty-sdk-define.plugin.ts in
// twenty-sdk 2.48): define* factories and flat constants keep working, every
// other export becomes a Proxy.
const survivesLogicFunctionBuild = (name: string): boolean => {
  if (/^define[A-Z]/.test(name)) {
    return true;
  }

  const value = (twentySdkDefine as Record<string, unknown>)[name];

  return (
    isPrimitive(value) ||
    (typeof value === 'object' &&
      value !== null &&
      Object.values(value).every(isPrimitive))
  );
};

const listSourceFiles = (directory: string): string[] =>
  readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);

    if (statSync(path).isDirectory()) {
      return listSourceFiles(path);
    }

    return /\.tsx?$/.test(entry) && !/\.test\.tsx?$/.test(entry) ? [path] : [];
  });

const DEFINE_IMPORT = /import\s+(type\s+)?\{([^}]*)\}\s+from\s+'twenty-sdk\/define'/g;

const valueImportsFromDefine = (source: string): string[] =>
  [...source.matchAll(DEFINE_IMPORT)]
    .filter(([, typeOnly]) => typeOnly === undefined)
    .flatMap(([, , names]) =>
      names
        .split(',')
        .map((name) => name.trim())
        .filter((name) => name.length > 0 && !name.startsWith('type ')),
    )
    .map((name) => name.split(/\s+as\s+/)[0]);

describe('standard object identifiers for runtime code', () => {
  it('match the SDK', () => {
    expect(OPPORTUNITY_OBJECT_UNIVERSAL_IDENTIFIER).toBe(
      twentySdkDefine.STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.opportunity
        .universalIdentifier,
    );
  });

  it('are needed: the SDK constant does not survive the logic-function build', () => {
    expect(survivesLogicFunctionBuild('STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS')).toBe(false);
  });

  it('runtime code reads no twenty-sdk/define export that becomes a Proxy in a logic function', () => {
    const offenders = RUNTIME_DIRECTORIES.flatMap((directory) =>
      listSourceFiles(join(process.cwd(), directory)).flatMap((path) =>
        valueImportsFromDefine(readFileSync(path, 'utf8'))
          .filter((name) => !survivesLogicFunctionBuild(name))
          .map((name) => `${relative(process.cwd(), path)}: ${name}`),
      ),
    );

    expect(offenders).toEqual([]);
  });
});
