'use client';

import { ActionIcon, Popover, Stack, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

import { useLocale } from '@/i18n/LocaleContext';
import type { MessageKey } from '@/i18n/messages';

export type HowThisWorksKeys = [MessageKey, MessageKey, MessageKey, MessageKey, MessageKey];

type HowThisWorksProps = {
  // The five lines of runbook 20, in this order: what it is, who owns it,
  // what must be filled, what happens automatically, where to get help.
  lineKeys: HowThisWorksKeys;
};

const LABEL_KEYS: MessageKey[] = ['how.label.1', 'how.label.2', 'how.label.3', 'how.label.4', 'how.label.5'];

export const HowThisWorks = ({ lineKeys }: HowThisWorksProps) => {
  const { t } = useLocale();

  return (
    <Popover width={360} position="bottom-start" withArrow>
      <Popover.Target>
        <ActionIcon variant="subtle" color="gray" aria-label={t('how.title')} size={36}>
          <IconInfoCircle size={18} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack gap="xs">
          <Text fw={600} size="sm">
            {t('how.title')}
          </Text>
          {lineKeys.map((lineKey, index) => (
            <Text key={lineKey} size="sm">
              <Text component="span" fw={600}>
                {t(LABEL_KEYS[index])}:
              </Text>{' '}
              {t(lineKey)}
            </Text>
          ))}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};
