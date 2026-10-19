// The server keeps a failed run's error out of the function logs, and a
// non-retryable error still leaves the queue job completed. Without this line
// a handler that throws on every run leaves no trace anyone looks at (B5).
// The error is rethrown unchanged so retryable failures stay retryable.
export const withFailureLog =
  <TEvent extends { recordId?: string }, TResult>(
    functionName: string,
    handler: (event: TEvent) => Promise<TResult>,
  ) =>
  async (event: TEvent): Promise<TResult> => {
    try {
      return await handler(event);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const subject = event.recordId === undefined ? '' : ` for ${event.recordId}`;

      console.error(`${functionName} failed${subject}: ${message}`);

      throw error;
    }
  };
