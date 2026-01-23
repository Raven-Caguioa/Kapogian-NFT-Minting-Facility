/**
 * Root Layout - Wallet Provider Setup
 */
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Kapogian — One-of-One Characters, Minted on SUI',
  description: 'Kapogian is a next-generation character generation facility built on the SUI Network. Every character is unique, provably scarce, and backed by physical merchandise delivered to you.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`selection:bg-accent selection:text-accent-foreground`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
