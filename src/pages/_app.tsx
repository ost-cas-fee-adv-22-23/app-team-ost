import '@/styles/globals.css';
import ErrorBoundary from '@/components/error-boundary';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  style: ['normal'],
  weight: ['500', '600', '700'],
  variable: '--font-poppins',
});

export default function App({ Component, router, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="description"
          content="This App is the result of the second part of the CAS Frontend Engineering Advanced course. It's our very own Twitter Clone - Mumble."
        />
        <meta name="theme-color" content="#7C3AED" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/maskable_icon_x192.png" />
        <link rel="icon" href="/maskable_icon_x48.png" />
        <link rel="icon" href="/maskable_icon_x72.png" />
        <link rel="icon" href="/maskable_icon_x96.png" />
        <link rel="icon" href="/maskable_icon_x128.png" />
        <link rel="icon" href="/maskable_icon_x192.png" />
        <link rel="icon" href="/maskable_icon_x384.png" />
        <link rel="icon" href="/maskable_icon_x512.png" />
        <link rel="icon" href="/icon-192x192.png" />
        <link rel="icon" href="/icon-256x256.png" />
        <link rel="icon" href="/icon-384x384.png" />
        <link rel="icon" href="/icon-512x512.png" />
      </Head>

      <SessionProvider session={session}>
        <main className={`${poppins.variable} font-poppins`}>
          <ErrorBoundary>
            {/* We use the router as the key for a correct state handling while navigating between dynamic pages. Ex. profilepages or mumble detailpages. */}
            <Component {...pageProps} key={router.asPath} />
          </ErrorBoundary>
        </main>
      </SessionProvider>
    </>
  );
}
