import type { StorybookConfig } from '@storybook/nextjs-vite';

// Every Kuec pattern has a story; scripts/check-design-rules.mjs fails when one does not.
const config: StorybookConfig = {
  framework: '@storybook/nextjs-vite',
  stories: ['../src/components/**/*.stories.tsx'],
  staticDirs: [],
};

export default config;
