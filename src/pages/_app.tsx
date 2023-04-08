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

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <main className={`${poppins.variable} font-poppins`}>
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
}
