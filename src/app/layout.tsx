import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import Providers from './providers';

import '@/styles/globals.css';
import 'nprogress/nprogress.css';

export const metadata: Metadata = {
  title: 'Nextacular',
  description: 'Multi-tenant SaaS boilerplate for Next.js',
};

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
