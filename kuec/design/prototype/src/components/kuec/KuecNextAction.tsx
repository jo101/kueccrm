'use client';

import { Button, Group, Stack, Text } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';

import { useLocale } from '@/i18n/LocaleContext';

type KuecNextActionProps = {
  text: string | null;
  dateLabel: string | null;
  setHref: string;
};

// The one line every case must answer: what happens next, and when.
export const KuecNextAction = ({ text, dateLabel, setHref }: KuecNextActionProps) => {
  const { t, direction } = useLocale();

  return (
    <Group justify="space-between" wrap="nowrap" align="center">
      <Group gap="xs" wrap="nowrap" align="flex-start" style={{ minWidth: 0 }}>
        <IconArrowRight size={18} style={{ flexShrink: 0, marginTop: 2, transform: direction === 'rtl' ? 'scaleX(-1)' : undefined }} aria-hidden />
        <Stack gap={0} style={{ minWidth: 0 }}>
          <Text fw={500} size="sm" c={text ? undefined : 'error'}>
            {text ?? t('date.noNext')}
          </Text>
          {dateLabel ? (
            <Text size="xs" c="dimmed">
              {dateLabel}
            </Text>
          ) : null}
        </Stack>
      </Group>
      <Button component="a" href={setHref} variant={text ? 'subtle' : 'filled'} size="xs">
        {t('card.action.setNext')}
      </Button>
    </Group>
  );
};
