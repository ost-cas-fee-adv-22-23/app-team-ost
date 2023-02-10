import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Poppins } from "@next/font/google";
import { PageWithLayoutType } from "../components/layouts/types/PageWithLayout";
import "../styles/globals.css";
import { ReactElement } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  style: ["normal"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
});

type AppLayoutProps = AppProps & {
  Component: PageWithLayoutType;
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppLayoutProps) {
  const Layout =
    Component.layout || ((children: ReactElement) => <>{children}</>);
  return (
    <SessionProvider session={session}>
      <main className={`${poppins.variable} font-poppins`}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </main>
    </SessionProvider>
  );
}
