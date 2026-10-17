import { type defineNavigationMenuItem } from 'twenty-sdk/define';
import { beforeAll, describe, expect, it } from 'vitest';

import { loadDefaultExports } from 'src/__tests__/utils/load-default-exports';
import helpNavigationMenuItem, {
  HELP_PAGE_URL,
} from 'src/navigation-menu-items/help.navigation-menu-item';

type NavigationMenuItemDefinition = ReturnType<typeof defineNavigationMenuItem>;

// Twenty's own entries start at position 0 (runbooks/12-global-features.md section 5).
const FIRST_STANDARD_POSITION = 0;

const loadNavigationMenuItems = async (): Promise<NavigationMenuItemDefinition[]> => {
  return loadDefaultExports<NavigationMenuItemDefinition>(__dirname, '.navigation-menu-item.ts');
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

  it('list the pinned entries in the agreed order, with Home and Exceptions above them and Help last', () => {
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
      'Capabilities',
      'Milestones',
      'Data quality',
      'uVENTURE',
      'Open uVENTURE',
      'Help',
    ]);
  });

  it('sit above every standard entry, so the order holds whatever Twenty seeds', () => {
    for (const item of items) {
      expect(item.config.position, item.config.name).toBeLessThan(
        FIRST_STANDARD_POSITION,
      );
    }
  });

  it('ends with Help, a link that opens the Help page outside the CRM', () => {
    expect(helpNavigationMenuItem.config).toMatchObject({
      type: 'LINK',
      link: HELP_PAGE_URL,
    });
    expect(HELP_PAGE_URL).toMatch(/^https:\/\/[a-z0-9-]+\.sharepoint\.com\//);
  });
});
