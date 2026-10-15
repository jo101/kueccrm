import { RestApiClient, RestApiClientError } from 'twenty-client-sdk/rest';
import { RetryableLogicFunctionError } from 'twenty-sdk/logic-function';
import { isDefined } from 'twenty-sdk/utils';

import { type ObjectNames } from 'src/automation/records/object-names';

const PAGE_SIZE = 200;
const MAX_PAGES = 25;

export type TwentyApi = {
  // The person behind the run (intersected with the app role), or the app when nobody is.
  asPerson: RestApiClient;
  // The app's own role: system fields, configuration, and work no person triggered.
  asApplication: RestApiClient;
};

// Built per run: a client caches its token, and a token belongs to one run's person.
export const createTwentyApi = (): TwentyApi => ({
  asPerson: new RestApiClient(),
  asApplication: new RestApiClient({ runAs: 'application' }),
});

const isTransientStatus = (status: number | undefined): boolean =>
  !isDefined(status) || status === 408 || status === 429 || status >= 500;

const describeError = (error: unknown): string =>
  error instanceof RestApiClientError
    ? `${error.message} ${JSON.stringify(error.body ?? '')}`
    : error instanceof Error
      ? error.message
      : String(error);

// Rate limits, server errors and network failures are retried by the queue (3 times);
// anything else (validation, permission) is a bug and fails the run.
const callApi = async <TResult>(
  operation: string,
  run: () => Promise<TResult>,
): Promise<TResult> => {
  try {
    return await run();
  } catch (error) {
    if (error instanceof RestApiClientError && !isTransientStatus(error.status)) {
      throw new Error(`${operation} failed: ${describeError(error)}`);
    }

    throw new RetryableLogicFunctionError(
      `${operation} failed transiently: ${describeError(error)}`,
    );
  }
};

const capitalize = (value: string): string =>
  `${value.charAt(0).toUpperCase()}${value.slice(1)}`;

type ListResponse = {
  data: Record<string, unknown[]>;
  pageInfo?: { hasNextPage?: boolean; endCursor?: string | null };
};

export const listRecords = async <TRecord>(
  client: RestApiClient,
  objectNames: ObjectNames,
  filter?: string,
): Promise<TRecord[]> => {
  const records: TRecord[] = [];
  let cursor: string | null = null;

  for (let page = 0; page < MAX_PAGES; page++) {
    const response: ListResponse = await callApi(
      `list ${objectNames.plural}`,
      () =>
        client.get<ListResponse>(`/rest/${objectNames.plural}`, {
          query: {
            limit: PAGE_SIZE,
            filter,
            starting_after: cursor ?? undefined,
          },
        }),
    );

    records.push(...((response.data[objectNames.plural] ?? []) as TRecord[]));

    const endCursor = response.pageInfo?.endCursor ?? null;

    if (response.pageInfo?.hasNextPage !== true || !isDefined(endCursor)) {
      return records;
    }

    cursor = endCursor;
  }

  throw new Error(
    `list ${objectNames.plural} returned more than ${PAGE_SIZE * MAX_PAGES} records; narrow the filter`,
  );
};

export const getRecord = async <TRecord>(
  client: RestApiClient,
  objectNames: ObjectNames,
  recordId: string,
): Promise<TRecord | null> => {
  const records = await listRecords<TRecord>(
    client,
    objectNames,
    `id[eq]:"${recordId}"`,
  );

  return records[0] ?? null;
};

export const createRecord = async <TRecord>(
  client: RestApiClient,
  objectNames: ObjectNames,
  data: Record<string, unknown>,
): Promise<TRecord> => {
  const response = await callApi(`create ${objectNames.singular}`, () =>
    client.post<{ data: Record<string, TRecord> }>(
      `/rest/${objectNames.plural}`,
      data,
    ),
  );

  const created = response.data[`create${capitalize(objectNames.singular)}`];

  if (!isDefined(created)) {
    throw new Error(`create ${objectNames.singular} returned no record`);
  }

  return created;
};

export const updateRecord = async (
  client: RestApiClient,
  objectNames: ObjectNames,
  recordId: string,
  data: Record<string, unknown>,
): Promise<void> => {
  await callApi(`update ${objectNames.singular} ${recordId}`, () =>
    client.patch(`/rest/${objectNames.plural}/${recordId}`, data),
  );
};

export const quoteFilterValues = (values: readonly string[]): string =>
  `[${values.map((value) => `"${value}"`).join(',')}]`;

export const withRetryableErrors = callApi;
