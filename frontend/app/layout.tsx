import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '../styles/globals.css';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const greatVibes = localFont({
  src: '../../assets/fonts/GreatVibes-Regular.ttf',
  variable: '--font-great-vibes',
  weight: '400',
  display: 'swap',
});

const playfairDisplay = localFont({
  src: '../../assets/fonts/PlayfairDisplay-Regular.ttf',
  variable: '--font-playfair',
  weight: '400',
  display: 'swap',
});

const nunito = localFont({
  src: '../../assets/fonts/Nunito-Regular.ttf',
  variable: '--font-nunito',
  weight: '400',
  display: 'swap',
});

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
      className={`${greatVibes.variable} ${playfairDisplay.variable} ${nunito.variable}`}
    >
      <body className="min-h-screen bg-tmIvory font-sans text-tmCharcoal">
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1 px-4 pb-16 pt-28 md:px-10 lg:px-16">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
