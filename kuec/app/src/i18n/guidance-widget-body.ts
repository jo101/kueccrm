import { isDefined } from 'twenty-sdk/utils';

import guidanceJson from './guidance.json';

const LANGUAGES = ['en', 'ar'] as const;

type Language = (typeof LANGUAGES)[number];

export const GUIDANCE_WIDGET_TITLE = {
  RECORD_PAGE: guidanceJson.titles.recordPage.en,
  DASHBOARD_TAB: guidanceJson.titles.dashboardTab.en,
} as const;

const findGuidancePage = (pageKey: string) => {
  const page = guidanceJson.pages.find((candidate) => candidate.key === pageKey);

  if (!isDefined(page)) {
    throw new Error(`No guidance in src/i18n/guidance.json for "${pageKey}"`);
  }

  return page;
};

const guidanceLines = (pageKey: string) => {
  const page = findGuidancePage(pageKey);

  return LANGUAGES.flatMap((language: Language) =>
    page.lines[language].map((text, index) => ({
      language,
      label: guidanceJson.lineLabels[language][index],
      text,
      blockId: `${pageKey}-${language}-${index + 1}`,
    })),
  );
};

// A widget body is one document for every viewer and the catalog cannot
// translate it, so it carries both languages, the Arabic lines right-aligned.
export const buildGuidanceBody = (pageKey: string) => {
  const lines = guidanceLines(pageKey);

  return {
    blocknote: JSON.stringify(
      lines.map(({ language, label, text, blockId }) => ({
        id: blockId,
        type: 'paragraph',
        props: {
          textColor: 'default',
          backgroundColor: 'default',
          textAlignment: language === 'ar' ? 'right' : 'left',
        },
        content: [
          { type: 'text', text: `${label}: `, styles: { bold: true } },
          { type: 'text', text, styles: {} },
        ],
        children: [],
      })),
    ),
    markdown: lines.map(({ label, text }) => `**${label}:** ${text}`).join('\n\n'),
  };
};
