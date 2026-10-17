// Rehearsal harness helpers: GraphQL/REST against the rehearsal instance, persona tokens, polling.
import { readFileSync } from 'node:fs';
export const BASE = process.env.BASE ?? 'http://server:3000';
export const DIR = new URL('../rehearsal/', import.meta.url).pathname;
export const ADMIN_KEY = readFileSync(DIR + 'admin.apikey', 'utf8').trim();
export const PASSWORD = 'Rehearsal-2026!pw';

export const gql = async (endpoint, query, variables = {}, token = ADMIN_KEY) => {
  const response = await fetch(`${BASE}/${endpoint}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ query, variables }),
  });
  return response.json();
};

export const rest = async (method, path, body, token = ADMIN_KEY) => {
  const response = await fetch(`${BASE}/rest/${path}`, {
    method,
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  let json;
  try { json = JSON.parse(text); } catch { json = text; }
  return { status: response.status, json };
};

const tokenCache = new Map();
export const personaToken = async (email) => {
  const cached = tokenCache.get(email);
  if (cached && cached.at > Date.now() - 10 * 60_000) return cached.token;
  const login = await gql('metadata', `mutation($e: String!, $p: String!, $o: String!) { getLoginTokenFromCredentials(email:$e, password:$p, origin:$o) { loginToken { token } } }`, { e: email, p: PASSWORD, o: BASE }, null);
  const loginToken = login.data?.getLoginTokenFromCredentials?.loginToken?.token;
  if (!loginToken) throw new Error(`login ${email}: ${JSON.stringify(login.errors)}`);
  const tokens = await gql('metadata', `mutation($t: String!, $o: String!) { getAuthTokensFromLoginToken(loginToken:$t, origin:$o) { tokens { accessOrWorkspaceAgnosticToken { token } } } }`, { t: loginToken, o: BASE }, null);
  const token = tokens.data.getAuthTokensFromLoginToken.tokens.accessOrWorkspaceAgnosticToken.token;
  tokenCache.set(email, { token, at: Date.now() });
  return token;
};

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const waitFor = async (label, read, done, timeoutMs = 120_000, everyMs = 3000) => {
  const start = Date.now();
  let value = await read();
  while (!done(value)) {
    if (Date.now() - start > timeoutMs) return { ok: false, value, ms: Date.now() - start, label };
    await sleep(everyMs);
    value = await read();
  }
  return { ok: true, value, ms: Date.now() - start, label };
};

export const list = async (plural, filter, token = ADMIN_KEY, extra = '') => {
  const { json } = await rest('GET', `${plural}?limit=200${filter ? `&filter=${encodeURIComponent(filter)}` : ''}${extra}`, undefined, token);
  return json?.data?.[plural] ?? [];
};
