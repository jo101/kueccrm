'use client';

import { Stepper } from '@mantine/core';

import { OPPORTUNITY_STAGE_ORDER, type OpportunityStage } from '@/data/model';
import { useLocale } from '@/i18n/LocaleContext';
import type { MessageKey } from '@/i18n/messages';

type KuecProgressStepsProps = {
  stage: OpportunityStage;
};

// The agreed stages only (Qualify, Scope, Propose, Negotiate, Signed); Lost and
// Parked are states, not steps, and show as a status indicator instead.
export const KuecProgressSteps = ({ stage }: KuecProgressStepsProps) => {
  const { t } = useLocale();
  const active = OPPORTUNITY_STAGE_ORDER.indexOf(stage);

  return (
    <Stepper active={active} size="xs" allowNextStepsSelect={false} iconSize={22}>
      {OPPORTUNITY_STAGE_ORDER.map((item) => (
        <Stepper.Step key={item} label={t(`stage.${item}` as MessageKey)} />
      ))}
    </Stepper>
  );
};
