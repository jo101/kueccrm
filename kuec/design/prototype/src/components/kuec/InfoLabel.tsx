'use client';

import { Group, Text, Tooltip } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

type InfoLabelProps = {
  label: string;
  tooltip: string;
};

// Mirrors uVENTURE's FieldLabelWithInfo: one focusable icon beside the label,
// never inside the control, so it adds a single tab stop (audit U12).
export const InfoLabel = ({ label, tooltip }: InfoLabelProps) => (
  <Group gap={4} wrap="nowrap" component="span" style={{ display: 'inline-flex' }}>
    <Text component="span" size="sm" c="dimmed">
      {label}
    </Text>
    <Tooltip label={tooltip} multiline w={260} withArrow events={{ hover: true, focus: true, touch: true }}>
      <span role="img" aria-label={tooltip} tabIndex={0} style={{ display: 'inline-flex', color: 'var(--uv-accent-icon-color)' }}>
        <IconInfoCircle size={14} aria-hidden />
      </span>
    </Tooltip>
  </Group>
);
