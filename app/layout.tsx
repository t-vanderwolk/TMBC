import type { Metadata } from 'next';
import '../styles/globals.css';

import { greatVibes, nunito, playfair } from '@/lib/fonts';

/**
 * TMBC ASSET RULE
 *
 * Do not import images from anywhere except `/assets/images`
 * Do not create new image folders
 * Do not duplicate assets per page
 *
 * All visual consistency depends on this rule.
 */

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
      {/* Playfair Display is bundled here via next/font and exposed as --font-playfair */}
      <head>
        {/* FO Verification */}
        <meta name="fo-verify" content="660bae52-3064-4bff-8322-959de3b4cbf6" />
      </head>
      <body className="min-h-screen bg-tmIvory font-sans text-tmCharcoal">
        <main className="flex min-h-screen flex-col pb-16">{children}</main>
      </body>
    </html>
  );
}
