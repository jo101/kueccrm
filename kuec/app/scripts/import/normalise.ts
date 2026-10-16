// Shared mailbox and ISP domains say nothing about the employer, so they never
// identify a company. emirates.net.ae and eim.ae are the UAE consumer ISPs.
const PUBLIC_EMAIL_DOMAINS = new Set([
  '163.com',
  'aol.com',
  'eim.ae',
  'emirates.net.ae',
  'gmail.com',
  'gmx.com',
  'gmx.de',
  'googlemail.com',
  'hotmail.co.uk',
  'hotmail.com',
  'icloud.com',
  'live.co.uk',
  'live.com',
  'mac.com',
  'mail.com',
  'me.com',
  'msn.com',
  'outlook.com',
  'proton.me',
  'protonmail.com',
  'qq.com',
  'rediffmail.com',
  'yahoo.co.uk',
  'yahoo.com',
  'yandex.com',
  'zoho.com',
]);

const LEGAL_SUFFIXES = [
  ['l', 'l', 'c'],
  ['llc'],
  ['fz', 'llc'],
  ['fz', 'co'],
  ['fzco'],
  ['fze'],
  ['fz'],
  ['p', 'j', 's', 'c'],
  ['pjsc'],
  ['psc'],
  ['w', 'l', 'l'],
  ['wll'],
  ['llp'],
  ['plc'],
  ['ltd'],
  ['limited'],
  ['inc'],
  ['incorporated'],
  ['corp'],
  ['corporation'],
  ['co'],
  ['company'],
  ['est'],
  ['establishment'],
  ['gmbh'],
  ['ag'],
  ['bv'],
  ['sa'],
  ['spa'],
  ['sarl'],
];

const HONORIFICS = new Set(['dr', 'eng', 'engr', 'he', 'miss', 'mr', 'mrs', 'ms', 'prof']);

export const normaliseText = (value: string): string =>
  value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replaceAll('&', ' and ')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();

export const normaliseCompanyName = (name: string): string => {
  const tokens = normaliseText(name).split(' ').filter((token) => token !== '');

  if (tokens[0] === 'the' && tokens.length > 1) {
    tokens.shift();
  }

  let hasRemovedSuffix = true;

  while (hasRemovedSuffix && tokens.length > 1) {
    hasRemovedSuffix = false;

    for (const suffix of LEGAL_SUFFIXES) {
      const tail = tokens.slice(-suffix.length);

      if (
        tokens.length > suffix.length &&
        tail.every((token, index) => token === suffix[index])
      ) {
        tokens.splice(-suffix.length);
        hasRemovedSuffix = true;
        break;
      }
    }
  }

  return tokens.join(' ');
};

export const normaliseDomain = (value: string): string | null => {
  const host = value
    .trim()
    .toLowerCase()
    .replace(/^[a-z]+:\/\//, '')
    .replace(/^www\./, '')
    .split(/[/?#:]/, 1)[0]
    .replace(/\.$/, '');

  return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(host) ? host : null;
};

export const normaliseEmail = (value: string): string | null => {
  const email = value.trim().toLowerCase().replace(/^mailto:/, '');

  return /^[^\s@]+@[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(email) ? email : null;
};

export const companyDomainFromEmail = (email: string): string | null => {
  const domain = normaliseDomain(email.split('@')[1] ?? '');

  return domain === null || PUBLIC_EMAIL_DOMAINS.has(domain) ? null : domain;
};

export type PersonName = { firstName: string; lastName: string };

// First token is the given name; the rest stays together so Arabic family
// names ("bin Rashid Al Maktoum") are kept whole.
export const splitFullName = (fullName: string): PersonName => {
  const tokens = fullName
    .trim()
    .split(/\s+/)
    .filter((token) => token !== '');

  while (tokens.length > 1 && HONORIFICS.has(normaliseText(tokens[0]))) {
    tokens.shift();
  }

  return { firstName: tokens[0] ?? '', lastName: tokens.slice(1).join(' ') };
};

export const normalisePersonName = ({ firstName, lastName }: PersonName): string =>
  normaliseText(`${firstName} ${lastName}`)
    .split(' ')
    .filter((token) => token !== '' && !HONORIFICS.has(token))
    .join(' ');

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

const EXCEL_EPOCH_UTC = Date.UTC(1899, 11, 30);

const toIsoDate = (year: number, month: number, day: number): string | null => {
  const date = new Date(Date.UTC(year, month - 1, day));

  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
    ? date.toISOString().slice(0, 10)
    : null;
};

const expandYear = (year: number): number => (year < 100 ? 2000 + year : year);

// UAE sheets write dates day first. A first part over 12 can only be a day; a
// second part over 12 means the sheet was US-formatted, so the parts swap.
export const parseDate = (value: string): string | null => {
  const text = value.trim();

  if (text === '') {
    return null;
  }

  if (/^\d{5}(\.\d+)?$/.test(text)) {
    return new Date(EXCEL_EPOCH_UTC + Math.floor(Number(text)) * 86_400_000)
      .toISOString()
      .slice(0, 10);
  }

  const isoMatch = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ].*)?$/.exec(text);

  if (isoMatch !== null) {
    return toIsoDate(Number(isoMatch[1]), Number(isoMatch[2]), Number(isoMatch[3]));
  }

  const numericMatch = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2}|\d{4})$/.exec(text);

  if (numericMatch !== null) {
    const first = Number(numericMatch[1]);
    const second = Number(numericMatch[2]);
    const year = expandYear(Number(numericMatch[3]));

    return second > 12
      ? toIsoDate(year, first, second)
      : toIsoDate(year, second, first);
  }

  const words = normaliseText(text).split(' ');
  const monthIndex = words.findIndex((word) => MONTHS.includes(word.slice(0, 3)) && !/\d/.test(word));
  const numbers = words.filter((word) => /^\d+$/.test(word)).map(Number);

  if (monthIndex !== -1 && numbers.length === 2) {
    const month = MONTHS.indexOf(words[monthIndex].slice(0, 3)) + 1;
    const [day, year] = numbers[0] > 31 ? [numbers[1], numbers[0]] : numbers;

    return toIsoDate(expandYear(year), month, day);
  }

  return null;
};

const TRUE_VALUES = new Set(['1', 'true', 'x', 'y', 'yes', '✓', '✔']);
const FALSE_VALUES = new Set(['0', 'false', 'n', 'no', '-']);

export const parseBoolean = (value: string): boolean | null => {
  const text = value.trim().toLowerCase();

  if (TRUE_VALUES.has(text)) {
    return true;
  }

  return FALSE_VALUES.has(text) ? false : null;
};

const CURRENCY_CODES = ['AED', 'USD', 'EUR', 'GBP', 'SAR'];

export type Money = { amount: number; currencyCode: string | null };

export const parseMoney = (value: string): Money | null => {
  const text = value.trim().toUpperCase();
  const currencyCode =
    CURRENCY_CODES.find((code) => text.includes(code)) ??
    (text.includes('$') ? 'USD' : null);
  const match = /^(-?\d[\d,]*(?:\.\d+)?)(K|M|MN)?$/.exec(
    text.replace(/AED|USD|EUR|GBP|SAR|[$\s]/g, ''),
  );

  if (match === null) {
    return null;
  }

  const multiplier = match[2] === undefined ? 1 : match[2] === 'K' ? 1_000 : 1_000_000;

  return {
    amount: Math.round(Number(match[1].replaceAll(',', '')) * multiplier * 100) / 100,
    currencyCode,
  };
};

export type Phone = { number: string; callingCode: string };

// Most contacts are in the UAE, where local numbers start with 0 and
// international ones with +971 or 00971.
export const parsePhone = (value: string): Phone | null => {
  const compact = value.replace(/[^\d+]/g, '').replace(/^00/, '+');

  if (compact.replace('+', '').length < 7) {
    return null;
  }

  if (compact.startsWith('+971')) {
    return { number: compact.slice(4), callingCode: '+971' };
  }

  if (compact.startsWith('971') && compact.length >= 11) {
    return { number: compact.slice(3), callingCode: '+971' };
  }

  if (compact.startsWith('0')) {
    return { number: compact.slice(1), callingCode: '+971' };
  }

  return { number: compact, callingCode: '' };
};
