import {
  getSystemPageLayoutTabUniversalIdentifier,
  getSystemRecordPageLayoutUniversalIdentifier,
} from 'twenty-sdk/define';
import { describe, expect, it } from 'vitest';

import { APPLICATION_UNIVERSAL_IDENTIFIER } from 'src/application.config';
import openWorkPackageCardCommand from 'src/command-menu-items/open-work-package-card.command-menu-item';
import workPackageCard, {
  WORK_PACKAGE_CARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
} from 'src/front-components/work-package-card.front-component';
import { WORK_PACKAGE_UNIVERSAL_IDENTIFIER } from 'src/objects/work-package.object';
import workPackageCardWidget from 'src/page-layout-widgets/work-package-card.page-layout-widget';

describe('Work package card surfaces', () => {
  it('are valid manifest entities', () => {
    for (const entity of [workPackageCard, workPackageCardWidget, openWorkPackageCardCommand]) {
      expect(entity.errors).toEqual([]);
    }
  });

  it('offers the card in the widget picker of work package record pages only', () => {
    expect(workPackageCard.config.isHeadless).toBeUndefined();
    expect(workPackageCard.config.widgetAvailability).toEqual({
      pageLayoutType: 'RECORD_PAGE',
      objectUniversalIdentifiers: [WORK_PACKAGE_UNIVERSAL_IDENTIFIER],
    });
  });

  it('places the card on the Home tab Twenty generates for work packages, after Fields', () => {
    const homeTab = getSystemPageLayoutTabUniversalIdentifier({
      objectMetadataApplicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
      pageLayoutUniversalIdentifier: getSystemRecordPageLayoutUniversalIdentifier({
        objectMetadataApplicationUniversalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
        objectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
      }),
      title: 'Home',
    });

    expect(workPackageCardWidget.config).toMatchObject({
      pageLayoutTabUniversalIdentifier: homeTab,
      type: 'FRONT_COMPONENT',
      position: { layoutMode: 'VERTICAL_LIST', index: 1 },
      configuration: {
        configurationType: 'FRONT_COMPONENT',
        frontComponentUniversalIdentifier: WORK_PACKAGE_CARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
      },
    });
  });

  it('opens the same card from a selected work package, such as a row in My work', () => {
    expect(openWorkPackageCardCommand.config).toMatchObject({
      availabilityType: 'RECORD_SELECTION',
      availabilityObjectUniversalIdentifier: WORK_PACKAGE_UNIVERSAL_IDENTIFIER,
      frontComponentUniversalIdentifier: WORK_PACKAGE_CARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
    });
  });
});
