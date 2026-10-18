'use client';

import { Group, Select, Text } from '@mantine/core';

import type { Persona } from '@/data/model';
import { useLocale } from '@/i18n/LocaleContext';

type KuecPersonPickerProps = {
  label: string;
  description?: string;
  people: Persona[];
  value: string | null;
  onChange: (id: string | null) => void;
  excludeIds?: string[];
};

// A searchable Select over workspace members; the option shows the role so a
// first-week colleague can pick the right person without knowing names.
export const KuecPersonPicker = ({ label, description, people, value, onChange, excludeIds = [] }: KuecPersonPickerProps) => {
  const { locale } = useLocale();
  const data = people.filter((person) => !excludeIds.includes(person.id)).map((person) => ({ value: person.id, label: person.name[locale], role: person.roleLabel[locale] }));

  return (
    <Select
      label={label}
      description={description}
      data={data}
      value={value}
      onChange={onChange}
      searchable
      allowDeselect={false}
      renderOption={({ option }) => {
        const match = data.find((item) => item.value === option.value);

        return (
          <Group justify="space-between" wrap="nowrap" w="100%">
            <Text size="sm">
              <bdi>{option.label}</bdi>
            </Text>
            <Text size="xs" c="dimmed">
              {match?.role}
            </Text>
          </Group>
        );
      }}
    />
  );
};
