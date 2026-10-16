import {
  defineCommandMenuItem,
  numberOfSelectedRecords,
} from 'twenty-sdk/define';
import { WORK_PACKAGE_CARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from '../front-components/work-package-card.front-component';
import { WORK_PACKAGE_UNIVERSAL_IDENTIFIER } from '../objects/work-package.object';

export const OPEN_WORK_PACKAGE_CARD_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIER = '8fbfe243-540b-470d-a7e0-f3920753db84';

// Select one row in My work (or any work package list) to open the same card
// in the side panel.
export default defineCommandMenuItem({
  universalIdentifier: OPEN_WORK_PACKAGE_CARD_COMMAND_MENU_ITEM_UNIVERSAL_IDENTIFIER,
  label: 'Open work package card',
  shortLabel: 'Card',
  isPinned: true,
  availabilityType: 'RECORD_SELECTION',
  availabilityObjectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
  conditionalAvailabilityExpression: numberOfSelectedRecords === 1,
  frontComponentUniversalIdentifier:
    WORK_PACKAGE_CARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
});
