import {
  definePageLayoutWidget,
  getSystemPageLayoutTabUniversalIdentifier,
  getSystemRecordPageLayoutUniversalIdentifier,
  PageLayoutTabLayoutMode,
  PageLayoutWidgetVerticalListHeightBehavior,
} from 'twenty-sdk/define';
import { SPIKE_APPLICATION_UNIVERSAL_IDENTIFIER } from '../application.config';
import { MANTINE_SPIKE_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from '../front-components/mantine-spike.front-component';
import { SPIKE_NOTE_UNIVERSAL_IDENTIFIER } from '../objects/spike-note.object';

export const MANTINE_SPIKE_WIDGET_UNIVERSAL_IDENTIFIER = '9d2f6b8a-1c4e-4f7a-b3d5-8e0a2c6f1b45';

export const SPIKE_NOTE_HOME_TAB_UNIVERSAL_IDENTIFIER = getSystemPageLayoutTabUniversalIdentifier({
  objectMetadataApplicationUniversalIdentifier: SPIKE_APPLICATION_UNIVERSAL_IDENTIFIER,
  pageLayoutUniversalIdentifier: getSystemRecordPageLayoutUniversalIdentifier({
    objectMetadataApplicationUniversalIdentifier: SPIKE_APPLICATION_UNIVERSAL_IDENTIFIER,
    objectUniversalIdentifier: SPIKE_NOTE_UNIVERSAL_IDENTIFIER,
  }),
  title: 'Home',
});

export default definePageLayoutWidget({
  universalIdentifier: MANTINE_SPIKE_WIDGET_UNIVERSAL_IDENTIFIER,
  pageLayoutTabUniversalIdentifier: SPIKE_NOTE_HOME_TAB_UNIVERSAL_IDENTIFIER,
  title: 'Mantine spike',
  type: 'FRONT_COMPONENT',
  objectUniversalIdentifier: SPIKE_NOTE_UNIVERSAL_IDENTIFIER,
  position: {
    layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
    index: 1,
    heightBehavior: PageLayoutWidgetVerticalListHeightBehavior.FIT_CONTENT,
  },
  configuration: {
    configurationType: 'FRONT_COMPONENT',
    frontComponentUniversalIdentifier: MANTINE_SPIKE_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  },
});
