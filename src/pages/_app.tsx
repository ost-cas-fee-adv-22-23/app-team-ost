import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  style: ['normal'],
  weight: ['500', '600', '700'],
  variable: '--font-poppins',
});

export default function App({ Component, router, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <main className={`${poppins.variable} font-poppins`}>
        {/* We use the router as the key for a correct state handling while navigating between dynamic pages. Ex. profilepages or mumble detailpages. */}
        <Component {...pageProps} key={router.asPath} />
      </main>
    </SessionProvider>
  );
}
