import { definePageLayoutTab, PageLayoutTabLayoutMode } from 'twenty-sdk/define';
import { MANTINE_SPIKE_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from '../front-components/mantine-spike.front-component';
import { SPIKE_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER } from '../page-layouts/spike.page-layout';

export const SPIKE_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER = '2e6a9c4d-8f1b-4b3e-a7d2-6c0e8b5f3a97';
export const SPIKE_PAGE_WIDGET_UNIVERSAL_IDENTIFIER = '8b3d5f7a-2e9c-4c1b-9a6d-4f2e0c8a7b58';

export default definePageLayoutTab({
  universalIdentifier: SPIKE_PAGE_LAYOUT_TAB_UNIVERSAL_IDENTIFIER,
  pageLayoutUniversalIdentifier: SPIKE_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER,
  title: 'Spike',
  position: 0,
  icon: 'IconFlask',
  layoutMode: PageLayoutTabLayoutMode.GRID,
  widgets: [
    {
      universalIdentifier: SPIKE_PAGE_WIDGET_UNIVERSAL_IDENTIFIER,
      title: 'Mantine spike (standalone page)',
      type: 'FRONT_COMPONENT',
      position: { layoutMode: PageLayoutTabLayoutMode.GRID, row: 0, column: 0, rowSpan: 24, columnSpan: 12 },
      configuration: {
        configurationType: 'FRONT_COMPONENT',
        frontComponentUniversalIdentifier: MANTINE_SPIKE_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
      },
    },
  ],
});
