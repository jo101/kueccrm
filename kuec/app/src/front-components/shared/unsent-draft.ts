// localStorage holds only text the person typed and has not sent yet. Storage
// can be unavailable or full; a lost draft must never break the component.
const DRAFT_KEY_PREFIX = 'kuec-draft:';

const draftKey = (scope: string) => `${DRAFT_KEY_PREFIX}${scope}`;

export const readUnsentDraft = (scope: string): string => {
  try {
    return localStorage.getItem(draftKey(scope)) ?? '';
  } catch {
    return '';
  }
};

export const writeUnsentDraft = (scope: string, text: string): void => {
  try {
    if (text === '') {
      localStorage.removeItem(draftKey(scope));

      return;
    }

    localStorage.setItem(draftKey(scope), text);
  } catch {
    // The draft stays in component state only.
  }
};

export const clearUnsentDraft = (scope: string): void =>
  writeUnsentDraft(scope, '');
