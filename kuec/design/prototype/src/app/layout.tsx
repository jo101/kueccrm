import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/spotlight/styles.css';
import 'mantine-datatable/styles.layer.css';
import './globals.css';

import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from 'next/font/google';
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';

import { Providers } from './providers';

// One type family across scripts (brief part 2): IBM Plex Sans with IBM Plex
// Sans Arabic, two weights. Loaded through next/font as uVENTURE loads Inter.
const plexSans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '600'], variable: '--font-plex', display: 'swap' });
const plexSansArabic = IBM_Plex_Sans_Arabic({ subsets: ['arabic'], weight: ['400', '600'], variable: '--font-plex-arabic', display: 'swap' });

export const metadata: Metadata = {
  title: 'KUEC CRM workbench',
  description: 'Design workbench for the KUEC /crm employee experience on anonymised data.',
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The font variables live on <html>: Mantine resolves --mantine-font-family at
    // :root, so a variable defined only on <body> would leave every font invalid.
    <html lang="en-AE" {...mantineHtmlProps} className={`${plexSans.variable} ${plexSansArabic.variable}`}>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body className={plexSans.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
