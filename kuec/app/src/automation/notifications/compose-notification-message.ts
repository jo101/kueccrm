import { isDefined } from 'twenty-sdk/utils';

export const MAX_NOTIFICATION_WORDS = 19;

const toWords = (text: string): string[] =>
  text.split(/\s+/).filter((word) => word.length > 0);

// Fixed wording is kept whole; the record name and free text (e.g. a blocked
// reason) are shortened so the message, link included, stays under 20 words.
export const composeNotificationMessage = ({
  lead,
  subject,
  detail,
  link,
}: {
  lead: string;
  subject: string;
  detail?: string | null;
  link: string;
}): string => {
  const leadWords = toWords(lead);
  let budget = MAX_NOTIFICATION_WORDS - leadWords.length - 1;
  const subjectWords = toWords(subject).slice(0, Math.max(1, Math.min(8, budget)));

  budget -= subjectWords.length;

  const detailWords = isDefined(detail)
    ? toWords(detail).slice(0, Math.max(0, budget))
    : [];

  const subjectText = `${subjectWords.join(' ')}${subjectWords.length < toWords(subject).length ? '…' : ''}`;
  const detailText =
    detailWords.length > 0
      ? ` ${detailWords.join(' ')}${detailWords.length < toWords(detail ?? '').length ? '…' : ''}`
      : '';

  return `${leadWords.join(' ')} ${subjectText}.${detailText} ${link}`;
};

export const countWords = (text: string): number => toWords(text).length;

export const buildRecordLink = (
  baseUrl: string,
  objectNameSingular: string,
  recordId: string,
): string => `${baseUrl.replace(/\/+$/, '')}/object/${objectNameSingular}/${recordId}`;
