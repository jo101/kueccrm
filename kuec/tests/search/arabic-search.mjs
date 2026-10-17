// End-to-end check of Arabic global search (runbooks/12-global-features.md section 1).
// Creates records marked TEST-ARS through the REST API, runs each query through the
// same `search` GraphQL query the command menu uses, prints the matrix, and destroys
// the records. Every expectation is 2.48 behaviour: a FAIL means search changed
// (an upgrade, a reverted field) and the runbook's rule needs another look.
//
// TWENTY_API_URL=https://crm.uventure-staging.kuec.example TWENTY_API_KEY=<admin key> node kuec/tests/search/arabic-search.mjs
// Staging or a disposable instance only: it writes and destroys records.

const API_URL = process.env.TWENTY_API_URL;
const API_KEY = process.env.TWENTY_API_KEY;

if (!API_URL || !API_KEY) {
  console.error('Set TWENTY_API_URL and TWENTY_API_KEY.');
  process.exit(2);
}

const MARKER = 'TEST-ARS';

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
};

const rest = async (method, path, body) => {
  const response = await fetch(`${API_URL}/rest/${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`${method} ${path}: ${response.status} ${text}`);
  }

  return text.length > 0 ? JSON.parse(text) : {};
};

const createRecord = async (objectNamePlural, objectNameSingular, data) => {
  const response = await rest('POST', objectNamePlural, data);
  const created = response.data?.[`create${objectNameSingular[0].toUpperCase()}${objectNameSingular.slice(1)}`];

  if (!created?.id) {
    throw new Error(`create ${objectNameSingular}: no id in ${JSON.stringify(response)}`);
  }

  return created.id;
};

const SEARCH_QUERY = `query Search($searchInput: String!, $limit: Int!, $includedObjectNameSingulars: [String!]) {
  search(searchInput: $searchInput, limit: $limit, includedObjectNameSingulars: $includedObjectNameSingulars) {
    edges { node { recordId objectNameSingular label } }
  }
}`;

const search = async (searchInput, objectNameSingular) => {
  const response = await fetch(`${API_URL}/graphql`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query: SEARCH_QUERY,
      variables: {
        searchInput,
        limit: 30,
        includedObjectNameSingulars: [objectNameSingular],
      },
    }),
  });
  const body = await response.json();

  if (body.errors) {
    throw new Error(`search "${searchInput}": ${JSON.stringify(body.errors)}`);
  }

  return new Set(body.data.search.edges.map(({ node }) => node.recordId));
};

// Same Arabic name twice: once as typed, once with Search keywords filled per the team rule.
const RECORDS = {
  companyPlain: {
    plural: 'companies',
    singular: 'company',
    data: { name: `${MARKER} Abu Dhabi Petroleum Services`, nameArabic: 'شركة أبوظبي للخدمات البترولية' },
  },
  companyWithKeywords: {
    plural: 'companies',
    singular: 'company',
    data: {
      name: `${MARKER} Abu Dhabi Petroleum Services (keywords)`,
      nameArabic: 'شركة أبوظبي للخدمات البترولية',
      keywords: 'ابوظبي خدمات بترولية abudhabi adps',
    },
  },
  personPlain: {
    plural: 'people',
    singular: 'person',
    data: {
      name: { firstName: `${MARKER} Mohammed`, lastName: 'Al Hammadi' },
      nameArabic: 'محمد الحمادي',
      emails: { primaryEmail: 'm.alhammadi@test-ars.example' },
      phones: { primaryPhoneNumber: '501234567', primaryPhoneCallingCode: '+971', primaryPhoneCountryCode: 'AE' },
    },
  },
  personWithDiacritics: {
    plural: 'people',
    singular: 'person',
    data: { name: { firstName: `${MARKER} Ahmed`, lastName: 'Al Mansoori' }, nameArabic: 'أَحْمَد المنصوري' },
  },
  opportunity: {
    plural: 'opportunities',
    singular: 'opportunity',
    data: { name: `${MARKER} Pipeline inspection licence`, nextAction: 'إرسال العرض الفني للعميل' },
  },
  workPackage: {
    plural: 'workPackages',
    singular: 'workPackage',
    data: { name: `${MARKER} دراسة الجدوى`, objective: 'تقييم الجدوى الفنية للتقنية' },
  },
};

// [query, object, records expected to be found]
const CASES = [
  ['شركة', 'company', ['companyPlain', 'companyWithKeywords'], 'first word, exact'],
  ['شر', 'company', ['companyPlain', 'companyWithKeywords'], 'start of a word'],
  ['أبوظبي', 'company', ['companyPlain', 'companyWithKeywords'], 'with hamza, as written'],
  ['ابوظبي', 'company', ['companyWithKeywords'], 'without hamza'],
  ['البترولية', 'company', ['companyPlain', 'companyWithKeywords'], 'with the article, as written'],
  ['بترولية', 'company', ['companyWithKeywords'], 'without the article'],
  ['بترول', 'company', ['companyWithKeywords'], 'stem without the article'],
  ['خدمات', 'company', ['companyWithKeywords'], 'without the attached لل'],
  ['شركه', 'company', [], 'ه typed for ة'],
  ['أبوظبي البترولية', 'company', ['companyPlain', 'companyWithKeywords'], 'two words'],
  ['abudhabi', 'company', ['companyWithKeywords'], 'transliteration'],
  ['Abu Dhabi', 'company', ['companyPlain', 'companyWithKeywords'], 'English name'],
  ['محمد', 'person', ['personPlain'], 'Arabic first name, no diacritics'],
  ['الحمادي', 'person', ['personPlain'], 'family name with the article'],
  ['حمادي', 'person', [], 'family name without the article'],
  ['أحمد', 'person', [], 'stored with diacritics, typed without'],
  ['0501234567', 'person', ['personPlain'], 'UAE mobile, local form'],
  ['+971501234567', 'person', ['personPlain'], 'UAE mobile, international form'],
  ['test-ars.example', 'person', ['personPlain'], 'email domain'],
  ['إرسال', 'opportunity', ['opportunity'], 'next action, as written'],
  ['ارسال', 'opportunity', [], 'next action, without hamza'],
  ['العرض', 'opportunity', ['opportunity'], 'next action, with the article'],
  ['عرض', 'opportunity', [], 'next action, without the article'],
  ['تقييم', 'workPackage', ['workPackage'], 'objective'],
  ['دراسة', 'workPackage', ['workPackage'], 'title'],
];

const created = {};
let failures = 0;

try {
  for (const [key, record] of Object.entries(RECORDS)) {
    created[key] = { ...record, id: await createRecord(record.plural, record.singular, record.data) };
  }

  console.log('| Query | Case | Object | Expected | Found | Result |');
  console.log('| --- | --- | --- | --- | --- | --- |');

  for (const [query, objectNameSingular, expectedKeys, description] of CASES) {
    const found = await search(query, objectNameSingular);
    const candidateKeys = Object.keys(created).filter(
      (key) => created[key].singular === objectNameSingular,
    );
    const foundKeys = candidateKeys.filter((key) => found.has(created[key].id));
    const pass =
      foundKeys.length === expectedKeys.length &&
      expectedKeys.every((key) => foundKeys.includes(key));

    if (!pass) {
      failures++;
    }

    console.log(
      `| ${query} | ${description} | ${objectNameSingular} | ${expectedKeys.join(', ') || 'none'} | ${foundKeys.join(', ') || 'none'} | ${pass ? 'PASS' : 'FAIL'} |`,
    );
  }
} finally {
  for (const record of Object.values(created)) {
    await rest('DELETE', `${record.plural}/${record.id}`).catch((error) =>
      console.error(`cleanup: ${error.message}`),
    );
  }
}

console.log(failures === 0 ? '\nAll cases match 2.48 behaviour.' : `\n${failures} case(s) differ from 2.48 behaviour.`);
process.exit(failures === 0 ? 0 : 1);
