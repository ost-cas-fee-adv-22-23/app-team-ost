import Head from "next/head";
import { LayoutProps } from "./types/pageWithLayout";

const LoginLayout: LayoutProps = ({ children }) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      Login-Layout
      <main>{children}</main>
    </>
  );
};
export default LoginLayout;
