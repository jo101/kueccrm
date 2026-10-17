import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  type defineLogicFunction,
  type definePageLayoutTab,
  type defineView,
  FieldType,
} from 'twenty-sdk/define';
import { beforeAll, describe, expect, it } from 'vitest';

import { loadDefaultExports } from 'src/__tests__/utils/load-default-exports';
import applicationConfig from 'src/application.config';
import guidanceJson from 'src/i18n/guidance.json';
import { buildGuidanceBody } from 'src/i18n/guidance-widget-body';
import { PACK_ENABLED_VARIABLE } from 'src/packs/pack-switch';
import { PACKS } from 'src/packs/packs';

type ViewDefinition = ReturnType<typeof defineView>;
type TabDefinition = ReturnType<typeof definePageLayoutTab>;
type LogicFunctionDefinition = ReturnType<typeof defineLogicFunction>;

const KUEC_DIRECTORY = join(__dirname, '..', '..', '..');
const LOGIC_FUNCTION_DIRECTORY = join(__dirname, '..', 'logic-functions');

describe('best-practice packs (src/packs/packs.ts)', () => {
  const viewIds = new Set<string>();
  const tabs = new Map<string, TabDefinition['config']>();
  const logicFunctionSources = new Map<string, string>();

  beforeAll(async () => {
    for (const directory of [join(__dirname, '..', 'views'), join(__dirname, '..', 'views', 'dashboard')]) {
      for (const view of await loadDefaultExports<ViewDefinition>(directory, '.view.ts')) {
        viewIds.add(view.config.universalIdentifier);
      }
    }

    for (const tab of await loadDefaultExports<TabDefinition>(
      join(__dirname, '..', 'page-layout-tabs'),
      '.page-layout-tab.ts',
    )) {
      tabs.set(tab.config.universalIdentifier, tab.config);
    }

    for (const fileName of readdirSync(LOGIC_FUNCTION_DIRECTORY).filter((name) => name.endsWith('.ts'))) {
      const definition = (
        (await import(join(LOGIC_FUNCTION_DIRECTORY, fileName))) as { default: LogicFunctionDefinition }
      ).default;

      logicFunctionSources.set(
        definition.config.universalIdentifier,
        readFileSync(join(LOGIC_FUNCTION_DIRECTORY, fileName), 'utf8'),
      );
    }
  });

  it('switches each pack with a boolean application variable that defaults to on', () => {
    const variables = applicationConfig.config.applicationVariables ?? {};

    for (const pack of PACKS) {
      expect(PACK_ENABLED_VARIABLE[pack.pack], pack.label).toBe(pack.enabledVariable);
      expect(variables[pack.enabledVariable], pack.label).toMatchObject({
        type: FieldType.BOOLEAN,
        isSecret: false,
        value: true,
      });
    }
  });

  it('ships a playbook for each pack that names its tab and its switch', () => {
    for (const pack of PACKS) {
      const path = join(KUEC_DIRECTORY, pack.playbook);

      expect(existsSync(path), pack.playbook).toBe(true);

      const playbook = readFileSync(path, 'utf8');

      expect(playbook, pack.playbook).toContain(pack.dashboardTabTitle);
      expect(playbook, pack.playbook).toContain(pack.enabledVariable);
    }
  });

  it('opens each pack tab with the pack guidance', () => {
    for (const pack of PACKS) {
      const tab = tabs.get(pack.dashboardTabUniversalIdentifier);

      expect(tab?.title, pack.label).toBe(pack.dashboardTabTitle);
      expect(guidanceJson.pages.some((page) => page.key === pack.guidancePageKey), pack.label).toBe(true);
      expect(JSON.stringify(tab?.widgets?.[0]?.configuration), pack.label).toContain(
        JSON.stringify(buildGuidanceBody(pack.guidancePageKey).markdown).slice(1, 60),
      );
    }
  });

  it('lists only views the app ships', () => {
    for (const pack of PACKS) {
      for (const viewId of pack.viewUniversalIdentifiers) {
        expect(viewIds.has(viewId), `${pack.label} ${viewId}`).toBe(true);
      }
    }
  });

  it('lets every pack automation stand down when its variable is off', () => {
    for (const pack of PACKS) {
      for (const logicFunctionId of pack.logicFunctionUniversalIdentifiers) {
        const source = logicFunctionSources.get(logicFunctionId);

        expect(source, `${pack.label} ${logicFunctionId}`).toBeDefined();
        expect(source, `${pack.label} ${logicFunctionId}`).toContain(`isPackEnabled(PACK.${pack.pack})`);
      }
    }
  });
});
