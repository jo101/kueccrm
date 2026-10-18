import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './globals.css';

import type { Metadata, Viewport } from 'next';
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';

import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'KUEC CRM prototype',
  description: 'Design-validation prototype of the KUEC /crm employee experience on anonymised data.',
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AE" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
