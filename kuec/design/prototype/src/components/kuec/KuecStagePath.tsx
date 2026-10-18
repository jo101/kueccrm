'use client';

import { Button, Group, Text, Tooltip } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

import { OPPORTUNITY_STAGE_PATH, type OpportunityStage } from '@/data/model';
import { useLocale } from '@/i18n/LocaleContext';
import type { MessageKey } from '@/i18n/messages';

type KuecStagePathProps = {
  stage: OpportunityStage;
  // Closed Lost and On Hold are states, not steps: the path shows them as a label after the chevrons.
  onMarkComplete?: () => void;
  markCompletePrimary?: boolean;
  markCompleteLoading?: boolean;
};

// The chevron stage path of the record template. Completed stages carry a
// check, the current one a stronger surface; no accent fill, so the single
// filled button stays the only accent on the screen.
export const KuecStagePath = ({ stage, onMarkComplete, markCompletePrimary = false, markCompleteLoading = false }: KuecStagePathProps) => {
  const { t } = useLocale();
  const activeIndex = OPPORTUNITY_STAGE_PATH.indexOf(stage);
  const isOffPath = activeIndex === -1;
  const isLast = activeIndex === OPPORTUNITY_STAGE_PATH.length - 1;

  return (
    <Group gap="md" wrap="wrap" align="center" className="kuec-stage-path" role="group" aria-label={t('opp.stage')}>
      <Tooltip label={t('info.stagePath')} multiline w={256} events={{ hover: true, focus: true, touch: true }}>
        <ol className="kuec-chevrons" aria-label={t('opp.stage')}>
          {OPPORTUNITY_STAGE_PATH.map((item, index) => {
            const state = isOffPath ? 'done' : index < activeIndex ? 'done' : index === activeIndex ? 'current' : 'todo';

            return (
              <li key={item} className={`kuec-chevron kuec-chevron-${state}`} aria-current={state === 'current' ? 'step' : undefined}>
                <span className="kuec-chevron-label">
                  {state === 'done' ? <IconCheck size={14} aria-hidden /> : null}
                  <span>{t(`stage.${item}` as MessageKey)}</span>
                </span>
              </li>
            );
          })}
        </ol>
      </Tooltip>
      {isOffPath ? (
        <Text size="sm" fw={600} c="dimmed">
          {t(`stage.${stage}` as MessageKey)}
        </Text>
      ) : null}
      {onMarkComplete && !isOffPath && !isLast ? (
        <Button variant={markCompletePrimary ? 'filled' : 'default'} onClick={onMarkComplete} loading={markCompleteLoading} className="kuec-action" style={{ marginInlineStart: 'auto' }}>
          {t('action.markStageComplete')}
        </Button>
      ) : null}
    </Group>
  );
};
