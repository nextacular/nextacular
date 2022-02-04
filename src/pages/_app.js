import { useState } from 'react';
import Router from 'next/router';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import TopBarProgress from 'react-topbar-progress-indicator';
import { SWRConfig } from 'swr';

import progressBarConfig from '../config/progress-bar';
import swrConfig from '../config/swr';
import '../styles/globals.css';

const App = ({ Component, pageProps }) => {
  const [progress, setProgress] = useState(false);

  Router.events.on('routeChangeStart', () => setProgress(true));
  Router.events.on('routeChangeComplete', () => setProgress(false));
  TopBarProgress.config(progressBarConfig());

  const swrOptions = swrConfig();

  return (
    <SessionProvider session={pageProps.session}>
      <SWRConfig value={swrOptions}>
        <ThemeProvider attribute="class">
          {progress && <TopBarProgress />}
          <Component {...pageProps} />
        </ThemeProvider>
      </SWRConfig>
    </SessionProvider>
  );
};

export default App;
