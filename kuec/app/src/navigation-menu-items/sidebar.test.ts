import { readdirSync } from 'node:fs';
import { join } from 'node:path';

import { type defineNavigationMenuItem } from 'twenty-sdk/define';
import { beforeAll, describe, expect, it } from 'vitest';

type NavigationMenuItemDefinition = ReturnType<typeof defineNavigationMenuItem>;

// Twenty's own entries start at position 0 (runbooks/12-global-features.md section 5).
const FIRST_STANDARD_POSITION = 0;

const loadNavigationMenuItems = async (): Promise<NavigationMenuItemDefinition[]> => {
  const fileNames = readdirSync(__dirname).filter((fileName) =>
    fileName.endsWith('.navigation-menu-item.ts'),
  );

  const itemModules = await Promise.all(
    fileNames.map(
      (fileName) =>
        import(join(__dirname, fileName)) as Promise<{
          default: NavigationMenuItemDefinition;
        }>,
    ),
  );

  return itemModules.map((itemModule) => itemModule.default);
};

describe('sidebar', () => {
  let items: NavigationMenuItemDefinition[] = [];

  beforeAll(async () => {
    items = await loadNavigationMenuItems();
  });

  it('are valid manifest entities', () => {
    for (const item of items) {
      expect(item.errors, item.config.name).toEqual([]);
    }
  });

  it('list the pinned entries in the agreed order, with Home and Exceptions above them', () => {
    const namesInOrder = [...items]
      .sort((left, right) => left.config.position - right.config.position)
      .map((item) => item.config.name);

    expect(namesInOrder).toEqual([
      'Home',
      'Exceptions',
      'Leads',
      'Pipeline',
      'My work',
      'BD Executive',
      'Projects',
      'Companies',
      'People',
      'Engagements',
      'Contracts',
      'Documents',
      'Milestones',
      'Data quality',
    ]);
  });

  it('sit above every standard entry, so the order holds whatever Twenty seeds', () => {
    for (const item of items) {
      expect(item.config.position, item.config.name).toBeLessThan(
        FIRST_STANDARD_POSITION,
      );
    }
  });
});
