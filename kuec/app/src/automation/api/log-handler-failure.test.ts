import { afterEach, describe, expect, it, vi } from 'vitest';

import { withFailureLog } from 'src/automation/api/log-handler-failure';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('withFailureLog', () => {
  it('passes a successful result through without logging', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const handler = withFailureLog('w01', async (_event: { recordId: string }) => ({ ok: true }));

    await expect(handler({ recordId: 'opportunity-1' })).resolves.toEqual({ ok: true });
    expect(consoleError).not.toHaveBeenCalled();
  });

  it('logs the function, the record and the message, then rethrows the same error', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const error = new Error('Bad Request');
    const handler = withFailureLog('w01', async (_event: { recordId: string }) => {
      throw error;
    });

    await expect(handler({ recordId: 'opportunity-1' })).rejects.toBe(error);
    expect(consoleError).toHaveBeenCalledWith('w01 failed for opportunity-1: Bad Request');
  });
});
