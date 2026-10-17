import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

import {
  type defineObject,
  type definePageLayoutTab,
  type definePageLayoutWidget,
  type PageLayoutWidgetManifest,
} from 'twenty-sdk/define';
import { beforeAll, describe, expect, it } from 'vitest';

import { loadDefaultExports } from 'src/__tests__/utils/load-default-exports';
import guidanceJson from 'src/i18n/guidance.json';
import {
  buildGuidanceBody,
  GUIDANCE_WIDGET_TITLE,
} from 'src/i18n/guidance-widget-body';
import { GUIDANCE_ROW_SPAN } from 'src/page-layout-tabs/utils/dashboard-widgets';
import { GUIDANCE_WIDGET_INDEX } from 'src/page-layout-widgets/utils/guidance-record-page-widget';

type ObjectDefinition = ReturnType<typeof defineObject>;
type TabDefinition = ReturnType<typeof definePageLayoutTab>;
type WidgetDefinition = ReturnType<typeof definePageLayoutWidget>;

const APP_DIRECTORY = join(__dirname, '..', '..');
const GRID_COLUMNS = 12;
// The standard objects people open as records; every app object has its own page.
const STANDARD_RECORD_PAGES = ['company', 'person', 'opportunity', 'note', 'task'];

const pagesOfKind = (kind: string) =>
  guidanceJson.pages.filter((page) => page.kind === kind).map((page) => page.key);


// Which guidance page a widget shows, read back from its body.
const guidanceKeyOf = (widget: Pick<PageLayoutWidgetManifest, 'configuration'>) => {
  const configuration = widget.configuration;

  if (configuration.configurationType !== 'STANDALONE_RICH_TEXT') {
    return undefined;
  }

  return guidanceJson.pages.find(
    (page) =>
      JSON.stringify(buildGuidanceBody(page.key)) === JSON.stringify(configuration.body),
  )?.key;
};

const guidanceKeyOfWidget = (widget: WidgetDefinition) => guidanceKeyOf(widget.config);

describe('guidance widgets (src/i18n/guidance.json)', () => {
  let recordPageWidgets: WidgetDefinition[] = [];
  let tabs: TabDefinition[] = [];
  let appObjectNames: string[] = [];

  beforeAll(async () => {
    recordPageWidgets = await loadDefaultExports<WidgetDefinition>(
      join(__dirname, '..', 'page-layout-widgets'),
      '-guidance.page-layout-widget.ts',
    );
    tabs = await loadDefaultExports<TabDefinition>(
      join(__dirname, '..', 'page-layout-tabs'),
      '.page-layout-tab.ts',
    );
    appObjectNames = (
      await loadDefaultExports<ObjectDefinition>(join(__dirname, '..', 'objects'), '.object.ts')
    ).map((object) => object.config.nameSingular);
  });

  it('gives every page five lines in each language, in the five agreed headings', () => {
    expect(guidanceJson.lineLabels.en).toEqual([
      'What it is',
      'Who owns it',
      'What must be filled',
      'What happens automatically',
      'Where to get help',
    ]);
    expect(guidanceJson.lineLabels.ar).toHaveLength(5);

    for (const page of guidanceJson.pages) {
      for (const lines of [page.lines.en, page.lines.ar]) {
        expect(lines, page.key).toHaveLength(5);

        for (const line of lines) {
          expect(line.trim() === line && line.endsWith('.'), `${page.key}: ${line}`).toBe(true);
        }
      }
    }
  });

  it('names Request help on every page where a work package appears', () => {
    for (const page of guidanceJson.pages.filter((candidate) => candidate.showsWorkPackages)) {
      expect(page.lines.en[4], page.key).toContain('Request help');
      expect(page.lines.ar[4], page.key).toContain('طلب مساعدة');
    }

    expect(
      guidanceJson.pages
        .filter((page) => page.showsWorkPackages)
        .map((page) => page.key)
        .sort(),
    ).toEqual(
      [
        'opportunity',
        'task',
        'project',
        'milestone',
        'workPackage',
        'home',
        'exceptions',
        'dataQuality',
        'bdTeam',
        'bdMine',
      ].sort(),
    );
  });

  it('has a record page text for every object people open, app objects included', () => {
    expect(pagesOfKind('recordPage').sort()).toEqual(
      [...STANDARD_RECORD_PAGES, ...appObjectNames].sort(),
    );
  });

  it('opens the Home tab of every record page with How this record works, above the fields', () => {
    expect(recordPageWidgets.map(guidanceKeyOfWidget).sort()).toEqual(
      pagesOfKind('recordPage').sort(),
    );

    for (const widget of recordPageWidgets) {
      expect(widget.errors).toEqual([]);
      expect(widget.config).toMatchObject({
        title: GUIDANCE_WIDGET_TITLE.RECORD_PAGE,
        type: 'STANDALONE_RICH_TEXT',
        position: { layoutMode: 'VERTICAL_LIST', index: GUIDANCE_WIDGET_INDEX },
      });
    }

    const tabIdentifiers = recordPageWidgets.map(
      (widget) => widget.config.pageLayoutTabUniversalIdentifier,
    );

    expect(new Set(tabIdentifiers).size).toBe(recordPageWidgets.length);
  });

  it('opens every dashboard tab with How this tab works, across the full width', () => {
    const openingKeys = tabs.map((tab) => {
      const [first, ...rest] = tab.config.widgets ?? [];

      expect(first.title, tab.config.title).toBe(GUIDANCE_WIDGET_TITLE.DASHBOARD_TAB);
      expect(first.position, tab.config.title).toEqual({
        layoutMode: 'GRID',
        row: 0,
        column: 0,
        rowSpan: GUIDANCE_ROW_SPAN,
        columnSpan: GRID_COLUMNS,
      });

      for (const widget of rest) {
        expect(
          widget.position?.layoutMode === 'GRID' && widget.position.row >= GUIDANCE_ROW_SPAN,
          `${tab.config.title}: ${widget.title}`,
        ).toBe(true);
      }

      return guidanceKeyOf(first);
    });

    expect(openingKeys.sort()).toEqual(pagesOfKind('dashboardTab').sort());
  });

  it('renders every widget text into kuec/runbooks/20-guidance.md', () => {
    expect(() =>
      execFileSync('node', ['scripts/render-guidance.mjs', '--check'], {
        cwd: APP_DIRECTORY,
        stdio: 'pipe',
      }),
    ).not.toThrow();
  });
});
