import i18n from 'i18next';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import NProgress from 'nprogress';
import { useEffect } from 'react';
import { initReactI18next } from 'react-i18next';
import { SWRConfig } from 'swr';

import swrConfig from '@/config/swr/index';
import WorkspaceProvider from '@/providers/workspace';
import enMessages from '@/../src/messages/en.json';
import koMessages from '@/../src/messages/ko.json';

import '@/styles/globals.css';
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false });

const langCode = 'en';
const langObject: Record<string, { translation: typeof enMessages }> = {
  [langCode]: { translation: enMessages },
  ko: { translation: koMessages },
};

i18n.use(initReactI18next).init({
  resources: langObject,
  lng: langCode,
  fallbackLng: langCode,
  interpolation: {
    escapeValue: false,
  },
});

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const swrOptions = swrConfig();
  const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

  useEffect(() => {
    const start = () => NProgress.start();
    const done = () => NProgress.done();

    router.events.on('routeChangeStart', start);
    router.events.on('routeChangeComplete', done);
    router.events.on('routeChangeError', done);

    return () => {
      router.events.off('routeChangeStart', start);
      router.events.off('routeChangeComplete', done);
      router.events.off('routeChangeError', done);
    };
  }, [router.events]);

  useEffect(() => {
    if (!gaId || process.env.NODE_ENV !== 'production') return;

    const handleRouteChange = (url: string) => {
      window.gtag?.('config', gaId, { page_path: url });
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events, gaId]);

  return (
    <SessionProvider session={pageProps.session}>
      <SWRConfig value={swrOptions}>
        <ThemeProvider attribute="class">
          <WorkspaceProvider>
            {gaId && process.env.NODE_ENV === 'production' && (
              <>
                <Script
                  strategy="afterInteractive"
                  src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                />
                <Script
                  id="gtag-init"
                  strategy="afterInteractive"
                  dangerouslySetInnerHTML={{
                    __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', '${gaId}');
                    `,
                  }}
                />
              </>
            )}
            <Component {...pageProps} />
          </WorkspaceProvider>
        </ThemeProvider>
      </SWRConfig>
    </SessionProvider>
  );
};

export default App;
