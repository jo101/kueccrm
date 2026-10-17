import { isNonEmptyArray } from '@sniptt/guards';
import { isDefined } from 'twenty-sdk/utils';

import { OPPORTUNITY_STAGE } from 'src/constants/opportunity-stage';
import { OPPORTUNITY_PLAYBOOK_TYPE } from 'src/fields/playbook-type-on-opportunity.field';

// The open stages in order; Lost and Parked leave the pipeline and need no
// exit criteria (CRM pack, kuec/playbooks/crm-pack.md).
export const PIPELINE_STAGE_ORDER: string[] = [
  OPPORTUNITY_STAGE.NEW,
  OPPORTUNITY_STAGE.SCREENING,
  OPPORTUNITY_STAGE.MEETING,
  OPPORTUNITY_STAGE.PROPOSAL,
  OPPORTUNITY_STAGE.CUSTOMER,
  OPPORTUNITY_STAGE.SIGNED,
];

export type ExitCheckOpportunity = {
  playbookType: string | null;
  companyId: string | null;
  ownerId: string | null;
  source: string | null;
  pointOfContactId: string | null;
  offering: string[] | null;
  amount: { amountMicros: number | null } | null;
  closeDate: string | null;
  fundingPath: string | null;
  probability: string | null;
  sharepointFolder: { primaryLinkUrl: string | null } | null;
  capabilityId: string | null;
  uventureRecord: { primaryLinkUrl: string | null } | null;
};

type ExitCriterion = {
  label: string;
  isMet: (opportunity: ExitCheckOpportunity) => boolean;
};

const hasLink = (links: { primaryLinkUrl: string | null } | null): boolean =>
  isDefined(links?.primaryLinkUrl) && links.primaryLinkUrl !== '';

const isLicence = (opportunity: ExitCheckOpportunity): boolean =>
  opportunity.playbookType === OPPORTUNITY_PLAYBOOK_TYPE.TECHNOLOGY_LICENSING;

// What must be true to leave each stage, in plain words for the owner.
export const STAGE_EXIT_CRITERIA: Record<string, ExitCriterion[]> = {
  [OPPORTUNITY_STAGE.NEW]: [
    { label: 'Company', isMet: ({ companyId }) => isDefined(companyId) },
    { label: 'Owner', isMet: ({ ownerId }) => isDefined(ownerId) },
    { label: 'Source', isMet: ({ source }) => isDefined(source) },
    { label: 'Type', isMet: ({ playbookType }) => isDefined(playbookType) },
  ],
  [OPPORTUNITY_STAGE.SCREENING]: [
    { label: 'Point of contact', isMet: ({ pointOfContactId }) => isDefined(pointOfContactId) },
    { label: 'Offering', isMet: ({ offering }) => isNonEmptyArray(offering) },
  ],
  [OPPORTUNITY_STAGE.MEETING]: [
    { label: 'Amount', isMet: ({ amount }) => isDefined(amount?.amountMicros) },
    { label: 'Close date', isMet: ({ closeDate }) => isDefined(closeDate) },
    { label: 'Funding path', isMet: ({ fundingPath }) => isDefined(fundingPath) },
  ],
  [OPPORTUNITY_STAGE.PROPOSAL]: [
    { label: 'Probability', isMet: ({ probability }) => isDefined(probability) },
  ],
  [OPPORTUNITY_STAGE.CUSTOMER]: [
    { label: 'SharePoint folder', isMet: ({ sharepointFolder }) => hasLink(sharepointFolder) },
    {
      label: 'Capability (the technology)',
      isMet: (opportunity) => !isLicence(opportunity) || isDefined(opportunity.capabilityId),
    },
    {
      label: 'uVENTURE record',
      isMet: (opportunity) => !isLicence(opportunity) || hasLink(opportunity.uventureRecord),
    },
  ],
};

export const isForwardMove = (fromStage: string | null, toStage: string): boolean => {
  const from = PIPELINE_STAGE_ORDER.indexOf(fromStage ?? '');
  const to = PIPELINE_STAGE_ORDER.indexOf(toStage);

  return to > 0 && to > from;
};

// Cumulative: a case that skips a stage still owes that stage's exit criteria.
export const stageExitGaps = (opportunity: ExitCheckOpportunity, toStage: string): string[] => {
  const to = PIPELINE_STAGE_ORDER.indexOf(toStage);

  if (to <= 0) {
    return [];
  }

  return PIPELINE_STAGE_ORDER.slice(0, to)
    .flatMap((stage) => STAGE_EXIT_CRITERIA[stage] ?? [])
    .filter((criterion) => !criterion.isMet(opportunity))
    .map((criterion) => criterion.label);
};
