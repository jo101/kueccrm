import { defineApplication } from 'twenty-sdk/define';

export const SPIKE_APPLICATION_UNIVERSAL_IDENTIFIER = '3f1b8c2e-5d4a-4e7b-9c1d-2a6f8e0b4c71';

export default defineApplication({
  universalIdentifier: SPIKE_APPLICATION_UNIVERSAL_IDENTIFIER,
  displayName: 'KUEC Mantine spike',
  description:
    'Throwaway compatibility spike: Mantine 8.3.18 inside the Twenty 2.48 front component runtime',
});
