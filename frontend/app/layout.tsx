import type { Metadata } from 'next';
import '../styles/globals.css';

import { greatVibes, nunito, playfair } from './fonts';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Taylor-Made Baby Co.',
  description: 'Concierge-style baby prep for intentional families.',
  metadataBase: new URL(BASE_URL),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${greatVibes.variable} ${playfair.variable} ${nunito.variable}`}
    >
      <body className="min-h-screen bg-tmIvory font-sans text-tmCharcoal">
        <main className="flex min-h-screen flex-col px-4 pb-16 pt-10 md:px-10 lg:px-16">
          {children}
        </main>
      </body>
    </html>
  );
}
