import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

// A disposable instance only: the suite creates and deletes records, installs
// and uninstalls the app. Never point it at production.
const TWENTY_API_URL = process.env.TWENTY_API_URL ?? 'http://localhost:2020';
const TWENTY_API_KEY = process.env.TWENTY_API_KEY;

if (TWENTY_API_KEY === undefined) {
  throw new Error(
    'Set TWENTY_API_KEY to an API key of the disposable test instance (see kuec/tests/04-automation.md).',
  );
}

// Make env vars available to globalSetup (test.env only applies to workers)
process.env.TWENTY_API_URL = TWENTY_API_URL;
process.env.TWENTY_API_KEY = TWENTY_API_KEY;

export default defineConfig({
  plugins: [
    tsconfigPaths({
      projects: ['tsconfig.spec.json'],
      ignoreConfigErrors: true,
    }),
  ],
  test: {
    testTimeout: 180_000,
    hookTimeout: 180_000,
    fileParallelism: false,
    sequence: { concurrent: false },
    include: ['src/**/*.integration-test.ts'],
    globalSetup: ['src/__tests__/global-setup.ts'],
    env: {
      TWENTY_API_URL,
      TWENTY_API_KEY,
    },
  },
});
