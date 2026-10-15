import { RestApiClient } from 'twenty-client-sdk/rest';
import { MetadataApiClient } from 'twenty-client-sdk/metadata';
import { isDefined } from 'twenty-sdk/utils';

import { OPPORTUNITY_STAGE } from 'src/constants/opportunity-stage';

export const testApi = new RestApiClient({
  baseUrl: process.env.TWENTY_API_URL,
  token: process.env.TWENTY_API_KEY,
});

type ListResponse<TRecord> = { data: Record<string, TRecord[]> };

export const list = async <TRecord>(
  namePlural: string,
  filter: string,
): Promise<TRecord[]> => {
  const response = await testApi.get<ListResponse<TRecord>>(`/rest/${namePlural}`, {
    query: { filter, limit: 200 },
  });

  return response.data[namePlural] ?? [];
};

export const getOne = async <TRecord>(
  namePlural: string,
  id: string,
): Promise<TRecord> => {
  const [record] = await list<TRecord>(namePlural, `id[eq]:"${id}"`);

  if (!isDefined(record)) {
    throw new Error(`${namePlural} ${id} not found`);
  }

  return record;
};

export const create = async <TRecord extends { id: string }>(
  namePlural: string,
  nameSingular: string,
  data: Record<string, unknown>,
): Promise<TRecord> => {
  const response = await testApi.post<{ data: Record<string, TRecord> }>(
    `/rest/${namePlural}`,
    data,
  );
  const key = `create${nameSingular.charAt(0).toUpperCase()}${nameSingular.slice(1)}`;
  const created = response.data[key];

  if (!isDefined(created)) {
    throw new Error(`create ${nameSingular} returned nothing`);
  }

  return created;
};

export const update = (
  namePlural: string,
  id: string,
  data: Record<string, unknown>,
) => testApi.patch(`/rest/${namePlural}/${id}`, data);

export const remove = (namePlural: string, id: string) =>
  testApi.delete(`/rest/${namePlural}/${id}`).catch(() => undefined);

const sleep = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

// Event handlers run on the worker queue, so effects are polled for.
export const waitFor = async <TValue>(
  description: string,
  read: () => Promise<TValue>,
  isDone: (value: TValue) => boolean,
  timeoutMs = 90_000,
): Promise<TValue> => {
  const startedAt = Date.now();
  let value = await read();

  while (!isDone(value)) {
    if (Date.now() - startedAt > timeoutMs) {
      throw new Error(`Timed out waiting for ${description}: ${JSON.stringify(value)}`);
    }

    await sleep(2_000);
    value = await read();
  }

  return value;
};

// Long enough for any duplicate event or job to have run on an idle worker.
export const QUIET_PERIOD_MS = 20_000;

export const settle = () => sleep(QUIET_PERIOD_MS);

const API_URL = process.env.TWENTY_API_URL ?? '';

type GraphqlResponse<TData> = {
  data?: TData;
  errors?: { message: string }[];
};

const postMetadata = async <TData>(
  query: string,
  variables: Record<string, unknown>,
  token?: string,
): Promise<TData> => {
  const response = await fetch(`${API_URL}/metadata`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: API_URL,
      ...(isDefined(token) ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });
  const body = (await response.json()) as GraphqlResponse<TData>;

  if (isDefined(body.errors) || !isDefined(body.data)) {
    throw new Error(`metadata request failed: ${JSON.stringify(body.errors)}`);
  }

  return body.data;
};

let userAccessToken: string | null = null;

// Running a function by hand needs a member's session with the Workflows
// permission, as in production; an API key is refused.
const getUserAccessToken = async (): Promise<string> => {
  if (isDefined(userAccessToken)) {
    return userAccessToken;
  }

  const email = process.env.TWENTY_TEST_USER_EMAIL ?? 'tim@apple.dev';
  const password = process.env.TWENTY_TEST_USER_PASSWORD ?? 'tim@apple.dev';
  const { getLoginTokenFromCredentials } = await postMetadata<{
    getLoginTokenFromCredentials: { loginToken: { token: string } };
  }>(
    `mutation ($email: String!, $password: String!, $origin: String!) {
      getLoginTokenFromCredentials(email: $email, password: $password, origin: $origin) {
        loginToken { token }
      }
    }`,
    { email, password, origin: API_URL },
  );
  const { getAuthTokensFromLoginToken } = await postMetadata<{
    getAuthTokensFromLoginToken: {
      tokens: { accessOrWorkspaceAgnosticToken: { token: string } };
    };
  }>(
    `mutation ($loginToken: String!, $origin: String!) {
      getAuthTokensFromLoginToken(loginToken: $loginToken, origin: $origin) {
        tokens { accessOrWorkspaceAgnosticToken { token } }
      }
    }`,
    { loginToken: getLoginTokenFromCredentials.loginToken.token, origin: API_URL },
  );

  userAccessToken =
    getAuthTokensFromLoginToken.tokens.accessOrWorkspaceAgnosticToken.token;

  return userAccessToken;
};

export const executeFunction = async (
  functionName: string,
  payload: Record<string, unknown> = {},
): Promise<Record<string, unknown>> => {
  const token = await getUserAccessToken();
  const { findManyLogicFunctions } = await postMetadata<{
    findManyLogicFunctions: { id: string; name: string }[];
  }>('{ findManyLogicFunctions { id name } }', {}, token);
  const logicFunction = findManyLogicFunctions.find(
    ({ name }) => name === functionName,
  );

  if (!isDefined(logicFunction)) {
    throw new Error(`${functionName} is not installed`);
  }

  const { executeOneLogicFunction } = await postMetadata<{
    executeOneLogicFunction: {
      data: Record<string, unknown> | null;
      logs: string;
      error: { errorMessage: string } | null;
    };
  }>(
    `mutation ($input: ExecuteOneLogicFunctionInput!) {
      executeOneLogicFunction(input: $input) { data logs error }
    }`,
    { input: { id: logicFunction.id, payload } },
    token,
  );

  if (isDefined(executeOneLogicFunction.error)) {
    throw new Error(
      `${functionName} threw: ${JSON.stringify(executeOneLogicFunction.error)}\n${executeOneLogicFunction.logs}`,
    );
  }

  return executeOneLogicFunction.data ?? {};
};

// The click-runbook adds these options to the standard stage field in production.
export const ensureOpportunityStageOptions = async () => {
  const metadataClient = new MetadataApiClient();
  const { objects } = await metadataClient.query({
    objects: {
      __args: { filter: {}, paging: { first: 200 } },
      edges: {
        node: {
          nameSingular: true,
          fieldsList: { id: true, name: true, options: true },
        },
      },
    },
  });
  const stageField = objects.edges
    .find(({ node }) => node.nameSingular === 'opportunity')
    ?.node.fieldsList?.find(({ name }) => name === 'stage');

  if (!isDefined(stageField)) {
    throw new Error('opportunity.stage not found');
  }

  const options = (stageField.options ?? []) as {
    value: string;
    position: number;
  }[];
  const missing = Object.values(OPPORTUNITY_STAGE).filter(
    (value) => !options.some((option) => option.value === value),
  );

  if (missing.length === 0) {
    return;
  }

  await metadataClient.mutation({
    updateOneField: {
      __args: {
        input: {
          id: stageField.id,
          update: {
            // The metadata API types JSON scalars as a plain record.
            options: [
              ...options,
              ...missing.map((value, index) => ({
                value,
                label: `${value.charAt(0)}${value.slice(1).toLowerCase()}`,
                position: options.length + index,
                color: 'gray',
              })),
            ] as unknown as Record<string, unknown>,
          },
        },
      },
      id: true,
    },
  });
};
