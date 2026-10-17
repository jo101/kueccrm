import { readdirSync } from 'node:fs';
import { join } from 'node:path';

// One file at a time: the test module runner interleaves parallel imports, and
// entity files import each other in pairs (a relation and its inverse), so a
// parallel import can read a constant before its module has finished.
export const loadDefaultExports = async <TDefinition>(
  directory: string,
  suffix: string,
): Promise<TDefinition[]> => {
  const definitions: TDefinition[] = [];

  for (const fileName of readdirSync(directory).filter((name) => name.endsWith(suffix))) {
    const module = (await import(join(directory, fileName))) as { default: TDefinition };

    definitions.push(module.default);
  }

  return definitions;
};
