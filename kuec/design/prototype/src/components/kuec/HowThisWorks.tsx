'use client';

import { ActionIcon, Popover, Stack, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

import { useLocale } from '@/i18n/LocaleContext';
import type { MessageKey } from '@/i18n/messages';

type HowThisWorksProps = {
  // The five lines of runbook 20, in this order: what it is, who owns it,
  // what must be filled, what happens automatically, where to get help.
  lineKeys: [MessageKey, MessageKey, MessageKey, MessageKey, MessageKey];
};

const LABEL_KEYS: MessageKey[] = ['how.label.1', 'how.label.2', 'how.label.3', 'how.label.4', 'how.label.5'];

export const HowThisWorks = ({ lineKeys }: HowThisWorksProps) => {
  const { t } = useLocale();

  return (
    <Popover width={360} position="bottom-start" withArrow shadow="md">
      <Popover.Target>
        <ActionIcon variant="subtle" color="gray" aria-label={t('how.title')} size="lg">
          <IconInfoCircle size={20} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack gap="xs">
          <Text fw={600}>{t('how.title')}</Text>
          {lineKeys.map((lineKey, index) => (
            <Text key={lineKey} size="sm">
              <Text component="span" fw={500}>
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
