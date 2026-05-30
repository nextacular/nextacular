'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { SWRConfig } from 'swr';

import swrConfig from '@/config/swr/index';
import WorkspaceProvider from '@/providers/workspace';

type ProvidersProps = {
  children: ReactNode;
};

const Providers = ({ children }: ProvidersProps) => {
  return (
    <SessionProvider>
      <SWRConfig value={swrConfig()}>
        <ThemeProvider attribute="class">
          <WorkspaceProvider>
            {children}
            <Toaster
              position="bottom-center"
              toastOptions={{ duration: 10000 }}
            />
          </WorkspaceProvider>
        </ThemeProvider>
      </SWRConfig>
    </SessionProvider>
  );
};

export default Providers;
