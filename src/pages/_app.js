import { useState } from 'react';
import Router from 'next/router';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import TopBarProgress from 'react-topbar-progress-indicator';
import { SWRConfig } from 'swr';

import progressBarConfig from '../config/progress-bar';
import swrConfig from '../config/swr';
import WorkspaceProvider from '../providers/workspace';

import '../styles/globals.css';

const App = ({ Component, pageProps }) => {
  const [progress, setProgress] = useState(false);
  const swrOptions = swrConfig();

  Router.events.on('routeChangeStart', () => setProgress(true));
  Router.events.on('routeChangeComplete', () => setProgress(false));
  TopBarProgress.config(progressBarConfig());

  return (
    <SessionProvider session={pageProps.session}>
      <SWRConfig value={swrOptions}>
        <ThemeProvider attribute="class">
          <WorkspaceProvider>
            {progress && <TopBarProgress />}
            <Component {...pageProps} />
          </WorkspaceProvider>
        </ThemeProvider>
      </SWRConfig>
    </SessionProvider>
  );
};

export default App;
