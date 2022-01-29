import { useState } from 'react';
import Router from 'next/router';
import { SessionProvider } from 'next-auth/react';
import TopBarProgress from 'react-topbar-progress-indicator';

import progressBarConfig from '../config/progress-bar';
import '../styles/globals.css';

const App = ({ Component, pageProps }) => {
  const [progress, setProgress] = useState(false);

  Router.events.on('routeChangeStart', () => setProgress(true));
  Router.events.on('routeChangeComplete', () => setProgress(false));
  TopBarProgress.config(progressBarConfig);

  return (
    <SessionProvider session={pageProps.session}>
      {progress && <TopBarProgress />}
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default App;
