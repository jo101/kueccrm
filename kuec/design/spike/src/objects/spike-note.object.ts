import { defineObject, FieldType } from 'twenty-sdk/define';

export const SPIKE_NOTE_UNIVERSAL_IDENTIFIER = '7c9e4a1b-2f3d-4b8e-a6c5-1d0e9f8b7a62';
export const SPIKE_NOTE_NAME_FIELD_UNIVERSAL_IDENTIFIER = 'b4d8e2f6-9a1c-4e3b-8d7f-5c2a1b0e9d83';

export default defineObject({
  universalIdentifier: SPIKE_NOTE_UNIVERSAL_IDENTIFIER,
  nameSingular: 'spikeNote',
  namePlural: 'spikeNotes',
  labelSingular: 'Spike note',
  labelPlural: 'Spike notes',
  description: 'Carrier record for the Mantine compatibility spike widget.',
  icon: 'IconFlask',
  labelIdentifierFieldMetadataUniversalIdentifier: SPIKE_NOTE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    {
      universalIdentifier: SPIKE_NOTE_NAME_FIELD_UNIVERSAL_IDENTIFIER,
      type: FieldType.TEXT,
      name: 'name',
      label: 'Name',
      description: 'Name of the spike record.',
      icon: 'IconAbc',
    },
  ],
});
