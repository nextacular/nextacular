import { SessionProvider } from 'next-auth/react';

import '../styles/globals.css';

const App = ({ Component, pageProps }) => {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default App;
